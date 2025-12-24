// tests/soak.js
import { courseCompletionWorkflow } from '../workflows/course-completion.js';

export const options = {
  vus: 3,
  duration: '5m', // 5 minutes (adjust as needed)
  thresholds: {
    'http_req_duration{expected_response:true}': ['p(95) < 2000'],
    checks: ['rate > 0.95'],
    // Detect memory leaks: iterations should not slow over time
  },
};
export default function () {
  courseCompletionWorkflow();
}
