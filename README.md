# BIC/REC Recruitment Results

The results page for the Blockchain Innovation Club (REC) recruitment. A candidate signs in with the **email**
they applied with and their **roll number as the password**, and the page shows whether they were selected (and
for which team) or not.

It is a static React + Vite site styled after the club site ([bicrec.web.app](https://bicrec.web.app)) and its
neo-brutalist design system. There is no backend.

## How results stay private

The results sheet is never published. `scripts/excel_to_json.py` turns it into `src/data/results.json`, where
every candidate's row is encrypted on its own:

- email + roll number → PBKDF2-SHA256 (150,000 rounds, random salt) → a record id and an AES-256-GCM key
- each record is padded to the same size, so selected and not-selected rows look identical
- the file holds only ids and ciphertext: no names, emails, roll numbers or teams

In the browser the same derivation runs on what the candidate types. If the id exists, the key opens that one
record; nothing is sent anywhere.

**The limit:** the roll number is the only secret. Anyone who knows (or guesses) a candidate's email *and* roll
number can see that candidate's result. The slow key derivation makes mass guessing expensive, not impossible.
Don't put anything in the sheet you wouldn't want that candidate's classmates to see.

## Publishing results

1. Build the sheet (Excel or CSV), one row per interviewed candidate, **selected and not selected**:

   | Email | Roll Number | Name | Department | Selected | Role |
   | --- | --- | --- | --- | --- | --- |
   | sanjay@rajalakshmi.edu.in | 250701499 | Sanjay Kumar | CSE | Yes | Technical Team |
   | aarav@rajalakshmi.edu.in | 250701502 | Aarav Mehta | ECE | No | |

   - **Email**, **Roll Number**, **Name** and **Selected** are required. **Role** is required when Selected is yes.
     **Department** is optional.
   - Selected accepts yes/no, true/false, 1/0, selected/not selected.
   - Column names are matched loosely (`Roll No`, `Register Number`, `Team`, `Status`, ... all work).
   - Format the roll-number column as **text** in Excel so leading zeroes survive.
   - Emails and roll numbers must be unique. Case and extra spaces don't matter.

2. Seal it:

   ```sh
   python3 -m pip install -r requirements.txt
   python3 scripts/excel_to_json.py path/to/results.xlsx src/data/results.json
   ```

   It prints how many rows it sealed (selected / not selected), or the exact row that's wrong.

3. Check it locally with a real row, then commit **only** `src/data/results.json` and push to `main`.
   `.gitignore` already blocks `.xlsx` and `.csv` files; keep the sheet out of the repo.

Wording on the page (next steps for selected candidates, the message for everyone else, club links) lives in
`src/data/site.js`.

The committed `results.json` is sealed from the fictional `scripts/sample-results.csv`. Try
`sanjay.sample@example.com` / `250701499` (selected) or `aarav.sample@example.com` / `250701502` (not selected).

## Running locally

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # lookup + Python/browser format tests
npm run build    # static site in dist/
```

The page needs Web Crypto, which browsers only offer over `https://` or on `localhost`. Opening the dev server
from another device by its LAN IP will show a "needs a secure connection" message; that's expected.

## Deploying

The output is a plain static site in `dist/`.

- **Vercel** (already configured, `vercel.json`): import the repo, keep the Vite preset. Every push to `main`
  redeploys.
- **Firebase Hosting**, next to the club site: create a second site in the `bicrec` project (for example
  `bicrec-results`) and deploy `dist/` to that site only, so the main club site is never overwritten.

## Project structure

```text
scripts/
  excel_to_json.py       seals the sheet into src/data/results.json
  sample-results.csv     fictional sample sheet
src/
  components/            Ticker, Navbar, PageHeader, ResultForm, ResultCard, HowItWorks, Footer, motion
  data/results.json      sealed results (safe to publish)
  data/site.js           page wording and club links
  lib/resultVault.js     validation, key derivation, decryption
  lib/chain.js           decorative hashes and dates
tests/
  resultVault.test.js
```

## Git workflow

All work is committed and pushed directly to `main`. No feature branches, no pull requests.

```sh
git checkout main
git pull
# ...change things, then:
npm test && npm run build
git add -A
git commit -m "Describe the change"
git push origin main
```
