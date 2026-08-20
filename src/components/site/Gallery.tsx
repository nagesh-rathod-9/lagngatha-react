import { useEffect, useMemo, useState, useRef, useCallback, KeyboardEvent, TouchEvent } from 'react'
import Masonry from 'react-masonry-css'
import { Reveal } from './Reveal'
import { assetUrl } from '../../data/siteContent'
import type { GalleryCategory, Orientation } from '../../data/siteContent'

interface Tile {
    cat: string
    orient: Orientation
    src: string
    title: string
    subtitle: string
}

const FILTERS: { key: string; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'wedding', label: 'Wedding' },
    { key: 'prewedding', label: 'Pre Wedding' },
    { key: 'engagement', label: 'Engagement' },
    { key: 'baby', label: 'Baby' },
    { key: 'couple', label: 'Couple' },
]

const MASONRY_BREAKPOINTS = {
    default: 4,
    1300: 4,
    992: 3,
    576: 1,
    0: 1,
}

function Lightbox({
    items,
    initialIndex,
    onClose,
}: {
    items: { src: string; title: string }[]
    initialIndex: number
    onClose: () => void
}) {
    const [index, setIndex] = useState(initialIndex)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const touchStartX = useRef<number | null>(null)

    const current = items[index]

    const goPrev = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setIndex((i) => (i - 1 + items.length) % items.length)
        setTimeout(() => setIsTransitioning(false), 300)
    }, [items.length, isTransitioning])

    const goNext = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setIndex((i) => (i + 1) % items.length)
        setTimeout(() => setIsTransitioning(false), 300)
    }, [items.length, isTransitioning])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'ArrowRight') goNext()
        }
        window.addEventListener('keydown', handler as any)
        return () => window.removeEventListener('keydown', handler as any)
    }, [onClose, goPrev, goNext])

    const handleTouchStart = useCallback((e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
    }, [])

    const handleTouchEnd = useCallback(
        (e: TouchEvent) => {
            if (touchStartX.current === null) return
            const diff = touchStartX.current - e.changedTouches[0].clientX
            if (Math.abs(diff) > 50) {
                if (diff > 0) goNext()
                else goPrev()
            }
            touchStartX.current = null
        },
        [goNext, goPrev]
    )

    return (
        <div
            className="lightbox-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            ref={containerRef}
        >
            <button className="lb-close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
            </button>

            <div className="lb-counter">
                {index + 1} / {items.length}
            </div>

            {items.length > 1 && (
                <>
                    <button className="lb-arrow lb-arrow-prev" onClick={goPrev} aria-label="Previous">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="lb-arrow lb-arrow-next" onClick={goNext} aria-label="Next">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </>
            )}

            <div className="lb-content">
                <div className={`lb-media-wrap ${isTransitioning ? 'lb-transition' : ''}`}>
                    <img src={current.src} alt={current.title} className="lb-image" />
                </div>
                <div className="lb-title">{current.title}</div>
            </div>
        </div>
    )
}

