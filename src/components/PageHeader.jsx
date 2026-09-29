import React from 'react';
import { RECRUITMENT_YEAR } from '../data/site.js';
import { sealedDate } from '../lib/chain.js';
import { Desync, Scramble, SplitText, Typewriter } from './motion.jsx';

const TITLE = 'Recruitment results';

export default function PageHeader({ published }) {
  const aside = [
    ['published', sealedDate(published)],
    ['recruitment', String(RECRUITMENT_YEAR)],
    ['sign in', 'email + roll no'],
    ['records', 'sealed'],
  ];

  return (
    <header className="page-header">
      <div className="wrap section page-header-grid">
        <div>
          <p className="meta page-eyebrow"><Typewriter text={`bic/rec · recruitment ${RECRUITMENT_YEAR}`} /></p>
          <h1 className="t-title page-title">
            <Desync text={TITLE}><SplitText text={TITLE} delay={0.15} /></Desync>
          </h1>
          <p className="t-lead page-lead">
            Interviewed with the Blockchain Innovation Club? Sign in with your email and roll number to find out
            whether you&apos;ve made the chain.
          </p>
        </div>
        <dl className="page-aside">
          {aside.map(([label, value], i) => (
            <div key={label}>
              <dt className="meta">{label}</dt>
              <dd><Scramble text={value} delay={0.5 + i * 0.1} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}
