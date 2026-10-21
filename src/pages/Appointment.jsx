import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar, Clock, Phone, MapPin, ChevronLeft,
  CheckCircle2, AlertCircle, Loader2, ArrowUpRight,
  User, Mail, MessageSquare
} from 'lucide-react';
import { CLINIC, SERVICES } from '../config/clinic';
import { getTodayIST, isSunday } from '../utils/hooks';
import './Appointment.css';

const SERVICE_OPTIONS = [
  { value: '', label: 'Select a treatment...' },
  { value: 'general-consultation', label: 'General Consultation / Not Sure' },
  ...SERVICES.map((s) => ({ value: s.id, label: s.title })),
];

const TIME_WINDOWS_WEEKDAY = [
  { value: 'morning', label: 'Morning (9:00 AM – 2:00 PM)' },
  { value: 'evening', label: 'Evening (4:00 PM – 9:00 PM)' },
];

const TIME_WINDOWS_SUNDAY = [
  { value: 'morning', label: 'Morning (9:00 AM – 2:00 PM)' },
];

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  service: '',
  date: '',
  timeWindow: '',
  patientType: '',
  message: '',
  consent: false,
};

function validateForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Full name is required';
  if (!form.phone.trim()) {
    errors.phone = 'Mobile number is required';
  } else if (!/^[+]?[\d\s-]{10,15}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter a valid mobile number';
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.service) errors.service = 'Please select a treatment';
  if (!form.date) {
    errors.date = 'Preferred date is required';
  } else if (form.date < getTodayIST()) {
    errors.date = 'Date cannot be in the past';
  }
  if (!form.timeWindow) errors.timeWindow = 'Preferred time is required';
  if (!form.consent) errors.consent = 'Please agree to be contacted about this appointment';
  return errors;
}

