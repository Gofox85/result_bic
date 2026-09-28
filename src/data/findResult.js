const rollNumberPattern = /^25\d{1,18}$/;

export function findResult(results, input) {
  const rollNo = input.trim();

  if (!rollNumberPattern.test(rollNo)) {
    return { type: 'invalid' };
  }

  const result = results.find((candidate) => candidate.rollNo === rollNo);
  return result ? { type: 'found', result } : { type: 'not-found' };
}