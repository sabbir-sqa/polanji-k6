// utils/auth.js
import http from 'k6/http';
import { check, fail } from 'k6';

export function login(email, password) {
  const url = `${__ENV.BASE_URL}/log_in`;
  const payload = `grant_type=password&username=${encodeURIComponent(
    email
  )}&password=${encodeURIComponent(password)}`;
  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const res = http.post(url, payload, params);

  // Check HTTP status
  if (res.status !== 200) {
    console.error(`❌ Login failed: ${res.status} ${res.statusText}`);
    console.error('Response body:', res.body.substring(0, 500)); // avoid huge logs
    fail(`Login failed with status ${res.status}`);
  }

  // Parse JSON safely
  let data;
  try {
    data = res.json();
  } catch (e) {
    console.error('❌ Invalid JSON in login response');
    console.error('Raw response:', res.body);
    fail('Login response is not valid JSON');
  }

  // Validate structure
  if (!data.access_token) {
    fail('Missing access_token in login response');
  }
  if (!data.user || typeof data.user.id !== 'number') {
    console.error('⚠️ User object missing or invalid:', data.user);
    fail('User ID not found in login response');
  }

  console.log(`✅ Login successful. User ID: ${data.user.id}`);
  return {
    token: data.access_token,
    userId: data.user.id,
    user: data.user,
  };
}
