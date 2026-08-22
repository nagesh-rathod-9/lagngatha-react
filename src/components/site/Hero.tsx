import { Reveal } from './Reveal'
import { assetUrl } from '../../data/siteContent'
import type { HeroData } from '../../data/siteContent'

export function Hero({ data }: { data: HeroData }) {
  return (
    <section className="hero" id="home">
      <div className="container-x">
        <div className="hero-layout">
          <Reveal>
            <span className="kicker font-tillana">{data.kicker}</span>
            <h1>{data.headingLine1} {data.headingLine2}</h1>
            <div className="hero-divider" />
            <p className="lead">&ldquo;{data.lead}&rdquo;</p>

            {/* New line: preferred locations */}
            <div className="hero-locations">
              <span>Sambhajinagar</span>
              <span className="sep">|</span>
              <span>Pune</span>
              <span className="sep">|</span>
              <span>Ahilyanagar</span>
            </div>

            <div className="hero-cta">
              <a href="#contact" className="btn-gold">{data.ctaPrimary}</a>
              <a href="#gallery" className="btn-outline-gold btn-outline-gold-active">{data.ctaSecondary}</a>
            </div>
            <div className="hero-stats">
              {data.stats.map((s) => (
                <div key={s.label}><span className="stat-number">{s.number}</span><span className="stat-label">{s.label}</span></div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="hero-images">
              <svg className="hero-ring" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" stroke="#B9873C" strokeWidth={1.4} strokeDasharray="4 8" />
              </svg>
              {data.images[0] && (
                <div className="hero-img hero-img-1"><img src={assetUrl(data.images[0].src)} alt={data.images[0].alt} loading="eager" /></div>
              )}
              {data.images[1] && (
                <div className="hero-img hero-img-2"><img src={assetUrl(data.images[1].src)} alt={data.images[1].alt} loading="lazy" /></div>
              )}
              {data.images[2] && (
                <div className="hero-img hero-img-3"><img src={assetUrl(data.images[2].src)} alt={data.images[2].alt} loading="lazy" /></div>
              )}
              {data.badges[0] && <div className="badge-gold badge-1">{data.badges[0].top && <b>{data.badges[0].top}</b>}<span>{data.badges[0].bottom}</span></div>}
              {data.badges[1] && <div className="badge-gold badge-2"><span>{data.badges[1].bottom}</span></div>}
              {data.badges[2] && <div className="badge-gold badge-3"><span>{data.badges[2].bottom}</span></div>}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}