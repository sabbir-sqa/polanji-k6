// tests/load.js
import { courseCompletionWorkflow } from '../workflows/course-completion.js';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '60s', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{expected_response:true}': ['p(95) < 1500'],
    http_req_failed: ['rate < 0.01'],
    checks: ['rate > 0.98'],
  },
};

export default function () {
  courseCompletionWorkflow();
}
