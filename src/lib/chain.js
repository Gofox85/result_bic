// Blockchain vocabulary from the BIC/REC design system: stable pseudo-hashes and "sealed" dates.
// Purely presentational — nothing here is cryptographic.

// FNV-1a, re-seeded per 8-hex chunk, so the same input always yields the same hash.
function hashHex(input, length = 40) {
  const text = String(input);
  let out = '';
  let seed = 0;
  while (out.length < length) {
    let h = 0x811c9dc5 ^ seed;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    out += (h >>> 0).toString(16).padStart(8, '0');
    seed++;
  }
  return out.slice(0, length);
}

export const shortHash = (input) => {
  const h = hashHex(input);
  return `0x${h.slice(0, 3)}…${h.slice(-3)}`;
};

export const pad2 = (n) => String(n).padStart(2, '0');

// "2026-09-29" -> "29.09.26"
export function sealedDate(isoDate) {
  const [year, month, day] = String(isoDate).split('-');
  return year && month && day ? `${day}.${month}.${year.slice(-2)}` : '00.00.00';
}
