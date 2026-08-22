import { Instagram } from 'lucide-react'
import { assetUrl } from '../../data/siteContent'
import type { ContactData } from '../../data/siteContent'

export function Footer({
  logoSrc = 'lagngatha.png',
  contact,
  galleryImages,
}: {
  logoSrc?: string
  contact: ContactData
  galleryImages: string[]
}) {
  return (
    <footer className="site-footer">
      <div className="container-x">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="f-logo">
              <img src={logoSrc} alt="Lagngatha Photo & Films" />
            </div>
            <div className="studio-line">
              Lagngatha Studio — candid wedding stories, cinematic films, and timeless portraits.
            </div>
            <span className="text-sm" style={{ fontSize: '12px' }}>
              Designed By &#10084;{' '}
<a
                href="https://www.instagram.com/nagesh_rathod_9/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-[var(--gold-light)]"
              >
                Nagesh Rathod
                <Instagram className="w-4 h-4" />
              </a>
          </span>
        </div>
        <div>
          <h5>Quick Links</h5>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#packages">Packages</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
          </ul>
        </div>
        <div>
          <h5>Services</h5>
          <ul>
            <li>
              <a href="#">Wedding Photography</a>
            </li>
            <li>
              <a href="#">Cinematic Films</a>
            </li>
            <li>
              <a href="#">Pre Wedding Shoots</a>
            </li>
            <li>
              <a href="#">Portraits</a>
            </li>
            <li>
              <a href="#">Albums &amp; Prints</a>
            </li>
          </ul>
        </div>
        <div className="f-connect">
          <h5>Connect</h5>
          <div className="item">
            <svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none">
              <path d="M4 5h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 14l5 2v4a2 2 0 0 1-2 2C9.6 22 2 14.4 2 7a2 2 0 0 1 2-2Z" />
            </svg>{' '}
            {contact.phone}
          </div>
          <div className="item">
            <svg viewBox="0 0 24 24" strokeWidth={1.6} fill="none">
              <path d="M3 6l9 6 9-6" />
              <rect x="3" y="5" width="18" height="14" rx="2" />
            </svg>{' '}
            {contact.email}
          </div>
        </div>
        <div>
          <h5>Gallery</h5>
          <div className="f-gallery">
            {galleryImages.map((img) => (
              <img key={img} src={assetUrl(img)} alt="Gallery thumbnail" loading="lazy" />
            ))}
          </div>
        </div>
      </div>
      <div
        className="footer-bottom text-center"
        style={{ textAlign: 'center', width: '100%' }}
      >
        <span>
          &copy; {new Date().getFullYear()} Lagngatha Photo &amp; Films. All Rights Reserved.
        </span>
      </div>
    </div>
    </footer >
  )
}