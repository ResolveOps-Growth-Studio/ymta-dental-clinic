import { useState } from 'react';
import { Plus } from 'lucide-react';
import { FAQ_ITEMS } from '../config/clinic';
import TextReveal from './TextReveal';
import './FAQ.css';

function AccordionItem({ item, isOpen, onToggle, index }) {
  return (
    <div className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}>
      <h3><button type="button" className="faq__trigger" onClick={onToggle} aria-expanded={isOpen} aria-controls={`faq-panel-${index}`} id={`faq-trigger-${index}`}>
        <span className="faq__question">{item.question}</span><span className="faq__indicator"><Plus size={18} aria-hidden="true" /></span>
      </button></h3>
      <div className="faq__panel" id={`faq-panel-${index}`} role="region" aria-labelledby={`faq-trigger-${index}`} aria-hidden={!isOpen} inert={!isOpen}>
        <div className="faq__panel-inner"><TextReveal text={item.answer} active={isOpen} staggerDelay={0.012} duration={0.32} className="faq__answer" /></div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section id="faq" className="faq section" aria-labelledby="faq-heading">
      <div className="container"><div className="faq__inner">
        <div className="faq__header">
          <div id="faq-heading"><TextReveal as="h2" text="Common questions answered." staggerDelay={0.065} duration={0.5} className="section-title" /></div>
          <p className="section-subtitle">Find answers to frequently asked questions about our clinic, treatments, and appointment process.</p>
        </div>
        <div className="faq__list">{FAQ_ITEMS.map((item, index) => <AccordionItem key={item.question} item={item} index={index} isOpen={openIndex === index} onToggle={() => setOpenIndex((current) => current === index ? null : index)} />)}</div>
      </div></div>
    </section>
  );
}
