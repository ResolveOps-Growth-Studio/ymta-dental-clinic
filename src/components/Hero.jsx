import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { gsap } from 'gsap';
import { CLINIC, HERO_SCENES } from '../config/clinic';
import { useInView, scrollToSection } from '../utils/hooks';
import './Hero.css';

export default function Hero() {
  const [ref, isVisible] = useInView();
  const heroRef = useRef(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root) return undefined;
    const scenes = gsap.utils.toArray('.hero__scene', root);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set(scenes, { autoAlpha: 0 });
    gsap.set(scenes[0], { autoAlpha: 1 });
    if (reduceMotion || scenes.length < 2) return undefined;

    const timeline = gsap.timeline({ repeat: -1 });
    const sceneDuration = 6;
    const crossfadeDuration = 1.05;
    scenes.forEach((scene, index) => {
      const start = index * sceneDuration;
      const previous = scenes[(index - 1 + scenes.length) % scenes.length];
      if (index > 0) {
        timeline.to(previous, { autoAlpha: 0, duration: crossfadeDuration, ease: 'power2.inOut' }, start);
        timeline.to(scene, { autoAlpha: 1, duration: crossfadeDuration, ease: 'power2.inOut' }, start);
      }
      timeline.fromTo(
        scene.querySelector('img'),
        { scale: 1.02, xPercent: index % 2 === 0 ? -1 : 1 },
        { scale: 1.09, xPercent: index % 2 === 0 ? 1 : -1, duration: sceneDuration + crossfadeDuration, ease: 'none' },
        start
      );
    });
    const finalStart = scenes.length * sceneDuration;
    timeline.to(scenes.at(-1), { autoAlpha: 0, duration: crossfadeDuration }, finalStart);
    timeline.to(scenes[0], { autoAlpha: 1, duration: crossfadeDuration }, finalStart);

    const handleVisibility = () => document.hidden ? timeline.pause() : timeline.resume();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      timeline.kill();
    };
  }, []);

  return (
    <section className="hero" ref={(node) => { ref.current = node; heroRef.current = node; }} aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true">
        {HERO_SCENES.map((scene, index) => (
          <div className="hero__scene" key={scene.id}>
            <img
              src={scene.src}
              alt=""
              width="1920"
              height="1080"
              style={{ objectPosition: scene.position }}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        <div className="hero__media-overlay" />
        <div className="hero__ambient-light" />
      </div>

      <div className="container hero__inner hero__inner--centered">
        <div className={`hero__content ${isVisible ? 'visible' : ''}`}>
          <div className="hero__badge">
            {CLINIC.rating.show && (
              <span className="hero__rating">
                <Star size={14} fill="currentColor" />
                {CLINIC.rating.value} · {CLINIC.rating.reviewCount} reviews
              </span>
            )}
            <span className="hero__location">{CLINIC.branch.name}, {CLINIC.branch.city}</span>
          </div>

          <h1 className="hero__title" id="hero-title">{CLINIC.tagline}</h1>
          <p className="hero__subtitle">{CLINIC.supportingCopy}</p>

          <div className="hero__actions">
            <Link to="/appointment" className="btn btn-primary btn-lg">
              Book an Appointment
              <ArrowRight size={18} />
            </Link>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => scrollToSection('services')}
            >
              Explore Treatments
            </button>
          </div>

          <div className="hero__hours">
            <span className="hero__hours-dot" />
            <span>Mon–Sat: 9 AM – 9 PM · Sun: 9 AM – 2 PM</span>
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
