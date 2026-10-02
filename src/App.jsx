import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Footer from './components/Footer.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Navbar from './components/Navbar.jsx';
import PageHeader from './components/PageHeader.jsx';
import ResultCard from './components/ResultCard.jsx';
import ResultForm from './components/ResultForm.jsx';
import Ticker from './components/Ticker.jsx';
import { Shutter, usePrefersReducedMotion } from './components/motion.jsx';
import vault from './data/results.json';
import {
  InsecureContextError,
  unlockResult,
  validateCredentials,
  validateEmail,
  validateRollNumber,
} from './lib/resultVault.js';

// Unlocking takes a moment by design (the key derivation is slow on purpose); holding the "unlocking" state
// for at least this long keeps a fast device from flashing it.
const MIN_UNLOCK_MS = 700;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const validators = { email: validateEmail, rollNo: validateRollNumber };

// The reveal, after a match: the explainer's blocks shunt off the page while the form is sealed under a shutter
// (LEAVE_MS). Then the result panel takes the whole row: it's carried over from where the form was and set down
// (SLIDE_MS), and its shutter opens. The card's own entrances wait REVEAL_MS so they play once it's open.
const LEAVE_MS = 440;
const SLIDE_MS = 500;
const REVEAL_MS = 440;
const SHUNT = 'cubic-bezier(0.77, 0, 0.175, 1)';
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const INK = '#14110e';

export default function App() {
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [errors, setErrors] = useState({});
  const [lookup, setLookup] = useState({ type: 'idle' });
  // 'form' -> (a match) 'leaving' -> 'result'. With reduced motion a match goes straight to 'result'.
  const [view, setView] = useState('form');
  const [howReturning, setHowReturning] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const emailRef = useRef(null);
  const rollNoRef = useRef(null);
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const returningToForm = useRef(false);
  const formPanelRect = useRef(null);

  useEffect(() => {
    if (view !== 'leaving') return undefined;
    const timer = setTimeout(() => {
      formPanelRect.current = panelRef.current?.getBoundingClientRect() ?? null;
      setView('result');
    }, LEAVE_MS);
    return () => clearTimeout(timer);
  }, [view]);

  // The result panel is a new element in a new place. Before it paints, start it where the form panel was (right
  // edges lined up, so it never pokes past the page), lifted onto a long shadow; it travels over and drops into place.
  useLayoutEffect(() => {
    const from = formPanelRect.current;
    formPanelRect.current = null;
    const panel = panelRef.current;
    if (view !== 'result' || !from || !panel?.animate) return;
    const to = panel.getBoundingClientRect();
    const dx = Math.round(from.right - to.right);
    const dy = Math.round(from.top - to.top);
    panel.animate(
      [
        { transform: `translate(${dx - 10}px, ${dy - 10}px)`, boxShadow: `17px 17px 0 ${INK}`, easing: SHUNT },
        { offset: 0.72, transform: 'translate(-10px, -10px)', boxShadow: `17px 17px 0 ${INK}`, easing: SPRING },
        { transform: 'none', boxShadow: `7px 7px 0 ${INK}` },
      ],
      { duration: SLIDE_MS },
    );
  }, [view]);

  useEffect(() => {
    if (view === 'result') {
      // Bring the whole card (stamp included) out from under the sticky header, then hand focus to its heading.
      panelRef.current?.scrollIntoView({ block: 'start' });
      headingRef.current?.focus({ preventScroll: true });
    } else if (lookup.type === 'idle' && returningToForm.current) {
      returningToForm.current = false;
      emailRef.current?.focus();
    }
  }, [view, lookup.type]);

  async function handleSubmit(event) {
    event.preventDefault();
    // A safety net: while a match clears the page for its result the button is disabled, so this shouldn't fire.
    if (lookup.type === 'checking' || view !== 'form') return;

    // The explainer's slide-in after "Check another result" has played; don't replay it after this attempt.
    setHowReturning(false);
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
      if (next.type === 'found') setView(reducedMotion ? 'result' : 'leaving');
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
    setView('form');
    setHowReturning(true);
  }

  // Fields are checked as they're filled in, not only on submit: when the candidate leaves a field, and then
  // live on every keystroke once it has been flagged, so the error clears the moment the value is right.
  function editField(setValue, field) {
    return (value) => {
      setValue(value);
      if (errors[field]) setErrors((current) => ({ ...current, [field]: validators[field](value) }));
    };
  }

  function checkField(field) {
    return (value) => {
      // An empty field the candidate has only tabbed through isn't an error yet; submitting it is.
      if (value.trim()) setErrors((current) => ({ ...current, [field]: validators[field](value) }));
    };
  }

  const showResult = view === 'result';
  const animateReveal = showResult && !reducedMotion;
  let howState = howReturning ? 'returning' : 'idle';
  if (lookup.type === 'checking') howState = 'checking';
  if (view === 'leaving') howState = 'leaving';

  return (
    <>
      <a className="skip-link" href="#check">Skip to the result checker</a>
      <Ticker published={vault.published} />
      <Navbar />
      <main>
        <PageHeader published={vault.published} />
        <section className="checker" id="check" aria-label="Result checker">
          <div className={`wrap section checker-grid ${showResult ? 'is-revealed' : ''}`}>
            {/* Keyed on the view, so the result is a fresh panel rather than the form's panel restyled. */}
            <div
              className={`panel ${showResult ? 'panel-result' : ''}`}
              key={showResult ? 'result' : 'form'}
              ref={panelRef}
              style={animateReveal ? { '--reveal': `${REVEAL_MS}ms` } : undefined}
            >
              {showResult ? (
                <>
                  <ResultCard
                    result={lookup.result}
                    published={vault.published}
                    revealDelay={animateReveal ? REVEAL_MS / 1000 : 0}
                    headingRef={headingRef}
                    onCheckAnother={checkAnotherResult}
                  />
                  {animateReveal && <Shutter mode="open" />}
                </>
              ) : (
                <>
                  <ResultForm
                    email={email}
                    rollNo={rollNo}
                    onEmailChange={editField(setEmail, 'email')}
                    onRollNoChange={editField(setRollNo, 'rollNo')}
                    onEmailBlur={checkField('email')}
                    onRollNoBlur={checkField('rollNo')}
                    onSubmit={handleSubmit}
                    errors={errors}
                    lookup={lookup}
                    iterations={vault.iterations}
                    emailRef={emailRef}
                    rollNoRef={rollNoRef}
                  />
                  {view === 'leaving' && <Shutter mode="close" />}
                </>
              )}
            </div>
            {/* Once a result is open, the explainer beside it is gone: the result has the row to itself. */}
            {!showResult && <HowItWorks state={howState} />}
          </div>
        </section>
      </main>
      <Footer published={vault.published} />
    </>
  );
}
