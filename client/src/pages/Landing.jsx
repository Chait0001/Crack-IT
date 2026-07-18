import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  FileText,
  Menu,
  Sparkles,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'What you get', href: '#what-you-get' },
  { label: 'Built for clarity', href: '#built-for-clarity' },
];

const OUTCOMES = [
  ['Tell a clearer story', 'Turn scattered experience into a focused professional narrative.'],
  ['Tailor with confidence', 'Use job context to sharpen the details that matter most.'],
  ['Send something polished', 'Export a clean, readable resume when you are ready.'],
];

const STEPS = [
  ['01', 'Start with your experience', 'Add what you have, however rough it is. A few notes are enough to begin.'],
  ['02', 'Shape the story', 'Refine achievements, organize sections, and see the document take form in real time.'],
  ['03', 'Make it ready to send', 'Review fit for a role, then export or share a version you feel good about.'],
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <div className="landing-shell landing-nav-inner">
          <Link to="/" className="landing-brand" aria-label="Crack IT home">
            <span className="landing-brand-mark"><BadgeCheck aria-hidden="true" /></span>
            <span>CRACK IT<span className="landing-brand-dot">!</span></span>
          </Link>

          <nav className="landing-nav-links" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>

          <div className="landing-nav-actions">
            <Link to="/login" className="landing-text-link">Sign in</Link>
            <Link to="/signup" className="landing-button landing-button-small">Create your resume <ArrowRight aria-hidden="true" /></Link>
          </div>

          <button
            type="button"
            className="landing-menu-button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav id="mobile-navigation" className="landing-mobile-menu" aria-label="Mobile navigation">
            <div className="landing-shell">
              {NAV_ITEMS.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
              <div className="landing-mobile-actions">
                <Link to="/login" onClick={closeMenu}>Sign in</Link>
                <Link to="/signup" onClick={closeMenu} className="landing-button">Create your resume <ArrowRight aria-hidden="true" /></Link>
              </div>
            </div>
          </nav>
        )}
      </header>

      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="landing-shell landing-hero-grid">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow"><Sparkles aria-hidden="true" /> A calmer way to get career-ready</p>
            <h1 id="hero-title">Your experience has a story.<br /><em>Make it easy to see.</em></h1>
            <p className="landing-lead">
              Crack IT helps you shape a thoughtful, job-ready resume—without fighting a blank page, a template, or your own achievements.
            </p>
            <div className="landing-hero-actions">
              <Link to="/signup" className="landing-button landing-button-large">Build my resume <ArrowRight aria-hidden="true" /></Link>
              <Link to="/login" className="landing-secondary-button">Explore the demo</Link>
            </div>
            <p className="landing-note">Start free. Bring a rough draft—or just bring your experience.</p>
          </div>

          <div className="landing-art" aria-label="Resume preview showing a refined professional profile">
            <div className="landing-orbit landing-orbit-one" aria-hidden="true" />
            <div className="landing-orbit landing-orbit-two" aria-hidden="true" />
            <div className="landing-paper">
              <div className="landing-paper-topline" />
              <div className="landing-paper-header">
                <div className="landing-avatar">AK</div>
                <div>
                  <div className="landing-name">Avery Kim</div>
                  <div className="landing-role">Product designer · New York</div>
                </div>
              </div>
              <div className="landing-paper-section">
                <span>PROFILE</span>
                <p>I turn complicated workflows into clear, useful products that people enjoy returning to.</p>
              </div>
              <div className="landing-paper-section landing-paper-experience">
                <span>EXPERIENCE</span>
                <div className="landing-job-line"><strong>Senior Product Designer</strong><small>2022—Now</small></div>
                <p>Led the redesign of onboarding, helping new teams reach their first meaningful outcome sooner.</p>
                <div className="landing-job-line"><strong>Product Designer</strong><small>2019—22</small></div>
              </div>
              <div className="landing-paper-footer">
                <span>Research</span><span>Systems thinking</span><span>Figma</span>
              </div>
            </div>
            <div className="landing-proof-card">
              <span className="landing-proof-icon"><Check aria-hidden="true" /></span>
              <div><strong>A clearer first draft</strong><small>Built around your real work</small></div>
            </div>
          </div>
        </div>
      </section>

      <section id="what-you-get" className="landing-outcomes" aria-labelledby="outcomes-title">
        <div className="landing-shell">
          <div className="landing-section-intro">
            <p className="landing-eyebrow">More than a document</p>
            <h2 id="outcomes-title">A good resume does not just list work. It gives it shape.</h2>
          </div>
          <div className="landing-outcome-grid">
            {OUTCOMES.map(([title, description], index) => (
              <article key={title} className="landing-outcome">
                <span className="landing-count">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="landing-workflow" aria-labelledby="workflow-title">
        <div className="landing-shell landing-workflow-grid">
          <div className="landing-workflow-heading">
            <p className="landing-eyebrow">A focused process</p>
            <h2 id="workflow-title">From rough notes to a resume that feels like you.</h2>
            <p>Crack IT keeps the mechanics in the background, so you can stay focused on the work you are proud of.</p>
          </div>
          <ol className="landing-steps">
            {STEPS.map(([number, title, description]) => (
              <li key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="built-for-clarity" className="landing-clarity" aria-labelledby="clarity-title">
        <div className="landing-shell landing-clarity-panel">
          <div>
            <p className="landing-eyebrow">Designed for the details</p>
            <h2 id="clarity-title">Helpful when you need momentum. Quiet when you need to think.</h2>
          </div>
          <ul>
            <li><FileText aria-hidden="true" /><span>Live previews that make every change tangible</span></li>
            <li><Sparkles aria-hidden="true" /><span>AI suggestions that begin with your real context</span></li>
            <li><BadgeCheck aria-hidden="true" /><span>Clean templates built to keep the focus on your work</span></li>
          </ul>
        </div>
      </section>

      <section className="landing-closing" aria-labelledby="closing-title">
        <div className="landing-shell landing-closing-inner">
          <p className="landing-eyebrow">Your next version starts here</p>
          <h2 id="closing-title">Make the work speak for itself.</h2>
          <p>Build a resume with more clarity, more confidence, and less friction.</p>
          <Link to="/signup" className="landing-button landing-button-large">Get started free <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-shell">
          <Link to="/" className="landing-brand" aria-label="Crack IT home">
            <span className="landing-brand-mark"><BadgeCheck aria-hidden="true" /></span>
            <span>CRACK IT<span className="landing-brand-dot">!</span></span>
          </Link>
          <p>Built for people with work worth showing.</p>
        </div>
      </footer>
    </main>
  );
}
