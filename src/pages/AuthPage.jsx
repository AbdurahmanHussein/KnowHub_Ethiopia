import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { auth } from '../supabase';
import { api } from '../services/api';

export default function AuthPage({ onAuthSuccess, onBack }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name');
        
        const { data, error: signUpErr } = await auth.signUp(email, password, { name });
        if (signUpErr) throw signUpErr;

        if (data?.user) {
          // Create profile in profiles table
          await api.saveProfile(data.user.id, {
            username: email,
            firstName: name || 'Student',
            gradeLevel: 'all',
            preferredSubjects: [],
            language: 'en',
            isAdmin: false
          });
          onAuthSuccess();
        }
      } else {
        const { data, error: signInErr } = await auth.signIn(email, password);
        if (signInErr) throw signInErr;

        if (data?.user) {
          onAuthSuccess();
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: 'var(--color-secondary)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Background radial gradients */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(212, 103, 46, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 80% 70%, rgba(43, 122, 104, 0.15) 0%, transparent 60%),
          linear-gradient(135deg, #0F2027 0%, #1B3A42 50%, #2C5364 100%)
        `,
        zIndex: 1,
      }} />

      {/* Floating Orbs */}
      <div style={{
        position: 'absolute',
        width: 300, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 103, 46, 0.1) 0%, transparent 70%)',
        top: '-10%', right: '-5%',
        animation: 'orbFloat1 15s ease-in-out infinite',
        zIndex: 2,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: 250, height: 250,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(43, 122, 104, 0.08) 0%, transparent 70%)',
        bottom: '-10%', left: '-5%',
        animation: 'orbFloat2 18s ease-in-out infinite',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Auth Card Container */}
      <div 
        className="glass-card animate-scale-in"
        style={{
          width: '100%',
          maxWidth: 420,
          padding: '40px 32px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
        }}
      >
        {/* Back Button */}
        <button 
          onClick={onBack}
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          <ArrowLeft size={18} />
        </button>

        {/* Branding header */}
        <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 12 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            background: 'var(--gradient-warm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: 'var(--shadow-glow-primary)',
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 800,
            color: '#fff',
            marginBottom: 4
          }}>
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)' }}>
            {authMode === 'login' ? 'Sign in to access your student workspace' : 'Join KnowHub Ethiopia today'}
          </p>
        </div>

        {/* Alert Error Box */}
        {error && (
          <div style={{
            background: 'rgba(231, 76, 60, 0.15)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12.5,
            color: '#ff7675'
          }}>
            <AlertCircle size={16} />
            <span style={{ flex: 1 }}>{error}</span>
          </div>
        )}

        {/* Submit Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {authMode === 'signup' && (
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }}>
                <User size={18} />
              </span>
              <input 
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 18px 14px 44px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'all 0.3s ease',
                }}
                className="auth-input-glow"
              />
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }}>
              <Mail size={18} />
            </span>
            <input 
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 18px 14px 44px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              className="auth-input-glow"
            />
          </div>

          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.4)' }}>
              <Lock size={18} />
            </span>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '14px 44px 14px 44px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: 14,
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              className="auth-input-glow"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: 'var(--gradient-warm)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
              boxShadow: 'var(--shadow-glow-primary)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          >
            {loading ? (
              <><Loader size={16} className="animate-rotate" /> Processing...</>
            ) : authMode === 'login' ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', marginTop: 20, marginBottom: 0 }}>
          {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button 
            onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}
            style={{
              background: 'none',
              color: 'var(--color-accent)',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              border: 'none',
              padding: 0,
              marginLeft: 4,
              textDecoration: 'underline'
            }}
          >
            {authMode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>

      {/* Style overrides for inputs in Auth Page */}
      <style>{`
        .auth-input-glow:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 14px rgba(212, 103, 46, 0.25) !important;
          background: rgba(255,255,255,0.08) !important;
        }
      `}</style>
    </div>
  );
}
