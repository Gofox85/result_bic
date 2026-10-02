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

1. Build the sheet (Excel or CSV), one row per candidate who can check (for 2026: every applicant), **selected and not selected**:

   | Email | Roll Number | Name | Department | Selected | Role |
   | --- | --- | --- | --- | --- | --- |
   | 250701499@rajalakshmi.edu.in | 250701499 | Sanjay Kumar | CSE | Yes | Tech Associate |
   | 250701502@rajalakshmi.edu.in | 250701502 | Aarav Mehta | ECE | No | |

   - **Email**, **Roll Number**, **Name** and **Selected** are required. **Role** is required when Selected is yes.
     **Department** is optional.
   - Selected accepts yes/no, true/false, 1/0, selected/not selected.
   - Column names are matched loosely (`Roll No`, `Register Number`, `Team`, `Status`, ... all work).
   - Format the roll-number column as **text** in Excel so leading zeroes survive.
   - Emails must be `@rajalakshmi.edu.in` addresses and roll numbers exactly 9 digits (e.g. `240101016`), the
     same rules the sign-in form enforces. The converter stops at the first row that breaks them.
   - Emails and roll numbers must be unique. Case and extra spaces don't matter.

2. Seal it:

   ```sh
   python3 -m pip install -r requirements.txt
   python3 scripts/excel_to_json.py path/to/results.xlsx src/data/results.json
   ```

   It prints how many rows it sealed (selected / not selected), or the exact row that's wrong.

3. Check it locally with a real row, then commit **only** `src/data/results.json` and push to `main`.
   That push deploys, so the results are live about two minutes later (see Deploying).
   `.gitignore` already blocks `.xlsx` and `.csv` files; keep the sheet out of the repo.

Wording on the page (next steps for selected candidates, the message for everyone else, club links) lives in
`src/data/site.js`.

Until real results are published, `results.json` is sealed from the fictional `scripts/sample-results.csv`. Try
`250701499@rajalakshmi.edu.in` / `250701499` (selected) or `250701502@rajalakshmi.edu.in` / `250701502` (not selected).
The tests use their own copy of the sample (`tests/fixtures/sample-results.json`), so replacing `results.json`
with the real results doesn't break them.

## Running locally

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # lookup + Python/browser format tests
npm run build    # static site in dist/
```

The page needs Web Crypto, which browsers only offer over `https://` or on `localhost`. Opening the dev server
from another device by its LAN IP will show a "needs a secure connection" message; that's expected.

## Deploying (Firebase Hosting)

The page is hosted as a second site, `bicrec-results`, inside the club's `bicrec` Firebase project, next to
[bicrec.web.app](https://bicrec.web.app). `firebase.json` names the hosting target `results`, and `.firebaserc`
maps that target to the `bicrec-results` site only, so a deploy from this repo can never overwrite the club site.

[`.github/workflows/firebase-deploy.yml`](.github/workflows/firebase-deploy.yml) runs on every push to `main`:

1. **Test & build**: re-seals the sample sheet with the Python sealer, runs `npm test` (which also checks the
   published `results.json` is sealed and has no email in the clear), and builds.
2. **Deploy**: builds and publishes to the live channel of `bicrec-results`.

A failing test stops the deploy. A manual run from the Actions tab deploys the branch it's started on.

**Pushing a new `results.json` to `main` puts it live in about two minutes.** Hold the push until results
are meant to be out. `index.html` is served with `no-cache`, so everyone gets the new results as soon as the
deploy finishes.

### One-time setup

You need a Google account that is an Owner or Editor on the `bicrec` Firebase project.

1. **Create the site.** In the [Firebase console](https://console.firebase.google.com/project/bicrec/hosting/sites),
   click **Add another site** and enter `bicrec-results`. Or with the CLI:

   ```sh
   npm install -g firebase-tools
   firebase login
   firebase hosting:sites:create bicrec-results --project bicrec
   ```

   Site IDs are global. If `bicrec-results` is taken, pick another and change it in `.firebaserc`.

2. **Add the deploy key to GitHub.**
   - Open the project's [service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=bicrec).
     Reuse the one the club site already deploys with (named like `github-action-…@bicrec.iam.gserviceaccount.com`):
     **Keys → Add key → Create new key → JSON**. If there isn't one, create a service account with the
     **Firebase Hosting Admin** role and make a JSON key for it.
   - In this repo, go to **Settings → Secrets and variables → Actions → New repository secret**. Name it
     `FIREBASE_SERVICE_ACCOUNT` and paste the whole JSON file as the value.
   - Delete the downloaded JSON file afterwards. It's a password for the project.

3. **Deploy.** Push to `main`, or open **Actions → Deploy to Firebase Hosting → Run workflow** on `main`.
   The site is live at `https://bicrec-results.web.app`.

### Deploying from your own machine

```sh
npm ci
npm run build
firebase deploy --only hosting:results
```

### Custom domain (optional)

In the Firebase console, open **Hosting → bicrec-results → Add custom domain** and follow the DNS steps.

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
  fixtures/sample-results.json   the sample sheet, sealed, for the tests
.github/workflows/firebase-deploy.yml
firebase.json, .firebaserc       hosting target "results" -> site bicrec-results
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
