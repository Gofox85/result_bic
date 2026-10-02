# Status: BIC/REC recruitment results

_Last updated: 2 Oct 2026_

The running record of this work across chats. **Read it before starting; update it before finishing.**
It holds no secrets and no candidate data. This repo is public.

## At a glance (end of 2 Oct)

- **Both repos are pushed to `main` and deployed** (results `Gofox85/result_bic`, club `SaIdEeVaN/BIC-REC_Site`).
- **Results site:** live with the 3 sample logins; the result reveal animation and the new result messages are in
  (selected results' next steps now mention WhatsApp and the club's WhatsApp group).
- **Club site:** team split into Board (8), Core (16) and Associates, with "Meet us"; official domain names; one
  faculty coordinator; no Join us; Gallery has 5 real albums, 34 photos (DeFi Unlocked, 11 Apr 2026; Hack to
  Blockchain, 13 Feb 2026; European Immersion Program, 6 Jan 2026; Decode Blockchain, 15 Oct 2025; the KBAIC
  inauguration, 18 Sep 2025), each with its own page (`/gallery/<slug>`). The Events page lists the club's 6 real
  events (those 5 plus Byte the Dust, 12 Feb 2026); an event's "Explore gallery" button opens its album page.
- **3 Oct, automatic** (scheduled tasks wake this chat; the user doesn't need to do anything):
  10:30 pre-flight check → **11:00 real results live** + Associates page says "Check your result" → 13:00 the 47
  associates listed. **The user moved the release from 08:00 to 11:00 IST** on the evening of 2 Oct; all three
  tasks were moved together (they were 07:30 / 08:00 / 10:00) and confirmed enabled at the new times.
- **Open, not blocking:** see "Waiting on the user". More gallery albums are coming from the user.

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
- results site: `3b2011f`, WhatsApp in the selected results' next steps. Before it: `b152d21` (the club's new result
  messages, see "Result-page messages"), `b8d470d` (official
  domain names in the roles), the Gallery footer link and the result reveal. The live data is still the sample data
  until the release.
