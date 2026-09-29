import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { unlockResult, validateCredentials } from '../src/lib/resultVault.js';

// Sealed by scripts/excel_to_json.py from scripts/sample-results.csv, so these also check that the Python
// sealer and the browser unlocker agree on the format.
const vault = JSON.parse(readFileSync(new URL('../src/data/results.json', import.meta.url), 'utf8'));

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
