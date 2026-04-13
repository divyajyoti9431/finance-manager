#!/usr/bin/env python3
"""
Finance Manager — GitHub Upload Runner
Runs git/gh commands, logs output, then serves log on HTTP so Claude can read results.
"""
import subprocess, os, sys, threading, http.server, json
from pathlib import Path

PROJECT = r"C:\Users\divya\video animation\finance-manager"
LOG_FILE = os.path.join(PROJECT, "upload-log.txt")
VIDEO = r"C:\Users\divya\Videos\Finance manager.mp4"
PORT = 5174

log_lines = []

def log(msg):
    print(msg, flush=True)
    log_lines.append(msg)
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def run(cmd, cwd=PROJECT, shell=True):
    """Run a command, return (returncode, stdout+stderr combined)"""
    result = subprocess.run(
        cmd, cwd=cwd, shell=True, capture_output=True, text=True, encoding="utf-8", errors="replace"
    )
    output = (result.stdout + result.stderr).strip()
    return result.returncode, output

# Clear old log
open(LOG_FILE, "w").close()

log("=== Finance Manager GitHub Upload ===")
log(f"Project: {PROJECT}")
log("")

os.chdir(PROJECT)

# --- Step 1: Git init ---
if not os.path.exists(os.path.join(PROJECT, ".git")):
    log("[1/7] Initializing git repository...")
    rc, out = run("git init")
    log(f"  git init: {out}")
    rc, out = run("git branch -M main")
    log(f"  branch -M main: {out}")
else:
    log("[1/7] Git already initialized.")

# --- Step 2: Stage files ---
log("[2/7] Staging all files (excluding node_modules)...")
rc, out = run("git add .")
log(f"  git add: rc={rc} {out[:200] if out else '(ok)'}")

# --- Step 3: Commit ---
log("[3/7] Creating commit...")
commit_msg = """Initial commit: Finance Manager with live NSE prices

- Real-time NSE stock/ETF prices via Yahoo Finance v8
- Live AMFI mutual fund NAVs via AMFI India bulk file
- Auto-refresh every 30 minutes with countdown timer
- SIP Manager with seasonality-based recommendations
- Gold ETF tracker with threshold alerts
- Stock Picker with 20 NSE short-term picks
- Portfolio dashboard with Recharts P&L charts
- Standalone app.html (no build step required)"""

rc, out = run(f'git commit -m "{commit_msg}"')
log(f"  git commit: rc={rc}")
log(f"  {out[:300]}")

# --- Step 4: Check gh auth ---
log("[4/7] Checking GitHub CLI authentication...")
rc, out = run("gh auth status")
log(f"  gh auth status: rc={rc}")
log(f"  {out[:400]}")

if rc != 0 and "Logged in" not in out:
    log("  ERROR: gh CLI not authenticated. Run: gh auth login")
    log("  STATUS: NEEDS_AUTH")
else:
    # --- Step 5: Create/connect GitHub repo ---
    log("[5/7] Creating GitHub repository...")
    rc_remote, out_remote = run("git remote get-url origin")
    if rc_remote == 0:
        log(f"  Remote origin already exists: {out_remote}")
        remote_exists = True
    else:
        remote_exists = False

    if not remote_exists:
        rc, out = run(
            'gh repo create finance-manager --public '
            '--description "Personal Investment Tracker - Live NSE Stocks, Gold ETFs and SIP Mutual Funds" '
            '--source . --remote origin'
        )
        log(f"  gh repo create: rc={rc}")
        log(f"  {out[:400]}")

    # --- Step 6: Push ---
    log("[6/7] Pushing to GitHub...")
    rc, out = run("git push -u origin main")
    log(f"  git push: rc={rc}")
    log(f"  {out[:400]}")
    if rc != 0:
        log("  Trying with --force...")
        rc, out = run("git push -u origin main --force")
        log(f"  git push --force: rc={rc}")
        log(f"  {out[:400]}")

    # --- Step 7: Create release with video ---
    log("[7/7] Creating GitHub release with demo video...")
    if os.path.exists(VIDEO):
        video_arg = f'"{VIDEO}"'
        release_notes = """Finance Manager v1.0 — Personal Investment Tracker

Features:
- Real-time NSE stock/ETF prices via Yahoo Finance
- Live AMFI mutual fund NAVs
- Auto-refresh every 30 minutes with countdown timer
- SIP Manager with seasonality recommendations
- Gold ETF threshold alerts
- Stock Picker with 20 NSE short-term picks
- Portfolio P&L dashboard with Recharts charts"""

        rc, out = run(
            f'gh release create v1.0.0 {video_arg} '
            f'--title "Finance Manager v1.0" '
            f'--notes "{release_notes}"'
        )
        log(f"  gh release create: rc={rc}")
        log(f"  {out[:600]}")

        # Get asset URL
        rc, asset_url = run("gh release view v1.0.0 --json assets --jq '.assets[] | select(.name | contains(\"mp4\")) | .browserDownloadUrl'")
        log(f"  Video asset URL: {asset_url}")

        # Get repo name with owner
        rc2, repo_name = run("gh repo view --json nameWithOwner --jq '.nameWithOwner'")
        log(f"  Repo: {repo_name}")

        # Construct the github.com URL
        rc3, repo_url = run("gh repo view --json url --jq '.url'")
        log(f"  Repo URL: {repo_url}")

        # Save results for README update
        results = {
            "asset_url": asset_url.strip(),
            "repo_url": repo_url.strip(),
            "repo_name": repo_name.strip()
        }
        with open(os.path.join(PROJECT, "upload-results.json"), "w") as f:
            json.dump(results, f, indent=2)
        log(f"  Results saved to upload-results.json")

    else:
        log(f"  WARNING: Video not found: {VIDEO}")

log("")
log("=== UPLOAD COMPLETE ===")
log("STATUS: SUCCESS")

# --- Start HTTP server to serve log ---
log(f"\nStarting HTTP server on port {PORT} to serve results...")

class LogHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/log":
            content = "\n".join(log_lines).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", len(content))
            self.end_headers()
            self.wfile.write(content)
        elif self.path == "/results":
            results_file = os.path.join(PROJECT, "upload-results.json")
            if os.path.exists(results_file):
                with open(results_file, "rb") as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", len(content))
                self.end_headers()
                self.wfile.write(content)
            else:
                self.send_response(404)
                self.end_headers()
        else:
            # Serve index
            html = f"""<!DOCTYPE html>
<html><head><title>Upload Log</title>
<style>body{{background:#111;color:#0f0;font-family:monospace;padding:20px}}
pre{{white-space:pre-wrap}}</style></head>
<body><h2>Finance Manager — Upload Log</h2>
<pre>{chr(10).join(log_lines)}</pre>
<p><a href="/results" style="color:#0ff">View JSON results</a></p>
</body></html>""".encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", len(html))
            self.end_headers()
            self.wfile.write(html)

    def log_message(self, format, *args):
        pass  # Suppress server access logs

server = http.server.HTTPServer(("", PORT), LogHandler)
print(f"Server running at http://localhost:{PORT}/", flush=True)
server.serve_forever()
