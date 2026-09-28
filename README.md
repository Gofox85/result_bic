# Recruitment Result Checker

## Overview

A lightweight, independent website where a visitor enters a roll number to check an approved recruitment result. Version 1 is a static React application with no backend, database, account system, or connection to another website.

## Main Workflow

```text
Roll number -> Check result -> Find exact record
                              -> Show name and status
                              -> Show role only when selected
```

The website never displays a public candidate directory. The records in `src/data/results.json` are fictional samples.

## Features

- Exact roll-number lookup after trimming whitespace
- Numeric input validation with a length limit
- Selected and not-selected result states
- Role shown only for selected candidates
- Friendly invalid-input and result-not-found messages
- Check-another-result reset action
- Responsive layout and keyboard-accessible form

## Technology

- React
- Vite
- JavaScript
- CSS
- JSON

## Project Structure

```text
src/
  components/
    Footer.jsx
    Navbar.jsx
    ResultCard.jsx
    ResultForm.jsx
  data/
    findResult.js
    results.json
  App.jsx
  index.css
  main.jsx
tests/
  findResult.test.js
index.html
vite.config.js
```

`findResult.js` validates and looks up the submitted roll number. `results.json` is the sample data source, while the components render the form, result, header, and privacy notice.

## GitHub Codespaces Setup

1. Open this repository in GitHub Codespaces.
2. Open the integrated terminal.
3. Install dependencies with `npm install`.
4. Start Vite with `npm run dev`.
5. Open the forwarded port shown in the **Ports** tab (Vite uses port `5173` by default).

## Installation

```sh
npm install
npm run dev
```

Run the lookup tests and production build with:

```sh
npm test
npm run build
```

## How to Update Results

Edit `src/data/results.json`. Replace the fictional sample entries only with information officially approved for publication. Keep roll numbers as strings, including any leading zeroes.

```json
[
  {
    "rollNo": "250123456",
    "name": "Alex Sample",
    "selected": true,
    "role": "Technical Team"
  }
]
```

Add only candidates whose results are approved for publication. Each roll number should be unique, and selected records may include their public role. Do not add a `selected: false` record: a valid roll number absent from this file returns **RESULT NOT FOUND**. That means no published result is available for that number; the app does not infer or display a candidate's name or a not-selected status without a matching record.

## Search and Validation

There is no public search or candidate list. The form accepts numeric roll numbers that start with `25` and contain up to 20 digits, trims surrounding whitespace, and requires an exact match. Partial matches are not returned. A number absent from the selected-only JSON produces **RESULT NOT FOUND**. Pressing Enter submits the form. **Check Another Result** clears the input and current result.

## Design

The interface uses a warm off-white background, black borders and text, a gold accent, and compact monospace labels. The form and result card resize for narrow screens without horizontal scrolling.

## Security

Input is validated before lookup and is never executed or inserted as HTML. Result fields are rendered as normal React text; the app does not use `dangerouslySetInnerHTML`, `innerHTML`, or `eval`. There are no credentials or secrets in the app.

This is a static app, so the JSON file and its contents are delivered to the browser and are not confidential. A roll number is not authentication: anyone who knows another person's roll number may be able to view that record. Treat all published records as approved public information. Do not add private candidate data.

## Privacy

The sample data is fictional. Only approved roll number, name, selection status, and selected role are displayed. Do not publish contact details, addresses, date of birth, interview notes, application answers, or internal evaluation. The page states: “Only officially approved recruitment information is displayed.”

## Git Workflow

Use a feature branch and open a pull request into `main` after review. Typical commands:

```sh
git status
git add .
git commit -m "feat: add recruitment result checker"
git push origin <feature-branch>
```

## Deployment

Build the static site with `npm run build`; Vite writes the output to `dist/`.

For **Vercel**, import the repository and use the Vite preset. The build command is `npm run build` and the output directory is `dist`.

For **GitHub Pages**, configure the repository-specific `base` path in `vite.config.js` before deployment, then publish the `dist/` output using GitHub Actions or a Pages deployment action.

## Future Improvements

A backend, database, secure admin publishing panel, or additional candidate verification could be considered later. They are intentionally not included in this version.