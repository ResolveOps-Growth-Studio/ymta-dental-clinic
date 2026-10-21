import { useEffect, useRef, useState } from 'react';

/**
 * Intersection Observer hook for scroll-triggered animations
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px', ...options }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return [ref, isVisible];
}

/**
 * Returns today's date string in YYYY-MM-DD format (IST)
 */
export function getTodayIST() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

/**
 * Check if a date is Sunday
 */
export function isSunday(dateStr) {
  const date = new Date(dateStr + 'T00:00:00+05:30');
  return date.getDay() === 0;
}

/**
 * Format phone number for tel: link
 */
export function formatPhoneLink(phone) {
  return `tel:${phone.replace(/\s/g, '')}`;
}

/**
 * Smooth scroll to element by ID
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
