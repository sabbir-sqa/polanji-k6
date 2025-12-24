# Polanji Performance Test Suite (k6)

Performance test automation for Testability Technology Inc. assignment.

## ✅ Features
- Realistic user workflow: Login → Dashboard → Recommendations → Python Course (ID=2) → Quiz Completion
- 4 test types: Smoke, Load, Stress, Soak, Spike
- Modular, maintainable, and CI-ready
- Windows PowerShell support

## 🚀 Setup (Windows)

1. **Install k6**:  
   Download & run [k6-v0.54.0-amd64.msi](https://github.com/grafana/k6/releases)

2. **Clone / Extract** this folder.

3. **Create `.env`** from `.env.example` and fill credentials.

4. **Run tests**:
   ```powershell
   # Smoke test (quick check)
   .\run-smoke.ps1

   # Or manually:
   k6 run -e BASE_URL=https://api.polanji.com -e EMAIL=... -e PASSWORD=... tests/smoke.js