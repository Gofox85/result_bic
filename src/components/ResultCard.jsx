import React from 'react';

export default function ResultCard({ lookup, onCheckAnother }) {
  if (lookup.type === 'not-found') {
    return (
      <section className="result-panel not-found" aria-live="polite" aria-atomic="true">
        <p className="micro-label">LOOKUP COMPLETE</p>
        <h2>RESULT NOT FOUND</h2>
        <p>No result was found for the entered roll number.</p>
        <p>Please check your roll number and try again.</p>
        <button className="secondary-button" type="button" onClick={onCheckAnother}>CHECK ANOTHER RESULT</button>
      </section>
    );
  }

  const { result } = lookup;

  return (
    <section className="result-panel" aria-live="polite" aria-atomic="true">
      <div className="result-panel-heading">
        <p className="micro-label">LOOKUP COMPLETE</p>
        <h2>YOUR RESULT</h2>
      </div>
      <dl className="result-details">
        <div className="detail-item">
          <dt>ROLL NUMBER</dt>
          <dd>{result.rollNo}</dd>
        </div>
        <div className="detail-item">
          <dt>NAME</dt>
          <dd>{result.name}</dd>
        </div>
        <div className="detail-item">
          <dt>STATUS</dt>
          <dd><span className={`status-tag ${result.selected ? 'is-selected' : 'is-not-selected'}`}>
            {result.selected ? 'SELECTED' : 'NOT SELECTED'}
          </span></dd>
        </div>
        {result.selected && (
          <div className="detail-item">
            <dt>SELECTED ROLE</dt>
            <dd>{result.role}</dd>
          </div>
        )}
      </dl>
      <button className="secondary-button" type="button" onClick={onCheckAnother}>CHECK ANOTHER RESULT</button>
    </section>
  );
}
