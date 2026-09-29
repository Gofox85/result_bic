import React, { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Navbar from './components/Navbar.jsx';
import PageHeader from './components/PageHeader.jsx';
import ResultCard from './components/ResultCard.jsx';
import ResultForm from './components/ResultForm.jsx';
import Ticker from './components/Ticker.jsx';
import vault from './data/results.json';
import { InsecureContextError, unlockResult, validateCredentials } from './lib/resultVault.js';

// Unlocking takes a moment by design (the key derivation is slow on purpose); holding the "unlocking" state
// for at least this long keeps a fast device from flashing it.
const MIN_UNLOCK_MS = 700;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [errors, setErrors] = useState({});
  const [lookup, setLookup] = useState({ type: 'idle' });
  const emailRef = useRef(null);
  const rollNoRef = useRef(null);
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const returningToForm = useRef(false);

  useEffect(() => {
    if (lookup.type === 'found') {
      // Bring the whole card (stamp included) out from under the sticky header, then hand focus to its heading.
      panelRef.current?.scrollIntoView({ block: 'start' });
      headingRef.current?.focus({ preventScroll: true });
    } else if (lookup.type === 'idle' && returningToForm.current) {
      returningToForm.current = false;
      emailRef.current?.focus();
    }
  }, [lookup.type]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (lookup.type === 'checking') return;

    const nextErrors = validateCredentials(email, rollNo);
    setErrors(nextErrors);
    if (nextErrors.email || nextErrors.rollNo) {
      setLookup({ type: 'idle' });
      (nextErrors.email ? emailRef : rollNoRef).current?.focus();
      return;
    }

    setLookup({ type: 'checking' });
    try {
      const [next] = await Promise.all([unlockResult(vault, email, rollNo), wait(MIN_UNLOCK_MS)]);
      setLookup(next);
    } catch (error) {
      setLookup({
        type: 'error',
        message:
          error instanceof InsecureContextError
            ? 'This page needs a secure connection. Open it over https:// and try again.'
            : 'Something went wrong while unlocking your result. Refresh the page and try again.',
      });
    }
  }

  function checkAnotherResult() {
    returningToForm.current = true;
    setEmail('');
    setRollNo('');
    setErrors({});
    setLookup({ type: 'idle' });
  }

  function editField(setValue, field) {
    return (value) => {
      setValue(value);
      if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    };
  }

  const found = lookup.type === 'found';

  return (
    <>
      <a className="skip-link" href="#check">Skip to the result checker</a>
      <Ticker published={vault.published} />
      <Navbar />
      <main>
        <PageHeader published={vault.published} />
        <section className="checker" id="check" aria-label="Result checker">
          <div className="wrap section checker-grid">
            {/* Keyed on the view, so the panel slams down again whenever it swaps form for result. */}
            <div className="panel" key={found ? 'result' : 'form'} ref={panelRef}>
              {found ? (
                <ResultCard
                  result={lookup.result}
                  published={vault.published}
                  headingRef={headingRef}
                  onCheckAnother={checkAnotherResult}
                />
              ) : (
                <ResultForm
                  email={email}
                  rollNo={rollNo}
                  onEmailChange={editField(setEmail, 'email')}
                  onRollNoChange={editField(setRollNo, 'rollNo')}
                  onSubmit={handleSubmit}
                  errors={errors}
                  lookup={lookup}
                  iterations={vault.iterations}
                  emailRef={emailRef}
                  rollNoRef={rollNoRef}
                />
              )}
            </div>
            <HowItWorks />
          </div>
        </section>
      </main>
      <Footer published={vault.published} />
    </>
  );
}
