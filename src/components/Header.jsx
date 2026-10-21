import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Calendar } from 'lucide-react';
import { CLINIC } from '../config/clinic';
import { scrollToSection } from '../utils/hooks';
import './Header.css';

const NAV_ITEMS = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Reviews', href: '/#reviews' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(() => window.scrollY > 24);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const capsuleRef = useRef(null);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let previousY = window.scrollY;
    let impulse = 0, y = 0, velocity = 0, frame = 0, previousTime = 0;
    const settle = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      impulse = y = velocity = 0;
      if (capsuleRef.current) capsuleRef.current.style.transform = '';
    };
    const tick = (now) => {
      const dt = Math.min((now - previousTime) / 1000, 0.032);
      previousTime = now;
      impulse *= 0.84;
      const target = Math.max(-3, Math.min(3, impulse * 0.12));
      velocity += (-240 * (y - target) - 28 * velocity) * dt;
      y += velocity * dt;
      if (Math.abs(impulse) < 0.05 && Math.abs(y) < 0.03 && Math.abs(velocity) < 0.03) {
        settle();
        return;
      }
      if (capsuleRef.current) capsuleRef.current.style.transform = `translate3d(0,${y.toFixed(2)}px,0)`;
      frame = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      const currentY = Math.max(0, window.scrollY);
      // Hysteresis avoids flicker around the reveal threshold.
      setIsScrolled((current) => current ? currentY > 8 : currentY > 24);
      impulse = impulse * 0.5 + (currentY - previousY) * 0.5;
      previousY = currentY;
      if (!media.matches && !frame && !document.hidden) {
        previousTime = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };
    const onVisibility = () => { if (document.hidden) settle(); };
    const onMotionChange = () => { if (media.matches) settle(); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', onMotionChange);
    return () => {
      settle();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMotionChange);
    };
  }, []);

  useEffect(() => { setIsMobileOpen(false); }, [location]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector('button')?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') setIsMobileOpen(false);
      if (event.key !== 'Tab') return;
      const targets = [...panelRef.current.querySelectorAll('a[href],button')].filter((el) => el.getClientRects().length);
      const first = targets[0], last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    const onResize = () => { if (window.innerWidth >= 1024) setIsMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      toggleRef.current?.focus({ preventScroll: true });
    };
  }, [isMobileOpen]);

  const handleNavClick = useCallback((event, href) => {
    event.preventDefault();
    const hash = href.split('#')[1];
    if (location.pathname !== '/') navigate('/', { state: { scrollTo: hash } });
    else scrollToSection(hash);
    setIsMobileOpen(false);
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!location.state?.scrollTo) return;
    const timer = setTimeout(() => scrollToSection(location.state.scrollTo), 100);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <header className={`capsule-header ${isScrolled ? 'capsule-header--scrolled' : ''}`}>
        <div className="capsule-header__pill" ref={capsuleRef}>
          <Link to="/" className="capsule-header__logo" aria-label={CLINIC.name} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="capsule-header__logo-badge"><img src="/images/logo-white.png" alt="" width="26" height="26" /></span>
            <span className="capsule-header__logo-text-group"><span className="capsule-header__logo-name">YMTA</span><span className="capsule-header__logo-sub">DENTAL CLINIC</span></span>
          </Link>
          <nav className="capsule-header__nav" aria-label="Main navigation">
            {NAV_ITEMS.map(({ label, href }) => <a key={label} href={href} className="capsule-header__link" onClick={(event) => handleNavClick(event, href)}>{label}</a>)}
          </nav>
          <div className="capsule-header__actions" aria-hidden={!isScrolled} inert={!isScrolled}>
            <div className="capsule-header__actions-inner">
              <a href={`tel:${CLINIC.phone.primary}`} className="capsule-header__call-btn"><Phone size={16} /><span>Call Now</span></a>
              <Link to="/appointment" className="capsule-header__cta"><Calendar size={16} /><span>Book Appointment</span></Link>
            </div>
          </div>
          <button ref={toggleRef} type="button" className="capsule-header__toggle" onClick={() => setIsMobileOpen((open) => !open)} aria-expanded={isMobileOpen} aria-controls="mobile-navigation" aria-label="Open menu"><Menu size={22} /></button>
        </div>
      </header>
      <div id="mobile-navigation" className={`mobile-menu ${isMobileOpen ? 'mobile-menu--open' : ''}`} role="dialog" aria-modal={isMobileOpen || undefined} aria-hidden={!isMobileOpen} inert={!isMobileOpen} aria-label="Navigation menu">
        <div className="mobile-menu__overlay" onClick={() => setIsMobileOpen(false)} />
        <div className="mobile-menu__panel" ref={panelRef}>
          <button className="mobile-menu__close" type="button" aria-label="Close menu" onClick={() => setIsMobileOpen(false)}><X size={22} /></button>
          <nav className="mobile-menu__nav" aria-label="Mobile navigation">{NAV_ITEMS.map(({ label, href }) => <a key={label} href={href} className="mobile-menu__link" onClick={(event) => handleNavClick(event, href)}>{label}</a>)}</nav>
          {isScrolled && <div className="mobile-menu__actions"><a href={`tel:${CLINIC.phone.primary}`} className="btn btn-secondary btn-lg"><Phone size={18} />Call Clinic</a><Link to="/appointment" className="btn btn-primary btn-lg" onClick={() => setIsMobileOpen(false)}><Calendar size={18} />Book Appointment</Link></div>}
        </div>
      </div>
      <div className={`mobile-action-bar ${isScrolled ? 'mobile-action-bar--visible' : ''}`} aria-hidden={!isScrolled} inert={!isScrolled}>
        <a href={`tel:${CLINIC.phone.primary}`} className="mobile-action-bar__btn mobile-action-bar__call"><Phone size={18} /><span>Call</span></a>
        <Link to="/appointment" className="mobile-action-bar__btn mobile-action-bar__book"><Calendar size={18} /><span>Book Visit</span></Link>
      </div>
    </>
  );
}
