import { useEffect, useMemo, useState, useRef, useCallback, KeyboardEvent, TouchEvent } from 'react'
import Masonry from 'react-masonry-css'
import { Reveal } from './Reveal'
import { assetUrl } from '../../data/siteContent'
import type { GalleryCategory, Reel, Orientation } from '../../data/siteContent'

interface Tile {
    cat: string
    orient: Orientation | 'reel'
    src: string
    title: string
    subtitle: string
    isReel: boolean
    videoSrc?: string
}

interface LightboxItem {
    type: 'image' | 'video'
    src: string
    poster?: string
    title: string
}

const FILTERS: { key: string; label: string; isReel?: boolean }[] = [
    { key: 'all', label: 'All' },
    { key: 'wedding', label: 'Wedding' },
    { key: 'prewedding', label: 'Pre Wedding' },
    { key: 'portrait', label: 'Portrait' },
    { key: 'fashion', label: 'Fashion' },
    { key: 'kids', label: 'Kids' },
    { key: 'reels', label: '\u25b6 Reels', isReel: true },
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
    items: LightboxItem[]
    initialIndex: number
    onClose: () => void
}) {
    const [index, setIndex] = useState(initialIndex)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(false)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const touchStartX = useRef<number | null>(null)

    const current = items[index]

    const togglePlay = useCallback(() => {
        if (!videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }, [isPlaying])

    const toggleMute = useCallback(() => {
        if (!videoRef.current) return
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
    }, [isMuted])

    const handleVideoTimeUpdate = useCallback(() => {
        if (!videoRef.current) return
        const { currentTime, duration } = videoRef.current
        setCurrentTime(currentTime)
        setProgress(duration ? (currentTime / duration) * 100 : 0)
    }, [])

    const handleVideoLoadedMetadata = useCallback(() => {
        if (!videoRef.current) return
        setDuration(videoRef.current.duration)
        videoRef.current.play().catch(() => { })
        setIsPlaying(true)
    }, [])

    const handleVideoEnded = useCallback(() => {
        setIsPlaying(false)
        setProgress(0)
        setCurrentTime(0)
        if (videoRef.current) {
            videoRef.current.currentTime = 0
        }
    }, [])

    const handleProgressClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!videoRef.current || !duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            const x = (e.clientX - rect.left) / rect.width
            const newTime = x * duration
            videoRef.current.currentTime = newTime
            setCurrentTime(newTime)
            setProgress((newTime / duration) * 100)
        },
        [duration]
    )

    const goPrev = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setIndex((i) => (i - 1 + items.length) % items.length)
        setIsPlaying(true)
        setTimeout(() => setIsTransitioning(false), 300)
    }, [items.length, isTransitioning])

    const goNext = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setIndex((i) => (i + 1) % items.length)
        setIsPlaying(true)
        setTimeout(() => setIsTransitioning(false), 300)
    }, [items.length, isTransitioning])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'ArrowRight') goNext()
            if (e.key === ' ' || e.key === 'Space') {
                e.preventDefault()
                if (current.type === 'video') togglePlay()
            }
        }
        window.addEventListener('keydown', handler as any)
        return () => window.removeEventListener('keydown', handler as any)
    }, [onClose, goPrev, goNext, togglePlay, current.type])

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

    useEffect(() => {
        if (current.type === 'video' && videoRef.current) {
            videoRef.current.load()
            videoRef.current.play().catch(() => { })
            setIsPlaying(true)
            setProgress(0)
            setCurrentTime(0)
        }
    }, [index, current.type])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return `${m}:${s.toString().padStart(2, '0')}`
    }

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
                    {current.type === 'image' ? (
                        <img src={current.src} alt={current.title} className="lb-image" />
                    ) : (
                        <div className="lb-video-wrap">
                            <video
                                ref={videoRef}
                                src={current.src}
                                poster={current.poster}
                                className="lb-video"
                                onTimeUpdate={handleVideoTimeUpdate}
                                onLoadedMetadata={handleVideoLoadedMetadata}
                                onEnded={handleVideoEnded}
                                playsInline
                                muted={isMuted}
                            />
                            <div className="lb-video-controls">
                                <button
                                    className="lb-vctrl-btn"
                                    onClick={togglePlay}
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? (
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="6" y="4" width="4" height="16" rx="0.5" />
                                            <rect x="14" y="4" width="4" height="16" rx="0.5" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    )}
                                </button>

                                <div className="lb-vprogress" onClick={handleProgressClick}>
                                    <div className="lb-vprogress-track">
                                        <div className="lb-vprogress-fill" style={{ width: `${progress}%` }} />
                                    </div>
                                    <div className="lb-vtime">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                </div>

                                <button
                                    className="lb-vctrl-btn"
                                    onClick={toggleMute}
                                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted ? (
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="lb-title">{current.title}</div>
            </div>
        </div>
    )
}

