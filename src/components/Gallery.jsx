import { useMemo, useState } from 'react';
import { ImagePlus, Images } from 'lucide-react';
import { BEFORE_AFTER_CASES } from '../config/clinic';
import { useInView } from '../utils/hooks';
import './Gallery.css';

export function ComparisonSlider({ resultCase }) {
  const [position, setPosition] = useState(50);
  const [hasImageError, setHasImageError] = useState(false);

  if (hasImageError) {
    return (
      <div className="results__media-error" role="status">
        This approved case image is temporarily unavailable.
      </div>
    );
  }

  return (
    <figure className="comparison" style={{
      '--comparison-position': `${position}%`,
      '--comparison-image-width': `${10000 / Math.max(position, 1)}%`,
    }}>
      <div className="comparison__media">
        <img src={resultCase.afterImageUrl} alt={resultCase.afterAlt} width="1200" height="800"
          loading="lazy" onError={() => setHasImageError(true)} />
        <div className="comparison__before" aria-hidden="true">
          <img src={resultCase.beforeImageUrl} alt="" width="1200" height="800"
            loading="lazy" onError={() => setHasImageError(true)} />
        </div>
        <span className="comparison__label comparison__label--before">Before</span>
        <span className="comparison__label comparison__label--after">After</span>
        <span className="comparison__divider" aria-hidden="true" />
        <input
          className="comparison__range"
          type="range"
          min="1"
          max="99"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={`Compare before and after images for ${resultCase.treatmentType}`}
        />
      </div>
      <figcaption>
        <strong>{resultCase.treatmentType}</strong>
        <span>{resultCase.approvedDescription}</span>
        {resultCase.clinicalContext && <small>{resultCase.clinicalContext}</small>}
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  const [ref, isVisible] = useInView();
  const [filter, setFilter] = useState('All');
  const categories = useMemo(
    () => ['All', ...new Set(BEFORE_AFTER_CASES.map((item) => item.treatmentType))],
    []
  );
  const visibleCases = BEFORE_AFTER_CASES.filter(
    (item) => item.approved && (filter === 'All' || item.treatmentType === filter)
  );

  return (
    <section id="gallery" className="results section" ref={ref} aria-labelledby="results-title">
      <div className="container">
        <div className={`results__header ${isVisible ? 'is-visible' : ''}`}>
          <span className="section-label">Treatment Results</span>
          <h2 className="section-title" id="results-title">Real results, shared with care.</h2>
          <p className="section-subtitle">
            This gallery is prepared for clinic-approved patient photographs and descriptions.
            Every published case will require documented consent.
          </p>
        </div>

        {categories.length > 2 && (
          <div className="results__filters" aria-label="Filter treatment results">
            {categories.map((category) => (
              <button type="button" key={category}
                className={filter === category ? 'is-active' : ''}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}>
                {category}
              </button>
            ))}
          </div>
        )}

        {visibleCases.length > 0 ? (
          <div className="results__grid">
            {visibleCases.map((resultCase) => (
              <ComparisonSlider key={resultCase.id} resultCase={resultCase} />
            ))}
          </div>
        ) : (
          <div className="results__empty">
            <div className="results__empty-visual" aria-hidden="true">
              <Images size={32} />
              <span />
              <ImagePlus size={32} />
            </div>
            <div>
              <h3>Approved patient cases are being prepared.</h3>
              <p>Authentic before-and-after photographs will appear here after clinical review and patient consent.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
