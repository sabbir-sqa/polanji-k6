//utils/auth.js
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

  //!Check HTTP status first
  if (res.status !== 200) {
    console.error(`Login failed: ${res.status} ${res.status_text}`);
    console.error(`Response body: ${res.body}`);
    fail('Login endpoint returned non-200 status');
  }

  //!Safely parse JSON
  let data;
  try {
    data = res.json();
  } catch (e) {
    console.error('Failed to parse JSON from /log_in response');
    console.error('Raw body:', res.body);
    fail('Invalid JSON response from /log_in');
  }

  //!Validate expected fields
  if (!data.access_token) {
    fail('access_token missing in login response');
  }
  if (!data.user || !data.user.id) {
    console.error(
      'Missing or incomplete user object in login response:',
      data.user
    );
    fail('User object missing or has no "id" field');
  }

  console.log(`Logged in as user ID: ${data.user.id}`);

  return {
    token: data.access_token,
    userId: data.user.id,
    user: data.user,
  };
}
