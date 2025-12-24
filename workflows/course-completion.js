// workflows/course-completion.js
import { login } from '../utils/auth.js';
import { addAuthHeaders } from '../utils/helpers.js';
import http from 'k6/http';
import { check, sleep } from 'k6';

export function courseCompletionWorkflow() {
  // 🔐 Step 1: Login
  const { token, userId } = login(__ENV.EMAIL, __ENV.PASSWORD);
  const authHeaders = addAuthHeaders({}, token);

  // 📚 Step 2: Get recommendations
  const recsRes = http.get(
    `${__ENV.BASE_URL}/recommendations?user_id=${userId}&limit=10`,
    {
      headers: authHeaders,
    }
  );
  check(recsRes, { 'recommendations: status 200': (r) => r.status === 200 });

  // 🎯 Step 3: Use known Python course ID = 2 (from assignment verification)
  const courseId = parseInt(__ENV.PYTHON_COURSE_ID || '2', 10);

  // 📘 Step 4: Fetch course details (optional but validates)
  const courseRes = http.get(`${__ENV.BASE_URL}/courses/${courseId}`, {
    headers: authHeaders,
  });
  check(courseRes, {
    'course: status 200': (r) => r.status === 200,
    'course: title contains Python': (r) => {
      try {
        const title = r.json().course_title;
        return title && title.toLowerCase().includes('python');
      } catch (e) {
        return false;
      }
    },
  });

  // ❓ Step 5: Get section 0 quizzes
  const quizRes = http.get(
    `${__ENV.BASE_URL}/section-quizzes?course_id=${courseId}&section_index=0`,
    { headers: authHeaders }
  );
  check(quizRes, { 'quiz: status 200': (r) => r.status === 200 });

  // ✅ Step 6: Mark quiz as complete
  const completeRes = http.post(
    `${__ENV.BASE_URL}/courses/${courseId}/sections/0/quiz-complete`,
    {}, // empty body
    { headers: authHeaders }
  );
  check(completeRes, { 'quiz-complete: status 200': (r) => r.status === 200 });

  // Simulate user think time
  sleep(1);
}
