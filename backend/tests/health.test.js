const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const http = require('http');

test('GET /api/health returns 200 with operational status and services info', async (t) => {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.strictEqual(res.status, 200);

    const body = await res.json();
    assert.strictEqual(body.status, 'healthy');
    assert.strictEqual(body.services.api, 'operational');
    assert.ok(typeof body.uptime === 'number');
    assert.ok(body.timestamp);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

