import { useEffect, useRef, useState } from 'react';
import { Search, BookOpen, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discover',
    description: 'Browse schools, scholarships, and opportunities tailored for Ethiopian students.',
    color: '#D4672E',
  },
  {
    icon: BookOpen,
    number: '02',
    title: 'Prepare',
    description: 'Access free test prep guides, study materials, and AI-powered tutoring to ace your exams.',
    color: '#2B7A68',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'Achieve',
    description: 'Apply for scholarships, seize opportunities, and take your education to the next level.',
    color: '#F7A940',
  },
];

export default function HowItWorks() {
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
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="how-it-works"
      style={{
        padding: '96px 24px',
        background: 'var(--color-light)',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 64,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Simple Steps
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 800,
            color: 'var(--color-dark)',
            marginTop: 12,
            letterSpacing: '-0.5px',
          }}>
            How KnowHub Works
          </h2>
        </div>

        {/* Steps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 32,
            position: 'relative',
          }}
          className="steps-grid"
        >
          {/* Connecting line (desktop) */}
          <div
            className="steps-line"
            style={{
              position: 'absolute',
              top: 60,
              left: '20%',
              right: '20%',
              height: 2,
              background: 'linear-gradient(90deg, #D4672E, #2B7A68, #F7A940)',
              opacity: 0.2,
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                style={{
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(40px)',
                  transition: `all 0.6s ease ${i * 0.15}s`,
                }}
              >
                {/* Number badge */}
                <div style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginBottom: 24,
                }}>
                  <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    background: `${step.color}0A`,
                    border: `2px solid ${step.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    transition: 'all 0.35s ease',
                  }}>
                    <Icon size={32} color={step.color} strokeWidth={1.8} />
                  </div>
                  <span style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: step.color,
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${step.color}40`,
                  }}>
                    {step.number}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--color-dark)',
                  marginBottom: 10,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--color-muted)',
                  lineHeight: 1.7,
                  maxWidth: 280,
                  margin: '0 auto',
                }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .steps-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .steps-line {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
