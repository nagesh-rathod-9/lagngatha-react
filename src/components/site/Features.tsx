import { Reveal } from './Reveal'
import type { FeatureItem } from '../../data/siteContent'

const ICONS: Record<FeatureItem['icon'], JSX.Element> = {
  candid: (
    <svg viewBox="0 0 24 24" strokeWidth={1.4}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7l1.6-3h4.8L16 7" /><circle cx="12" cy="13.5" r="3.4" /></svg>
  ),
  film: (
    <svg viewBox="0 0 24 24" strokeWidth={1.4}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3z" /></svg>
  ),
  portrait: (
    <svg viewBox="0 0 24 24" strokeWidth={1.4}><path d="M12 3c4.5 0 8 3 8 6.5 0 2-1.4 3-3 3h-1.4c-1 0-1.6.9-1.2 1.8.5 1 .1 2.2-1 2.6-3.6.6-6.4-2.8-6.4-6.9C7 6 9.2 3 12 3z" /><circle cx="9" cy="9" r="1" /><circle cx="14" cy="8" r="1" /><circle cx="9" cy="13" r="1" /></svg>
  ),
  album: (
    <svg viewBox="0 0 24 24" strokeWidth={1.4}><path d="M4 5h16v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" /><path d="M4 5l8 5 8-5" /></svg>
  ),
}

export function Features({ items }: { items: FeatureItem[] }) {
  return (
    <section id="features">
      <div className="container-x">
        <Reveal className="section-head" style={{ marginBottom: 34 }}>
          <div><span className="eyebrow">Why Lagngatha</span><h2 className="h2">Crafted With Care,<br />Every Single Time</h2></div>
        </Reveal>
        <Reveal className="feature-grid">
          {items.map((f) => (
            <div className="feature-item" key={f.title}>
              <div className="ic">{ICONS[f.icon]}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
