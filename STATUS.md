# Status: BIC/REC recruitment results

_Last updated: 2 Oct 2026_

The running record of this work across chats. **Read it before starting; update it before finishing.**
It holds no secrets and no candidate data. This repo is public.

## The two sites

| | Results site | Club site |
|---|---|---|
| URL | https://bicrec-results.web.app | https://bicrec.web.app |
| Repo | `Gofox85/result_bic` (this repo) | `SaIdEeVaN/BIC-REC_Site` |
| Firebase | site `bicrec-results` in project `bicrec`, hosting target `results` | default site `bicrec` in the same project |
| Deploy | every push to `main` (`.github/workflows/firebase-deploy.yml`): tests, then deploy | every push to `main`: lint + 4-shard Playwright, then deploy |
| Deploy key | GitHub secret `FIREBASE_SERVICE_ACCOUNT` = key for `github-results-deploy@bicrec.iam.gserviceaccount.com` (roles: Firebase Hosting Admin, API Keys Viewer) | its own `FIREBASE_SERVICE_ACCOUNT` (the `firebase-adminsdk` account). **Don't touch it or its key.** |

Both repos: **commit and push straight to `main`**, no branches or PRs (the user's rule). Every push is a production
deploy, so run the checks first.

Latest change to each live site:
- results site: `f451491` "Remove the chain field background animation" (later commits only touch this file);
- club site: `11f066b` "Stop browsers caching the site's pages".

This repo has only the `main` branch.

## Current state

- **Results site is live with sample data only.** Sample logins:
  - `250701499@rajalakshmi.edu.in` / `250701499` (selected)
  - `250701502@rajalakshmi.edu.in` / `250701502` (not selected)
- **Club site Core Members page (`/team/core`) says "Results coming soon".** It's switched by
  `RECRUITMENT_RESULTS_OPEN` in the club repo's `src/data/club.js` (now `false`). Set to `true`, the page shows
  "Check your result" with a button to the results site. **The user will say when to open it.** Don't open it before
  the real results are published, or every candidate gets "no match".
- **Sign-in rules** (results form and Excel converter both enforce them):
  - Email must end in `@rajalakshmi.edu.in`; otherwise the error is "enter valid email id".
  - The roll number is the password: digits only (letters are dropped as typed) and exactly 9 digits.
- **Caching** (`firebase.json` in each repo): pages are sent with `no-cache`, so a deploy shows up on the next visit
  without a hard refresh. Hashed files under `/assets/` are cached for a year (`immutable`).
  - Club site rules: `/assets/**` and `!/assets/**` (every page and public file).
  - Results site rules: `/assets/**`, `/` and `**/*.html` (it's a single page at `/`).
  - Keep Cache-Control rules from overlapping. Firebase applies whichever matching rule is listed **last**, which
    was checked in the hosting emulator.
- **Links are underlined** on both sites. The exceptions are buttons, logos, header nav cells and boxed social links.
- **Club Contact form:** checks the email format ("enter valid email id") but accepts any domain, because outside
  partners write in through it. The user hasn't confirmed this yet (see below).

## Results data: in progress (2 Oct)

The user sent the real data as uploads in the chat: four round-2 shortlist sheets (Visual & Digital Media, Design,
Tech, Research), each with name, roll number, department and email, plus a markdown list of who was selected per
team. Teams: Event, Digital Media, Design, Tech, Research, Visual Media, PR.
- **Who goes in:** everyone on a round-2 shortlist can sign in. They're "selected" only if they're on the selection
  list.
- **Role text** (the user's rule): `<team name> Associate`, e.g. "Design Associate", "Tech Associate".
- **Matched so far:** 56 shortlisted people; 32 of the 47 selected names match one of them. A dry run through
  `scripts/excel_to_json.py` passes. Nothing is published yet.
- **Where the work is:** `build_sheet.py` (scratchpad) merges the sheets and the list into the converter's CSV.
  The scratchpad and uploads don't survive a new session; if they're gone, ask the user to upload the files again.
  **Never commit the sheets or the CSV.**
- **Blocked on the user:**
  - the Event and PR teams' shortlist sheets (14 selected people have no email or roll number yet);
  - one selected Tech candidate who isn't on the Tech sheet;
  - one selected name whose initial differs from the sheet;
  - one candidate listed with two different roll numbers;
  - when to publish, and whether to open Core Members at the same time.

## Waiting on the user

1. **The answers above**, then the results go out.
2. **When to publish the results,** and separately, **when to open Core Members.**
3. **The result-page messages** (`src/data/site.js` here): keep the current ones or send new text.
4. **Contact form:** keep accepting any email (recommended), or college-only?

## How to do the pending work

### Publish the real results (once the user sends the sheet)
1. Keep the sheet out of the repo (`.gitignore` blocks `.xlsx`/`.csv`). Work from the scratchpad.
2. Seal it. The system `cryptography` package is broken in this container, so use a venv:
   ```sh
   python3 -m venv /tmp/venv && /tmp/venv/bin/pip install -r requirements.txt
   /tmp/venv/bin/python scripts/excel_to_json.py <sheet> src/data/results.json
   ```
   It prints selected / not-selected counts, or stops at the first bad row with its row number. Show the user the
   counts and any bad rows.
3. Spot-check a few real logins with `unlockResult` from `src/lib/resultVault.js` in node. Don't paste candidate
   details anywhere public.
4. Run `npm test && npm run build`, commit **only** `src/data/results.json`, and push to `main` **at the time the
   user gives**. Watch the Actions run.
5. Then ask whether to open Core Members.

### Open Core Members ("make it available")
In `SaIdEeVaN/BIC-REC_Site`: set `RECRUITMENT_RESULTS_OPEN = true` in `src/data/club.js`, run lint + build + the
`team/core|Core Members` Playwright tests, and push to `main`. To close it again, set it back to `false`.

### Starting a new session
- This repo is cloned at `/home/user/result_bic`. The club repo is a second repo: if `/home/user/bic-rec_site` is
  missing, attach it with `add_repo` (owner `SaIdEeVaN`, repo `BIC-REC_Site`, **push** access; the user has
  approved this before), clone it to `/home/user/bic-rec_site`, then `git pull` both before changing anything.
- Python: `python3 -m venv` + `pip install -r requirements.txt` (the system `cryptography` package is broken).

### Checking work from this container
- Deploy status: `curl -sS "https://api.github.com/repos/<owner>/<repo>/actions/runs?head_sha=<sha>"`, then
  `.../actions/runs/<id>/jobs` for each job's result. This works from here for both repos.
- `*.web.app` is blocked from here. Confirm deploys through the GitHub Actions API/logs, and ask the user to check
  the live page.
- For Playwright, use the preinstalled Chromium: `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`.
  Keep any local Playwright config **outside** the repo.
- The club site's five `/achievements fits the viewport` checks fail **only here**: Google Fonts is blocked, so the
  fallback font is wider. They pass in CI.
- Test `firebase.json` changes before deploying: install `firebase-tools` in the scratchpad, copy the built `dist/`
  and the `firebase.json` into a scratch folder, run `firebase emulators:start --only hosting --project demo-bicrec`
  (a `demo-` project needs no login), and read the headers back with `curl -D -`.
- The GitHub check on this repo links to `results.web.app`. That's a naming quirk of Firebase's deploy action; the
  real site is `bicrec-results.web.app`.

## Decisions so far (and why)

- **Results are encrypted per candidate.** Email + roll number go through PBKDF2 (150k rounds), which gives each
  record's id and its AES-GCM key. Records are padded to one size, so `results.json` shows no names, emails, roll
  numbers or selected count.
  - The limit, which the user has been told: the roll number is the only secret. Anyone who knows someone's email
    and roll number can see that person's result.
- **UI follows the club's neo-brutalist design system** (`DESIGN_SYSTEM.md` in the club repo). Underlines are 2px,
  the system's thinnest allowed line.
- **No background animation.** A blockchain background (an animated field of blocks and links behind every page)
  was added to both sites on 1 Oct and removed the same day: the user didn't like how it looked. Don't bring
  back background animation unless the user asks for it again.
- **Core Members history:** a redirect to the results site was tried first. The user then preferred a "Check your
  result" button, and on 30 Sep asked for "coming soon" until results go out. That's why the page has a switch.

## Log

- **29 Sep:**
  - Results site redesigned in the BIC/REC style, with email + roll number sign-in and encrypted results.
  - Firebase site `bicrec-results` created and GitHub Action set up (the user did the console steps).
  - First live deploy.
- **29 Sep:** Club site Core Members: redirect, then replaced by a "Check your result" page.
- **30 Sep:** Review feedback done on both sites: college-email and 9-digit validation, link underlines, and the
  Contact-form email check.
- **30 Sep:** Core Members back to "Results coming soon" behind `RECRUITMENT_RESULTS_OPEN`. This status file added.
- **1 Oct:** Blockchain background animation added to both sites, made stronger, then reverted on both at the
  user's request (revert commits; the code is in the history if ever wanted).
- **1 Oct:** The old branches (`feature/recruitment-results`, `claude/confident-mayer-k9hw1o`) are gone from this
  repo; only `main` remains. STATUS.md brought up to date.
- **1 Oct:** Confirmed both sites' code matches the last commits of 30 Sep (results `ae34b8d`, club `091ae3f`).
  Club site now tells browsers not to cache pages (`no-cache`), so changes show without a hard refresh.
- **1 Oct:** STATUS.md checked against both repos and brought up to date. Nothing is in progress; the next step
  is the user's results sheet and publish time.
- **2 Oct:** Real data received (4 shortlist sheets + selection list). Matched and dry-run sealed in the
  scratchpad; waiting on the user's answers before publishing (see "Results data: in progress").