- club site: `1ff5b47`, the event button reads "Explore gallery" (the user). Before it: `de391ef`, photos for Karthick Raja R, M. Harish Karthikeyan and Harshini: **every board and
  core member now has a photo**. Before it: `cd9e0f6` (four member photos, Pavithra J on the core board, Padma Priya J removed),
  `aa6fc0f` (Mohammed Irfan S, Media Director, and the "Media" group), `d02d641`
  (Harshini's title) and `3f7a0b3`: Byte the Dust's write-up, the club's figures counted from the Events page, the News
  page removed, core team titles in the official domain names (see "Events page" and "Club team pages"). Before
  it: `4ea9a03` (DeFi Unlocked, and a page of its own for every album, see "Gallery"), `e3ea5da` (the Events page lists the club's real events, linked to their albums, see "Events page"),
  `e26ea0f` (Gallery albums European Immersion Program and Hack to Blockchain, and a grid
  that fits any photo shape), `65bf931` (four more Decode Blockchain photos), `c2e5ee0` (the Gallery's Decode
  Blockchain album), `068b1c6` (KBA spelled out as the
  Kerala Blockchain Academy everywhere), `8c202d1` (four
  more photos in the Gallery's first album, nine now, see "Gallery"),
  `8c165b2` (the Gallery's first real album), `52bd3b5` (Join us removed,
  Kabilan S removed from the Technical team), `2c3cef5` (only Dr. Muneeshwari R as faculty coordinator), `60d01c0` (the team split into
  board, core and associate members with "Meet us", see "Club team pages"), `3e94254` (Gallery page brought back),
  `77a4118` (official domain names), `8089d4b` (the roster section, now on the Associates page) and `d893df9`
  (Contact form college-only). Further back is the user's own `9ab2722`, a merge from another session that added a
  **dark theme** switched from the header and a `status.md` in the club repo. That `status.md` is the user's own
  (last updated 1 Oct); this file is the one kept up to date.

**Results deploy workflow:** it was switched off manually on 1 Oct at 22:20 IST and the user turned it back on
on 2 Oct. If it's ever `disabled_manually` again, don't re-enable it yourself: ask the user.

## Release scheduled: 3 Oct 2026, 11:00 IST (05:30 UTC)

- **The file:** `release/results.json.enc` is the verified, sealed `results.json` (244 records), encrypted again
  (AES-256-GCM) with a random key that is **not in this repo**. It was re-sealed on 2 Oct (`b8d470d`) with the official
  domain names in the roles, every login re-verified, and locked again with the same key. The pre-flight and go-live tasks
  were updated with the new file's checksum, and the associates task with the new team names. It's in the repo so the
  release survives a reset session. It isn't part of the built site, and it's useless without the key.
- **Three scheduled tasks (`send_later`) wake this session**, so the user doesn't need to give a notice. The key, the
  expected sha256, the associates list and the exact steps are in their messages, which are private to the user's account.
  They don't depend on the scratchpad: the unlock uses plain `node` crypto. All three were checked on 2 Oct (enabled,
  right times), the go-live and associates ones again after the team split, and all three were moved on the
  evening of 2 Oct when the user changed the release from 08:00 to 11:00 IST. **This chat session must not be
  archived or deleted before 13:00 IST on 3 Oct**, since the tasks wake it. The user can close the app; that's fine.
  - `trig_01BN4Hrjf62vF58FCSDNZAfX`, 10:30 IST (05:00 UTC): pre-flight. Checks the workflow is enabled, unlocks the file into the
    scratchpad, dry-runs both builds, and alerts the user if anything's wrong.
  - `trig_01XRSKMF8P4NDU9YUDNHRFJr`, **11:00 IST (05:30 UTC)**: go. Unlocks into `src/data/results.json`, checks the sha256, tests,
    removes `release/` and pushes. Then sets `RECRUITMENT_RESULTS_OPEN = true` on the club site (which opens the
    Associates page, `/team/associates`) and pushes, watches both deploys, and tells the user.
  - `trig_01Nib2VAvwLAabvG7uBFVDh4`, 13:00 IST (07:30 UTC): the associates. Fills `src/data/associates.js` in the
    club repo with the 47 new associates (the list is in the task's private message), then pushes and tells the
    user. It first checks that the 11:00 release happened. It kept its two-hour gap after the release: the list
    names who was selected, so it must never go up before the results. (The user may want a different time; any
    time after 11:00 is fine.) (Updated on 2 Oct for the team split: it used to fill
    `src/data/coreMembers.js`, which is now `associates.js`.)
- **To move or cancel the release:** `update_trigger` with a new `run_once_at` (keeps the message), or `delete_trigger`
  the IDs. Move all three together: the associates list waits for the release, and the pre-flight comes 30 minutes
  before it.
- **Where the selected members' details are:** not in either repo in readable form (both are public). The user
  has their master sheet and selection list, plus a private spreadsheet of the 47 sent in the chat on 2 Oct.
  From 13:00 IST on 3 Oct, the club repo's `src/data/associates.js` holds names, teams and departments only.

This repo has only the `main` branch.

## Current state

- **Results site is live with sample data only** until 11:00 IST on 3 Oct. Sample logins:
  - `250701499@rajalakshmi.edu.in` / `250701499`: selected, Technical Associate
  - `250701501@rajalakshmi.edu.in` / `250701501`: selected, Design Associate
  - `250701502@rajalakshmi.edu.in` / `250701502`: not selected
- **Club team pages** (the user's structure, 2 Oct). The club's members are in three teams, each with its own page
  and an "about" section:
  - **Board members** (`/team/board`): the faculty coordinator, then the **core board** (President, Vice President,
    two ambassadors, and the Secretary, Pavithra J, moved up from the executive team on 2 Oct at the user's word)
    and the **executive team** (Operations Executive, Technology Executive, Treasurer): 8 people. Profiles at `/team/board/<slug>`.
  - **Core members** (`/team/core`): everyone else from the old board page, the domain leads and co-leads (16;
    Kabilan S, the Technical team's Blockchain Lead, and Padma Priya J, Head of Events, were removed on 2 Oct at the
    user's request, with their photos; Mohammed Irfan S, Media Director, was added),
    grouped by domain in the official order. Profiles at `/team/core/<slug>`; an old `/team/board/<slug>` link to a
    core member redirects. The header has a "2026–27 recruitment" button to the Associates page, for anyone arriving
    from an old link (this address used to be the recruitment page).
  - **Associate members** (`/team/associates`): the new recruits ("associates"). This is the recruitment page that
    used to be `/team/core`: it says **"Results coming soon"** until `RECRUITMENT_RESULTS_OPEN` (club
    `src/data/club.js`, now `false`) is set to `true`, then "Check your result" with a button to the results site.
    The 11:00 task opens it right after the results go live; don't open it before, or every candidate gets "no
    match". Its roster (domain tabs, a card per associate with name, department and "<domain> Associate") renders
    only when `associates` in `src/data/associates.js` is non-empty. It's empty now; the 13:00 task fills it.
  - **Meet us**: a section with three cells linking to the three pages (`src/components/MeetUs.jsx`, data in
    `src/data/teams.js`). It's its own page (`/team`, "Meet us" in the main menu), sits on Home and About, and ends
    each team page with the current team inked. The associates' cell says "results soon"/"results are live" until
    the list is filled, then the count.
  - Data: `src/data/members.js` (`boardGroups`/`coreGroups`, `boardMembers`/`coreTeamMembers`, `memberPath`),
    `src/data/associates.js`, `src/data/domains.js`. The "about" texts are in each page file (`ABOUT`); they're
    first drafts the user can change.
  - The main menu (Home, About us, Meet us, Events, Gallery, Contact us, then the theme switch; no Join since 2 Oct)
    has tighter side padding below 1280px so it fits on one line at 1024px.
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
  - Club core team page (`/team/core`) group headings, in this order: Event, PR and Outreach, Technical, Design,
    Research and Innovation, and "Media" (the user, 2 Oct: one group covering both Visual Media and Digital Media;
    it was "Visual and Digital Media"). Media is led by **Mohammed Irfan S, Media Director** (added 2 Oct with
    department AI & DS, email, LinkedIn and Instagram; his roll number was given but is not published), then the
    Visual Media Lead (Yogadharshini NK), Digital Media Lead (Keerthana G), Digital Media Co-Lead (Janis Olivia A)
    and Visual Media Co-Lead (Harshini), from the user's team list. The core team is 16, the club 24 (after Padma Priya J's removal). People's own
    titles use the official domain names (the user said yes on 2 Oct): PR and Outreach Lead / Co-Lead, Technical
    Lead / Co-Lead, Research and Innovation Lead (Muhilan S was "Research Lead"; M. Harish Karthikeyan already had
    that title). Titles that already named their domain stay (Head of Events, Event Co-Lead, Head of Design,
    Co-Head of Design, Design Co-Lead, Digital Media Co-Lead), and so does Frontend Lead. All the media titles are settled
    (see the Media group above).
- **Gallery: real albums** (from 2 Oct). The placeholder frames are gone; the page lists albums, newest first.
  5 albums, 34 photos. **Each album also has its own page**, `/gallery/<slug>` (the user, 2 Oct: an event's photos
  should open that event's gallery, not the whole page): back link to all albums, date and count, title,
  description, tags, "About the event →", the photos and the full view. Album titles on `/gallery` link there; an
  unknown slug says "Album not found". Each album page has its own share tags and is in the sitemap.
  - **DeFi Unlocked**, **11 April 2026**, a workshop (the user). 3 photos from the chat: the speaker deploying a
    contract from Remix with MetaMask on Sepolia (lead), a full lab, a club member hosting Q&A in front of the
    closing slide. **The closing slide showed the speaker's phone number; it was painted over** (filled with the
    slide's background) before processing, so it's not in the published photo. The slide also names the speaker
    (Janakiraman K, Cryptocortex Crew) and is dated "April 11, 2025" (a typo on the slide; the user said 2026).
    Nobody is named on the site.
  - **Hack to Blockchain**, **13 February 2026** (the user). The screen in the photos reads "Hack to Blockchain" with
    Rajalakshmi Engineering College, Notion and Titanium 2026 logos; Titanium '26 is the national-level technical
    symposium (club `achievements.js`), so the album calls it the club's event at Titanium 2026, with Notion. 5 photos
    (4 Samsung HEIC, 1 iPhone HEIC with GPS, removed), in this order: the whole hall (lead), the consensus session,
    a Notion bag handed over, a certificate on stage, the team with a faculty member. Tags: titanium 2026, with notion.
  - **European Immersion Program**, **6 January 2026** (the user): students from top European institutions came to
    REC for an immersion program in blockchain and quantum cryptography. 8 photos (3 JPG, 5 iPhone HEIC with GPS,
    removed), in this order: the group at the Idea Factory (lead), gathered round the code, Blockverse on every
    screen, the session in the lab, laughs at a desk, Q&A, club members with two visitors, faculty with visitors.
  - **Decode Blockchain**, **15 October 2025**: the club's **first event** (the user), a hands-on workshop organised
    by the Blockchain Innovation Club with the Department of CSE ("BIC × … Workshop" on the screen, theme
    "Unlocking the Future of Blockchain"). 9 photos from the chat, in this order: the group in front of the
    workshop screen (lead), the wallet set-up with the speaker, participants at laptops, a full room at work, two
    participants on one laptop, the team talking the room through it, the big group photo, the team with the
    speaker, six members under the palms.
    Neutral captions, nobody named. On the Events page as block #0002 (see "Events page").
  - **Album 1:** "KBAIC Inauguration Ceremony", **18 September 2025**: the start of the club (as KBA Club REC,
    since renamed the Blockchain Innovation Club) and the inauguration of its **first board** (the user, 2 Oct),
    with the Department of CSE, theme "Unlocking the Future of Blockchain". 9 photos the user sent in the chat on
    2 Oct, in this order: the first board's group photo outside the REC Tech Lounge (the lead), the dais, a welcome
    with flowers, a speaker at the podium, the appointment letters and badges, the front row, the full hall, the
    lecture hall, three students listening. The captions and alt texts are neutral first drafts: nobody is named,
    since the user didn't name anyone. Photos in the folder are numbered in that order (re-processed when the
    order changed).
  - **KBA = Kerala Blockchain Academy** (the user confirmed on 2 Oct; the event's screen says so too). The album says
    "the Kerala Blockchain Academy Club REC (KBA Club REC)". Every "Kerala Blockchain Association" on both sites
    was corrected to "Academy": both footers, the club's Achievements page and figures, a news item and the
    hackathon story.
  - **How it's built** (club repo): `src/data/gallery.js` (albums: slug, title, date, datetime, tags, description,
    photos with `n`, `alt`, `caption`), `src/lib/galleryPhotos.js` (resolves the files),
    `src/assets/gallery/<slug>/<nn>.webp` (1600px) and `<nn>-thumb.webp` (960px), README in that folder.
    `src/pages/Gallery.jsx` (all albums) and `src/pages/GalleryAlbum.jsx` (one album, `/gallery/:slug`) share
    `src/components/gallery/AlbumPhotos.jsx` (the grid), `src/components/gallery/Viewer.jsx` (the full view: a
    modal `<dialog>`, arrow keys or buttons step through, Esc closes, focus returns to the photo) and
    `src/lib/useViewer.js` (its state). `albumPath`/`getAlbumBySlug` are in `src/data/gallery.js`.
  - **The grid fits any count** (`blockSize`/`rowSpans` in AlbumPhotos): 1–2 photos sit side by side; 3 or 4 make
    a block of the lead (double size) with 2 or 3 stacked beside it; 5 or more start with the lead and 4 beside it
    (6 starts with lead + 2, then a row of 3). The rest run in rows of 4 (or 3 when they come in threes) on a
    12-column grid, and a short last row is widened to fill. On phones it's two across, the lead full width, and
    an odd one out at the end takes the full width. The lead's image is taken out of the flow at lg so any photo
    shape fills its cell exactly.
  - Albums link to their event ("About the event →") when an event in `src/data/events.js` names them as `album`.
  - **To add an album** (the user sends 5–10 photos with a title, date, a line or two, captions optional): run the
    scratchpad's `gallery-process.py <out folder> <photos in order>` (Pillow: converts to sRGB, resizes, saves WebP
    with **no metadata at all**; if the scratchpad is gone, rewrite it along those lines), add the album at the top
    of `albums`, run lint + build + e2e (the gallery tests check every photo loads, and the full view), screenshot
    it for the user, push.
  - History: removed on 2 Oct at the user's ask, restored the same day (revert of `5cdd90a`), photos put on hold,
    then the user sent album 1 in the chat.
- **Events page** (club `src/data/events.js`, from 2 Oct): the club's **real** events, oldest first (block #0001
  up). It used to list 6 template events that never happened (a Jan 2026 "inaugural" Blockchain Fundamentals
  Workshop, a Web3 Hackathon with ₹50,000 prizes, a DeFi lecture, a bootcamp, a quiz, a meetup); the user said to
  take the events from the gallery, and Decode Blockchain was the club's first event, so they were replaced:
  1. KBAIC Inauguration Ceremony, 18 Sep 2025 (type Inauguration)
  2. Decode Blockchain, 15 Oct 2025 (Workshop)
  3. European Immersion Program, 6 Jan 2026 (Immersion Program)
  4. **Byte the Dust: A Cyber Forensics**, 12 Feb 2026: a cyber forensics challenge (the user): each team was
     given a case and applied the process of cyber and digital forensics to identify, preserve, analyse and
     document what happened. No photos or venue yet.
  5. Hack to Blockchain, 13 Feb 2026
  6. **DeFi Unlocked**, 11 Apr 2026 (Workshop). Speaker: Janakiraman K, Cryptocortex Crew (from the closing
     slide; the user confirmed naming him).
  - Fields: `time`, `venue`, `highlights`, `speakers`, `certificate` are optional (only what's known is shown);
    `album` is the gallery slug. An event with an album shows four of its photos and an "Explore gallery" button, which
    opens the album's own page (`/gallery/<slug>`); without one it says "Photos pending". The filter tabs are built from the events' types.
  - Types: Byte the Dust and Hack to Blockchain are "Technical Event", and the inauguration is listed as an
    event (both confirmed by the user). Venues are "Rajalakshmi Engineering College" for the five with photos (they
    show REC), none for Byte the Dust. No times anywhere.
  - **The club's figures follow this list** (the user: the Events page count matters): `stats` in club
    `src/data/achievements.js` counts `events` (every event: 6), `workshops` (type Workshop: 2) and
    `immersionPrograms` (type Immersion Program: 1) from `events.js`. Home shows "6 events & workshops"; the
    Achievements page shows 6 events, 2 workshops, 1 immersion program. Home's "working force of N members" is read
    from the roster too (it said 25; there are 24). Add an event and every count follows.
  - Home's "Events that define us" shows the three most recent; the "next event" card says "coming soon" (all past).
  - **No News page** (removed on 2 Oct at the user's word; it only had the template's made-up items): page, data,
    footer link and share tags are gone, and an old `/news` link redirects to `/events`.
- **Big photo batches from Drive** (if the user sends whole folders or zips rather than picked photos):
  - Drive access works (the environment's network access was set on 2 Oct). List a shared folder with
    `https://drive.google.com/embeddedfolderview?id=<folder id>`; download a file with
    `https://drive.usercontent.google.com/download?id=<file id>&export=download&confirm=t`.
  - The first Drive folder (the inauguration, 266 JPGs from a Canon EOS 80D whose clock said February 2016, so dates
    are useless) was stopped at 97 photos; those are in the scratchpad (`photos/batch1-raw/`, private, never
    commit). The user then picked 5 and sent them in the chat.
  - For zips: one at a time (download, unzip, read metadata, web-size the picks, delete the rest); Pillow +
    `pillow-heif` + WebP are in the scratchpad venv, `unzip` is installed, no `exiftool`. Suggest picks with a
    thumbnail sheet for the user to approve; publish only the approved ones.
- **Photos from Google Drive:** Drive is reachable from here since 2 Oct: the user set the environment's network
  access to Custom with `drive.google.com`, `drive.usercontent.google.com` and `*.googleusercontent.com` (plus the
  default list). Drive files must be shared as "Anyone with the link". The user may send 5–6 large files (under
  2 GB each): about 30 GB of disk is free here, so handle them one at a time (download, extract, resize for the web,
  delete the original). Only web-sized images go into a repo (GitHub refuses files over 100 MB).
- **No Join us** (the user, 2 Oct: the recruitment period is over). The Join page, its route and share tags, the
  amber Join cell in the header, the footer's "Join the club" and the Join buttons on Home and About are gone. Home's
  hero now offers "Explore events" and "Meet us"; the closing calls to action point to events and the contact page.
  An old `/join` link redirects to `/team/associates`. The "members" figure on Home and /achievements now counts the
  board and core lists (`teamMembers.length` in the club's `src/data/achievements.js`): 24 now, was a fixed 25.
- **Faculty coordinator: Dr. Muneeshwari R only** (the user, 2 Oct). Dr. Manoranjini J isn't the club's coordinator,
  so her entry and photo were removed. Text naming the coordinators as a group uses `FACULTY` from the club's
  `src/data/members.js` ("faculty coordinator" while there's one).
- **Links are underlined** on both sites. The exceptions are buttons, logos, header nav cells and boxed social links.
- **Club Contact form:** takes only `@rajalakshmi.edu.in` addresses (the user's choice, 2 Oct). Anything else shows
  "enter valid email id". A line under the form points people outside REC to the club's email.
- **Result-page messages** (`src/data/site.js`), as the user worded them on 2 Oct (lightly tidied: "applying to
  BIC/REC", an em dash). The user said Claude may refine them.
  - Selected, under the title: "A new block has been added to the chain! Congratulations on being selected as a/an
    **<role>**. The journey starts now." (`SELECTED_OPENING` + the role sentence in `ResultCard.jsx` +
    `SELECTED_CLOSING`.) Under the details, the next steps (`SELECTED_NEXT_STEPS`, WhatsApp added at the user's
    request on 2 Oct): "Keep an eye on your college email and WhatsApp. The core team will share your onboarding
    details and the date of your first meet, and invite you to the club's WhatsApp group."
  - Not selected (`NOT_SELECTED_MESSAGE`): "Thank you for applying to BIC/REC. We truly value your interest and
    participation. Although you weren't selected this time, our events and workshops stay open to everyone — come
    build with us."
  - The titles are unchanged: "Welcome to the chain, <first name>." and "Not this time, <first name>."
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

## Results data: ready, release scheduled for 3 Oct 11:00 IST

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

**Go-live steps:** automated by the 11:00 task. If it ever has to be done by hand, follow that task's message (it has
the key):
1. Results site: unlock `release/results.json.enc` into `src/data/results.json`, check the sha256, run
   `npm test && npm run build`, `git rm -r release`, commit and push. **Check the deploy workflow is enabled first**
   (see the warning near the top).
2. Club site: set `RECRUITMENT_RESULTS_OPEN = true` in `src/data/club.js` (opens the Associates page), run lint +
   build, and push. The user wants it to switch **at the same time** as the results go live.
3. Watch both deploys, then tell the user.

## Waiting on the user

Nothing blocks the launch: the 10:30 check, the 11:00 release and the 13:00 associates list are scheduled (see
above). The user only needs to keep this chat session (not archive it).

Open, not blocking (asked on 2 Oct; change only if they answer):
- **WhatsApp group name:** the user said the group has a name (2 Oct) but hasn't given it yet. It goes in
  `SELECTED_NEXT_STEPS` in `src/data/site.js` (results repo), in place of "the club's WhatsApp group"; before
  11:00 on 3 Oct a push goes live with the sample data only, which is fine.
- **Associates list time:** 13:00 IST on 3 Oct unless the user picks another time after 11:00.
- **The "about" texts** on the three team pages, and the Meet us blurbs: first drafts, the user may reword them.
- **Gallery:** more albums to come from the user. Optional: names for the people in the photos.
- **Events:** Byte the Dust's venue and photos; times and venues for the others, if they have them.

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
   user gives** (before the release, a push makes it live early; re-lock it instead and update the go-live task).
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
- Stopping a local server: never `pkill -f`/`pgrep -f` with a pattern that also appears in your own command line
  (it kills the shell running it: exit 144). Find the PIDs with `ps -eo pid,args` and `kill` those.
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
- **2 Oct:** Gallery restored on both sites for the club's real photos (see "Gallery"). Drive was still
  blocked from this container at that point; the user then allowed it.
- **2 Oct:** Drive access working. Batch 1 download started, then stopped at 97 of 266 when the user said to leave
  the gallery part for now. Photos on hold; the Gallery page is unchanged (placeholders).
- **2 Oct:** Club team split into board, core and associate members (each page with an "about"), plus "Meet us"
  (its own page, in the menu, on Home and About). The recruitment page moved from `/team/core` to
  `/team/associates`. The 08:00 and 10:00 tasks were updated to match. Club e2e suite passes (apart from the five
  known `/achievements` font checks), including new tests for Meet us, member links and the old-link redirect, and
  the associates tests with the 47 filled in temporarily.
- **2 Oct:** Faculty coordinators: only Dr. Muneeshwari R now (entry and photo of the other removed).
- **2 Oct:** Result messages changed to the user's new wording (selected and not selected). Checked on desktop and
  phone with the sample logins.
- **2 Oct:** STATUS.md checked against both repos (all pushed to `main`, both sites deployed) and tidied: Drive
  access, the core team's group headings, the open (non-blocking) questions, and a note on stopping servers safely.
- **2 Oct:** Join us removed (recruitment is over; `/join` redirects to the Associates page) and Kabilan S removed
  from the Technical team. Club e2e suite passes apart from the five known `/achievements` font checks.
- **2 Oct (end of day):** STATUS.md checked again: both repos in sync with `main`, the three 3 Oct tasks enabled
  (07:30, 08:00, 10:00 IST). Added "At a glance".
- **2 Oct:** Selected results' next steps now mention WhatsApp and the club's WhatsApp group (the user's request).
- **2 Oct:** Gallery rebuilt around real albums; the first is the KBAIC inauguration (18 Sep 2025, 5 photos the user
  sent). Photos web-sized as WebP with no metadata; full-screen viewer. Club e2e suite passes (new gallery tests
  included) apart from the five known `/achievements` font checks.
- **2 Oct:** Four more inauguration photos added (nine in the album), the first board's group photo now leads, and
  the description says the first board was inaugurated too. Gallery tests pass at every width.
- **2 Oct:** KBA is the Kerala Blockchain Academy (the user). "Association" corrected to "Academy" on both sites
  (8 places), and the inauguration album spells it out.
- **2 Oct:** Gallery album "Decode Blockchain" (15 Oct 2025, the club's first event, 5 photos) added above the
  inauguration. Gallery tests pass at every width.
- **2 Oct:** Four more Decode Blockchain photos (nine in the album). Both albums now fill their grids evenly.
- **2 Oct:** Gallery albums "European Immersion Program" (6 Jan 2026, 8 photos) and "Hack to Blockchain" (13 Feb
  2026, 5 photos, at Titanium 2026 with Notion). HEICs converted (Display P3 to sRGB), GPS stripped. The album grid
  now fits any photo shape (4:3 and 16:9 too) and any count. Club e2e passes apart from the five known
  `/achievements` font checks.
- **2 Oct:** Events page rebuilt from the gallery (the user): the 6 template events replaced by the club's 5 real
  ones, Byte the Dust (12 Feb 2026) added, each event linked to its album and back. Two news links unlinked. Tests
  updated and two added; the same five known font checks are the only failures locally.
- **2 Oct:** DeFi Unlocked (11 Apr 2026, workshop, 3 photos) added to the gallery and the Events page; the speaker's
  phone number on a slide painted out. Every album now has its own page (`/gallery/<slug>`) and an event's photos
  open it (the user). The album grid handles any photo count. Club e2e passes apart from the five known
  `/achievements` font checks.
- **2 Oct (evening):** The user moved the results release from 08:00 to **11:00 IST** on 3 Oct. The three tasks
  were moved together: pre-flight 10:30, go-live 11:00, associates list 13:00 (still two hours after the release).
  The sealed file needs no change (its `published` value is a date, not a time) and no page mentions 8 AM.
- **2 Oct (night):** The user's answers: Byte the Dust described (a cyber forensics challenge); the club's figures now
  counted from the Events page (6 events, 2 workshops, 1 immersion program; Home's member count from the roster);
  News page removed (`/news` redirects to `/events`); DeFi Unlocked names its speaker; core team titles in the
  official domain names (the three Media titles wait on the user); event types and the inauguration confirmed.
  Club e2e passes apart from the five known `/achievements` font checks.
- **2 Oct (night):** Harshini's title is Visual Media Co-Lead (the user). Her photo and two others are waiting to be
  sent again (see "Waiting on the user").
- **2 Oct (night):** Mohammed Irfan S added to the core team as Media Director; the media group renamed "Media";
  Yogadharshini NK Visual Media Lead, Keerthana G Digital Media Lead (from the user's team list). Four unnamed
  member photos prepared, waiting on who's who. The scratchpad's `gallery-process.py` now converts every colour
  profile to sRGB (it skipped profiles whose name contained "sRGB"; no published photo was affected).
- **2 Oct (night):** Member photos for Arjun K, Kishoreathava S, Muhammed Fahad SJ and Mohammed Irfan S (named by the
  user). Pavithra J (Secretary) moved to the core board; Padma Priya J (Head of Events) removed with her photo.
- **2 Oct (night):** Photos for Karthick Raja R, M. Harish Karthikeyan and Harshini (resent as a normal message, so
  they were saved). Every board and core member has a photo now.
- **2 Oct (night):** The button under an event's photos reads "Explore gallery" (was "See all N photos"); it opens
  that event's album page.
