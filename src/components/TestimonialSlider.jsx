import { useState, useEffect, useRef } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Hana Mekonnen',
    role: 'Grade 12 Student, Addis Ababa',
    text: 'KnowHub helped me find a scholarship I never knew existed. I got accepted to the Mastercard Foundation program thanks to the resources here!',
    avatar: 'HM',
    color: '#D4672E',
  },
  {
    name: 'Yonas Tadesse',
    role: 'IELTS Test Taker',
    text: 'The IELTS preparation guides are incredible. I went from a 5.5 to a 7.5 in just 8 weeks using the strategies on KnowHub.',
    avatar: 'YT',
    color: '#2B7A68',
  },
  {
    name: 'Sara Alemayehu',
    role: 'University Freshman',
    text: 'I discovered 3 internship opportunities through KnowHub that weren\'t advertised anywhere else. This platform is a game-changer!',
    avatar: 'SA',
    color: '#F7A940',
  },
  {
    name: 'Dawit Bekele',
    role: 'High School Student, Bahir Dar',
    text: 'The free courses section introduced me to programming. Now I\'m building my own apps. KnowHub opened doors I didn\'t know existed.',
    avatar: 'DB',
    color: '#8B5CF6',
  },
  {
    name: 'Meron Haile',
    role: 'Scholarship Recipient',
    text: 'Finding the right school was overwhelming until I found KnowHub. The comparison tools and ratings made my decision so much easier.',
    avatar: 'MH',
    color: '#EC4899',
  },
];

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);
  const timerRef = useRef(null);

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (index) => {
    clearInterval(timerRef.current);
    setActive(index);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((active + 1) % testimonials.length);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        padding: '96px 24px',
        background: 'var(--color-secondary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 103, 46, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -80,
        left: -80,
        width: 280,
        height: 280,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(43, 122, 104, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
      }}>
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: 48,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease',
        }}>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}>
            Student Stories
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 800,
            color: '#fff',
            marginTop: 12,
            letterSpacing: '-0.5px',
          }}>
            What Students Say
          </h2>
        </div>

        {/* Testimonial Card */}
        <div style={{
          position: 'relative',
          minHeight: 220,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.7s ease 0.2s',
        }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                position: i === active ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                right: 0,
                background: 'rgba(255, 255, 255, 0.06)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-xl)',
                padding: 'clamp(28px, 4vw, 40px)',
                textAlign: 'center',
                opacity: i === active ? 1 : 0,
                transform: i === active ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: i === active ? 'auto' : 'none',
              }}
            >
              <Quote
                size={32}
                color="var(--color-accent)"
                style={{ marginBottom: 16, opacity: 0.6 }}
              />
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(15px, 2vw, 18px)',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.8,
                marginBottom: 24,
                fontStyle: 'italic',
                maxWidth: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}>
                "{t.text}"
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${t.color}, ${t.color}CC)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#fff',
                  boxShadow: `0 4px 16px ${t.color}40`,
                }}>
                  {t.avatar}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 15,
                    color: '#fff',
                    margin: 0,
                  }}>
                    {t.name}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.5)',
                    margin: 0,
                  }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginTop: 32,
        }}>
          <button
            onClick={prev}
            aria-label="Previous testimonial"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
          >
            <ChevronLeft size={18} />
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                style={{
                  width: i === active ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === active
                    ? 'var(--color-accent)'
                    : 'rgba(255,255,255,0.2)',
                  border: 'none',
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next testimonial"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
