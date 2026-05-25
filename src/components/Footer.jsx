import { Sparkles, Send, Heart } from 'lucide-react';

const Instagram = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Explore',
      links: [
        { label: 'Schools', href: '#features' },
        { label: 'Scholarships', href: '#features' },
        { label: 'Opportunities', href: '#features' },
        { label: 'Free Courses', href: '#features' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'IELTS Prep', href: '#testprep' },
        { label: 'TOEFL Guide', href: '#testprep' },
        { label: 'Study Materials', href: '#resources' },
        { label: 'AI Tutor', href: '#features' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#about' },
        { label: 'Contact', href: '#cta' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ],
    },
  ];

  return (
    <footer style={{
      background: '#0C1E24',
      color: 'rgba(255,255,255,0.6)',
      padding: '64px 24px 32px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle top accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'var(--gradient-warm)',
      }} />

      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        {/* Top Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr repeat(3, 1fr)',
            gap: 48,
            marginBottom: 48,
          }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--gradient-warm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Sparkles size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 18,
                  color: '#fff',
                }}>
                  KnowHub
                </span>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 10,
                  color: 'var(--color-accent)',
                  display: 'block',
                  marginTop: -3,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  Ethiopia
                </span>
              </div>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.45)',
              maxWidth: 280,
              marginBottom: 20,
            }}>
              Empowering Ethiopian students with free access to schools, scholarships, test prep, and opportunities.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { Icon: Send, label: 'Telegram' },
                { Icon: Instagram, label: 'Instagram' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 103, 46, 0.15)';
                    e.currentTarget.style.color = 'var(--color-accent)';
                    e.currentTarget.style.borderColor = 'rgba(212, 103, 46, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 16,
                letterSpacing: '0.5px',
              }}>
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 10 }}>
                    <a
                      href={link.href}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.45)',
                        transition: 'color 0.3s ease',
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--color-accent)'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.45)'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.06)',
          marginBottom: 24,
        }} />

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
            margin: 0,
          }}>
            © {currentYear} KnowHub Ethiopia. All rights reserved.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.3)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            Made with <Heart size={12} color="var(--color-primary)" fill="var(--color-primary)" /> for Ethiopian students
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
