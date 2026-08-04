import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },  // Ramp up to 10 users
    { duration: '3m', target: 10 },  // Stay at 10 users for 3m
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users for 3m
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users for 3m
    { duration: '1m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete below 2s
    http_req_failed: ['rate<0.01'],    // Error rate must be less than 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3000/api/v1';

export default function () {
  // 1. Create Project
  const projectRes = http.post(`${BASE_URL}/projects`, JSON.stringify({ name: 'Load Test Project' }), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${__ENV.TEST_TOKEN}` },
  });
  check(projectRes, { 'project created': (r) => r.status === 200 });
  const projectId = projectRes.json('data.id');

  sleep(1);

  // 2. Upload Document
  const docPayload = {
    projectId: projectId,
    // In a real test, this would be a multipart form upload with a file
  };
  const uploadRes = http.post(`${BASE_URL}/documents`, JSON.stringify(docPayload), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${__ENV.TEST_TOKEN}` },
  });
  check(uploadRes, { 'document uploaded': (r) => r.status === 200 });
  const documentId = uploadRes.json('data.id');

  sleep(1);

  // 3. Trigger Execution
  const execRes = http.post(`${BASE_URL}/executions`, JSON.stringify({ projectId, documentId }), {
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${__ENV.TEST_TOKEN}` },
  });
  check(execRes, { 'execution started': (r) => r.status === 200 });

  sleep(5);
}
