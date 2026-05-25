import { useEffect, useRef, useState } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  FolderOpen,
  Bot,
  Rocket,
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Discover Schools',
    description: 'Browse 45+ Ethiopian schools with detailed info, ratings, and curriculum types to find your perfect match.',
    color: '#1B3A42',
    gradient: 'linear-gradient(135deg, #1B3A42 0%, #2B7A68 100%)',
  },
  {
    icon: Award,
    title: 'Scholarships & Funding',
    description: 'Access 120+ scholarships — from Mastercard Foundation to local grants. Never miss a funding opportunity.',
    color: '#D4672E',
    gradient: 'linear-gradient(135deg, #D4672E 0%, #F7A940 100%)',
  },
  {
    icon: BookOpen,
    title: 'Test Prep Guides',
    description: 'In-depth IELTS, TOEFL, and DET preparation with proven strategies, tips, and practice resources.',
    color: '#2B7A68',
    gradient: 'linear-gradient(135deg, #2B7A68 0%, #3CA88E 100%)',
  },
  {
    icon: FolderOpen,
    title: 'Study Resources',
    description: 'Download PDFs, PowerPoints, articles, and magazines — a complete library for your academic success.',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
  },
  {
    icon: Bot,
    title: 'AI Study Assistant',
    description: 'Get instant answers about schools, scholarships, and study tips with our free AI tutor — available 24/7.',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
  },
  {
    icon: Rocket,
    title: 'Opportunities',
    description: 'Competitions, internships, summer camps, and programs from Google, TechCrewAfrica, and more.',
    color: '#F7A940',
    gradient: 'linear-gradient(135deg, #F7A940 0%, #FBBF24 100%)',
  },
];

function FeatureCard({ feature, index }) {
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
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        background: 'var(--color-card)',
        borderRadius: 'var(--radius-xl)',
        padding: 32,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid var(--color-border)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${index * 0.08}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = `0 20px 50px ${feature.color}18`;
        e.currentTarget.style.borderColor = `${feature.color}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: feature.gradient,
        borderRadius: '24px 24px 0 0',
      }} />

      {/* Icon */}
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-lg)',
        background: feature.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        boxShadow: `0 8px 24px ${feature.color}25`,
        transition: 'all 0.35s ease',
      }}>
        <Icon size={26} color="#fff" strokeWidth={2} />
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        fontWeight: 700,
        color: 'var(--color-dark)',
        marginBottom: 10,
      }}>
        {feature.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        color: 'var(--color-muted)',
        lineHeight: 1.7,
        margin: 0,
      }}>
        {feature.description}
      </p>

      {/* Bottom decorative dot */}
      <div style={{
        position: 'absolute',
        bottom: -40,
        right: -40,
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: `${feature.color}06`,
        pointerEvents: 'none',
      }} />
    </div>
  );
}

export default function FeaturesGrid() {
  return (
    <section
      id="features"
      style={{
        padding: '80px 24px 96px',
        background: 'var(--color-surface)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 56,
        }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: 12,
          }}>
            What We Offer
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            fontWeight: 800,
            color: 'var(--color-dark)',
            marginBottom: 16,
            letterSpacing: '-0.5px',
          }}>
            Everything You Need to{' '}
            <span className="text-gradient">Succeed</span>
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: 'var(--color-muted)',
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            From school discovery to test preparation, KnowHub is your complete educational companion.
          </p>
        </div>

        {/* Features Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
          className="features-grid"
        >
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
