# Robust k6 JSON analyzer — works with all k6 versions
$results = Get-ChildItem "results\*.json" | Sort-Object LastWriteTime

Write-Host "k6 Performance Summary" -ForegroundColor Cyan
Write-Host ("=" * 60)

foreach ($file in $results) {
    $testName = $file.BaseName -replace '-\d{8}-\d{6}', ''
    $content = Get-Content $file.FullName -Raw

    # Check if it's aggregated format (newer k6)
    if ($content -like '*"metrics":*') {
        $data = $content | ConvertFrom-Json
        $metrics = $data.metrics

        # Try tagged metric first (from your CLI output)
        $dur = $metrics.'http_req_duration{expected_response:true}'
        if (-not $dur) { $dur = $metrics.http_req_duration }

        $p95 = if ($dur.values.'p(95)') { [Math]::Round($dur.values.'p(95)', 2) } else { 0 }
        $p99 = if ($dur.values.'p(99)') { [Math]::Round($dur.values.'p(99)', 2) } else { 0 }

        $checksPass = [int]($metrics.checks.passes -as [string] -replace '\D', '0')
        $checksFail = [int]($metrics.checks.fails -as [string] -replace '\D', '0')
        $totalChecks = $checksPass + $checksFail
        $passRate = if ($totalChecks -gt 0) { [Math]::Round(100 * $checksPass / $totalChecks, 2) } else { 100 }
    }
    # Else: raw samples format (older k6)
    else {
        $samples = $content -split '\r?\n' | Where-Object { $_ -match '^{.*}$' } | ConvertFrom-Json
        $reqDurs = @($samples | Where-Object { $_.metric -eq 'http_req_duration' -and $_.data.value } | ForEach-Object { $_.data.value })
        $checks = @($samples | Where-Object { $_.metric -eq 'checks' })

        $p95 = 0; $p99 = 0
        if ($reqDurs.Count -gt 0) {
            $sorted = $reqDurs | Sort-Object
            $idx95 = [Math]::Floor(0.95 * $sorted.Count) - 1
            $idx99 = [Math]::Floor(0.99 * $sorted.Count) - 1
            $p95 = if ($idx95 -ge 0) { [Math]::Round($sorted[$idx95], 2) } else { 0 }
            $p99 = if ($idx99 -ge 0) { [Math]::Round($sorted[$idx99], 2) } else { 0 }
        }

        $passes = ($checks | Where-Object { $_.data.pass -eq $true }).Count
        $fails = ($checks | Where-Object { $_.data.pass -eq $false }).Count
        $totalChecks = $passes + $fails
        $passRate = if ($totalChecks -gt 0) { [Math]::Round(100 * $passes / $totalChecks, 2) } else { 100 }
    }

    # Output
    $nameDisplay = ("Test: " + $testName).PadRight(20)
    $p95Display = ("p95: " + $p95 + "ms").PadRight(15)
    $passDisplay = ("Pass: " + $passRate + "%").PadRight(12)

    Write-Host $nameDisplay -NoNewline
    Write-Host $p95Display -ForegroundColor $(if ($p95 -lt 2000) { "Green" } elseif ($p95 -lt 5000) { "Yellow" } else { "Red" }) -NoNewline
    Write-Host $passDisplay -ForegroundColor $(if ($passRate -ge 99) { "Green" } else { "Red" })
}

Write-Host ("=" * 60)
Write-Host "Done. Metrics in ms (lower is better)." -ForegroundColor Green