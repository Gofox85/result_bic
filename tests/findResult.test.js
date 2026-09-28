import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { findResult } from '../src/data/findResult.js';

const results = JSON.parse(readFileSync(new URL('../src/data/results.json', import.meta.url), 'utf8'));

test('finds a selected result after trimming whitespace', () => {
  const lookup = findResult(results, ' 250701499 ');
  assert.equal(lookup.type, 'found');
  assert.equal(lookup.result.name, 'Sanjay Kumar');
  assert.equal(lookup.result.selected, true);
  assert.equal(lookup.result.role, 'Technical Team');
});

test('returns not-found for a roll number omitted from the selected results', () => {
  assert.equal(findResult(results, '250701500').type, 'not-found');
});

test('requires a numeric roll number and limits its length', () => {
  for (const value of ['', '   ', 'abc123', '290701499', '25', '25' + '1'.repeat(19)]) {
    assert.equal(findResult(results, value).type, 'invalid', value);
  }
});

test('matches the complete roll number only', () => {
  assert.equal(findResult(results, '2507014').type, 'not-found');
  assert.equal(findResult(results, '2507014990').type, 'not-found');
  assert.equal(findResult(results, '259999999').type, 'not-found');
});