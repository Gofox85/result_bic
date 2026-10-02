import React from 'react';
import { CLUB_SITE, NOT_SELECTED_MESSAGE, SELECTED_NEXT_STEPS } from '../data/site.js';
import { pad2, sealedDate, shortHash } from '../lib/chain.js';
import { Roll, Scramble, SplitText } from './motion.jsx';

const CONFIRMATION_SLOTS = 6;

// Six cells split by 3px rules, filling amber left to right: the block is confirmed.
function Confirmations() {
  return (
    <div className="confirmations">
      <div className="confirm-strip" aria-hidden="true">
        {Array.from({ length: CONFIRMATION_SLOTS }, (_, i) => (
          <span className="confirm-cell" key={i} style={{ '--i': i }} />
        ))}
      </div>
      <p className="meta">{pad2(CONFIRMATION_SLOTS)}/{pad2(CONFIRMATION_SLOTS)} confirmations</p>
    </div>
  );
}

function Ledger({ rows }) {
  return (
    <dl className="result-ledger">
      {rows.filter(([, value]) => value).map(([label, value, highlight]) => (
        <div className={highlight ? 'is-highlight' : undefined} key={label}>
          <dt className="meta">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Greet by the first real name, skipping initials: "S. Pratiba" and "V Sanjaivel" become Pratiba and Sanjaivel.
const greetingName = (name) => name.split(/\s+/).find((part) => part.replace(/\./g, '').length > 2) ?? name.trim();

export default function ResultCard({ result, published, headingRef, onCheckAnother }) {
  const firstName = greetingName(result.name);
  const title = result.selected ? `Welcome to the chain, ${firstName}.` : `Not this time, ${firstName}.`;

  return (
    <article className="result" aria-labelledby="result-title">
      <div className="result-top">
        <span className="stamp">
          <span className={`chip chip-lg ${result.selected ? 'chip-mint' : ''}`}>
            {result.selected ? 'Selected' : 'Not selected'}
          </span>
        </span>
        <span className="meta">
          <Scramble text={`record ${shortHash(result.rollNo)} · sealed ${sealedDate(published)}`} delay={0.3} />
        </span>
      </div>

      <h2 className="t-h3 result-title" id="result-title" ref={headingRef} tabIndex={-1}>
        <SplitText text={title} delay={0.15} stagger={0.045} />
      </h2>

      {result.selected ? (
        <>
          <p className="t-lead result-lead">
            You&apos;ve been selected as {/^[aeiou]/i.test(result.role) ? 'an' : 'a'} <strong>{result.role}</strong>.
          </p>
          <Ledger
            rows={[
              ['name', result.name],
              ['roll number', result.rollNo],
              ['department', result.department],
              ['role', result.role, true],
            ]}
          />
          <Confirmations />
          <p className="t-body result-body">{SELECTED_NEXT_STEPS}</p>
        </>
      ) : (
        <>
          <p className="t-body result-body">{NOT_SELECTED_MESSAGE}</p>
          <Ledger
            rows={[
              ['name', result.name],
              ['roll number', result.rollNo],
              ['department', result.department],
            ]}
          />
        </>
      )}

      <div className="result-actions">
        {!result.selected && (
          <a className="btn btn-amber" href={`${CLUB_SITE}/events`}><Roll>See upcoming events</Roll></a>
        )}
        <button className="btn btn-bone" type="button" onClick={onCheckAnother}><Roll>Check another result</Roll></button>
      </div>
    </article>
  );
}
