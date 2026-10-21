import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowUpRight, Calendar, MessageCircle } from 'lucide-react';
import { CLINIC, SERVICES, getWhatsAppUrl } from '../config/clinic';
import { useInView, scrollToSection } from '../utils/hooks';
import './Footer.css';

function InstagramIcon({ size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const [ref, isVisible] = useInView();
  const whatsappUrl = getWhatsAppUrl('Hello, I would like to enquire about dental care at YMTA Dental Clinic.');

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="contact section" ref={ref}>
        <div className="container">
          <div className={`contact__inner ${isVisible ? 'visible' : ''}`}>
            <div className="contact__header">
              <span className="section-label">Contact</span>
              <h2 className="section-title">Visit our clinic.</h2>
              <p className="section-subtitle">
                We're conveniently located on the Palakkad–Coimbatore Road in B.K. Pudur.
                Reach us by phone or stop by during our opening hours.
              </p>
            </div>

            <div className="contact__grid">
              <div className="contact__card">
                <MapPin size={20} className="contact__card-icon" />
                <h3 className="contact__card-title">Address</h3>
                <p className="contact__card-text">{CLINIC.branch.fullAddress}</p>
                <a
                  href={CLINIC.branch.mapsUrl}
                  className="contact__card-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions
                  <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="contact__card">
                <Phone size={20} className="contact__card-icon" />
                <h3 className="contact__card-title">Phone</h3>
                <p className="contact__card-text">
                  <a href={`tel:${CLINIC.phone.primary}`} className="contact__phone-link">
                    {CLINIC.phone.primaryDisplay}
                  </a>
                </p>
                <p className="contact__card-note">Call us to schedule or enquire</p>
                <div className="contact__social-actions">
                  {whatsappUrl && (
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle size={16} aria-hidden="true" />
                      WhatsApp
                    </a>
                  )}
                  {CLINIC.social.instagram.url && (
                    <a href={CLINIC.social.instagram.url} target="_blank" rel="noopener noreferrer">
                      <InstagramIcon size={16} />
                      Instagram
                    </a>
                  )}
                </div>
              </div>

              <div className="contact__card">
                <Clock size={20} className="contact__card-icon" />
                <h3 className="contact__card-title">Hours</h3>
                <div className="contact__hours">
                  <div className="contact__hours-row">
                    <span className="contact__hours-days">{CLINIC.hours.weekday.days}</span>
                    <div>
                      {CLINIC.hours.weekday.sessions.map((s) => (
                        <span key={s.label} className="contact__hours-time">{s.time}</span>
                      ))}
                    </div>
                  </div>
                  <div className="contact__hours-row">
                    <span className="contact__hours-days">{CLINIC.hours.sunday.days}</span>
                    <div>
                      {CLINIC.hours.sunday.sessions.map((s) => (
                        <span key={s.label} className="contact__hours-time">{s.time}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact__cta">
              <Link to="/appointment" className="btn btn-primary btn-lg">
                <Calendar size={18} />
                Book an Appointment
              </Link>
            </div>

            <div className="contact__map" style={{ marginTop: 'var(--space-12)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', height: '400px' }}>
              <iframe
                title="Google Maps Location for YMTA Dental Clinic"
                src={`https://www.google.com/maps?q=${CLINIC.branch.mapsQuery}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <Link to="/" className="footer__logo" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <img src="/images/logo-white.png" alt="" className="footer__logo-img" width="40" height="40" />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
                  <span className="footer__logo-text">YMTA</span>
                  <span className="footer__logo-sub">DENTAL CLINIC</span>
                </div>
              </Link>
              <p className="footer__tagline">
                Thoughtful dental care for confident smiles.
              </p>
              {CLINIC.social.instagram.url && (
                <a
                  href={CLINIC.social.instagram.url}
                  className="footer__social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon size={20} />
                </a>
              )}
            </div>

            <div className="footer__links">
              <div className="footer__col">
                <h4 className="footer__col-title">Navigation</h4>
                <nav aria-label="Footer navigation">
                  <a href="/#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
                  <a href="/#services" onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}>Services</a>
                  <a href="/#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}>Gallery</a>
                  <a href="/#reviews" onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}>Reviews</a>
                  <a href="/#faq" onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}>FAQ</a>
                </nav>
              </div>
              <div className="footer__col">
                <h4 className="footer__col-title">Services</h4>
                <nav aria-label="Services links">
                  {SERVICES.slice(0, 4).map((s) => (
                    <Link key={s.id} to={`/appointment?service=${encodeURIComponent(s.id)}`}>
                      {s.title}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="footer__col">
                <h4 className="footer__col-title">Contact</h4>
                <nav aria-label="Contact links">
                  <a href={`tel:${CLINIC.phone.primary}`}>{CLINIC.phone.primaryDisplay}</a>
                  <a href={CLINIC.branch.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Get Directions
                  </a>
                  <Link to="/appointment">Book Appointment</Link>
                </nav>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <p className="footer__copyright">
              © {new Date().getFullYear()} {CLINIC.name}, {CLINIC.branch.name}. All rights reserved.
            </p>
            <p className="footer__other-branches">
              Also in: {CLINIC.otherBranches.join(' · ')}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
