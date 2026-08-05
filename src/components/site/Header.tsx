import { useEffect, useState } from 'react'
import { useHeaderScrolled, useActiveSection } from '../../hooks/useScrollState'

const NAV_ITEMS = [
  { href: '#home', label: 'Home' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#packages', label: 'Packages' },
  { href: '#about', label: 'About' },
  { href: '#team', label: 'Team' }, // <--- NEW ITEM ADDED HERE
  { href: '#contact', label: 'Contact' },
]

export function Header({ logoSrc = 'lagngatha.png' }: { logoSrc?: string }) {
  const scrolled = useHeaderScrolled(30)
  const active = useActiveSection(NAV_ITEMS.map((n) => n.href))
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
  }, [drawerOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container-x">
          <div className="nav-wrap">
            <a className="brand" href="#home">
              <img src={logoSrc} alt="Lagngatha Photo & Films" />
            </a>
            <ul className="nav-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a className={active === item.href ? 'active' : ''} href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="nav-cta"><a href="#contact" className="btn-gold">Book Now</a></div>
            <button
              className={`burger ${drawerOpen ? 'open' : ''}`}
              aria-label="Toggle menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span className="bars"><span /><span /><span /></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer-backdrop ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <nav className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
        <ul className="drawer-links">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setDrawerOpen(false)}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>{item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="drawer-foot">
          <a href="#contact" className="btn-gold" onClick={() => setDrawerOpen(false)}>Book Now</a>
          <p>Gangapur, Maharashtra &middot; 96731 11013</p>
        </div>
      </nav>
    </>
  )
}