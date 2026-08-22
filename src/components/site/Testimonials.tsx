import { Reveal } from './Reveal'

interface Testimonial {
  name: string
  instagramHandle?: string
  instagramUrl?: string
  rating: number
  shootType: string
  review: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Abhi Tormad',
    instagramHandle: 'abhi_tormad_patil',
    instagramUrl: 'https://www.instagram.com/abhi_tormad_patil/',
    rating: 4.9,
    shootType: 'Traditional Royal Shetkari Outdoor Shoot',
    review:
      'लग्नगाथा स्टुडिओने आमचं आउटडोअर शूट अगदी ट्रॅडिशनल आणि रॉयल शेतकरी स्टाईलमध्ये अप्रतिम कॅप्चर केलं. प्रत्येक फोटोत आमच्या मातीतल्या मुळांचा अभिमान दिसतो. टीमचं काम आणि क्रिएटिव्हिटी खरंच कौतुकास्पद आहे!',
  },
  {
    name: 'Adesh Bhawar',
    instagramHandle: 'ades_hbhawar',
    instagramUrl: 'https://www.instagram.com/ades_hbhawar/',
    rating: 5.0,
    shootType: 'Wedding & Outdoor Shoot',
    review:
      'आमचं लग्न आणि आता अलीकडचं आउटडोअर शूट दोन्ही लग्नगाथा स्टुडिओनेच केलं. दोन्ही वेळा त्यांनी क्षण अगदी नैसर्गिक आणि सुंदर पद्धतीने टिपले. फोटो बघून पुन्हा तेच दिवस जगल्यासारखं वाटतं!',
  },
  {
    name: 'Sanket Sumb',
    rating: 4.9,
    shootType: 'Pre-Wedding & Wedding Shoot',
    review:
      'प्री-वेडिंग शूटपासून ते लग्नाच्या दिवसापर्यंत, लग्नगाथा टीमने प्रत्येक क्षण मनापासून कॅप्चर केला. त्यांची कँडिड स्टाईल आणि प्रोफेशनल अ‍ॅप्रोच खूप आवडली. अल्बम बघून डोळे भरून येतात!',
  },
  {
    name: 'Shrihari Maharaj Devle',
    instagramHandle: 'shrihari_mharaj_devle',
    instagramUrl: 'https://www.instagram.com/shrihari_mharaj_devle/',
    rating: 4.9,
    shootType: 'Wedding Shoot',
    review:
      'आमच्या लग्नाचं शूट लग्नगाथा स्टुडिओने केलं आणि प्रत्येक क्षण त्यांनी खूप सुंदर पद्धतीने टिपला. टीमचा नम्रपणा आणि व्यावसायिकता खरंच वाखाणण्याजोगी आहे. मनापासून धन्यवाद!',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// Maroon-gold gradient star rating — fills each star left-to-right based
// on the numeric rating (supports halves/decimals, e.g. 4.9).
function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ display: 'flex', gap: 1.5 }}>
        {Array.from({ length: 5 }).map((_, i) => {
          const fillAmount = Math.max(0, Math.min(1, rating - i))
          const gradId = `star-grad-${i}-${rating}`
          return (
            <svg key={i} width={12} height={12} viewBox="0 0 24 24">
              <defs>
                <linearGradient id={gradId}>
                  <stop offset={`${fillAmount * 100}%`} stopColor="#b8863f" />
                  <stop offset={`${fillAmount * 100}%`} stopColor="rgba(0,0,0,0.12)" />
                </linearGradient>
              </defs>
              <path
                d="M12 2.5l2.9 6.4 6.9.7-5.2 4.7 1.5 6.9L12 17.9l-6.1 3.3 1.5-6.9-5.2-4.7 6.9-.7L12 2.5Z"
                fill={`url(#${gradId})`}
              />
            </svg>
          )
        })}
      </div>
      <span style={{ fontSize: 11.5, color: '#8c2438', fontWeight: 700 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

export function Testimonials() {
  return (
    // Explicit backgroundColor is a safety-net fallback so this section
    // is always readable regardless of which global class it inherits —
    // matches the cream tone used in your "Why Lagngatha" section.
    // Remove the inline background if your `.section` class already
    // sets the correct one for this slot in the page.
    <section id="testimonials" className="section" style={{ backgroundColor: '#FBF4EC' }}>
      {/* Card grid + styling kept inline in the TSX (no separate CSS
          file). Desktop: single row of 4. Tablet: 2 per row.
          Mobile: 1 per row. */}
      <style>{`
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 18px;
        }
        @media (max-width: 1100px) {
          .testi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 620px) {
          .testi-grid {
            grid-template-columns: 1fr;
          }
        }
        .testi-card {
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 14px;
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 4px 16px rgba(60, 20, 20, 0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .testi-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(60, 20, 20, 0.09);
        }
        .testi-quote-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(140, 36, 56, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8c2438;
          flex-shrink: 0;
        }
        .testi-shoot-tag {
          display: inline-block;
          font-size: 9.5px;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          font-weight: 700;
          color: #8c2438;
          background: rgba(140, 36, 56, 0.07);
          border: 1px solid rgba(140, 36, 56, 0.22);
          padding: 3px 8px;
          border-radius: 999px;
          width: fit-content;
        }
        .testi-review {
          font-size: 12.8px;
          line-height: 1.6;
          color: #4a3d3d;
          margin: 0;
        }
        .testi-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px solid rgba(0, 0, 0, 0.07);
        }
        .testi-person {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }
        .testi-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8c2438, #5a1826);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          flex-shrink: 0;
        }
        .testi-name-row {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .testi-name {
          font-weight: 700;
          color: #241a1a;
          font-size: 12.5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .testi-handle {
          font-size: 11px;
          color: rgba(36, 26, 26, 0.5);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .testi-handle:hover {
          color: #8c2438;
        }
        @media (max-width: 380px) {
          .testi-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>

      <div className="container-x">
        <Reveal
          className="section-head"
          style={{
            justifyContent: 'center',
            textAlign: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          <span className="eyebrow">Testimonials</span>
          <h2 className="h2">What Our Clients Say</h2>
          <p className="text-soft" style={{ maxWidth: 520, marginTop: 10 }}>
            Real experiences from couples and families we've had the joy of shooting.
          </p>
        </Reveal>

        <Reveal className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testi-card" key={t.name}>
              <div className="testi-quote-circle">
                <svg width={16} height={12} viewBox="0 0 44 32" fill="currentColor">
                  <path d="M0 32V19.7C0 8.4 6.6 1.3 17.8 0l1.9 4.9C12.4 6.6 8.8 10.6 8.4 16.4H18V32H0Zm26 0V19.7C26 8.4 32.6 1.3 43.8 0l1.9 4.9c-7.3 1.7-10.9 5.7-11.3 11.5H44V32H26Z" />
                </svg>
              </div>

              <span className="testi-shoot-tag">{t.shootType}</span>

              <p className="testi-review">{t.review}</p>

              <div className="testi-footer">
                <div className="testi-person">
                  <div className="testi-avatar">{initials(t.name)}</div>
                  <div className="testi-name-row">
                    <span className="testi-name">{t.name}</span>
                    {t.instagramUrl ? (
                      <a
                        href={t.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="testi-handle"
                      >
                        @{t.instagramHandle}
                      </a>
                    ) : (
                      <span className="testi-handle">Verified Client</span>
                    )}
                  </div>
                </div>
                <StarRating rating={t.rating} />
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}