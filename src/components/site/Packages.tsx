import { Reveal } from './Reveal'
import type { PackageTier } from '../../data/siteContent'

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}>
    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function toWhatsappNumber(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '')
  return digits.startsWith('91') ? digits : `91${digits}`
}

function buildPackageMessage(tier: PackageTier) {
  const lines = [
    '✨ *Package Enquiry — LagnaGatha Studio* ✨',
    '',
    `📦 *Package:* ${tier.name}`,
    `💰 *Starting at:* ${tier.price}`,
    '',
    "Hi! I'm interested in this package for my event. Could you share more details?",
    '',
    '_Sent via lagnagatha.com_',
  ]
  return lines.join('\n')
}

export function Packages({ tiers, phone }: { tiers: PackageTier[]; phone: string }) {
  const waNumber = toWhatsappNumber(phone)

  return (
    <section id="packages" className="section-alt">
      <style>{`
        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(${tiers.length}, 1fr);
          gap: 24px;
          align-items: stretch;
        }
        @media (max-width: 768px) {
          .pkg-grid {
            grid-template-columns: 1fr;
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
          }}
        >
          <span className="eyebrow">Packages &amp; Plans</span>
          <h2 className="h2">
            Choose Your Story's
            <br />
            Canvas
          </h2>
          <p className="text-soft" style={{ maxWidth: 520, marginTop: 10 }}>
            Every wedding is different, so is every quote. These plans are starting points — we
            tailor the final package to your events, guest count and city.
          </p>
        </Reveal>

        <Reveal className="pkg-grid">
          {tiers.map((tier) => {
            const waMessage = encodeURIComponent(buildPackageMessage(tier))
            return (
              <div className={`pkg-card ${tier.featured ? 'featured' : ''}`} key={tier.name}>
                {tier.ribbon && <span className="pkg-ribbon">{tier.ribbon}</span>}
                <div className="pkg-name">{tier.name}</div>
                <div className="pkg-tag">{tier.tag}</div>
                <div className="pkg-price">
                  {tier.price.replace(' onwards', '')} <span>onwards</span>
                </div>
                <div className="pkg-divider" />
                <ul className="pkg-list">
                  {tier.items.map((item) => (
                    <li key={item}>
                      {CHECK}
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/${waNumber}?text=${waMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-gold"
                >
                  Enquire Now
                </a>
              </div>
            )
          })}
        </Reveal>

        <Reveal as="p" className="pkg-note">
          Prices are indicative starting rates for Ahmednagar &amp; nearby cities — share your
          event details for a custom quote.
        </Reveal>
      </div>
    </section>
  )
}