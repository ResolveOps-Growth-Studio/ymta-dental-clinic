import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../config/clinic';
import { useInView } from '../utils/hooks';
import './FAQ.css';

function AccordionItem({ item, isOpen, onToggle, index }) {
  return (
    <div className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}>
      <button
        className="faq__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        id={`faq-trigger-${index}`}
      >
        <span className="faq__question">{item.question}</span>
        <ChevronDown className="faq__chevron" size={20} />
      </button>
      <div
        className="faq__panel"
        id={`faq-panel-${index}`}
        role="region"
        aria-labelledby={`faq-trigger-${index}`}
      >
        <p className="faq__answer">{item.answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [ref, isVisible] = useInView();

  return (
    <section id="faq" className="faq section" ref={ref}>
      <div className="container">
        <div className={`faq__inner ${isVisible ? 'visible' : ''}`}>
          <div className="faq__header">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Common questions answered.</h2>
            <p className="section-subtitle">
              Find answers to frequently asked questions about our clinic,
              treatments, and appointment process.
            </p>
          </div>

          <div className="faq__list" role="list">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                index={index}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
