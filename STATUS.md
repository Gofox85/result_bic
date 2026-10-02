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

Latest change to each live site (both deploys succeeded):
- results site: `b8d470d`, the official domain names in the roles (see "Official domain names"), after `f0c7cfe` (no
  Gallery link) and the result reveal. The live data is still the sample data until the release.
- club site: `60d01c0`, the team split into board, core and associate members with "Meet us" (see "Club team
  pages"). Before it: `3e94254` (Gallery page brought back), `77a4118` (official domain names), `8089d4b` (the
  roster section, now on the Associates page) and `d893df9` (Contact form college-only). Further back is the user's own `9ab2722`, a merge from another session that added a **dark theme**
  switched from the header and a `status.md` in the club repo.

**Results deploy workflow:** it was switched off manually on 1 Oct at 22:20 IST and the user turned it back on
on 2 Oct. If it's ever `disabled_manually` again, don't re-enable it yourself: ask the user.

## Release scheduled: 3 Oct 2026, 08:00 IST (02:30 UTC)

- **The file:** `release/results.json.enc` is the verified, sealed `results.json` (244 records), encrypted again
  (AES-256-GCM) with a random key that is **not in this repo**. It was re-sealed on 2 Oct (`b8d470d`) with the official
  domain names in the roles, every login re-verified, and locked again with the same key. The 07:30 and 08:00 tasks
  were updated with the new file's checksum, and the 10:00 task with the new team names. It's in the repo so the release survives a reset
  session. It isn't part of the built site, and it's useless without the key.
