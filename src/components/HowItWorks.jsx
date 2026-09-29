import React from 'react';
import { CLUB_EMAIL } from '../data/site.js';

const steps = [
  { title: 'Your college email', body: 'Use the @rajalakshmi.edu.in address you applied with.' },
  { title: 'Roll number as password', body: 'Your 9-digit roll number, for example 240101016. Digits only.' },
  {
    title: 'Unlocked on your device',
    body: 'Every result is sealed. Only your email and roll number together can open yours, and nothing you type leaves this page.',
  },
];

export default function HowItWorks() {
  return (
    <section className="how" aria-labelledby="how-title">
      <h2 className="t-h3" id="how-title">How it works</h2>
      <ol className="steps">
        {steps.map((step, i) => (
          <li className="step" key={step.title}>
            <span className={`node ${i === steps.length - 1 ? 'node-head' : ''}`} aria-hidden="true" />
            <div>
              <p className="meta">block #{String(i + 1).padStart(4, '0')}{i === steps.length - 1 ? ' · head' : ''}</p>
              <h3 className="t-row">{step.title}</h3>
              <p className="t-small">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="t-small how-help">
        Can&apos;t find your result? Write to{' '}
        <a className="text-link" href={`mailto:${CLUB_EMAIL}`}>{CLUB_EMAIL}</a> with your name and roll number.
      </p>
    </section>
  );
}
