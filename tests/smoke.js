// tests/smoke.js
import { courseCompletionWorkflow } from '../workflows/course-completion.js';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    'http_req_duration{expected_response:true}': ['p(95) < 2000'],
    checks: ['rate > 0.95'],
  },
};

export default function () {
  courseCompletionWorkflow();
}
