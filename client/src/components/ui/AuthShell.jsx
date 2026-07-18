import { BadgeCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthShell({ children, eyebrow, title, description }) {
  return (
    <main className="auth-page editorial-page">
      <aside className="auth-aside">
        <Link to="/" className="editorial-nav-brand"><span><BadgeCheck aria-hidden="true" /></span> CRACK IT!</Link>
        <div>
          <p className="editorial-kicker"><Sparkles aria-hidden="true" /> A calmer way to get career-ready</p>
          <h1>{title}</h1><p>{description}</p>
        </div>
        <div className="auth-aside-note"><span>01</span><p>Start with the work you remember. Shape the story together from there.</p></div>
      </aside>
      <section className="auth-form-area">
        <div className="auth-mobile-brand"><Link to="/" className="editorial-nav-brand"><span><BadgeCheck aria-hidden="true" /></span> CRACK IT!</Link></div>
        <div className="auth-form-wrap"><p className="editorial-kicker">{eyebrow}</p>{children}</div>
      </section>
    </main>
  );
}
