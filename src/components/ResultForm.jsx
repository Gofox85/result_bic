import React, { useState } from 'react';
import { ROLL_NUMBER_LENGTH, rollNumberInput } from '../lib/resultVault.js';
import { Roll } from './motion.jsx';

function FieldError({ id, children }) {
  return children ? <p className="field-error" id={id}>{children}</p> : null;
}

export default function ResultForm({
  email,
  rollNo,
  onEmailChange,
  onRollNoChange,
  onEmailBlur,
  onRollNoBlur,
  onSubmit,
  errors,
  lookup,
  iterations,
  emailRef,
  rollNoRef,
}) {
  const [showRollNo, setShowRollNo] = useState(false);
  const checking = lookup.type === 'checking';

  return (
    <form className="result-form" onSubmit={onSubmit} noValidate aria-busy={checking}>
      <h2 className="t-h3">Check your result</h2>

      <div>
        <label className="field-label" htmlFor="email">email address</label>
        <input
          ref={emailRef}
          className="field"
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@rajalakshmi.edu.in"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          onBlur={(event) => onEmailBlur(event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        <FieldError id="email-error">{errors.email}</FieldError>
      </div>

      <div>
        <label className="field-label" htmlFor="roll-number">password · your roll number</label>
        <div className={`field-group ${errors.rollNo ? 'is-invalid' : ''}`}>
          <input
            ref={rollNoRef}
            className="field"
            id="roll-number"
            name="rollNumber"
            type={showRollNo ? 'text' : 'password'}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={ROLL_NUMBER_LENGTH}
            placeholder="e.g. 240101016"
            value={rollNo}
            // Digits only: letters and symbols are dropped as they're typed or pasted.
            onChange={(event) => onRollNoChange(rollNumberInput(event.target.value))}
            onBlur={(event) => onRollNoBlur(event.target.value)}
            aria-invalid={Boolean(errors.rollNo)}
            aria-describedby={errors.rollNo ? 'roll-number-error' : undefined}
          />
          <button
            className="field-toggle"
            type="button"
            aria-controls="roll-number"
            onClick={() => setShowRollNo((shown) => !shown)}
          >
            {showRollNo ? 'hide' : 'show'}<span className="sr-only"> roll number</span>
          </button>
        </div>
        <FieldError id="roll-number-error">{errors.rollNo}</FieldError>
      </div>

      {lookup.type === 'not-found' && (
        <div className="form-alert on-ink" role="alert">
          <p className="meta">no match</p>
          <p>No result matches that email and roll number. Check both and try again.</p>
        </div>
      )}
      {lookup.type === 'error' && (
        <div className="form-alert on-ink" role="alert">
          <p className="meta">couldn&apos;t unlock</p>
          <p>{lookup.message}</p>
        </div>
      )}

      <button className="btn btn-amber btn-block" type="submit" disabled={checking}>
        {checking ? <span>Unlocking<span className="caret" aria-hidden="true" /></span> : <Roll>Reveal my result</Roll>}
      </button>
      <p className="meta" aria-live="polite">
        {checking
          ? `deriving your key · ${iterations.toLocaleString('en-IN')} rounds`
          : 'checked on this device — nothing you type is sent or stored'}
      </p>
    </form>
  );
}
