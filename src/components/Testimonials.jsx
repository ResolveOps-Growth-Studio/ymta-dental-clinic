import { Star, Quote } from 'lucide-react';
import { CLINIC, TESTIMONIALS } from '../config/clinic';
import { useInView } from '../utils/hooks';
import './Testimonials.css';

export default function Testimonials() {
  const [ref, isVisible] = useInView();

  return (
    <section id="reviews" className="testimonials section" ref={ref}>
      <div className="container">
        <div className={`testimonials__header ${isVisible ? 'visible' : ''}`}>
          <span className="section-label">Patient Reviews</span>
          <h2 className="section-title">What our patients say.</h2>
          {CLINIC.rating.show && CLINIC.rating.verifiedForLaunch && (
            <div className="testimonials__rating-summary">
              <div className="testimonials__stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={i < Math.floor(CLINIC.rating.value) ? 'currentColor' : 'none'}
                    strokeWidth={i < Math.floor(CLINIC.rating.value) ? 0 : 1.5}
                  />
                ))}
              </div>
              <span className="testimonials__rating-text">
                {CLINIC.rating.value} out of {CLINIC.rating.total} · {CLINIC.rating.reviewCount} reviews on {CLINIC.rating.source}
              </span>
            </div>
          )}
        </div>

        <div className={`testimonials__grid ${isVisible ? 'visible' : ''}`}>
          {TESTIMONIALS.map((review, index) => (
            <div
              className="testimonials__card"
              key={index}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <Quote className="testimonials__quote-icon" size={32} />
              <blockquote className="testimonials__text">
                "{review.text}"
                {review.isExcerpt && <span className="testimonials__excerpt-marker"> (excerpt)</span>}
              </blockquote>
              <div className="testimonials__author">
                <div className="testimonials__avatar">
                  {review.name.charAt(0)}
                </div>
                <span className="testimonials__name">{review.name}</span>
              </div>
            </div>
          ))}
        </div>

        {CLINIC.flags.reviewsLinkVerified && (
          <div className="testimonials__cta">
            <a
              href="#"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Google Reviews
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
