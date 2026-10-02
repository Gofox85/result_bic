import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  EMAIL_ERROR,
  ROLL_NUMBER_ERROR,
  rollNumberInput,
  unlockResult,
  validateCredentials,
} from '../src/lib/resultVault.js';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));

// Sealed by scripts/excel_to_json.py from scripts/sample-results.csv (CI re-seals it on every run), so these
// also check that the Python sealer and the browser unlocker agree on the format.
const vault = readJson('./fixtures/sample-results.json');

test('unlocks a selected result with the matching email and roll number', async () => {
  const lookup = await unlockResult(vault, '250701499@rajalakshmi.edu.in', '250701499');
  assert.equal(lookup.type, 'found');
  assert.deepEqual(lookup.result, {
    rollNo: '250701499',
    name: 'Sanjay Kumar',
    selected: true,
    role: 'Technical Associate',
    department: 'CSE',
  });
});

test('unlocks a not-selected result without a role', async () => {
  const lookup = await unlockResult(vault, '250701502@rajalakshmi.edu.in', '250701502');
  assert.equal(lookup.type, 'found');
  assert.equal(lookup.result.selected, false);
  assert.equal(lookup.result.role, undefined);
});

test('ignores case and surrounding whitespace', async () => {
  const lookup = await unlockResult(vault, '  250701501@Rajalakshmi.EDU.in ', ' 250701501 ');
  assert.equal(lookup.type, 'found');
  assert.equal(lookup.result.name, 'Priya Sharma');
});

test('returns not-found when either half does not match', async () => {
  assert.equal((await unlockResult(vault, '250701499@rajalakshmi.edu.in', '250701501')).type, 'not-found');
  assert.equal((await unlockResult(vault, '250701501@rajalakshmi.edu.in', '250701499')).type, 'not-found');
  assert.equal((await unlockResult(vault, 'nobody@rajalakshmi.edu.in', '250701499')).type, 'not-found');
});

test('publishes no names, emails or roll numbers in the clear', () => {
  const raw = JSON.stringify(vault);
  for (const value of ['Sanjay', 'rajalakshmi.edu.in', '250701499', 'Technical Associate']) {
    assert.equal(raw.includes(value), false, value);
  }
});

test('accepts only a @rajalakshmi.edu.in email', () => {
  for (const email of ['240101016@rajalakshmi.edu.in', ' Priya.S@Rajalakshmi.EDU.IN ']) {
    assert.deepEqual(validateCredentials(email, '240101016'), {}, email);
  }
  for (const email of ['', 'not-an-email', 'priya@gmail.com', 'priya@rajalakshmi.edu.in.evil.com', '@rajalakshmi.edu.in']) {
    assert.deepEqual(validateCredentials(email, '240101016'), { email: EMAIL_ERROR }, email);
  }
  assert.equal(EMAIL_ERROR, 'enter valid email id');
});

test('accepts only a 9-digit roll number', () => {
  assert.deepEqual(validateCredentials('a@rajalakshmi.edu.in', ' 240101016 '), {});
  for (const rollNo of ['', '24010101', '2401010160', '24010101A', '2401-0101', 'abcdefghi']) {
    assert.deepEqual(validateCredentials('a@rajalakshmi.edu.in', rollNo), { rollNo: ROLL_NUMBER_ERROR }, rollNo);
  }
});

test('the roll number field keeps only digits, nine at most', () => {
  assert.equal(rollNumberInput('24a01-01 016'), '240101016');
  assert.equal(rollNumberInput('abc!@#'), '');
  assert.equal(rollNumberInput('2401010169999'), '240101016');
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
