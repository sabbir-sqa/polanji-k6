# run-smoke.ps1
$BASE_URL = "https://api.polanji.com"
$EMAIL = "performancetest02@gmail.com"
$PASSWORD = "user123456"
$PYTHON_COURSE_ID = "2"

# Create results folder if missing
if (-not (Test-Path results)) {
    New-Item -ItemType Directory -Path results | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$outputFile = "results\smoke-$timestamp.json"

Write-Host ""
Write-Host "Running Smoke Test..." -ForegroundColor Cyan
Write-Host "Output: $outputFile" -ForegroundColor DarkGray
Write-Host "----------------------------------------"

& k6 run `
    --out json=$outputFile `
    -e BASE_URL=$BASE_URL `
    -e EMAIL=$EMAIL `
    -e PASSWORD=$PASSWORD `
    -e PYTHON_COURSE_ID=$PYTHON_COURSE_ID `
    tests\smoke.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] Smoke test passed." -ForegroundColor Green
    Write-Host "Results saved to: $outputFile" -ForegroundColor Yellow
}
else {
    Write-Host ""
    Write-Host "[FAILED] Smoke test failed." -ForegroundColor Red
}