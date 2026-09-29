import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { unlockResult, validateCredentials } from '../src/lib/resultVault.js';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));

// Sealed by scripts/excel_to_json.py from scripts/sample-results.csv (CI re-seals it on every run), so these
// also check that the Python sealer and the browser unlocker agree on the format.
const vault = readJson('./fixtures/sample-results.json');

test('unlocks a selected result with the matching email and roll number', async () => {
  const lookup = await unlockResult(vault, 'sanjay.sample@example.com', '250701499');
  assert.equal(lookup.type, 'found');
  assert.deepEqual(lookup.result, {
    rollNo: '250701499',
    name: 'Sanjay Kumar',
    selected: true,
    role: 'Technical Team',
    department: 'CSE',
  });
});

test('unlocks a not-selected result without a role', async () => {
  const lookup = await unlockResult(vault, 'aarav.sample@example.com', '250701502');
  assert.equal(lookup.type, 'found');
  assert.equal(lookup.result.selected, false);
  assert.equal(lookup.result.role, undefined);
});

test('ignores case and surrounding whitespace', async () => {
  const lookup = await unlockResult(vault, '  Priya.Sample@EXAMPLE.com ', ' 250701501 ');
  assert.equal(lookup.type, 'found');
  assert.equal(lookup.result.name, 'Priya Sharma');
});

test('returns not-found when either half does not match', async () => {
  assert.equal((await unlockResult(vault, 'sanjay.sample@example.com', '250701501')).type, 'not-found');
  assert.equal((await unlockResult(vault, 'priya.sample@example.com', '250701499')).type, 'not-found');
  assert.equal((await unlockResult(vault, 'nobody@example.com', '250701499')).type, 'not-found');
});

test('publishes no names, emails or roll numbers in the clear', () => {
  const raw = JSON.stringify(vault);
  for (const value of ['Sanjay', 'sample@example.com', '250701499', 'Technical Team']) {
    assert.equal(raw.includes(value), false, value);
  }
});

test('validates the email and roll number before looking anything up', () => {
  assert.deepEqual(validateCredentials('a@b.co', '250701499'), {});
  assert.deepEqual(Object.keys(validateCredentials('', '')), ['email', 'rollNo']);
  assert.deepEqual(Object.keys(validateCredentials('not-an-email', '250701499')), ['email']);
  for (const rollNo of ['123', '2507-01499', '1'.repeat(21)]) {
    assert.deepEqual(Object.keys(validateCredentials('a@b.co', rollNo)), ['rollNo'], rollNo);
  }
});

// The published file holds the real results, so only its shape is checked here, never its contents.
test('the published results.json is sealed and well-formed', () => {
  const published = readJson('../src/data/results.json');
  assert.equal(published.format, 1);
  assert.match(published.published, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(published.iterations >= 100_000);
  assert.equal(Buffer.from(published.salt, 'base64').length, 16);

  const records = Object.entries(published.records);
  assert.ok(records.length > 0, 'no records');
  for (const [id, sealed] of records) {
    assert.match(id, /^[0-9a-f]{32}$/);
    // 12-byte IV + padded 256-byte blocks + 16-byte tag
    assert.equal((Buffer.from(sealed, 'base64').length - 12 - 16) % 256, 0, id);
  }
  assert.equal(JSON.stringify(published).includes('@'), false, 'an email address is in the clear');
});
