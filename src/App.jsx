import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import FloatingContact from './components/FloatingContact';

const AppointmentPage = lazy(() => import('./pages/Appointment'));

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'var(--color-text-muted)',
      fontFamily: 'var(--font-body)',
    }}>
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">Skip to Main Content</a>
      <Header />
      <main id="main-content">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/appointment" element={<AppointmentPage />} />
          </Routes>
        </Suspense>
      </main>
      <FloatingContact />
    </BrowserRouter>
  );
}
