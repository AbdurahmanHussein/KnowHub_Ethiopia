import { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import './index.css';

export default function App() {
  const { isTelegram, user, isReady } = useTelegram();
  const [isInApp, setIsInApp] = useState(false);

  // Automatically enter the app if running inside Telegram Mini App environment
  useEffect(() => {
    if (isReady && isTelegram) {
      setIsInApp(true);
    }
  }, [isReady, isTelegram]);

  if (!isReady) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-secondary)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'var(--gradient-warm)',
            animation: 'pulse 1.5s ease infinite',
          }} />
          <span style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.5px',
          }}>
            Loading KnowHub...
          </span>
        </div>
      </div>
    );
  }

  if (isInApp) {
    return (
      <Dashboard 
        isTelegram={isTelegram} 
        user={user} 
        onBackToLanding={() => setIsInApp(false)} 
      />
    );
  }

  return (
    <LandingPage 
      isTelegram={isTelegram} 
      onEnterApp={() => setIsInApp(true)} 
    />
  );
}
