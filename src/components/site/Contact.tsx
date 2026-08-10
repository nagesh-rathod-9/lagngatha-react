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
              <div className="socials">
                <a href={data.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" /></svg></a>
                <a href={data.facebookUrl} aria-label="Facebook"><svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none"><path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1Z" /></svg></a>
                <a href={data.youtubeUrl} aria-label="YouTube"><svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none"><rect x="2" y="6" width="20" height="12" rx="3" /><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" /></svg></a>
                <a href={data.whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none"><path d="M4 20l1.3-3.9A8 8 0 1 1 8.3 19Z" /></svg></a>
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