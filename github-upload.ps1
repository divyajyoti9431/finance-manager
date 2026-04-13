# Finance Manager — GitHub Upload Script
# Writes all output to a log file so Claude can read the results

$logFile = "C:\Users\divya\video animation\finance-manager\upload-log.txt"
$projectDir = "C:\Users\divya\video animation\finance-manager"
$videoFile = "C:\Users\divya\Videos\Finance manager.mp4"

function Log($msg) {
    $timestamp = Get-Date -Format "HH:mm:ss"
    $line = "[$timestamp] $msg"
    Write-Host $line
    Add-Content -Path $logFile -Value $line
}

# Clear previous log
if (Test-Path $logFile) { Remove-Item $logFile }
New-Item -Path $logFile -ItemType File | Out-Null

Log "=== Finance Manager GitHub Upload ==="
Log "Project: $projectDir"
Log ""

# Change to project directory
Set-Location $projectDir
Log "Changed to: $(Get-Location)"

# --- Step 1: Git Init ---
if (-not (Test-Path ".git")) {
    Log "[1/7] Initializing git repository..."
    git init 2>&1 | ForEach-Object { Log $_ }
    git branch -M main 2>&1 | ForEach-Object { Log $_ }
} else {
    Log "[1/7] Git already initialized."
}

# --- Step 2: Stage files ---
Log "[2/7] Staging files..."
git add . 2>&1 | ForEach-Object { Log $_ }
$staged = git diff --cached --name-only 2>&1
Log "Staged files: $($staged.Count) files"

# --- Step 3: Commit ---
Log "[3/7] Creating commit..."
$commitMsg = "Initial commit: Finance Manager with live NSE prices

- Real-time NSE stock/ETF prices via Yahoo Finance v8
- Live AMFI mutual fund NAVs via AMFI India bulk file
- Auto-refresh every 30 minutes with countdown timer
- SIP Manager with seasonality-based recommendations
- Gold ETF tracker with threshold alerts
- Stock Picker with 20 NSE short-term picks
- Portfolio dashboard with Recharts P&L charts
- Standalone app.html (no build step required)"

git commit -m $commitMsg 2>&1 | ForEach-Object { Log $_ }

# --- Step 4: Check gh auth ---
Log "[4/7] Checking GitHub CLI authentication..."
$authStatus = gh auth status 2>&1
$authStatus | ForEach-Object { Log $_ }
$isAuthed = ($authStatus | Select-String "Logged in") -ne $null
if (-not $isAuthed) {
    Log "ERROR: gh CLI not authenticated. Run: gh auth login"
    Log "STATUS: NEEDS_AUTH"
    exit 1
}

# --- Step 5: Create GitHub repo ---
Log "[5/7] Creating GitHub repository..."
# Check if remote already exists
$remotes = git remote 2>&1
if ($remotes -contains "origin") {
    Log "Remote 'origin' already exists, skipping repo creation."
    $repoUrl = git remote get-url origin 2>&1
    Log "Existing remote: $repoUrl"
} else {
    $createResult = gh repo create finance-manager --public --description "Personal Investment Tracker - Live NSE Stocks, Gold ETFs and SIP Mutual Funds" --source . --remote origin --push 2>&1
    $createResult | ForEach-Object { Log $_ }
}

# --- Step 6: Push ---
Log "[6/7] Pushing to GitHub..."
$pushResult = git push -u origin main 2>&1
$pushResult | ForEach-Object { Log $_ }
if ($LASTEXITCODE -eq 0) {
    Log "Push successful!"
} else {
    # Try force push if branch already exists
    Log "Normal push failed, trying with --force..."
    git push -u origin main --force 2>&1 | ForEach-Object { Log $_ }
}

# --- Step 7: Create release with video ---
Log "[7/7] Creating GitHub release with demo video..."
if (Test-Path $videoFile) {
    $releaseResult = gh release create v1.0.0 "$videoFile" --title "Finance Manager v1.0" --notes "Finance Manager v1.0 — Personal Investment Tracker

Features:
- Real-time NSE stock/ETF prices
- Live AMFI mutual fund NAVs
- Auto-refresh every 30 minutes
- Portfolio P&L dashboard with charts" 2>&1
    $releaseResult | ForEach-Object { Log $_ }

    # Get video asset URL
    Log "Getting video asset URL..."
    $releaseInfo = gh release view v1.0.0 --json assets 2>&1
    Log "Release info: $releaseInfo"

    # Try to get direct video URL
    $assetUrl = gh release view v1.0.0 --json assets --jq '.assets[0].url' 2>&1
    Log "Asset URL (API): $assetUrl"

    # The GitHub user-attachments URL format for release assets
    $repoUrl = git remote get-url origin 2>&1
    Log "Repo URL: $repoUrl"

    # Get repo info to construct the release asset URL
    $repoInfo = gh repo view --json nameWithOwner --jq '.nameWithOwner' 2>&1
    Log "Repo: $repoInfo"

    # Get browser-visible asset URL
    $browserUrl = gh release view v1.0.0 --json assets --jq '.assets[] | select(.name | contains(".mp4")) | .browserDownloadUrl' 2>&1
    Log "Video download URL: $browserUrl"
} else {
    Log "WARNING: Video file not found at: $videoFile"
}

Log ""
Log "=== UPLOAD COMPLETE ==="
Log "STATUS: SUCCESS"

# Get final repo URL
$finalUrl = gh repo view --json url --jq '.url' 2>&1
Log "GitHub repo URL: $finalUrl"
