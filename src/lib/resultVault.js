// Results are published sealed. A candidate's record can only be opened with their own email and roll
// number: together they derive (PBKDF2, then HMAC) both the id the record is filed under and the AES-GCM key
// that seals it. Nobody reading results.json can list the candidates or see a result without those two values.
//
// scripts/excel_to_json.py writes this format. Keep the two in step.

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Candidates sign in with their college email and their 9-digit roll number (e.g. 240101016).
// scripts/excel_to_json.py refuses sheet rows that break these rules, so no one is published unable to sign in.
export const ROLL_NUMBER_LENGTH = 9;
const emailPattern = /^[^\s@]+@rajalakshmi\.edu\.in$/;
const rollNumberPattern = new RegExp(`^\\d{${ROLL_NUMBER_LENGTH}}$`);

export const EMAIL_ERROR = 'enter valid email id';
export const ROLL_NUMBER_ERROR = `enter valid roll number (${ROLL_NUMBER_LENGTH} digits)`;

const normalizeEmail = (value) => value.trim().toLowerCase();
const normalizeRollNumber = (value) => value.replace(/\s+/g, '').toUpperCase();

// What the roll number field keeps of whatever is typed or pasted into it: digits only, never more than nine.
export const rollNumberInput = (value) => value.replace(/\D/g, '').slice(0, ROLL_NUMBER_LENGTH);

export const validateEmail = (email) => (emailPattern.test(normalizeEmail(email)) ? undefined : EMAIL_ERROR);
export const validateRollNumber = (rollNo) =>
  rollNumberPattern.test(normalizeRollNumber(rollNo)) ? undefined : ROLL_NUMBER_ERROR;

export function validateCredentials(email, rollNo) {
  const errors = {};
  const emailError = validateEmail(email);
  const rollNoError = validateRollNumber(rollNo);
  if (emailError) errors.email = emailError;
  if (rollNoError) errors.rollNo = rollNoError;
  return errors;
}

const fromBase64 = (value) => Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

export class InsecureContextError extends Error {}

function subtleCrypto() {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new InsecureContextError('Web Crypto is only available over https or on localhost.');
  return subtle;
}

async function deriveRecordSecrets(vault, email, rollNo) {
  const subtle = subtleCrypto();
  const secret = await subtle.importKey('raw', encoder.encode(`${email}\n${rollNo}`), 'PBKDF2', false, ['deriveBits']);
  const master = await subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromBase64(vault.salt), iterations: vault.iterations },
    secret,
    256,
  );
  const expander = await subtle.importKey('raw', master, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const [id, key] = await Promise.all([
    subtle.sign('HMAC', expander, encoder.encode('bic-results/id')),
    subtle.sign('HMAC', expander, encoder.encode('bic-results/key')),
  ]);
  return { id: toHex(new Uint8Array(id).slice(0, 16)), key };
}

// Resolves to { type: 'found', result } or { type: 'not-found' }. A wrong email and a wrong roll number look
// the same from here, on purpose: the page can't tell which half was mistyped, and neither can anyone guessing.
export async function unlockResult(vault, emailInput, rollNoInput) {
  const { id, key } = await deriveRecordSecrets(vault, normalizeEmail(emailInput), normalizeRollNumber(rollNoInput));
  if (!Object.prototype.hasOwnProperty.call(vault.records, id)) return { type: 'not-found' };

  const subtle = subtleCrypto();
  const sealed = fromBase64(vault.records[id]);
  const aesKey = await subtle.importKey('raw', key, 'AES-GCM', false, ['decrypt']);
  const plain = await subtle.decrypt(
    { name: 'AES-GCM', iv: sealed.slice(0, 12), additionalData: encoder.encode(id) },
    aesKey,
    sealed.slice(12),
  );
  return { type: 'found', result: JSON.parse(decoder.decode(plain)) };
}