export function Gallery({ categories, reels }: { categories: GalleryCategory[]; reels: Reel[] }) {
    const [filter, setFilter] = useState('all')
    const [mounted, setMounted] = useState(false)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    const tiles: Tile[] = useMemo(() => {
        const imageTiles = categories.flatMap((cat) =>
            cat.items.map(([orient, file], i) => ({
                cat: cat.key,
                orient,
                src: assetUrl(file),
                title: `${cat.label} Story ${i + 1}`,
                subtitle: cat.label,
                isReel: false,
            }))
        )
        const reelTiles = reels.map((r) => ({
            cat: 'reels',
            orient: 'reel' as const,
            src: assetUrl(r.poster),
            videoSrc: r.file,
            title: `${r.title} \u2014 ${r.sub}`,
            subtitle: r.sub,
            isReel: true,
        }))
        return [...imageTiles, ...reelTiles]
    }, [categories, reels])

    const visible = filter === 'all' ? tiles : tiles.filter((t) => t.cat === filter)

    const lightboxItems: LightboxItem[] = useMemo(
        () =>
            visible.map((t) => ({
                type: t.isReel ? 'video' : 'image',
                src: t.isReel ? assetUrl(t.videoSrc!) : t.src,
                poster: t.isReel ? t.src : undefined,
                title: t.title,
            })),
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
          /* ── masonry grid ── */
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

          /* ── gallery tile ── */
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

          /* ── reel badges ── */
          .gallery-tile.is-reel .play-ico {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(185,135,60,.88);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            transition: transform .3s ease, background .3s ease;
            pointer-events: none;
            box-shadow: 0 4px 20px rgba(185,135,60,.35);
          }
          .gallery-tile.is-reel .play-ico svg {
            width: 28px;
            height: 28px;
            margin-left: 4px;
          }
          .gallery-tile.is-reel:hover .play-ico {
            transform: translate(-50%, -50%) scale(1.08);
            background: rgba(185,135,60,1);
          }
          .gallery-tile.is-reel .reel-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            gap: 4px;
            padding: 8px 12px;
            background: linear-gradient(0deg, rgba(0,0,0,.5), transparent);
            pointer-events: none;
          }
          .gallery-tile.is-reel .reel-progress span {
            flex: 1;
            height: 3px;
            border-radius: 4px;
            background: rgba(255,255,255,.25);
          }
          .gallery-tile.is-reel .reel-progress span:first-child {
            background: rgba(255,255,255,.7);
          }

          .reel-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 4px 12px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 600;
            letter-spacing: .04em;
            text-transform: uppercase;
            background: rgba(185,135,60,.9);
            color: #fff;
            pointer-events: none;
            backdrop-filter: blur(4px);
          }

          /* ── lightbox overlay ── */
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

          .lb-video-wrap {
            position: relative;
            width: 100%;
            max-width: 1000px;
            aspect-ratio: 16 / 9;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,.5);
          }
          .lb-video {
            width: 100%;
            height: 100%;
            display: block;
            background: #000;
          }

          .lb-video-controls {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 18px 14px;
            background: linear-gradient(0deg, rgba(0,0,0,.7) 0%, transparent 100%);
            opacity: 1;
            transition: opacity .3s ease;
          }
          .lb-video-wrap:hover .lb-video-controls {
            opacity: 1;
          }

          .lb-vctrl-btn {
            flex-shrink: 0;
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 50%;
            background: rgba(255,255,255,.08);
            backdrop-filter: blur(4px);
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background .2s ease, transform .2s ease;
          }
          .lb-vctrl-btn:hover {
            background: rgba(255,255,255,.18);
            transform: scale(1.06);
          }
          .lb-vctrl-btn svg {
            width: 18px;
            height: 18px;
          }

          .lb-vprogress {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
          }
          .lb-vprogress-track {
            flex: 1;
            height: 4px;
            border-radius: 4px;
            background: rgba(255,255,255,.2);
            position: relative;
            transition: height .2s ease;
          }
          .lb-vprogress-track:hover {
            height: 6px;
          }
          .lb-vprogress-fill {
            height: 100%;
            border-radius: 4px;
            background: #b8873c;
            transition: width .05s linear;
          }
          .lb-vtime {
            font-size: 12px;
            font-weight: 500;
            color: rgba(255,255,255,.7);
            font-variant-numeric: tabular-nums;
            letter-spacing: .02em;
            flex-shrink: 0;
            min-width: 76px;
            text-align: right;
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
            .lb-video-controls {
              padding: 8px 12px 12px;
              gap: 8px;
            }
            .lb-vctrl-btn {
              width: 30px;
              height: 30px;
            }
            .lb-vctrl-btn svg { width: 15px; height: 15px; }
            .lb-vtime { font-size: 10px; min-width: 60px; }
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
            .lb-video-wrap {
              border-radius: 6px;
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
            .lb-video-controls {
              padding: 6px 8px 10px;
              gap: 6px;
            }
            .lb-vctrl-btn {
              width: 26px;
              height: 26px;
            }
            .lb-vctrl-btn svg { width: 13px; height: 13px; }
            .lb-vtime { font-size: 9px; min-width: 52px; }
            .lb-title { font-size: 12px; }
          }
        `}</style>

            <div className="container-x">
                <Reveal className="section-head">
                    <div>
                        <span className="eyebrow">Our Work</span>
                        <h2 className="h2">Frames Worth<br />Remembering</h2>
                        <p className="text-soft" style={{ marginTop: 8, maxWidth: 420 }}>
                            Portraits, wide candid frames and cinematic reels — all in one story wall.
                        </p>
                    </div>
                    <div className="filters">
                        {FILTERS.map((f) => (
                            <button
                                key={f.key}
                                className={`filter-btn ${f.isReel ? 'is-reel' : ''} ${filter === f.key ? 'active' : ''}`}
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
                                className={`gallery-tile orient-${tile.orient} ${tile.isReel ? 'is-reel' : ''}`}
                                onClick={() => handleOpen(i)}
                            >
                                {tile.isReel ? (
                                    <>
                                        <img src={tile.src} alt={tile.title} loading="lazy" />
                                        <div className="reel-progress">
                                            <span />
                                            <span />
                                            <span />
                                        </div>
                                        <span className="reel-badge">Reel</span>
                                        <div className="play-ico">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </>
                                ) : (
                                    <img src={tile.src} alt={tile.subtitle} loading="lazy" />
                                )}
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