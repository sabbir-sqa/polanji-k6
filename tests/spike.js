// tests/spike.js
import { courseCompletionWorkflow } from '../workflows/course-completion.js';

export const options = {
  stages: [
    { duration: '10s', target: 2 },
    { duration: '10s', target: 25 }, // spike!
    { duration: '20s', target: 2 },
  ],
  thresholds: {
    http_req_failed: ['rate < 0.1'], // 10% failure allowed during spike
  },
};
export default function () {
  courseCompletionWorkflow();
}
