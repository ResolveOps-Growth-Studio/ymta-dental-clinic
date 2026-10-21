import { useEffect, useRef, useState } from 'react';
import './TextReveal.css';

/** Local implementation of the supplied demo API; no unavailable alias or UI dependency. */
export default function TextReveal({ text, as: Tag = 'p', splitBy = 'words', staggerDelay = 0.035, duration = 0.45, once = true, active, className = '' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (active !== undefined) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) observer.disconnect();
      } else if (!once) setInView(false);
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [active, once]);
  const visible = active === undefined ? inView : active;
  let tokenIndex = 0;
  const renderToken = (token) => <span className="text-reveal__token" key={tokenIndex} style={{ '--reveal-delay': `${Math.min(tokenIndex++ * staggerDelay, 0.3)}s` }}>{token}</span>;
  return (
    <Tag ref={ref} className={`text-reveal ${visible ? 'text-reveal--visible' : ''} ${className}`} style={{ '--reveal-duration': `${duration}s` }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text.split(/(\s+)/).map((part, index) => /\s+/.test(part) ? part : <span className="text-reveal__word" key={index}>{splitBy === 'characters' ? Array.from(part).map(renderToken) : renderToken(part)}</span>)}</span>
    </Tag>
  );
}
