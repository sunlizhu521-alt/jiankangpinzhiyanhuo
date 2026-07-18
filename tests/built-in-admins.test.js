import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function findFreePort() {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const { port } = server.address();
  server.close();
  await once(server, 'close');
  return port;
}

async function login(baseUrl, name, password) {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, password })
  });
  if (!response.ok) throw new Error(`Login failed for ${name}: ${response.status}`);
  return response.json();
}

test('both built-in administrators are synchronized from environment variables', { timeout: 20_000 }, async () => {
  const tempDir = mkdtempSync(path.join(tmpdir(), 'jiankangpinzhiyanhuo-admin-test-'));
  const port = await findFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server/app.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(port),
      DATA_DIR: tempDir,
      BACKUP_DIR: path.join(tempDir, 'backups'),
      ADMIN_NAME: '孙立柱',
      ADMIN_PASSWORD: 'primary-test-password',
      SECOND_ADMIN_NAME: '胡远刚',
      SECOND_ADMIN_PASSWORD: 'secondary-test-password'
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  });
  let serverOutput = '';
  child.stdout.on('data', (chunk) => { serverOutput += chunk; });
  child.stderr.on('data', (chunk) => { serverOutput += chunk; });

  try {
    let primary;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      try {
        primary = await login(baseUrl, '孙立柱', 'primary-test-password');
        break;
      } catch {
        if (child.exitCode !== null) throw new Error(`Server exited early: ${serverOutput}`);
        await delay(100);
      }
    }
    assert.ok(primary, `Server did not become ready: ${serverOutput}`);

    const secondary = await login(baseUrl, '胡远刚', 'secondary-test-password');
    const usersResponse = await fetch(`${baseUrl}/api/auth/users`, {
      headers: { Authorization: `Bearer ${primary.token}` }
    });
    assert.equal(usersResponse.status, 200);
    const usersPayload = await usersResponse.json();
    const builtInAdmins = usersPayload.users.filter((user) => ['孙立柱', '胡远刚'].includes(user.name));

    assert.equal(primary.role, '管理员');
    assert.equal(secondary.role, '管理员');
    assert.ok(secondary.pageAccess.length > 0);
    assert.equal(builtInAdmins.length, 2);
    assert.ok(builtInAdmins.every((user) => user.role === '管理员'));
  } finally {
    if (child.exitCode === null) {
      const closePromise = once(child, 'close');
      child.kill('SIGKILL');
      await Promise.race([closePromise, delay(5_000)]);
    }
    rmSync(tempDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});
