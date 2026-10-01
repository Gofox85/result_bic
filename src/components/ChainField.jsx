import React, { useEffect, useRef } from 'react';
import { startChainField } from '../lib/chainField.js';
import { usePrefersReducedMotion } from './motion.jsx';

// The animated chain behind the page (see lib/chainField.js). Fixed behind everything by default; `contained`
// fills its section instead, for ink sections that would otherwise cover the page-wide field.
export default function ChainField({ tone = 'bone', contained = false }) {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => startChainField(ref.current, { tone, animate: !reduced }), [tone, reduced]);

  return <canvas ref={ref} className={`chain-field${contained ? ' is-contained' : ''}`} aria-hidden="true" />;
}
