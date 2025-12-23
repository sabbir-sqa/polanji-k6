//workflow.js
import { login } from './utils/auth.js';
import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

export function handleSummary(data) {
  console.log('✅ Test finished. Summary:');
  console.log(textSummary(data, { indent: '  ' }));
  return {}; // no output files unless needed
}

export const options = {
  vus: 1,
  duration: '10s',
};

export default function () {
  //!Step 1: Login -> get token & userId
  const { token, userId } = login(__ENV.EMAIL, __ENV.PASSWORD);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  //!Step 2: Get dashboard stats
  const statsRes = http.get(`${__ENV.BASE_URL}/dashboard/stats`, {
    headers: authHeaders,
  });
  check(statsRes, { 'dashboard stats: 200': (r) => r.status === 200 });
  sleep(0.5);

  //!Step 3: Get recommendations
  const recsRes = http.get(
    `${__ENV.BASE_URL}/recommendations?user_id=${userId}&limit=10`,
    {
      headers: authHeaders,
    }
  );
  check(recsRes, { 'recommendations: 200': (r) => r.status === 200 });

  // Parse recommendations to find "Python Data Structures and Algorithms"
  // For now, assume course_id = 125 (you’ll verify this in DevTools later)
  const pythonCourseId = 2;

  sleep(0.5);

  //!Step 4: Get course details
  const courseRes = http.get(`${__ENV.BASE_URL}/courses/${pythonCourseId}`, {
    headers: authHeaders,
  });
  check(courseRes, { 'course details: 200': (r) => r.status === 200 });
  sleep(0.5);

  //!Step 5: Get section quizes (assume section 0)
  const quizRes = http.get(
    `${__ENV.BASE_URL}/section-quizzes?course_id=${pythonCourseId}&section_index=0}`,
    {
      headers: authHeaders,
    }
  );
  check(quizRes, { 'quizzes: 200': (r) => r.status === 200 });
  sleep(0.5);

  //!Step 6: Mark quiz as complete
  const completeRes = http.post(
    `${__ENV.BASE_URL}/courses/${pythonCourseId}/sections/0/quiz-complete`,
    {
      headers: authHeaders,
    }
  );
  check(completeRes, { 'quiz complete: 200': (r) => r.status === 200 });
  sleep(1);
}
