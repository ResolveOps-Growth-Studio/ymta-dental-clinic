import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { SERVICES } from '../config/clinic';
import './Services.css';

const LABELS = {
  'dental-implants': ['Dental implants', 'Our primary focus'],
  'root-canal': ['Root canal care', 'Preserve your natural tooth'],
  'braces-aligners': ['Braces & aligners', 'Find your smile alignment'],
  'extractions': ['Tooth extractions', 'Considered, supportive care'],
  'preventive-care': ['Preventive care', 'Everyday oral health'],
  'pediatric-family': ['Family dental care', 'Care for every generation'],
};

export default function Services() {
  const [active, setActive] = useState(0);
  const touch = useRef(null);
  const move = (direction) => setActive((current) => (current + direction + SERVICES.length) % SERVICES.length);
  return (
    <section id="services" className="services section" aria-labelledby="services-heading">
      <div className="container">
        <div className="services__header">
          <h2 id="services-heading" className="section-title">A little care.<br /><em>A whole new smile.</em></h2>
          <div className="services__intro">
            <p>Dental implants are at the heart of what we do. Explore our treatments and find the right care for your smile.</p>
            <a href="#treatment-picker">Explore treatments <ArrowRight size={17} /></a>
          </div>
        </div>
        <div className="services__stage" aria-label="Dental treatments" aria-roledescription="carousel"
          onTouchStart={(event) => { touch.current = event.touches[0].clientX; }}
          onTouchEnd={(event) => { if (touch.current !== null) { const distance = touch.current - event.changedTouches[0].clientX; if (Math.abs(distance) > 50) move(distance > 0 ? 1 : -1); } touch.current = null; }}>
          {SERVICES.map((service, index) => {
            let offset = (index - active + SERVICES.length) % SERVICES.length;
            if (offset > 2) offset -= SERVICES.length;
            const selected = offset === 0;
            const hidden = offset === -3;
            const [title, subtitle] = LABELS[service.id];
            return (
              <article key={service.id} className={`treatment-card ${selected ? 'is-selected' : ''} ${hidden ? 'is-hidden' : ''}`}
                style={{ '--offset': offset, '--distance': Math.abs(offset), '--layer': 5 - Math.abs(offset) }}
                aria-hidden={hidden || undefined} inert={hidden ? true : undefined}>
                <div className="treatment-card__photo">
                  <img src={service.image} alt="" width="720" height="480" loading="lazy" />
                  <Link className="treatment-card__connect" to={`/appointment?service=${service.id}`} aria-label={`Connect to book ${title}`}>
                    <span>Connect</span><ArrowUpRight size={18} />
                  </Link>
                </div>
                <div className="treatment-card__body">
                  <p className="treatment-card__subtitle">{subtitle}</p>
                  <h3>{title}</h3>
                  <p className="treatment-card__description">{service.shortDescription}</p>
                  <Link className="treatment-card__book" to={`/appointment?service=${service.id}`}>Plan your visit <ArrowUpRight size={16} /></Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="services__controls">
          <button type="button" onClick={() => move(-1)} aria-label="Previous treatment"><ArrowLeft size={20} /></button>
          <p aria-live="polite" aria-atomic="true"><strong>{LABELS[SERVICES[active].id][0]}</strong><span>{active + 1} / {SERVICES.length}</span></p>
          <button type="button" onClick={() => move(1)} aria-label="Next treatment"><ArrowRight size={20} /></button>
        </div>
        <div className="services__picker" id="treatment-picker" aria-label="Choose a treatment">
          {SERVICES.map((service, index) => <button type="button" key={service.id} aria-pressed={active === index} onClick={() => setActive(index)}>{LABELS[service.id][0]}</button>)}
        </div>
        <p className="services__note">Not sure where to start? <Link to="/appointment?service=general-consultation">Let’s talk about your smile <ArrowUpRight size={15} /></Link></p>
      </div>
    </section>
  );
}
