# 🚀 Polanji Performance Test Suite  
### *Submitted for Testability Technology Inc. — Take-Home Assignment*

> ✅ **Fully functional on Windows**  
> ✅ **Modular, scalable, and CI/CD-ready**  
> ✅ **Evidence-based bottleneck analysis included**

---

## 🔍 Executive Summary

This project implements a **comprehensive performance test suite** for Polanji’s FastAPI backend using **k6**, simulating real user behavior while identifying scalability bottlenecks under load.

### ✅ Key Achievements
| Feature | Status |
|--------|--------|
| **Realistic Workflow** | `Login` → `Dashboard` → `Recommendations` → `Python Course (ID=2)` → `Quiz Attempt` → `Submit` |
| **4 Test Types** | Smoke, Load, Stress, Spike (Soak optional) |
| **Individual Endpoint Tests** | `/topics`, `/enroll`, `/courses/{id}/quiz-complete`, etc. |
| **Automated Analysis** | PowerShell script (`scripts/analyze.ps1`) extracts key metrics from JSON |
| **Windows-Optimized** | 100% PowerShell-compatible, no Unix dependencies |

---

## 🛠 Why k6 Was Chosen (vs JMeter)

| Criteria | ✅ **k6** | ⚠️ JMeter |
|---------|----------|-----------|
| **Language** | Modern JavaScript (ES6+) — test-as-code | XML + Groovy — GUI-driven |
| **Performance** | Lightweight (Go-based), fast startup | Heavy (JVM), slow at scale |
| **API-First** | Native REST/GraphQL support | Requires plugins for modern APIs |
| **CI/CD Integration** | CLI-first, JSON output, Docker-native | Complex setup, fragile `.jmx` files |
| **Maintainability** | Modular, reusable, Git-friendly | Hard to diff/review XML |

> 💡 For a *developer-centric team* testing a *FastAPI backend*, k6 is the optimal choice — and aligns with Testability Inc.’s modern stack.

---

## 📂 Project Structure

```bash
polanzi-k6/
├── 📄 README.md                  # ← You are here
├── 📄 .env.example               # Credentials template (DO NOT COMMIT)
│
├── 🚀 run-all.ps1                # Run all tests (Load, Stress, Spike)
├── 🚀 run-smoke.ps1              # Quick smoke test (1 VU)
│
├── 📁 utils/                     # Reusable utilities
│   ├── auth.js                  # Robust login + token extraction
│   └── helpers.js               # Header & auth helpers
│
├── 📁 workflows/                 # Real user journeys
│   └── course-completion.js     # Main flow: Login → Quiz (video-accurate)
│
├── 📁 tests/                     # Performance test types
│   ├── smoke.js                 # 1 VU, 10s — quick validation
│   ├── load.js                  # Ramp 5→10→0 VUs — steady load
│   ├── stress.js                # Ramp to 30 VUs — find breaking point
│   ├── spike.js                 # Burst to 25 VUs — test resilience
│   └── soak.js                  # 3 VUs, 5 min — long-term stability
│
├── 📁 results/                   # Auto-generated outputs
│   ├── smoke-20251224-121331.json
│   ├── load-20251224-121547.json
│   └── ...                      # Raw k6 metrics (for analysis)
│
└── 📁 scripts/
    └── analyze.ps1              # Summarizes JSON results (PowerShell)