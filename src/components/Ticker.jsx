import React from 'react';
import { RECRUITMENT_YEAR } from '../data/site.js';
import { sealedDate, shortHash } from '../lib/chain.js';

// Header ticker: an endless marquee (two identical runs, shifted by exactly one run). Static and clipped when
// reduced motion is requested.
export default function Ticker({ published }) {
  const entries = [
    `recruitment ${RECRUITMENT_YEAR} · results live`,
    `block #${RECRUITMENT_YEAR} · ${shortHash(`bic-rec-results-${published}`)} · sealed ${sealedDate(published)}`,
    'sign in with your email + roll number',
    'every result is sealed · only you can open yours',
  ];
  const run = [...entries, ...entries];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <p className="ticker-run" key={copy}>
            {run.map((entry, i) => <span key={i}>{entry}</span>)}
          </p>
        ))}
      </div>
    </div>
  );
}
