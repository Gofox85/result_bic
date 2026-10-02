import React, { Fragment, useEffect, useState } from 'react';

// The BIC/REC motion language, cut down to what this page uses: things shunt, stamp and decrypt.
// Nothing fades. With reduced motion requested, every effect renders its final state straight away.

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(reducedMotionQuery).matches);

  useEffect(() => {
    const query = window.matchMedia(reducedMotionQuery);
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

// 0 -> 1 over `duration` seconds, starting after `delay`. Bump `replay` to run it again.
function useProgress(duration, delay, replay) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return undefined;
    }

    let frame;
    let start;
    const tick = (now) => {
      start ??= now + delay * 1000;
      const next = Math.min(Math.max((now - start) / (duration * 1000), 0), 1);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, duration, delay, replay]);

  return progress;
}

const GLYPHS = '0123456789abcdef';
const KEEP = new Set([' ', '·', '#', '.', '…', '/', '-', ':', '&']);

// Decrypt: characters cycle through hex glyphs and lock in left to right.
export function Scramble({ text, duration = 0.8, delay = 0, replay = 0, className }) {
  const progress = useProgress(duration, replay ? 0 : delay, replay);
  const chars = Array.from(text);
  const locked = Math.floor(progress * chars.length);
  const tick = Math.floor(progress * 30);
  const shown =
    progress >= 1
      ? text
      : chars
          .map((ch, i) =>
            i < locked || KEEP.has(ch) ? ch : GLYPHS[(i * 7 + tick * 11 + ch.charCodeAt(0)) % GLYPHS.length],
          )
          .join('');

  return (
    <span className={className}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

// Eyebrows type themselves out behind a hard-blinking caret.
export function Typewriter({ text, delay = 0, speed = 0.035 }) {
  const progress = useProgress(text.length * speed, delay, 0);
  const count = Math.round(progress * text.length);

  return (
    <span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        {progress < 1 && <span className="caret" />}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}

// Headline words shunt up out of their own line box, one after another.
export function SplitText({ text, delay = 0, stagger = 0.08 }) {
  const words = text.split(' ');

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="split-word">
              <span style={{ animationDelay: `${delay + Math.min(i, 12) * stagger}s` }}>{word}</span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </>
  );
}

// Fork: on hover the label splits into an amber and a mint copy, then snaps back into register.
export function Desync({ text, children }) {
  return (
    <span className="desync">
      <span aria-hidden="true" className="desync-ghost desync-a">{text}</span>
      <span aria-hidden="true" className="desync-ghost desync-b">{text}</span>
      <span className="desync-real">{children ?? text}</span>
    </span>
  );
}

const SLATS = 8;
const hexLine = () =>
  Array.from({ length: 24 }, () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0')).join(' ');
// One set per page load, so the seal over the form and the seal over the result read as the same block.
const SHUTTER_LINES = Array.from({ length: SLATS }, hexLine);

// Seal: slats of ciphertext cover the panel. "close" shunts them in from alternate sides; "open" shunts them back
// out, top to bottom, to show what's underneath. Not rendered at all when reduced motion is requested.
export function Shutter({ mode }) {
  return (
    <div className={`shutter is-${mode}`} aria-hidden="true">
      {SHUTTER_LINES.map((line, i) => (
        <span className="slat" key={i} style={{ '--i': i, '--dir': i % 2 ? 1 : -1 }}>{line}</span>
      ))}
    </div>
  );
}

// Label roll: on hover the label shunts up out of its slot and an identical copy rises into it.
export function Roll({ children }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
