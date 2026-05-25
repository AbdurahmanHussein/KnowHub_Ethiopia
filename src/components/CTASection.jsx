import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="cta"
      style={{
        padding: '96px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-surface)',
      }}
    >
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1B3A42 0%, #0F2027 40%, #203A43 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(40px, 6vw, 72px) clamp(24px, 4vw, 56px)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(15, 32, 39, 0.25)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.97)',
          transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Decorative orbs */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 103, 46, 0.15) 0%, transparent 70%)',
            animation: 'orbFloat1 10s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(247, 169, 64, 0.1) 0%, transparent 70%)',
            animation: 'orbFloat2 12s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />

          {/* Sparkle icon */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(212, 103, 46, 0.12)',
            marginBottom: 24,
            position: 'relative',
          }}>
            <Sparkles size={28} color="var(--color-accent)" />
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 4vw, 40px)',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 16,
            letterSpacing: '-0.5px',
            position: 'relative',
          }}>
            Ready to Start Your Journey?
          </h2>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 480,
            margin: '0 auto 32px',
            lineHeight: 1.7,
            position: 'relative',
          }}>
            Join thousands of Ethiopian students already using KnowHub to unlock their full potential.
          </p>

          <div style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            position: 'relative',
          }}>
            <button
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
              Launch KnowHub
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            marginTop: 32,
            flexWrap: 'wrap',
            position: 'relative',
          }}>
            {[
              '✓ 100% Free',
              '✓ Works on Telegram',
              '✓ No Registration',
            ].map((badge) => (
              <span
                key={badge}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.45)',
                  fontWeight: 500,
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
