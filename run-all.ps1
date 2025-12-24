param([switch]$IncludeSoak)

$BASE_URL = "https://api.polanji.com"
$EMAIL = "performancetest02@gmail.com"
$PASSWORD = "user123456"
$PYTHON_COURSE_ID = "2"

if (-not (Test-Path results)) {
    New-Item -ItemType Directory -Path results | Out-Null
}

$tests = @()
$tests += @{ Name = "Smoke"; Script = "tests\smoke.js"; Duration = "10s" }
$tests += @{ Name = "Load"; Script = "tests\load.js"; Duration = "~2 min" }
$tests += @{ Name = "Stress"; Script = "tests\stress.js"; Duration = "~1.5 min" }
$tests += @{ Name = "Spike"; Script = "tests\spike.js"; Duration = "~40s" }

if ($IncludeSoak) {
    $tests += @{ Name = "Soak"; Script = "tests\soak.js"; Duration = "~5 min" }
}

Write-Host ""
Write-Host "Starting Full Test Suite" -ForegroundColor Cyan
Write-Host "============================================================"

foreach ($test in $tests) {
    $name = $test.Name
    $script = $test.Script
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $outputFile = "results\$($name.ToLower())-$timestamp.json"

    Write-Host ""
    $time = Get-Date -Format "HH:mm:ss"
    Write-Host "[$time] Running $name Test..." -ForegroundColor Magenta

    # ✅ SAFE k6 invocation (avoids PowerShell -- parsing)
    $k6Args = @(
        "run",
        "--out", "json=$outputFile",
        "-e", "BASE_URL=$BASE_URL",
        "-e", "EMAIL=$EMAIL",
        "-e", "PASSWORD=$PASSWORD",
        "-e", "PYTHON_COURSE_ID=$PYTHON_COURSE_ID",
        $script
    )

    & k6 $k6Args

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $name -> $outputFile" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $name failed" -ForegroundColor Red
    }

    Start-Sleep -Seconds 1
}

Write-Host ""
Write-Host "All tests completed." -ForegroundColor Green