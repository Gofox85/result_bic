import React, { useState } from 'react';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import ResultCard from './components/ResultCard.jsx';
import ResultForm from './components/ResultForm.jsx';
import results from './data/results.json';
import { findResult } from './data/findResult.js';

export default function App() {
  const [rollNo, setRollNo] = useState('');
  const [lookup, setLookup] = useState({ type: 'idle' });

  function handleSubmit(event) {
    event.preventDefault();
    setLookup(findResult(results, rollNo));
  }

  function checkAnotherResult() {
    setRollNo('');
    setLookup({ type: 'idle' });
  }

  const showForm = lookup.type === 'idle' || lookup.type === 'invalid';

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="checker-main">
        <section className="checker-panel" aria-labelledby="page-title">
          <p className="eyebrow"><span className="eyebrow-mark" /> OFFICIAL RECRUITMENT UPDATE</p>
          <h1 id="page-title">RECRUITMENT<br />RESULTS<span>.</span></h1>
          <p className="intro-copy">The next step starts here. Enter your roll number to check your result.</p>

          {showForm ? (
            <ResultForm
              value={rollNo}
              onChange={setRollNo}
              onSubmit={handleSubmit}
              invalid={lookup.type === 'invalid'}
            />
          ) : (
            <ResultCard lookup={lookup} onCheckAnother={checkAnotherResult} />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
