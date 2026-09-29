# Working in this repo

- Commit and push straight to `main`. Don't create feature branches or pull requests.
- Run `npm test` and `npm run build` before every push.
- Never commit a candidate sheet (`.xlsx` / `.csv`). Only the sealed `src/data/results.json` goes in the repo.
- `src/lib/resultVault.js` (browser) and `scripts/excel_to_json.py` (sealer) share one format. Change them together;
  `tests/resultVault.test.js` checks they still agree.
- The UI follows the BIC/REC neo-brutalist design system from the club site
  (`SaIdEeVaN/BIC-REC_Site`, `DESIGN_SYSTEM.md`): ink/bone/amber, 3px rules, hard offset shadows, no radius,
  no blur, no fades.
