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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /* ── Restrained spring-velocity physics for floating capsule ── */
  const capsuleRef = useRef(null);
  const stateRef = useRef({
    lastScrollY: 0,
    velocity: 0,
    y: 0,
    vy: 0,
    scale: 1,
    vScale: 0,
    rafId: null,
    isIdle: true,
  });

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const s = stateRef.current;
    s.lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const dy = currentScrollY - s.lastScrollY;
      s.lastScrollY = currentScrollY;

      setIsScrolled(currentScrollY > 20);

      // Dampened velocity impulse (positive = scrolling down, negative = scrolling up)
      s.velocity = s.velocity * 0.6 + dy * 0.4;

      if (s.isIdle) {
        s.isIdle = false;
        startLoop();
      }
    };

    const startLoop = () => {
      let lastTime = performance.now();

      const tick = (now) => {
        const dt = Math.min((now - lastTime) / 1000, 0.033);
        lastTime = now;

        // Decay velocity input gradually
        s.velocity *= 0.88;

        // Target displacement: subtle shift in direction of scroll (max ±4px)
        const clampedV = Math.max(-14, Math.min(14, s.velocity));
        const targetY = clampedV * 0.28;

        // Target scale: tiny subtle compression during fast scroll (0.988 - 1.0)
        const targetScale = 1 - Math.min(0.012, Math.abs(clampedV) * 0.0009);

        // Spring physics parameters
        const k = 220; // stiffness
        const c = 24;  // damping

        // Displacement Y spring
        const forceY = -k * (s.y - targetY) - c * s.vy;
        s.vy += forceY * dt;
        s.y += s.vy * dt;

        // Scale spring
        const forceScale = -k * (s.scale - targetScale) - c * s.vScale;
        s.vScale += forceScale * dt;
        s.scale += s.vScale * dt;

        // Check if settled to rest
        const isSettledY = Math.abs(s.y) < 0.04 && Math.abs(s.vy) < 0.04;
        const isSettledScale = Math.abs(s.scale - 1) < 0.0005 && Math.abs(s.vScale) < 0.0005;
        const isVelocityDecayed = Math.abs(s.velocity) < 0.1;

        if (isSettledY && isSettledScale && isVelocityDecayed) {
          s.y = 0;
          s.vy = 0;
          s.scale = 1;
          s.vScale = 0;
          s.velocity = 0;
          s.isIdle = true;

          if (capsuleRef.current) {
            capsuleRef.current.style.transform = '';
          }
          return; // pause loop until next scroll event
        }

        if (capsuleRef.current) {
          capsuleRef.current.style.transform = `translate3d(0, ${s.y.toFixed(2)}px, 0) scale(${s.scale.toFixed(4)})`;
        }

        s.rafId = requestAnimationFrame(tick);
      };

      s.rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (s.rafId) cancelAnimationFrame(s.rafId);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleNavClick = useCallback(
    (e, href) => {
      e.preventDefault();
      const [path, hash] = href.split('#');
      if (location.pathname !== '/' && path === '/') {
        navigate('/', { state: { scrollTo: hash } });
      } else if (hash) {
        scrollToSection(hash);
      }
      setIsMobileOpen(false);
    },
    [location.pathname, navigate]
  );

  // Handle scroll after navigation from appointment page
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => scrollToSection(location.state.scrollTo), 100);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const isNotHome = location.pathname !== '/';

  return (
    <>
      <header
        className={`capsule-header ${(isScrolled || isNotHome) ? 'capsule-header--scrolled' : ''}`}
        role="banner"
      >
        <div className="capsule-header__rail">
          <div className="capsule-header__pill" ref={capsuleRef}>
            {/* Logo & Brand */}
            <Link
              to="/"
              className="capsule-header__logo"
              aria-label={CLINIC.name}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="capsule-header__logo-badge">
                <img
                  src="/images/logo-white.png"
                  alt=""
                  className="capsule-header__logo-img"
                  width="26"
                  height="26"
                />
              </div>
              <div className="capsule-header__logo-text-group">
                <span className="capsule-header__logo-name">YMTA</span>
                <span className="capsule-header__logo-sub">DENTAL CLINIC</span>
              </div>
            </Link>

            {/* Vertical Divider */}
            <span className="capsule-header__divider" aria-hidden="true" />

            {/* Desktop Navigation Links */}
            <nav className="capsule-header__nav" aria-label="Main navigation">
              {NAV_ITEMS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="capsule-header__link"
                  onClick={(e) => handleNavClick(e, href)}
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="capsule-header__actions">
              {/* Optional Call Now — comfortably shown at wide desktop (>= 1280px) */}
              <a
                href={`tel:${CLINIC.phone.primary}`}
                className="capsule-header__call-btn"
                aria-label="Call Clinic Now"
              >
                <Phone size={14} />
                <span>Call Now</span>
              </a>

              {/* Primary Booking CTA */}
              <Link to="/appointment" className="capsule-header__cta">
                <Calendar size={15} />
                <span>Book Appointment</span>
              </Link>
            </div>

            {/* Mobile Hamburger / Close Button */}
            <button
              className="capsule-header__toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-navigation"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <div
        id="mobile-navigation"
        className={`mobile-menu ${isMobileOpen ? 'mobile-menu--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileOpen}
        aria-label="Navigation menu"
      >
        <div className="mobile-menu__overlay" onClick={() => setIsMobileOpen(false)} />
        <div className="mobile-menu__panel">
          <nav className="mobile-menu__nav" aria-label="Mobile navigation">
            {NAV_ITEMS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="mobile-menu__link"
                onClick={(e) => handleNavClick(e, href)}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="mobile-menu__actions">
            <a href={`tel:${CLINIC.phone.primary}`} className="btn btn-secondary btn-lg mobile-menu__call">
              <Phone size={18} />
              Call Clinic
            </a>
            <Link to="/appointment" className="btn btn-primary btn-lg" onClick={() => setIsMobileOpen(false)}>
              <Calendar size={18} />
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="mobile-action-bar">
        <a href={`tel:${CLINIC.phone.primary}`} className="mobile-action-bar__btn mobile-action-bar__call">
          <Phone size={18} />
          <span>Call</span>
        </a>
        <Link to="/appointment" className="mobile-action-bar__btn mobile-action-bar__book">
          <Calendar size={18} />
          <span>Book</span>
        </Link>
      </div>
    </>
  );
}
