//!smoke.js
import http from 'k6/http';
import { check, sleep } from 'k6';

//Test Configuration
export const options = {
  vus: 1, // Number of virtual users = 1
  duration: '5s', // Run for 5 seconds
};

//Default function = executed by each VU
export default function () {
  //1. Prepare login data (form-urlencoded)
  const payload =
    'grant_type=password&username=performancetest02@gmail.com&password=user123456';
  const params = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  //2. Send POST request
  const res = http.post('https://api.polanji.com/log_in', payload, params);

  //3/ Validate response
  check(res, {
    'login succeeded': (r) => r.status === 200,
    'Got access token': (r) => r.json().access_token.length > 0,
  });

  //4. Simulate user think time
  sleep(1);
}
