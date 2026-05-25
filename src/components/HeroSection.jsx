import { useEffect, useRef } from 'react';
import { ArrowRight, Send } from 'lucide-react';

export default function HeroSection({ isTelegram, onEnterApp }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mouse-x', `${x}%`);
      hero.style.setProperty('--mouse-y', `${y}%`);
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--color-secondary)',
      }}
    >
      {/* Animated gradient background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(ellipse at var(--mouse-x, 30%) var(--mouse-y, 40%), rgba(212, 103, 46, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, rgba(43, 122, 104, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #0F2027 0%, #1B3A42 35%, #203A43 65%, #2C5364 100%)
        `,
        transition: 'background 0.3s ease',
      }} />

      {/* Floating orbs */}
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 103, 46, 0.08) 0%, transparent 70%)',
        top: '10%',
        right: '-5%',
        animation: 'orbFloat1 12s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(247, 169, 64, 0.06) 0%, transparent 70%)',
        bottom: '10%',
        left: '-3%',
        animation: 'orbFloat2 15s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(43, 122, 104, 0.08) 0%, transparent 70%)',
        top: '50%',
        left: '60%',
        animation: 'orbFloat1 18s ease-in-out infinite reverse',
        pointerEvents: 'none',
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 800,
        margin: '0 auto',
        padding: '120px 24px 80px',
        textAlign: 'center',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 20px',
          marginBottom: 32,
          animation: 'fadeInDown 0.8s ease forwards',
        }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--color-success-light)',
            animation: 'pulse 2s ease infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.85)',
            letterSpacing: '0.5px',
          }}>
            Empowering Ethiopian Students
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          color: '#fff',
          lineHeight: 1.1,
          marginBottom: 24,
          letterSpacing: '-1.5px',
          animation: 'fadeInUp 0.9s ease 0.15s both',
        }}>
          Your Gateway to{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 50%, var(--color-accent-light) 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'textGradient 4s ease infinite',
          }}>
            Education
          </span>{' '}
          in Ethiopia
        </h1>

        {/* Subheadline */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(16px, 2.2vw, 20px)',
          color: 'rgba(255,255,255,0.65)',
          maxWidth: 560,
          margin: '0 auto 40px',
          lineHeight: 1.7,
          fontWeight: 400,
          animation: 'fadeInUp 0.9s ease 0.3s both',
        }}>
          Discover schools, scholarships, test prep, and opportunities — all in one place. Study smarter, achieve more.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          flexWrap: 'wrap',
          animation: 'fadeInUp 0.9s ease 0.45s both',
        }}>
          <button
            onClick={onEnterApp}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--gradient-warm)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              transition: 'all 0.35s ease',
              boxShadow: '0 8px 32px rgba(212, 103, 46, 0.35)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(212, 103, 46, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(212, 103, 46, 0.35)';
            }}
          >
            Explore Now
            <ArrowRight size={18} />
          </button>

          {!isTelegram && (
            <button
              onClick={() => scrollToSection('#cta')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: 'var(--radius-full)',
                padding: '16px 36px',
                fontSize: 16,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.35s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              }}
            >
              <Send size={16} />
              Open in Telegram
            </button>
          )}
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          animation: 'fadeIn 1s ease 1.2s both',
        }}>
          <span style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            Scroll
          </span>
          <div style={{
            width: 24,
            height: 40,
            borderRadius: 12,
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 8,
          }}>
            <div style={{
              width: 4,
              height: 10,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.4)',
              animation: 'float 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </div>
    </section>
  );
}
