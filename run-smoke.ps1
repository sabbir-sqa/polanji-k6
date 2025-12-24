# run-smoke.ps1
Write-Host "🚀 Running Smoke Test..." -ForegroundColor Cyan

# Load .env if exists
if (Test-Path .env) {
    Write-Host "📦 Loading environment from .env" -ForegroundColor Green
    Get-Content .env | ForEach-Object {
        if ($_ -match "^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$") {
            $name = $matches[1]
            $value = $matches[2] -replace '^["'']|["'']$'
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}
else {
    Write-Host "⚠️  .env not found. Using defaults." -ForegroundColor Yellow
}

k6 run `
    -e BASE_URL=$env:BASE_URL `
    -e EMAIL=$env:EMAIL `
    -e PASSWORD=$env:PASSWORD `
    -e PYTHON_COURSE_ID=$env:PYTHON_COURSE_ID `
    tests/smoke.js