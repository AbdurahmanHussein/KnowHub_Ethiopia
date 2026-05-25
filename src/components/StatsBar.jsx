import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Trophy, Rocket, Lightbulb } from 'lucide-react';

const stats = [
  { icon: GraduationCap, label: 'Schools', value: 45, suffix: '+', color: '#1B3A42' },
  { icon: Trophy, label: 'Scholarships', value: 120, suffix: '+', color: '#D4672E' },
  { icon: Rocket, label: 'Opportunities', value: 80, suffix: '+', color: '#2B7A68' },
  { icon: Lightbulb, label: 'Free Courses', value: 200, suffix: '+', color: '#F7A940' },
];

function AnimatedCounter({ target, suffix, triggered }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [triggered, target]);

  return <>{count}{suffix}</>;
}

export default function StatsBar() {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
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
      style={{
        position: 'relative',
        marginTop: -48,
        zIndex: 10,
        padding: '0 24px',
      }}
    >
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0,0,0,0.04)',
        padding: '32px 16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
      }}
        className="stats-grid"
      >
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '12px 8px',
                borderRadius: 'var(--radius-lg)',
                transition: 'all 0.35s ease',
                opacity: triggered ? 1 : 0,
                transform: triggered ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${i * 0.1}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 103, 46, 0.06)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: `${stat.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={22} color={stat.color} strokeWidth={2} />
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1,
              }}>
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  triggered={triggered}
                />
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-muted)',
              }}>
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 4px !important;
            padding: 20px 8px !important;
          }
        }
      `}</style>
    </section>
  );
}
