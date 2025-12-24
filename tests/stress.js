// tests/stress.js
import { courseCompletionWorkflow } from '../workflows/course-completion.js';

export const options = {
  stages: [
    { duration: '20s', target: 5 },
    { duration: '20s', target: 15 },
    { duration: '20s', target: 30 }, // stress peak
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{expected_response:true}': ['p(99) < 3000'],
    http_req_failed: ['rate < 0.05'], // allow 5% under stress
  },
};
export default function () {
  courseCompletionWorkflow();
}
