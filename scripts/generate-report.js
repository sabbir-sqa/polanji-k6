// scripts/generate-html-report.js
const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, '..', 'results');
const jsonFiles = fs.readdirSync(resultsDir).filter((f) => f.endsWith('.json'));

if (jsonFiles.length === 0) {
  console.error('❌ No JSON results found in ./results/');
  process.exit(1);
}

// Get most recent JSON
const latest = jsonFiles
  .map((f) => ({ name: f, time: fs.statSync(path.join(resultsDir, f)).mtime }))
  .sort((a, b) => b.time - a.time)[0];

const data = JSON.parse(
  fs.readFileSync(path.join(resultsDir, latest.name), 'utf8')
);

// Extract key metrics
const checks = data.metrics.checks || {};
const httpReqs = data.metrics.http_reqs || {};
const duration = data.metrics.http_req_duration || {};
const failed = data.metrics.http_req_failed || {};

const summary = {
  timestamp: new Date().toISOString(),
  testFile: latest.name.replace('.json', ''),
  checksPassed: checks.passes || 0,
  checksFailed: checks.fails || 0,
  totalRequests: httpReqs.count || 0,
  avgDuration: (duration.avg || 0).toFixed(2),
  p95Duration: (duration['p(95)'] || 0).toFixed(2),
  errorRate: ((failed.rate || 0) * 100).toFixed(2),
  iterations: data.metrics.iterations ? data.metrics.iterations.count : 0,
};

// Simple HTML template
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Polanji Performance Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; }
    .header { border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .metric { background: #f8f9fa; padding: 12px; margin: 10px 0; border-radius: 6px; }
    .pass { color: #10b981; }
    .warn { color: #f59e0b; }
    .fail { color: #ef4444; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }
    .highlight { background-color: #fffbeb; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Polanji Performance Test Report</h1>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Test: <strong>${summary.testFile}</strong></p>
  </div>

  <div class="metric">
    <h3>✔️ Checks</h3>
    <p>Passed: <span class="pass">${
      summary.checksPassed
    }</span> | Failed: <span class="${
  summary.checksFailed > 0 ? 'fail' : 'pass'
}">${summary.checksFailed}</span></p>
    <p>Pass Rate: <strong class="${
      summary.checksFailed === 0 ? 'pass' : 'warn'
    }">${(100 - summary.errorRate).toFixed(2)}%</strong></p>
  </div>

  <div class="metric">
    <h3>⏱️ Latency (ms)</h3>
    <p>Avg: ${summary.avgDuration} | p95: ${summary.p95Duration}</p>
  </div>

  <div class="metric">
    <h3>📊 Throughput</h3>
    <p>Requests: ${summary.totalRequests} | Iterations: ${
  summary.iterations
}</p>
  </div>

  <h3>Recent Results</h3>
  <table>
    <thead><tr><th>File</th><th>Requests</th><th>p95 (ms)</th><th>Errors</th><th>Passed</th></tr></thead>
    <tbody>
      ${jsonFiles
        .slice(0, 5)
        .map((file) => {
          const d = JSON.parse(
            fs.readFileSync(path.join(resultsDir, file), 'utf8')
          );
          const dur = d.metrics.http_req_duration || {};
          const fails = d.metrics.http_req_failed || {};
          const chk = d.metrics.checks || {};
          return `<tr class="${file === latest.name ? 'highlight' : ''}">
          <td>${file}</td>
          <td>${d.metrics.http_reqs?.count || 0}</td>
          <td>${(dur['p(95)'] || 0).toFixed(0)}</td>
          <td class="${fails.rate > 0.01 ? 'fail' : 'pass'}">${(
            fails.rate * 100
          ).toFixed(1)}%</td>
          <td class="${chk.fails > 0 ? 'warn' : 'pass'}">${chk.passes || 0}/${
            (chk.passes || 0) + (chk.fails || 0)
          }</td>
        </tr>`;
        })
        .join('')}
    </tbody>
  </table>

  <footer style="margin-top: 40px; color: #666;">
    <p>Test performed for Testability Technology Inc. • k6 v${
      data?.root_group?.metadata?.version || 'unknown'
    }</p>
  </footer>
</body>
</html>
`;

fs.writeFileSync(path.join(resultsDir, 'report.html'), html);
console.log(`✅ HTML report saved: ${path.join(resultsDir, 'report.html')}`);
