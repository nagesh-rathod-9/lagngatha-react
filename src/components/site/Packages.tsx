import { Reveal } from './Reveal'
import type { PackageTier } from '../../data/siteContent'

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth={2}><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

export function Packages({ tiers }: { tiers: PackageTier[] }) {
  return (
    <section id="packages" className="section-alt">
      <div className="container-x">
        <Reveal className="section-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <span className="eyebrow">Packages &amp; Plans</span>
          <h2 className="h2">Choose Your Story's<br />Canvas</h2>
          <p className="text-soft" style={{ maxWidth: 520, marginTop: 10 }}>
            Every wedding is different, so is every quote. These plans are starting points — we tailor the final package to your events, guest count and city.
          </p>
        </Reveal>

        <Reveal className="pkg-grid">
          {tiers.map((tier) => (
            <div className={`pkg-card ${tier.featured ? 'featured' : ''}`} key={tier.name}>
              {tier.ribbon && <span className="pkg-ribbon">{tier.ribbon}</span>}
              <div className="pkg-name">{tier.name}</div>
              <div className="pkg-tag">{tier.tag}</div>
              <div className="pkg-price">{tier.price.replace(' onwards', '')} <span>onwards</span></div>
              <div className="pkg-divider" />
              <ul className="pkg-list">
                {tier.items.map((item) => (
                  <li key={item}>{CHECK}{item}</li>
                ))}
              </ul>
              <a href="#contact" className="btn-outline-gold">Enquire Now</a>
            </div>
          ))}
        </Reveal>

        <Reveal as="p" className="pkg-note">
          Prices are indicative starting rates for Ahmednagar &amp; nearby cities — share your event details for a custom quote.
        </Reveal>
      </div>
    </section>
  )
}
