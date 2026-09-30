# Working in this repo

- **Read `STATUS.md` first.** It records what's done, what's waiting on the user and how to do it, across this repo
  and the club site (`SaIdEeVaN/BIC-REC_Site`). Update it before finishing any task.
- Commit and push straight to `main`. Don't create feature branches or pull requests.
- Every push to `main` deploys to Firebase (`bicrec-results.web.app`) via `.github/workflows/firebase-deploy.yml`.
  Run `npm test` and `npm run build` before every push.
- Deploy only through the `results` hosting target. Never deploy to the project's default site: that is the
  club's main site, bicrec.web.app.
- Never commit a candidate sheet (`.xlsx` / `.csv`). Only the sealed `src/data/results.json` goes in the repo.
- `src/lib/resultVault.js` (browser) and `scripts/excel_to_json.py` (sealer) share one format. Change them together;
  `tests/resultVault.test.js` checks they still agree.
- The UI follows the BIC/REC neo-brutalist design system from the club site
  (`SaIdEeVaN/BIC-REC_Site`, `DESIGN_SYSTEM.md`): ink/bone/amber, 3px rules, hard offset shadows, no radius,
  no blur, no fades.