export function Gallery({ categories }: { categories: GalleryCategory[] }) {
    const [filter, setFilter] = useState('wedding')
    const [mounted, setMounted] = useState(false)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    const tiles: Tile[] = useMemo(() => {
        return categories.flatMap((cat) =>
            cat.items.map(([orient, file], i) => ({
                cat: cat.key,
                orient,
                src: assetUrl(file),
                title: `${cat.label} Story ${i + 1}`,
                subtitle: cat.label,
            }))
        )
    }, [categories])

    const visible = filter === 'all' ? tiles : tiles.filter((t) => t.cat === filter)

    const lightboxItems = useMemo(
        () => visible.map((t) => ({ src: t.src, title: t.title })),
        [visible]
    )

    const handleOpen = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const handleClose = () => {
        setLightboxOpen(false)
        document.body.style.overflow = ''
    }

    return (
        <section id="gallery" className="section-alt">
            <style>{`
          .masonry-grid {
            display: flex;
            margin-left: -18px;
            width: auto;
            opacity: 0;
            transform: translateY(16px);
            transition: opacity .6s ease, transform .6s ease;
          }
          .masonry-grid.is-mounted {
            opacity: 1;
            transform: translateY(0);
          }
          .masonry-grid-column {
            padding-left: 18px;
            background-clip: padding-box;
          }
          .masonry-grid-column > .masonry-item {
            margin-bottom: 18px;
          }
          @media (max-width: 575px) {
            .masonry-grid-column {
              width: 100% !important;
            }
          }

          .gallery-tile {
            position: relative;
            cursor: pointer;
            overflow: hidden;
            border-radius: 14px;
            background: #1a1a1a;
            box-shadow: 0 8px 30px rgba(0,0,0,.12);
            transition: transform .3s ease, box-shadow .3s ease;
          }
          .gallery-tile:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 48px rgba(0,0,0,.18);
          }
          .gallery-tile img {
            display: block;
            width: 100%;
            height: auto;
            transition: transform .5s ease;
          }
          .gallery-tile:hover img {
            transform: scale(1.03);
          }
          .gallery-tile .overlay {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 18px 18px 16px;
            background: linear-gradient(0deg, rgba(0,0,0,.6) 0%, transparent 70%);
            opacity: 0;
            transition: opacity .35s ease;
            color: #fff;
            pointer-events: none;
          }
          .gallery-tile:hover .overlay {
            opacity: 1;
          }
          .gallery-tile .gt-cat {
            font-size: 11px;
            font-weight: 500;
            letter-spacing: .06em;
            text-transform: uppercase;
            opacity: .75;
          }
          .gallery-tile .gt-title {
            font-size: 15px;
            font-weight: 600;
            margin-top: 2px;
            line-height: 1.3;
          }

          .lightbox-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(0,0,0,.88);
            backdrop-filter: blur(16px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            animation: lbFadeIn .3s ease;
          }
          @keyframes lbFadeIn {
            0% { opacity: 0; backdrop-filter: blur(0); }
            100% { opacity: 1; backdrop-filter: blur(16px); }
          }

          .lb-close {
            position: absolute;
            top: 20px;
            right: 24px;
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,.08);
            backdrop-filter: blur(4px);
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background .25s ease, transform .25s ease;
            z-index: 10;
          }
          .lb-close:hover {
            background: rgba(255,255,255,.18);
            transform: rotate(90deg);
          }
          .lb-close svg {
            width: 22px;
            height: 22px;
          }

          .lb-counter {
            position: absolute;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 13px;
            font-weight: 500;
            color: rgba(255,255,255,.5);
            letter-spacing: .04em;
            font-variant-numeric: tabular-nums;
            z-index: 10;
            background: rgba(0,0,0,.3);
            padding: 4px 16px;
            border-radius: 100px;
            backdrop-filter: blur(4px);
          }

          .lb-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 48px;
            height: 48px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,.06);
            backdrop-filter: blur(4px);
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background .25s ease, transform .25s ease;
            z-index: 10;
          }
          .lb-arrow:hover {
            background: rgba(255,255,255,.14);
            transform: translateY(-50%) scale(1.05);
          }
          .lb-arrow svg {
            width: 22px;
            height: 22px;
          }
          .lb-arrow-prev { left: 24px; }
          .lb-arrow-next { right: 24px; }

          .lb-content {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 90vw;
            max-height: 90vh;
            width: 100%;
            height: 100%;
            justify-content: center;
          }

          .lb-media-wrap {
            position: relative;
            width: 100%;
            height: calc(100% - 60px);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity .3s ease, transform .3s ease;
          }
          .lb-media-wrap.lb-transition {
            opacity: 0;
            transform: scale(.96);
          }

          .lb-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 6px;
            box-shadow: 0 20px 60px rgba(0,0,0,.5);
            user-select: none;
          }

          .lb-title {
            margin-top: 14px;
            font-size: 15px;
            font-weight: 500;
            color: rgba(255,255,255,.7);
            text-align: center;
            letter-spacing: .02em;
            max-width: 80%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          @media (max-width: 768px) {
            .lb-arrow {
              width: 40px;
              height: 40px;
            }
            .lb-arrow svg { width: 18px; height: 18px; }
            .lb-arrow-prev { left: 8px; }
            .lb-arrow-next { right: 8px; }
            .lb-close {
              top: 12px;
              right: 12px;
              width: 38px;
              height: 38px;
            }
            .lb-close svg { width: 18px; height: 18px; }
            .lb-counter {
              top: 14px;
              font-size: 11px;
              padding: 2px 12px;
            }
            .lb-title {
              font-size: 13px;
              margin-top: 10px;
              max-width: 90%;
            }
            .lb-content {
              max-width: 96vw;
              max-height: 94vh;
            }
            .lb-media-wrap {
              height: calc(100% - 50px);
            }
          }

          @media (max-width: 480px) {
            .lb-arrow {
              width: 32px;
              height: 32px;
            }
            .lb-arrow svg { width: 14px; height: 14px; }
            .lb-arrow-prev { left: 4px; }
            .lb-arrow-next { right: 4px; }
            .lb-title { font-size: 12px; }
          }
        `}</style>

            <div className="container-x">
                <Reveal className="section-head">
                    <div>
                        <span className="eyebrow">Our Work</span>
                        <h2 className="h2">Frames Worth<br />Remembering</h2>
                        <p className="text-soft" style={{ marginTop: 8, maxWidth: 420 }}>
                            Portraits, wide candid frames and cinematic stories — all in one story wall.
                        </p>
                    </div>
                    <div className="filters">
                        {FILTERS.map((f) => (
                            <button
                                key={f.key}
                                className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                                onClick={() => setFilter(f.key)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </Reveal>

                <Masonry
                    breakpointCols={MASONRY_BREAKPOINTS}
                    className={`masonry-grid ${mounted ? 'is-mounted' : ''}`}
                    columnClassName="masonry-grid-column"
                >
                    {visible.map((tile, i) => (
                        <div className="masonry-item" key={tile.title + i}>
                            <div
                                className={`gallery-tile orient-${tile.orient}`}
                                onClick={() => handleOpen(i)}
                            >
                                <img src={tile.src} alt={tile.subtitle} loading="lazy" />
                                <div className="overlay">
                                    <span className="gt-cat">{tile.subtitle}</span>
                                    <span className="gt-title">{tile.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>
            </div>

            {lightboxOpen && (
                <Lightbox
                    items={lightboxItems}
                    initialIndex={lightboxIndex}
                    onClose={handleClose}
                />
            )}
        </section>
    )
}