- **Three scheduled tasks (`send_later`) wake this session**, so the user doesn't need to give a notice. The key, the
  expected sha256, the roster list and the exact steps are in their messages, which are private to the user's account.
  They don't depend on the scratchpad: the unlock uses plain `node` crypto. All three were checked on 2 Oct (enabled,
  right times). **This chat session must not be archived or deleted before 10:00 IST on 3 Oct**, since the tasks wake it.
  - `trig_01BN4Hrjf62vF58FCSDNZAfX`, 07:30 IST: pre-flight. Checks the workflow is enabled, unlocks the file into the
    scratchpad, dry-runs both builds, and alerts the user if anything's wrong.
  - `trig_01XRSKMF8P4NDU9YUDNHRFJr`, 08:00 IST: go. Unlocks into `src/data/results.json`, checks the sha256, tests,
    removes `release/` and pushes. Then sets `RECRUITMENT_RESULTS_OPEN = true` on the club site (which opens the
    Associates page, `/team/associates`) and pushes, watches both deploys, and tells the user.
  - `trig_01Nib2VAvwLAabvG7uBFVDh4`, 10:00 IST: the associates. Fills `src/data/associates.js` in the club repo
    with the 47 new associates (the list is in the task's private message), then pushes and tells the user. It
    first checks that the 08:00 release happened. (Updated on 2 Oct for the team split: it used to fill
    `src/data/coreMembers.js`, which is now `associates.js`.)
- **To move or cancel the release:** `update_trigger` with a new `run_once_at` (keeps the message), or `delete_trigger`
  the IDs. Move all three together: the roster waits for the release, and the pre-flight comes 30 minutes before it.
- **Where the selected members' details are:** not in either repo in readable form (both are public). The user
  has their master sheet and selection list, plus a private spreadsheet of the 47 sent in the chat on 2 Oct.
  From 10:00 IST on 3 Oct, the club repo's `src/data/associates.js` holds names, teams and departments only.

This repo has only the `main` branch.

## Current state

- **Results site is live with sample data only** until 08:00 IST on 3 Oct. Sample logins:
  - `250701499@rajalakshmi.edu.in` / `250701499`: selected, Technical Associate
  - `250701501@rajalakshmi.edu.in` / `250701501`: selected, Design Associate
  - `250701502@rajalakshmi.edu.in` / `250701502`: not selected
- **Club team pages** (the user's structure, 2 Oct). The club's members are in three teams, each with its own page
  and an "about" section:
  - **Board members** (`/team/board`): the faculty coordinators, then the **core board** (President, Vice President,
    ambassadors) and the **executive team**: 8 people. Profiles at `/team/board/<slug>`.
  - **Core members** (`/team/core`): everyone else from the old board page, the domain leads and co-leads (17),
    grouped by domain in the official order. Profiles at `/team/core/<slug>`; an old `/team/board/<slug>` link to a
    core member redirects. The header has a "2026–27 recruitment" button to the Associates page, for anyone arriving
    from an old link (this address used to be the recruitment page).
  - **Associate members** (`/team/associates`): the new recruits ("associates"). This is the recruitment page that
    used to be `/team/core`: it says **"Results coming soon"** until `RECRUITMENT_RESULTS_OPEN` (club
    `src/data/club.js`, now `false`) is set to `true`, then "Check your result" with a button to the results site.
    The 08:00 task opens it right after the results go live; don't open it before, or every candidate gets "no
    match". Its roster (domain tabs, a card per associate with name, department and "<domain> Associate") renders
    only when `associates` in `src/data/associates.js` is non-empty. It's empty now; the 10:00 task fills it.
  - **Meet us**: a section with three cells linking to the three pages (`src/components/MeetUs.jsx`, data in
    `src/data/teams.js`). It's its own page (`/team`, "Meet us" in the main menu), sits on Home and About, and ends
    each team page with the current team inked. The associates' cell says "results soon"/"results are live" until
    the list is filled, then the count.
  - Data: `src/data/members.js` (`boardGroups`/`coreGroups`, `boardMembers`/`coreTeamMembers`, `memberPath`),
    `src/data/associates.js`, `src/data/domains.js`. The "about" texts are in each page file (`ABOUT`); they're
    first drafts the user can change.
  - The main menu's side padding is tighter below 1280px so its seven items fit on one line at 1024px.
- **Sign-in rules** (results form and Excel converter both enforce them):
  - Email must end in `@rajalakshmi.edu.in`; otherwise the error is "enter valid email id".
  - The roll number is the password: digits only (letters are dropped as typed) and exactly 9 digits.
- **Caching** (`firebase.json` in each repo): pages are sent with `no-cache`, so a deploy shows up on the next visit
  without a hard refresh. Hashed files under `/assets/` are cached for a year (`immutable`).
  - Club site rules: `/assets/**` and `!/assets/**` (every page and public file).
  - Results site rules: `/assets/**`, `/` and `**/*.html` (it's a single page at `/`).
  - Keep Cache-Control rules from overlapping. Firebase applies whichever matching rule is listed **last**, which
    was checked in the hosting emulator.
- **Official domain names** (the user, 2 Oct), in the club's order: **Event, PR and Outreach, Technical, Design,
  Research and Innovation, Visual Media, Digital Media.** Use exactly these everywhere. Where they appear:
  - Results: roles are `<domain> Associate` (e.g. "Technical Associate", "PR and Outreach Associate").
  - Club `src/data/domains.js`: `DOMAINS` (the associates' tabs, in this order); each associate's `team` must match.
    The core team's groups on `/team/core` follow the same order.
  - Club Join us page, "Find your team": these seven. The skill chips under each are placeholders picked on 2 Oct
    (the user can change them). Content and Operations teams were removed: they aren't club domains.
  - Club board page group headings: Design, Event, PR and Outreach, Technical, Research and Innovation, and "Visual
    and Digital Media" (one group of media leads covering both). People's own titles ("Tech Lead", "Media Lead", …)
    were left as they are; they're the board's positions.
- **Gallery: back, waiting for real photos.** Removed on 2 Oct at the user's ask, then restored the same day
  (club revert of `5cdd90a`, results footer link re-added) because the club is adding real photos. It still shows
  the 12 placeholder frames (categories and titles are placeholders too) until the photos arrive.
- **Photos: ON HOLD.** On 2 Oct the user said to leave the gallery part for now, so don't process photos or change
  the Gallery page until they bring it up again. It stays as it is (placeholder frames). Where it got to:
  - **Drive access works now** (the user set the environment's network access on 2 Oct).
  - Batch 1 is a Drive folder of 266 separate JPGs (not a zip), from a Canon EOS 80D at 6000×4000, about 6 MB each.
    The camera's clock was wrong: the EXIF dates say February 2016, so dates can't be used to match these photos to
    events. List them with `https://drive.google.com/embeddedfolderview?id=<folder id>` and download each with
    `https://drive.usercontent.google.com/download?id=<file id>&export=download&confirm=t`.
  - The download was stopped at 97 of 266 photos. Those 97 are in the scratchpad (`photos/batch1-raw/`, private,
    never commit).

  The plan agreed earlier, for when it resumes. The user sends photos **one batch at a time** as Drive links:
  - Handle one zip at a time: download, unzip, read each photo's metadata (date taken, camera, size, GPS present),
    shrink for the web, delete the zip and the unzipped folder. Pillow + `pillow-heif` (iPhone HEIC) and WebP support
    are in the scratchpad venv; `unzip` is installed; there's no `exiftool` (Pillow reads EXIF).
  - Match photos to events by the date taken (the club's events are dated in `src/data/events.js`), order them, and
    skip near-duplicates and bursts.
  - Give the user a private spreadsheet of every photo's metadata, and a thumbnail sheet of the suggested picks to
    approve. Publish only the approved selection: the site can't hold thousands of photos.
  - **Strip all metadata (GPS especially) from published images.** Keep the metadata spreadsheet private.
  - Still to decide with the user: how the gallery is organised (by event or by the current categories) and whether
    event pages show their own photos.
  - **Batch 1** (link sent 2 Oct, a Drive folder; the link is in the chat): the inauguration of the **first-tenure
    board**, from when the club was still the **Kerala Blockchain Association (KBA) club**; it was renamed Blockchain
    Innovation Club later. Caption it accordingly.
- **Photos from Google Drive:** this container can't reach `drive.google.com`, `drive.usercontent.google.com` or
  `lh3.googleusercontent.com` (blocked by the environment's network policy; checked 2 Oct). To use Drive photos,
  the user either adds those hosts in the environment's Network access settings (and shares the files as "Anyone
  with the link") or uploads the photos in the chat. The user may send 5–6 large files (under 2 GB each): about
  30 GB of disk is free here, so handle them one at a time (download, extract, resize for the web, delete the
  original). Only web-sized images go into a repo (GitHub refuses files over 100 MB).
- **Links are underlined** on both sites. The exceptions are buttons, logos, header nav cells and boxed social links.
- **Club Contact form:** takes only `@rajalakshmi.edu.in` addresses (the user's choice, 2 Oct). Anything else shows
  "enter valid email id". A line under the form points people outside REC to the club's email.
- **Result-page messages** (`src/data/site.js`): the user confirmed on 2 Oct to keep them as they are.
- **Result reveal** (the user's ask, 2 Oct: "when I click Reveal my result, the content to the left of the box should
  be removed, with custom animations"). On a match:
  1. The form says "Unlocked". The "How it works" blocks lock amber and shunt off the left of the page, top first,
     while slats of ciphertext close over the form (`<Shutter>` in `motion.jsx`).
  2. The result panel gets the row to itself (centred, 760px wide on desktop; "How it works" isn't rendered). It's
     carried over from where the form was and set down (a FLIP animation in `App.jsx`), then the slats open.
  3. The card plays in: stamp, title, ledger rows one by one, confirmations. Selected results get an outline knocked
     off the stamp.

  While the key is being derived, the three "How it works" blocks light up in turn. "Check another result" brings
  "How it works" back, shunting in from the left. A no-match leaves the page as it is. With reduced motion, a match
  goes straight to the result with no animation. Timings are `LEAVE_MS`/`SLIDE_MS`/`REVEAL_MS` in `App.jsx` and the
  matching CSS delays in `index.css`. The user asked for it faster, so it now takes about 1.7s from click to the full
  result (was 2.5s), including the 0.5s minimum unlock wait (`MIN_UNLOCK_MS`, was 0.7s).

## Results data: ready, release scheduled for 3 Oct 08:00 IST

**Source of truth:** the master form-response sheet ("BIC Recruitment 2026-27 Responses"), which the user says is
100% correct. It supplies every email, roll number, name and department.
- Where a college-email cell is malformed, the form's login-email column holds the correct address.
- Five people submitted twice, with identical details both times.

**What gets published:**
- **Every applicant can check** (the user's choice): 244 people, of whom 47 are selected and 197 not selected.
- Selected per team (from the user's selection list): Event 8, PR and Outreach 7, Technical 8, Design 8, Research
  and Innovation 6, Visual Media 5, Digital Media 5.
- **Role text** (the user's rule): `<team> Associate`, with the official domain names. The page reads "selected as
  a/an <role>".
- Matching the selection list to the master: every name resolved to exactly one applicant. A few list entries
  differ from the master in spelling or an initial, and one candidate's roll number on a shortlist sheet differed
  from the master. The master wins everywhere.

**In the repo:** only `release/results.json.enc` (locked; see "Release scheduled").

**In the scratchpad** (never commit any of it; it holds candidate emails and roll numbers in the clear; it may not
survive a reset, and the release doesn't need it):
- `ready-results-v3.json` (from `v3-everyone.csv`): sealed with the official domain names, and the source of the
  current release file. All 244 logins open the right record; wrong pairs open nothing. (`ready-results.json` /
  `v2-everyone.csv` are the older Tech/PR/Research version.)
- `build_v2.py` + `master.py`: rebuild it (`build_v2.py OUT.csv --everyone`, then `scripts/excel_to_json.py`).
- `verify-v3.mjs`: checks every login against the v3 files.
- `BIC-selected-members-2026.xlsx`: the private list of the 47 for the user, updated to the official names.

If the scratchpad is gone and the data has to be rebuilt, ask the user to re-upload the master sheet and the
selection list, then redo the matching.

**Go-live steps:** automated by the 08:00 task. If it ever has to be done by hand, follow that task's message (it has
the key):
1. Results site: unlock `release/results.json.enc` into `src/data/results.json`, check the sha256, run
   `npm test && npm run build`, `git rm -r release`, commit and push. **Check the deploy workflow is enabled first**
   (see the warning near the top).
2. Club site: set `RECRUITMENT_RESULTS_OPEN = true` in `src/data/club.js` (opens the Associates page), run lint +
   build, and push. The user wants it to switch **at the same time** as the results go live.
3. Watch both deploys, then tell the user.

## Waiting on the user

Nothing. The 08:00 release and the 10:00 roster are scheduled (see above), and every open question has been
answered. The user only needs to keep this chat session open. Anything else is new work.

## How to do the pending work

### Re-seal the results (only if the sheet changes)
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
   user gives** (before the release, a push makes it live early; re-lock it instead and update the 08:00 task).
   Watch the Actions run.

### Open the Associates page ("make it available"; it used to be Core Members)
In `SaIdEeVaN/BIC-REC_Site`: set `RECRUITMENT_RESULTS_OPEN = true` in `src/data/club.js`, run lint + build + the
`Associates` Playwright tests, and push to `main`. To close it again, set it back to `false`.

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
- Result reveal: the scratchpad has `reveal-checks.mjs` (behaviour checks: reduced motion, no match, centring,
  return, no sideways scroll) and `reveal-capture.mjs` + `reveal-gif.py` (records the reveal through a CDP screencast
  and makes GIFs; Pillow is in the scratchpad venv). Both run against `npx vite preview --port 4180`. If the
  scratchpad is gone, rewrite them along those lines.
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
  back background animation unless the user asks for it again. The result reveal (2 Oct) is different: it only
  moves the page's own blocks, once, when a result opens, using the design system's shunt/stamp motion (no fades).
- **Recruitment page history:** a redirect to the results site was tried first. The user then preferred a "Check your
  result" button, and on 30 Sep asked for "coming soon" until results go out. That's why the page has a switch. It
  was the Core Members page until 2 Oct, when the team was split and it became the Associates page.

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
- **2 Oct:** Result reveal animation added (see "Current state"). Checked in Chromium at desktop and phone sizes,
  for selected, not selected, no match, "Check another result" and reduced motion.
- **2 Oct:** Reveal sped up at the user's request (about 1.7s from click to the full result). The user asked whether
  the 3 Oct launches need a nudge: they don't. The three scheduled tasks were checked (enabled, right times).
- **2 Oct:** STATUS.md refreshed: club site's latest commits, all three scheduled tasks, the roster section, one
  sample-login list, and go-live steps marked as automated.
- **2 Oct:** Gallery removed from the club site (page, route, share tags, links) and from the results-site footer.
  Club e2e suite run locally: all pass except the five known `/achievements` font checks.
- **2 Oct:** Official domain names applied on both sites, the release file re-sealed with them, and the three
  scheduled tasks updated. Checked: all 244 logins, the 08:00 unlock command, page layouts at 360–1280px with the
  47-member roster filled in temporarily, and the club e2e suite (only the five known `/achievements` font checks fail).
- **2 Oct:** Gallery restored on both sites for the club's real photos (see "Photos (in progress)"). Drive is still
  blocked from this container; the user has the steps to allow it.
- **2 Oct:** Drive access working. Batch 1 download started, then stopped at 97 of 266 when the user said to leave
  the gallery part for now. Photos on hold; the Gallery page is unchanged (placeholders).
- **2 Oct:** Club team split into board, core and associate members (each page with an "about"), plus "Meet us"
  (its own page, in the menu, on Home and About). The recruitment page moved from `/team/core` to
  `/team/associates`. The 08:00 and 10:00 tasks were updated to match. Club e2e suite passes (apart from the five
  known `/achievements` font checks), including new tests for Meet us, member links and the old-link redirect, and
  the associates tests with the 47 filled in temporarily.
