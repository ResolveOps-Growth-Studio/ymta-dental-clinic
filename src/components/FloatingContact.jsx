import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CLINIC, getWhatsAppUrl } from '../config/clinic';
import './FloatingContact.css';

const DEFAULT_MESSAGE = 'Hello, I would like to enquire about a dental implant consultation at YMTA Dental Clinic.';

function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" width="27" height="27" aria-hidden="true"><path fill="currentColor" d="M12.04 2a9.84 9.84 0 0 0-8.46 14.86L2 22l5.28-1.54A9.91 9.91 0 1 0 12.04 2Zm0 17.8a7.8 7.8 0 0 1-3.98-1.09l-.29-.17-3.13.91.94-3.05-.19-.31a7.73 7.73 0 1 1 6.65 3.71Zm4.28-5.83c-.23-.12-1.38-.68-1.59-.76-.21-.08-.36-.12-.52.12-.15.23-.59.76-.73.92-.13.15-.27.17-.5.06-.23-.12-.98-.36-1.86-1.15a6.97 6.97 0 0 1-1.29-1.61c-.13-.23-.01-.36.1-.47.11-.1.23-.27.35-.4.12-.14.15-.23.23-.39.08-.15.04-.29-.02-.4-.06-.12-.52-1.25-.71-1.71-.19-.45-.38-.39-.52-.4h-.44c-.15 0-.4.06-.61.29-.21.23-.81.79-.81 1.94 0 1.14.83 2.25.95 2.4.12.15 1.64 2.5 3.96 3.5.55.24.99.38 1.32.49.56.18 1.06.15 1.46.09.45-.07 1.38-.57 1.57-1.11.2-.55.2-1.02.14-1.11-.06-.1-.21-.15-.44-.27Z" /></svg>;
}

export default function FloatingContact() {
  const [showHint, setShowHint] = useState(false);
  const [paused, setPaused] = useState(false);
  const whatsappUrl = getWhatsAppUrl(DEFAULT_MESSAGE);
  useEffect(() => {
    // A single, dismissible invitation; the subtle icon cue continues afterwards.
    const appear = setTimeout(() => setShowHint(true), 1600);
    const disappear = setTimeout(() => setShowHint(false), 10000);
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      clearTimeout(appear);
      clearTimeout(disappear);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <aside className={`social-dock ${paused ? 'social-dock--paused' : ''}`} aria-label="Connect with YMTA">
      <a className="floating-contact floating-contact--instagram" href={CLINIC.social.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Visit YMTA on Instagram">
        <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg><span className="floating-contact__label">Instagram</span>
      </a>
      {whatsappUrl && <div className="whatsapp-contact">
        {showHint && <div className="whatsapp-invitation">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><strong>Questions about your smile?</strong><span>Let’s chat on WhatsApp <span aria-hidden="true">→</span></span></a>
          <button type="button" onClick={() => setShowHint(false)} aria-label="Dismiss WhatsApp invitation"><X size={14} /></button>
        </div>}
        <a className="floating-contact floating-contact--whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Enquire on WhatsApp">
          <WhatsAppIcon /><span className="floating-contact__label">WhatsApp us</span>
        </a>
      </div>}
    </aside>
  );
}
