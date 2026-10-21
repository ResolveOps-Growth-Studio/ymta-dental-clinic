import { Heart, Users, ShieldCheck } from 'lucide-react';
import { useInView } from '../utils/hooks';
import './About.css';

const PILLARS = [
  {
    icon: Heart,
    title: 'Patient-First Care',
    desc: 'We take time to understand your concerns and preferences before recommending any treatment.',
  },
  {
    icon: Users,
    title: 'Clear Communication',
    desc: 'Every procedure is explained in a way that helps you make informed decisions about your dental health.',
  },
  {
    icon: ShieldCheck,
    title: 'Preventive Approach',
    desc: 'We emphasise routine check-ups and early intervention to help maintain your natural teeth.',
  },
];

export default function About() {
  const [ref, isVisible] = useInView();

  return (
    <section id="about" className="about section" ref={ref}>
      <div className="container">
        <div className={`about__grid ${isVisible ? 'visible' : ''}`}>
          <div className="about__visual">
            <div className="about__image-main">
              <img src="/images/clinic_hero.jpg" alt="Modern dental treatment room"
                className="about__image-img" width="1200" height="800" loading="lazy" />
            </div>
            <div className="about__accent-block">
              <span className="about__accent-number">B.K. Pudur</span>
              <span className="about__accent-text">Coimbatore</span>
            </div>
          </div>

          <div className="about__content">
            <span className="section-label">About Us</span>
            <h2 className="about__title">Care that starts with understanding you.</h2>
            <p className="about__desc">
              At YMTA Dental Clinic, we believe good dental care begins with listening.
              Whether you're visiting for a routine check-up or considering a more involved procedure,
              we work with you to understand your needs and create a plan you're comfortable with.
            </p>
            <p className="about__desc">
              Our B.K. Pudur branch in Kuniyamuthur serves families and individuals across Coimbatore
              with a range of dental services — from preventive care and cleaning to implants
              and orthodontics.
            </p>

            <div className="about__pillars">
              {PILLARS.map(({ icon: Icon, title, desc }, i) => (
                <div className="about__pillar" key={title}>
                  <div className="about__pillar-icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="about__pillar-title">{title}</h3>
                    <p className="about__pillar-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
