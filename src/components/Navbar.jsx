import { useState, useEffect, useRef } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Test Prep', href: '#testprep' },
    { label: 'Resources', href: '#resources' },
    { label: 'About', href: '#about' },
  ];

  const scrollToSection = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-nav)',
          padding: scrolled ? '12px 0' : '20px 0',
          background: scrolled
            ? 'rgba(27, 58, 66, 0.92)'
            : 'rgba(27, 58, 66, 0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
            }}
          >
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'var(--gradient-warm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(212, 103, 46, 0.3)',
            }}>
              <Sparkles size={20} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 20,
                color: '#fff',
                letterSpacing: '-0.3px',
              }}>
                KnowHub
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: 12,
                color: 'var(--color-accent)',
                display: 'block',
                marginTop: -4,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                Ethiopia
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
          }}
            className="nav-desktop"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.8)',
                  transition: 'color 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => scrollToSection('#cta')}
              style={{
                background: 'var(--gradient-warm)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '10px 24px',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: 'var(--font-body)',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(212, 103, 46, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 28px rgba(212, 103, 46, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(212, 103, 46, 0.3)';
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 10,
              padding: 8,
              color: '#fff',
              transition: 'all 0.3s ease',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 32, 39, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      >
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 600,
              color: '#fff',
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
              transition: `all 0.4s ease ${i * 0.08}s`,
            }}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={() => scrollToSection('#cta')}
          style={{
            background: 'var(--gradient-warm)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            padding: '14px 40px',
            fontSize: 18,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            marginTop: 16,
            boxShadow: 'var(--shadow-glow-primary)',
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.4s ease 0.35s',
          }}
        >
          Get Started
        </button>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
