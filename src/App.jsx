import { useState, useEffect } from 'react';
import { useTelegram } from './hooks/useTelegram';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import { auth } from './supabase';
import './index.css';

export default function App() {
  const { isTelegram, user, isReady } = useTelegram();
  const [isInApp, setIsInApp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Monitor Supabase Auth state changes for browser users
  // Monitor Supabase Auth state changes for browser users
  useEffect(() => {
    if (!isReady) return;

    if (isTelegram) {
      // Telegram user, auto-load app (defer state updates)
      setTimeout(() => {
        setIsInApp(true);
        setAuthLoading(false);
      }, 0);
      return;
    }

      // Check current session with error handling
      const checkSession = async () => {
        try {
          const { session } = await auth.getSession();
          if (session?.user) {
            setAuthUser(session.user);
          }
        } catch (err) {
          console.warn('Failed to check session:', err);
        } finally {
          setAuthLoading(false);
        }
      };

      checkSession();

      // Listen for session updates with error handling
      let subscription;
      try {
        const { data: { subscription: sub } } = auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            setAuthUser(session.user);
            setIsInApp(true);
            setShowAuth(false);
          } else {
            setAuthUser(null);
            setIsInApp(false);
          }
        });
        subscription = sub;
      } catch (err) {
        console.warn('Failed to subscribe to auth changes:', err);
      }

      return () => subscription?.unsubscribe();
  }, [isReady, isTelegram]);

  if (!isReady || authLoading) {
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

  // If the user has authenticated or is running in Telegram, show the Dashboard (main app)
  if (isInApp) {
    return (
      <Dashboard 
        isTelegram={isTelegram} 
        user={user} 
        onBackToLanding={() => {
          if (!isTelegram) {
            auth.signOut();
          }
          setIsInApp(false);
        }} 
      />
    );
  }

  // If the user wants to sign in/up, show the AuthPage
  if (showAuth) {
    return (
      <AuthPage 
        onAuthSuccess={() => {
          setIsInApp(true);
          setShowAuth(false);
        }}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  // Otherwise, show the LandingPage (Default state for guest/unregistered users)
  return (
    <LandingPage 
      isTelegram={isTelegram} 
      onEnterApp={() => {
        if (authUser || isTelegram) {
          setIsInApp(true);
        } else {
          setShowAuth(true);
        }
      }} 
    />
  );
}
