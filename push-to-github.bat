@echo off
echo ================================================
echo   Finance Manager — GitHub Upload Script
echo ================================================
echo.

REM Change to the finance-manager directory
cd /d "%~dp0"

REM Initialize git if not already done
if not exist ".git" (
    echo [1/6] Initializing git repository...
    git init
    git branch -M main
) else (
    echo [1/6] Git repository already initialized.
)

REM Add .gitignore and stage everything (excluding node_modules)
echo [2/6] Staging all files...
git add .

REM Commit
echo [3/6] Creating commit...
git commit -m "Initial commit: Finance Manager with live NSE prices

- Real-time NSE stock/ETF prices via Yahoo Finance
- Live AMFI mutual fund NAVs
- Auto-refresh every 30 minutes with countdown timer
- SIP Manager with seasonality-based recommendations
- Gold ETF tracker with threshold alerts
- Stock Picker with 20 NSE short-term picks
- Portfolio dashboard with Recharts P&L charts
- Standalone app.html (no build step required)"

echo.
echo [4/6] Almost done!
echo.
echo ================================================
echo  NOW DO THESE STEPS MANUALLY:
echo ================================================
echo.
echo  1. Go to https://github.com/new
echo  2. Repository name: finance-manager
echo  3. Description: Personal Investment Tracker - Live NSE Stocks, Gold ETFs and SIP Mutual Funds
echo  4. Set to PUBLIC
echo  5. DO NOT check "Add README" (we already have one)
echo  6. Click "Create repository"
echo  7. Copy the repo URL (e.g. https://github.com/YOUR_USERNAME/finance-manager.git)
echo  8. Come back here and run:
echo.
echo     git remote add origin https://github.com/YOUR_USERNAME/finance-manager.git
echo     git push -u origin main
echo.
echo ================================================
echo  THEN ADD THE DEMO VIDEO:
echo ================================================
echo.
echo  1. Go to your repo on GitHub
echo  2. Click Releases (right sidebar) -> Create a new release
echo  3. Tag: v1.0.0   Title: Finance Manager v1.0
echo  4. Drag C:\Users\divya\Videos\Finance manager.mp4 into the assets box
echo  5. Publish release
echo  6. Copy the video URL and update README.md line 11
echo.
pause
