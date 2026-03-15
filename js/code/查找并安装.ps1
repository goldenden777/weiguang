# Find Node.js/npm and run npm install (English output to avoid encoding issues)
$ErrorActionPreference = "Stop"
chcp 65001 | Out-Null

$paths = @(
    "C:\Program Files\nodejs\npm.cmd",
    "${env:ProgramFiles(x86)}\nodejs\npm.cmd",
    "$env:LOCALAPPDATA\Programs\node\npm.cmd",
    "$env:APPDATA\npm\npm.cmd",
    "$env:ProgramFiles\nodejs\node.exe"
)

$npmPath = $null
foreach ($p in $paths) {
    if ($p -match "node\.exe$") {
        $dir = [System.IO.Path]::GetDirectoryName($p)
        $npm = Join-Path $dir "npm.cmd"
        if (Test-Path $npm) { $npmPath = $npm; break }
    } elseif (Test-Path $p) {
        $npmPath = $p
        break
    }
}

if (-not $npmPath) {
    Write-Host ""
    Write-Host "Node.js / npm NOT found in common locations." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Node.js:" -ForegroundColor Cyan
    Write-Host "  1. Open https://nodejs.org/" -ForegroundColor White
    Write-Host "  2. Download and install the LTS version" -ForegroundColor White
    Write-Host "  3. During setup, check 'Add to PATH'" -ForegroundColor White
    Write-Host "  4. After install, close and reopen Cursor, then run: npm install" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "Found npm: $npmPath" -ForegroundColor Green
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan
& $npmPath install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host ""
Write-Host "Done. To start dev server run:" -ForegroundColor Green
Write-Host "  & `"$npmPath`" run simulate" -ForegroundColor White
Write-Host ""
