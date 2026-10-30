const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const http = require('http');

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}/api`;
});

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
});

test('Auth & Projects Isolation Flow', async (t) => {
  // 1. Register User A
  const regResA = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user_a@example.com',
      password: 'SecurePassword123!',
      name: 'Alice Researcher'
    })
  });
  assert.strictEqual(regResA.status, 201);
  const dataA = await regResA.json();
  assert.ok(dataA.token);
  assert.strictEqual(dataA.user.email, 'user_a@example.com');
  const tokenA = dataA.token;

  // 2. Duplicate registration returns 409
  const dupRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user_a@example.com',
      password: 'AnotherPassword123!'
    })
  });
  assert.strictEqual(dupRes.status, 409);

  // 3. Login User A
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user_a@example.com',
      password: 'SecurePassword123!'
    })
  });
  assert.strictEqual(loginRes.status, 200);

  // 4. Login with invalid password returns 401
  const badLogin = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user_a@example.com',
      password: 'WrongPassword!'
    })
  });
  assert.strictEqual(badLogin.status, 401);

  // 5. Protected route /api/auth/me without token returns 401
  const noTokenRes = await fetch(`${baseUrl}/auth/me`);
  assert.strictEqual(noTokenRes.status, 401);

  // 6. Protected route /api/auth/me with valid token returns 200
  const meRes = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${tokenA}` }
  });
  assert.strictEqual(meRes.status, 200);
  const meData = await meRes.json();
  assert.strictEqual(meData.user.email, 'user_a@example.com');

  // 7. User A creates a research project
  const createProjRes = await fetch(`${baseUrl}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      title: 'Generative AI in Software Engineering',
      topic: 'Impact of LLMs on developer productivity and code security',
      objective: 'Evaluate code synthesis benchmarks and vulnerability surface',
      mode: 'discover'
    })
  });
  assert.strictEqual(createProjRes.status, 201);
  const projData = await createProjRes.json();
  const projectId = projData.project.id;
  assert.ok(projectId);

  // 8. Register User B
  const regResB = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user_b@example.com',
      password: 'SecurePassword456!',
      name: 'Bob Analyst'
    })
  });
  assert.strictEqual(regResB.status, 201);
  const tokenB = (await regResB.json()).token;

  // 9. ISOLATION CHECK: User B attempts to access User A's project -> MUST return 404/403
  const userBAccessRes = await fetch(`${baseUrl}/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  assert.strictEqual(userBAccessRes.status, 404);

  // 10. ISOLATION CHECK: User B attempts to update User A's project -> MUST return 404
  const userBUpdateRes = await fetch(`${baseUrl}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenB}`
    },
    body: JSON.stringify({ title: 'Hacked Title' })
  });
  assert.strictEqual(userBUpdateRes.status, 404);

  // 11. ISOLATION CHECK: User B lists projects -> should be empty
  const userBListRes = await fetch(`${baseUrl}/projects`, {
    headers: { Authorization: `Bearer ${tokenB}` }
  });
  const userBList = await userBListRes.json();
  assert.strictEqual(userBList.projects.length, 0);

  // 12. User A updates their project
  const userAUpdate = await fetch(`${baseUrl}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      title: 'Generative AI in Software Engineering - Updated'
    })
  });
  assert.strictEqual(userAUpdate.status, 200);
  const updatedData = await userAUpdate.json();
  assert.strictEqual(updatedData.project.title, 'Generative AI in Software Engineering - Updated');
});

