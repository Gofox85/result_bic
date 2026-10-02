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
- results site: `c73305f` and earlier: the "applied" wording and "selected as a/an <role>". The live data is still
  the sample data until the release.
- club site: `b5f36f4`, on top of the user's own `9ab2722`. That merge, from another session, added a **dark theme**
  switched from the header and a `status.md` in the club repo.

**Results deploy workflow:** it was switched off manually on 1 Oct at 22:20 IST and the user turned it back on
on 2 Oct. If it's ever `disabled_manually` again, don't re-enable it yourself: ask the user.

## Release scheduled: 3 Oct 2026, 08:00 IST (02:30 UTC)

- **The file:** `release/results.json.enc` is the verified, sealed `results.json` (244 records), encrypted again
  (AES-256-GCM) with a random key that is **not in this repo**. It's in the repo so the release survives a reset
  session. It isn't part of the built site, and it's useless without the key.
- **Two scheduled tasks (`send_later`) wake this session.** The key, the expected sha256 and the exact steps are in
  their messages, which are private to the user's account.
  - `trig_01BN4Hrjf62vF58FCSDNZAfX`, 07:30 IST: pre-flight. Checks the workflow is enabled, unlocks the file into the
    scratchpad, dry-runs both builds, and alerts the user if anything's wrong.
  - `trig_01XRSKMF8P4NDU9YUDNHRFJr`, 08:00 IST: go. Unlocks into `src/data/results.json`, checks the sha256, tests,
    removes `release/` and pushes. Then sets `RECRUITMENT_RESULTS_OPEN = true` on the club site and pushes, watches
    both deploys, and tells the user.
  - `trig_01Nib2VAvwLAabvG7uBFVDh4`, 10:00 IST: club site roster. Fills `src/data/coreMembers.js` in the club repo
    with the 47 new core members (the list is in the task's private message), then pushes and tells the user. It
    first checks that the 08:00 release happened.
- **To move or cancel the release:** `delete_trigger` the IDs, and schedule again if needed.
- **Where the selected members' details are:** not in either repo in readable form (both are public). The user
  has their master sheet and selection list, plus a private spreadsheet of the 47 sent in the chat on 2 Oct.
  From 10:00 IST on 3 Oct, the club repo's `src/data/coreMembers.js` holds names, teams and departments only.

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
- **Club Contact form:** takes only `@rajalakshmi.edu.in` addresses (the user's choice, 2 Oct). Anything else shows
  "enter valid email id". A line under the form points people outside REC to the club's email.
- **Result-page messages** (`src/data/site.js`): the user confirmed on 2 Oct to keep them as they are.
- **Sample logins** (live until the release): `250701499@rajalakshmi.edu.in` / `250701499` (selected, Tech
  Associate), `250701501@…` / `250701501` (selected, Design Associate), `250701502@…` / `250701502` (not selected).

## Results data: ready, waiting for the user's go time (2 Oct)

**Source of truth:** the master form-response sheet ("BIC Recruitment 2026-27 Responses"), which the user says is
100% correct. It supplies every email, roll number, name and department.
- Where a college-email cell is malformed, the form's login-email column holds the correct address.
- Five people submitted twice, with identical details both times.

**What gets published:**
- **Every applicant can check** (the user's choice): 244 people, of whom 47 are selected and 197 not selected.
- Selected per team (from the user's selection list): Event 8, Tech 8, Design 8, PR 7, Research 6, Digital
  Media 5, Visual Media 5.
- **Role text** (the user's rule): `<team> Associate`. The page reads "selected as a/an <role>".
- Matching the selection list to the master: every name resolved to exactly one applicant. A few list entries
  differ from the master in spelling or an initial, and one candidate's roll number on a shortlist sheet differed
  from the master. The master wins everywhere.

**Ready in the scratchpad** (never commit any of it; it holds candidate emails and roll numbers in the clear):
- `ready-results.json`: sealed and verified. All 244 logins open the right record; wrong pairs open nothing.
- `build_v2.py` + `master.py`: rebuild it (`build_v2.py OUT.csv --everyone`, then `scripts/excel_to_json.py`).
- `verify.mjs`: checks every login.

If the scratchpad is gone, ask the user to re-upload the master sheet and the selection list, then redo the
matching.

**Go-live steps** (only at the time the user gives):
1. Results site: copy `ready-results.json` to `src/data/results.json`, run `npm test && npm run build`, commit
   only that file, and push. **Check the deploy workflow is enabled first** (see the warning near the top).
2. Club site: set `RECRUITMENT_RESULTS_OPEN = true` in `src/data/club.js`, run lint + build, and push. The user
   wants Core Members to switch **at the same time** as the results go live.
3. Watch both deploys, then tell the user.

## Waiting on the user

Nothing. The 08:00 release and the 10:00 roster are scheduled (see above), and every open question has been
answered. Anything else is new work.

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
- **2 Oct:** Unused-file sweep of both repos (import graph from every entry point, barrel exports, member photos):
  only `.env.example` here was unused, and it's deleted. The club repo had nothing unused.
- **2 Oct:** Contact form made college-only. Sample results switched to the "<team> Associate" roles. Club site
  got the Core Members roster section (empty until 10:00 IST on 3 Oct), and the roster task was scheduled.
- **2 Oct:** Go-live set by the user for 3 Oct 08:00 IST. Locked release file committed, and the 07:30 pre-flight
  and 08:00 release scheduled.
- **2 Oct:** Real data received (4 shortlist sheets + selection list, then the master sheet as source of truth).
  The user chose "every applicant can check" and to publish at a time they give, with Core Members switching at
  the same moment. Wording changed from "interviewed" to "applied" on both sites, and the result reads "selected as
  a/an <role>". Sealed data verified and ready (see "Results data: ready").
