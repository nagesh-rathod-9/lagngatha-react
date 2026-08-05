import { Reveal } from './Reveal'
import { assetUrl } from '../../data/siteContent'
import type { AboutData } from '../../data/siteContent'

export function About({ data }: { data: AboutData }) {
  return (
    <section className="about" id="about">
      <div className="container-x">
        <div className="about-layout">
          <Reveal>
            <div className="about-visual">
              {data.images[0] && <img className="a1" src={assetUrl(data.images[0].src)} alt={data.images[0].alt} loading="lazy" />}
              {data.images[1] && <img className="a2" src={assetUrl(data.images[1].src)} alt={data.images[1].alt} loading="lazy" />}
            </div>
          </Reveal>
          <Reveal>
            <span className="eyebrow">About Us</span>
            <h2 className="h2">The Studio Behind<br />the Stories</h2>
            <p className="text-soft" style={{ marginTop: 14 }}>
              {data.intro}
            </p>
            <div className="quote-strip"><p>&ldquo;{data.quote}&rdquo;</p></div>
            <div className="about-stats">
              {data.stats.map((s) => (
                <div key={s.label}><span className="stat-number">{s.number}</span><span className="stat-label">{s.label}</span></div>
              ))}
            </div>
            <a href="#team" className="btn-gold" style={{ marginTop: 28, display: 'inline-flex' }}>{data.cta}</a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
