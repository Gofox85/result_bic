import React, { useState } from 'react';
import logo from '../assets/bic-logo.jpeg';
import { CLUB_SITE } from '../data/site.js';
import { Roll, Scramble } from './motion.jsx';

export default function Navbar() {
  // The wordmark decrypts on load and again whenever the mouse comes back to it.
  const [replay, setReplay] = useState(0);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          className="brand"
          href="/"
          aria-label="BIC/REC recruitment results"
          onPointerEnter={(event) => event.pointerType === 'mouse' && setReplay((n) => n + 1)}
        >
          <img className="brand-logo" src={logo} alt="" width="48" height="48" />
          <span className="brand-text">
            <span className="brand-name"><Scramble text="BIC/REC" duration={0.6} replay={replay} /></span>
            <span className="meta brand-meta">blockchain innovation club</span>
          </span>
        </a>
        <nav className="header-nav" aria-label="Main">
          <a className="nav-cell nav-cell-club roll-host" href={CLUB_SITE}><Roll>Club site</Roll></a>
          <span className="nav-cell nav-cell-active" aria-current="page">Results</span>
        </nav>
      </div>
    </header>
  );
}
