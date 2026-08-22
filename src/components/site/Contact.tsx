import { useState } from 'react'
import type { FormEvent } from 'react'
import { Reveal } from './Reveal'
import type { ContactData } from '../../data/siteContent'

const SERVICES = ['Wedding Photography', 'Pre-Wedding Shoot', 'Portrait Session', 'Fashion Shoot', 'Children Photography', 'Cinematic Film']

// Strips spaces/dashes and ensures the number has India's country code for wa.me
function toWhatsappNumber(phone: string) {
  const digits = phone.replace(/[^0-9]/g, '')
  return digits.startsWith('91') ? digits : `91${digits}`
}

function buildWhatsappMessage(payload: Record<string, string>) {
  const lines = [
    '✨ *New Enquiry — LagnaGatha Studio* ✨',
    '',
    `👤 *Name:* ${payload.name}`,
    `📞 *Phone:* ${payload.phone}`,
    `🎯 *Service:* ${payload.service}`,
  ]

  if (payload.eventDetails) {
    lines.push(`📅 *Event:* ${payload.eventDetails}`)
  }

  if (payload.message) {
    lines.push('', '📝 *Their story:*', payload.message)
  }

  lines.push('', '_Sent via lagnagatha.com contact form_')

  return lines.join('\n')
}

// Proper branded social icons, each with their real platform color and a
// recognizable glyph, styled as a circular button (background + white icon)
// instead of the generic thin outline icons used before. All inline —
// no separate CSS file, per project convention.
const SOCIAL_ICON_SIZE = 40

const socialIconWrapStyle = (background: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: SOCIAL_ICON_SIZE,
  height: SOCIAL_ICON_SIZE,
  borderRadius: '50%',
  background,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
})

function InstagramIcon() {
  return (
    <span
      style={socialIconWrapStyle(
        'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
      )}
    >
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="#fff" strokeWidth={1.8} />
        <circle cx="12" cy="12" r="4.2" stroke="#fff" strokeWidth={1.8} />
        <circle cx="17.4" cy="6.6" r="1.15" fill="#fff" />
      </svg>
    </span>
  )
}

function FacebookIcon() {
  return (
    <span style={socialIconWrapStyle('#1877F2')}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <path
          d="M14.5 8.5H16.5V5.3C16.16 5.25 15 5.15 13.65 5.15C10.82 5.15 8.9 6.89 8.9 10.06V12.75H5.75V16.3H8.9V22H12.55V16.3H15.58L16.06 12.75H12.55V10.42C12.55 9.39 12.83 8.5 14.5 8.5Z"
          fill="#fff"
        />
      </svg>
    </span>
  )
}

function YoutubeIcon() {
  return (
    <span style={socialIconWrapStyle('#FF0000')}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <rect x="2.5" y="6.5" width="19" height="11" rx="3.2" fill="none" stroke="#fff" strokeWidth={1.6} />
        <path d="M10.2 9.6L15 12L10.2 14.4V9.6Z" fill="#fff" />
      </svg>
    </span>
  )
}

function WhatsappIcon() {
  return (
    <span style={socialIconWrapStyle('#25D366')}>
      <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3.5A8.5 8.5 0 0 0 4.6 16.4L3.5 20.5l4.2-1.1A8.5 8.5 0 1 0 12 3.5Z"
          stroke="#fff"
          strokeWidth={1.6}
        />
        <path
          d="M9 9.4c0-.5.4-1 .9-1h.6c.3 0 .5.15.6.4l.6 1.5c.1.25.05.5-.1.7l-.5.55c-.1.1-.1.25-.05.4.4.9 1.15 1.65 2.05 2.05.15.05.3.05.4-.05l.55-.5c.2-.15.45-.2.7-.1l1.5.6c.25.1.4.35.4.6v.6c0 .5-.45.9-.95.9-3.4 0-6.7-3.3-6.7-6.7Z"
          fill="#fff"
        />
      </svg>
    </span>
  )
}

export function Contact({ data, onSubmit }: { data: ContactData; onSubmit?: (payload: Record<string, string>) => void }) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries()) as Record<string, string>

    onSubmit?.(payload)

    const waNumber = toWhatsappNumber(data.phone)
    const waMessage = encodeURIComponent(buildWhatsappMessage(payload))
    window.open(`https://wa.me/${waNumber}?text=${waMessage}`, '_blank', 'noopener,noreferrer')

    setSubmitted(true)
    e.currentTarget.reset()
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact">
      <div className="container-x">
        <Reveal className="section-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
          <span className="eyebrow">Get In Touch</span>
          <h2 className="h2">Let's Write the<br />Next Chapter</h2>
          <p className="text-soft" style={{ maxWidth: 460, marginTop: 10 }}>
            Share your date and city and we'll get back to you within a day — no obligation, just a conversation.
          </p>
        </Reveal>

        <Reveal className="contact-card">
          <div className="contact-panel">
            <div className="contact-info">
              <div className="item">
                <div className="ic2"><svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none"><path d="M4 5h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 14l5 2v4a2 2 0 0 1-2 2C9.6 22 2 14.4 2 7a2 2 0 0 1 2-2Z" /></svg></div>
                <div><span className="label">Call / WhatsApp</span><span className="value">{data.phone}</span></div>
              </div>
              <div className="item">
                <div className="ic2"><svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none"><path d="M3 6l9 6 9-6" /><rect x="3" y="5" width="18" height="14" rx="2" /></svg></div>
                <div><span className="label">Email</span><span className="value">{data.email}</span></div>
              </div>
              <div className="item">
                <div className="ic2"><svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none"><path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" /><circle cx="12" cy="10" r="2.4" /></svg></div>
                <div><span className="label">Studio</span><span className="value">{data.city}</span></div>
              </div>
              <div className="socials" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <a
                  href={data.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  style={{ display: 'inline-flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <InstagramIcon />
                </a>
                <a
                  href={data.facebookUrl}
                  aria-label="Facebook"
                  style={{ display: 'inline-flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <FacebookIcon />
                </a>
                <a
                  href={data.youtubeUrl}
                  aria-label="YouTube"
                  style={{ display: 'inline-flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <YoutubeIcon />
                </a>
                <a
                  href={data.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  style={{ display: 'inline-flex' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <WhatsappIcon />
                </a>
              </div>
            </div>
            <div className="map-frame">
              <iframe
                src={data.mapEmbedUrl}
                width="600" height="450" style={{ border: 0 }}
                allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
                title="Studio location"
              />
            </div>
          </div>

          <div className="form-panel">
            <div className="panel-title">Tell us about your day</div>
            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field"><label>Your Name</label><input name="name" type="text" required placeholder="Full name" /></div>
                <div className="field"><label>Phone / WhatsApp</label><input name="phone" type="tel" required placeholder="+91" /></div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Service You Need</label>
                  <select name="service" defaultValue={SERVICES[0]}>
                    {SERVICES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field"><label>Event Date &amp; City</label><input name="eventDetails" type="text" placeholder="e.g. 14 Dec, Ahmednagar" /></div>
              </div>
              <div className="field"><label>Tell Us About Your Day</label><textarea name="message" rows={3} placeholder="A few lines about your story..." /></div>
              <button type="submit" className="btn-gold form-submit">{submitted ? 'Thanks — Sent!' : 'Send Message'}</button>
              <p className="form-note">We usually reply within 24 hours.</p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}