import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { IMPLANT_JOURNEY, getWhatsAppUrl } from '../config/clinic';
import { useInView } from '../utils/hooks';
import './ImplantSpotlight.css';

export default function ImplantSpotlight() {
  const [ref, isVisible] = useInView({ threshold: 0.12 });
  const whatsappUrl = getWhatsAppUrl('Hello, I would like to enquire about a dental implant consultation at YMTA Dental Clinic.');
  return (
    <section className="implant section" ref={ref} aria-labelledby="implant-title">
      <div className="container">
        <div className={`implant__spotlight ${isVisible ? 'is-visible' : ''}`}>
          <div className="implant__media">
            <img src="/images/service_implants.jpg" alt="Dental implant treatment illustration"
              width="900" height="1100" loading="lazy" />
            <div className="implant__media-note">
              <Check size={16} aria-hidden="true" />
              <span>Personalized after clinical assessment</span>
            </div>
          </div>
          <div className="implant__content">
            <span className="section-label">Implant Care</span>
            <h2 className="section-title" id="implant-title">A considered path to replacing missing teeth.</h2>
            <p className="section-subtitle">
              Dental implants can support a natural-looking restoration. Suitability and the exact
              treatment sequence depend on an individual clinical assessment.
            </p>
            <div className="implant__actions">
              <Link to="/appointment?service=dental-implants" className="btn btn-primary">
                Request an Implant Consultation
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              {whatsappUrl && (
                <a href={whatsappUrl} className="implant__whatsapp" target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
        <ol className={`implant__journey ${isVisible ? 'is-visible' : ''}`} aria-label="Illustrative implant treatment journey">
          {IMPLANT_JOURNEY.map((step, index) => (
            <li className="implant__step" key={step.title}>
              <span className="implant__step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{step.title}</h3><p>{step.description}</p></div>
            </li>
          ))}
        </ol>
        <p className="implant__disclaimer">
          This journey is a general illustration. Your dentist will explain the steps appropriate to your needs.
        </p>
      </div>
    </section>
  );
}
