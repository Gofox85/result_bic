import React from 'react';

export default function ResultForm({ value, onChange, onSubmit, invalid }) {
  return (
    <form className="result-form" onSubmit={onSubmit} noValidate>
      <label htmlFor="roll-number">ENTER YOUR ROLL NUMBER</label>
      <input
        id="roll-number"
        name="rollNumber"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={21}
        placeholder="e.g. 250701671"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? 'roll-number-error' : 'roll-number-hint'}
      />
      {invalid ? (
        <p className="form-message form-error" id="roll-number-error" role="alert">
          Please enter a valid roll number.
        </p>
      ) : (
        <p className="form-message" id="roll-number-hint">Use the numeric roll number issued during application.</p>
      )}
      <button className="primary-button" type="submit">CHECK RESULT <span aria-hidden="true">↗</span></button>
    </form>
  );
}