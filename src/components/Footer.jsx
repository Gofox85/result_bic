import React, { useEffect, useState } from 'react';
import { CLUB_EMAIL, CLUB_INSTAGRAM, CLUB_LINKEDIN, CLUB_SITE, RECRUITMENT_YEAR } from '../data/site.js';
import { pad2, sealedDate } from '../lib/chain.js';
import { Desync, Roll } from './motion.jsx';

const socialLinks = [
  { label: 'Instagram', href: CLUB_INSTAGRAM },
  { label: 'LinkedIn', href: CLUB_LINKEDIN },
  { label: 'Email', href: `mailto:${CLUB_EMAIL}` },
];

const clubLinks = [
  { label: 'About', path: '/about' },
  { label: 'Events', path: '/events' },
  { label: 'Contact', path: '/contact' },
];

const GENESIS = Date.UTC(2025, 7, 1); // the club's first block: August 2025
const BLOCK_TIME = 12_000;

// Decorative chrome that rewrites itself every second, so it's hidden from assistive tech.
function BlockClock() {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed = Math.max(now - GENESIS, 0);
  const height = String(Math.floor(elapsed / BLOCK_TIME)).padStart(7, '0');
  return <span aria-hidden="true">block {height} · sealed {pad2(Math.floor((elapsed % BLOCK_TIME) / 1000))}s ago</span>;
}

export default function Footer({ published }) {
  return (
    <footer className="site-footer on-ink">
      <div className="wrap section footer-grid">
        <div>
          <a className="t-cta footer-wordmark" href={CLUB_SITE}><Desync text="BIC/REC" /></a>
          <p className="t-body footer-blurb">
            Blockchain Innovation Club, Rajalakshmi Engineering College. Innovate. Decentralize. Build the future.
          </p>
          <p className="meta">in partnership with kerala blockchain association</p>
          <ul className="footer-socials">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  className="fill-up"
                  href={link.href}
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Club site">
          <h2 className="meta">the club</h2>
          <ul className="footer-links">
            {clubLinks.map((link) => (
              <li key={link.path}>
                <a className="roll-host" href={`${CLUB_SITE}${link.path}`}><Roll>{link.label}</Roll></a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="footer-bar">
        <div className="wrap footer-bar-inner">
          <span>© {RECRUITMENT_YEAR} blockchain innovation club · rajalakshmi engineering college.</span>
          <span>results sealed {sealedDate(published)} · <BlockClock /></span>
        </div>
      </div>
    </footer>
  );
}
