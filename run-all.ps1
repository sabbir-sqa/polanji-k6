# run-all.ps1
$tests = @("smoke", "load", "stress", "spike")
# Skip soak for now (long-running)

foreach ($test in $tests) {
    Write-Host "`n🔍 Running $test test..." -ForegroundColor Magenta
    & k6 run `
        -e BASE_URL=$env:BASE_URL `
        -e EMAIL=$env:EMAIL `
        -e PASSWORD=$env:PASSWORD `
        -e PYTHON_COURSE_ID=2 `
        "tests/$test.js"
    Start-Sleep -Seconds 2
}