export default function AppointmentPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const isPreview = !CLINIC.flags.backendConnected;

  // Preselect service from URL
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      const match = SERVICE_OPTIONS.find((o) => o.value === serviceParam);
      if (match) {
        setForm((f) => ({ ...f, service: serviceParam }));
      }
    }
  }, [searchParams]);

  // Scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const timeWindows = useMemo(() => {
    if (form.date && isSunday(form.date)) return TIME_WINDOWS_SUNDAY;
    return TIME_WINDOWS_WEEKDAY;
  }, [form.date]);

  // Reset timeWindow if switching to Sunday and evening was selected
  useEffect(() => {
    if (form.date && isSunday(form.date) && form.timeWindow === 'evening') {
      setForm((f) => ({ ...f, timeWindow: '' }));
    }
  }, [form.date, form.timeWindow]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[field];
        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const fieldErrors = validateForm(form);
    if (fieldErrors[field]) {
      setErrors((e) => ({ ...e, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    setTouched(Object.fromEntries(Object.keys(INITIAL_FORM).map((k) => [k, true])));

    if (Object.keys(validationErrors).length > 0) return;

    // There is no backend connected, always show the preview state
    setStatus('success');
  };

  const showError = (field) => touched[field] && errors[field];

  if (status === 'success') {
    return (
      <div className="appointment-page">
        <div className="container">
          <div className="appointment__success">
            <AlertCircle size={48} className="appointment__success-icon" style={{ color: 'var(--color-text-secondary)' }} />
            <h1 className="appointment__success-title">
              Preview Only
            </h1>
            <div className="appointment__preview-notice">
              <p>
                <strong>Preview only — your appointment request has not been sent.</strong> Once a submission service is connected, your request will be securely transmitted to the clinic.
              </p>
            </div>

            <div className="appointment__success-summary">
              <h3>Request Summary</h3>
              <dl>
                <div><dt>Name</dt><dd>{form.name}</dd></div>
                <div><dt>Phone</dt><dd>{form.phone}</dd></div>
                <div><dt>Treatment</dt><dd>{SERVICE_OPTIONS.find((o) => o.value === form.service)?.label}</dd></div>
                <div><dt>Preferred Date</dt><dd>{new Date(form.date + 'T00:00:00+05:30').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</dd></div>
                <div><dt>Time</dt><dd>{timeWindows.find((w) => w.value === form.timeWindow)?.label}</dd></div>
              </dl>
            </div>

            <p className="appointment__success-note">
              An appointment is confirmed only after our team contacts you.
            </p>

            <div className="appointment__success-actions">
              <a href={`tel:${CLINIC.phone.primary}`} className="btn btn-primary btn-lg">
                <Phone size={18} />
                Call Clinic
              </a>
              <Link to="/" className="btn btn-secondary btn-lg">
                <ChevronLeft size={18} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-page">
      <div className="container">
        <Link to="/" className="appointment__back">
          <ChevronLeft size={18} />
          Back to Home
        </Link>

        <div className="appointment__layout">
          {/* Info panel */}
          <aside className="appointment__info">
            <div className="appointment__info-inner">
              <h1 className="appointment__info-title">Let's plan your visit.</h1>
              <p className="appointment__info-desc">
                Share your preferred appointment details. Our team will contact you
                to confirm availability.
              </p>

              {isPreview && (
                <div className="appointment__preview-badge">
                  <AlertCircle size={16} />
                  Preview Mode — requests are not submitted
                </div>
              )}

              <div className="appointment__info-details">
                <div className="appointment__info-item">
                  <MapPin size={18} />
                  <div>
                    <strong>{CLINIC.branch.name} Branch</strong>
                    <p>{CLINIC.branch.fullAddress}</p>
                    <a
                      href={CLINIC.branch.mapsUrl}
                      className="appointment__info-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>

                <div className="appointment__info-item">
                  <Phone size={18} />
                  <div>
                    <strong>Phone</strong>
                    <a href={`tel:${CLINIC.phone.primary}`} className="appointment__info-phone">
                      {CLINIC.phone.primaryDisplay}
                    </a>
                  </div>
                </div>

                <div className="appointment__info-item">
                  <Clock size={18} />
                  <div>
                    <strong>Hours</strong>
                    <p>{CLINIC.hours.weekday.days}: 9 AM – 2 PM, 4 PM – 9 PM</p>
                    <p>{CLINIC.hours.sunday.days}: 9 AM – 2 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Form panel */}
          <div className="appointment__form-panel">
            <form className="appointment__form" onSubmit={handleSubmit} noValidate>
              <div className="appointment__form-grid">
                {/* Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="apt-name">
                    Full Name <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <User size={16} className="form-input-icon" />
                    <input
                      id="apt-name"
                      name="name"
                      type="text"
                      className={`form-input form-input--icon ${showError('name') ? 'error' : ''}`}
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      autoComplete="name"
                      placeholder="Your full name"
                    />
                  </div>
                  {showError('name') && (
                    <span className="form-error"><AlertCircle size={14} /> {errors.name}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="form-label" htmlFor="apt-phone">
                    Mobile Number <span className="required">*</span>
                  </label>
                  <div className="form-input-wrapper">
                    <Phone size={16} className="form-input-icon" />
                    <input
                      id="apt-phone"
                      name="phone"
                      type="tel"
                      className={`form-input form-input--icon ${showError('phone') ? 'error' : ''}`}
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  {showError('phone') && (
                    <span className="form-error"><AlertCircle size={14} /> {errors.phone}</span>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="form-label" htmlFor="apt-email">
                    Email Address <span className="form-optional">(optional)</span>
                  </label>
                  <div className="form-input-wrapper">
                    <Mail size={16} className="form-input-icon" />
                    <input
                      id="apt-email"
                      name="email"
                      type="email"
                      className={`form-input form-input--icon ${showError('email') ? 'error' : ''}`}
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      autoComplete="email"
                      spellCheck={false}
                      placeholder="you@example.com"
                    />
                  </div>
                  {showError('email') && (
                    <span className="form-error"><AlertCircle size={14} /> {errors.email}</span>
                  )}
                </div>

                {/* Service */}
                <div className="form-group">
                  <label className="form-label" htmlFor="apt-service">
                    Treatment / Service <span className="required">*</span>
                  </label>
                  <select
                    id="apt-service"
                    name="service"
                    className={`form-select ${showError('service') ? 'error' : ''}`}
                    value={form.service}
                    onChange={(e) => handleChange('service', e.target.value)}
                    onBlur={() => handleBlur('service')}
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {showError('service') && (
                    <span className="form-error"><AlertCircle size={14} /> {errors.service}</span>
                  )}
                </div>

                {/* Date */}
                <div className="form-group">
                  <label className="form-label" htmlFor="apt-date">
                    Preferred Date <span className="required">*</span>
                  </label>
                  <input
                    id="apt-date"
                    name="date"
                    type="date"
                    className={`form-input ${showError('date') ? 'error' : ''}`}
                    value={form.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    onBlur={() => handleBlur('date')}
                    min={getTodayIST()}
                  />
                  {form.date && isSunday(form.date) && (
                    <span className="form-hint">Sunday — Morning only (9 AM – 2 PM)</span>
                  )}
                  {showError('date') && (
                    <span className="form-error"><AlertCircle size={14} /> {errors.date}</span>
                  )}
                </div>

                {/* Time window */}
                <div className="form-group">
                  <label className="form-label" htmlFor="apt-time">
                    Preferred Visit Window <span className="required">*</span>
                  </label>
                  <select
                    id="apt-time"
                    name="timeWindow"
                    className={`form-select ${showError('timeWindow') ? 'error' : ''}`}
                    value={form.timeWindow}
                    onChange={(e) => handleChange('timeWindow', e.target.value)}
                    onBlur={() => handleBlur('timeWindow')}
                  >
                    <option value="">Select a time window…</option>
                    {timeWindows.map((w) => (
                      <option key={w.value} value={w.value}>{w.label}</option>
                    ))}
                  </select>
                  {showError('timeWindow') && (
                    <span className="form-error"><AlertCircle size={14} /> {errors.timeWindow}</span>
                  )}
                </div>

                {/* Patient type */}
                <div className="form-group">
                  <label className="form-label" htmlFor="apt-patient-type">
                    Patient Type <span className="form-optional">(optional)</span>
                  </label>
                  <select
                    id="apt-patient-type"
                    name="patientType"
                    className="form-select"
                    value={form.patientType}
                    onChange={(e) => handleChange('patientType', e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="new">New patient</option>
                    <option value="returning">Returning patient</option>
                  </select>
                </div>

                {/* Message */}
                <div className="form-group form-group--full">
                  <label className="form-label" htmlFor="apt-message">
                    Brief Message <span className="form-optional">(optional)</span>
                  </label>
                  <div className="form-input-wrapper">
                    <MessageSquare size={16} className="form-input-icon form-input-icon--textarea" />
                    <textarea
                      id="apt-message"
                      name="message"
                      className="form-textarea form-input--icon"
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      placeholder="Any details you'd like us to know before your visit"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Consent */}
                <div className="form-group form-group--full">
                  <label className={`form-checkbox ${showError('consent') ? 'form-checkbox--error' : ''}`}>
                    <input
                      type="checkbox"
                      name="consent"
                      checked={form.consent}
                      onChange={(e) => handleChange('consent', e.target.checked)}
                      onBlur={() => handleBlur('consent')}
                    />
                    <span className="form-checkbox__check" />
                    <span className="form-checkbox__label">
                      I agree to be contacted about this appointment request.
                    </span>
                  </label>
                  {showError('consent') && (
                    <span className="form-error"><AlertCircle size={14} /> {errors.consent}</span>
                  )}
                </div>
              </div>

              {status === 'error' && (
                <div className="appointment__form-error">
                  <AlertCircle size={18} />
                  <div>
                    <strong>Something went wrong.</strong>
                    <p>Your entered data has been preserved. Please try again or call us directly.</p>
                  </div>
                </div>
              )}

              <div className="appointment__form-actions">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg appointment__submit"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={18} className="appointment__spinner" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Calendar size={18} />
                      {isPreview ? 'Preview Submission' : 'Request Appointment'}
                    </>
                  )}
                </button>
                <a href={`tel:${CLINIC.phone.primary}`} className="btn btn-secondary btn-lg">
                  <Phone size={18} />
                  Call Instead
                </a>
              </div>

              <p className="appointment__form-note">
                Submitting this form sends a request, not a confirmed booking.
                Our team will contact you to confirm your appointment.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
