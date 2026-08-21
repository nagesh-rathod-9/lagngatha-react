import { useEffect, useState, useRef, useCallback, KeyboardEvent, TouchEvent } from 'react'
import { Reveal } from './Reveal'
import { assetUrl } from '../../data/siteContent'
import type { Reel } from '../../data/siteContent'

declare global {
    interface Window {
        instgrm?: {
            Embeds: { process: () => void }
        }
    }
}

let instagramScriptPromise: Promise<void> | null = null

function loadInstagramEmbedScript(): Promise<void> {
    if (window.instgrm) return Promise.resolve()
    if (instagramScriptPromise) return instagramScriptPromise
    instagramScriptPromise = new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        script.onload = () => resolve()
        document.body.appendChild(script)
    })
    return instagramScriptPromise
}

function InstagramEmbed({ url }: { url: string }) {
    useEffect(() => {
        loadInstagramEmbedScript().then(() => {
            // Re-scan the DOM so this blockquote (which may have just
            // mounted, or changed permalink on reel switch) gets turned
            // into the real inline player.
            window.instgrm?.Embeds.process()
        })
    }, [url])

    return (
        <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={`${url}?utm_source=ig_embed&utm_campaign=loading`}
            data-instgrm-version="14"
            style={{ margin: 0, width: '100%', minWidth: 'unset', maxWidth: '400px' }}
        />
    )
}

function ReelLightbox({
    items,
    initialIndex,
    onClose,
}: {
    items: { src: string; poster: string; title: string; embedUrl?: string }[]
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
    const touchStartX = useRef<number | null>(null)

    const current = items[index]
    const isEmbed = !!current.embedUrl

    const togglePlay = useCallback(() => {
        if (isEmbed || !videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
    }, [isPlaying, isEmbed])

    const toggleMute = useCallback(() => {
        if (isEmbed || !videoRef.current) return
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
    }, [isMuted, isEmbed])

    const handleVideoTimeUpdate = useCallback(() => {
        if (!videoRef.current) return
        const { currentTime, duration } = videoRef.current
        setCurrentTime(currentTime)
        setProgress(duration ? (currentTime / duration) * 100 : 0)
    }, [])

    const handleVideoLoadedMetadata = useCallback(() => {
        if (!videoRef.current) return
        setDuration(videoRef.current.duration)
        videoRef.current.play().catch(() => {})
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
                togglePlay()
            }
        }
        window.addEventListener('keydown', handler as any)
        return () => window.removeEventListener('keydown', handler as any)
    }, [onClose, goPrev, goNext, togglePlay])

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
        if (!isEmbed && videoRef.current) {
            videoRef.current.load()
            videoRef.current.play().catch(() => {})
            setIsPlaying(true)
            setProgress(0)
            setCurrentTime(0)
        }
    }, [index, isEmbed])

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
                    {isEmbed ? (
                        <div className="lb-embed-wrap">
                            {/* Real Instagram embed — driven by embedUrl (the reel
                                permalink) set in siteContent.ts. Instagram's embed.js
                                turns this blockquote into an inline player with its own
                                play/pause + sound controls; hitting play does NOT
                                navigate away from the site. */}
                            <InstagramEmbed url={current.embedUrl!} />
                        </div>
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
                                <button className="lb-vctrl-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
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

                                <button className="lb-vctrl-btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
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

export function Reels({ reels }: { reels: Reel[] }) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)

    const items = reels.map((r) => ({
        src: assetUrl(r.file),
        poster: assetUrl(r.poster),
        title: `${r.title} \u2014 ${r.sub}`,
        embedUrl: r.embedUrl,
    }))

    const handleOpen = (index: number) => {
        setLightboxIndex(index)
        setLightboxOpen(true)
        document.body.style.overflow = 'hidden'
    }

    const handleClose = () => {
        setLightboxOpen(false)
        document.body.style.overflow = ''
    }

    if (!reels.length) return null

    return (
        <section id="reels" className="section">
            <style>{`
          .reels-strip {
            display: flex;
            gap: 16px;
            overflow-x: auto;
            padding: 4px 4px 12px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
          }
          .reels-strip::-webkit-scrollbar { height: 6px; }
          .reels-strip::-webkit-scrollbar-thumb { background: rgba(185,135,60,.4); border-radius: 4px; }

          .reel-card {
            position: relative;
            flex: 0 0 220px;
            aspect-ratio: 9 / 16;
            border-radius: 14px;
            overflow: hidden;
            cursor: pointer;
            background: #1a1a1a;
            scroll-snap-align: start;
            box-shadow: 0 8px 30px rgba(0,0,0,.12);
            transition: transform .3s ease, box-shadow .3s ease;
          }
          .reel-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 48px rgba(0,0,0,.18);
          }
          .reel-card img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .5s ease;
          }
          .reel-card:hover img {
            transform: scale(1.03);
          }

          .reel-card .play-ico {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 52px;
            height: 52px;
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
          .reel-card .play-ico svg {
            width: 26px;
            height: 26px;
            margin-left: 3px;
          }
          .reel-card:hover .play-ico {
            transform: translate(-50%, -50%) scale(1.08);
            background: rgba(185,135,60,1);
          }

          .reel-card .reel-progress {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            gap: 4px;
            padding: 10px 12px;
            background: linear-gradient(180deg, rgba(0,0,0,.5), transparent);
            pointer-events: none;
          }
          .reel-card .reel-progress span {
            flex: 1;
            height: 3px;
            border-radius: 4px;
            background: rgba(255,255,255,.25);
          }
          .reel-card .reel-progress span:first-child {
            background: rgba(255,255,255,.7);
          }

          .reel-card .reel-badge {
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
          .lb-close svg { width: 22px; height: 22px; }

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
          .lb-arrow svg { width: 22px; height: 22px; }
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

          .lb-video-wrap {
            position: relative;
            width: 100%;
            max-width: 460px;
            aspect-ratio: 9 / 16;
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
            object-fit: cover;
          }

          .lb-embed-wrap {
            position: relative;
            width: 100%;
            max-width: 400px;
            max-height: 85vh;
            overflow-y: auto;
            background: #000;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0,0,0,.5);
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
          .lb-vctrl-btn svg { width: 18px; height: 18px; }

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
          .lb-vprogress-track:hover { height: 6px; }
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
            .reel-card { flex-basis: 160px; }
            .lb-arrow { width: 40px; height: 40px; }
            .lb-arrow svg { width: 18px; height: 18px; }
            .lb-arrow-prev { left: 8px; }
            .lb-arrow-next { right: 8px; }
            .lb-close { top: 12px; right: 12px; width: 38px; height: 38px; }
            .lb-close svg { width: 18px; height: 18px; }
            .lb-counter { top: 14px; font-size: 11px; padding: 2px 12px; }
            .lb-video-controls { padding: 8px 12px 12px; gap: 8px; }
            .lb-vctrl-btn { width: 30px; height: 30px; }
            .lb-vctrl-btn svg { width: 15px; height: 15px; }
            .lb-vtime { font-size: 10px; min-width: 60px; }
            .lb-title { font-size: 13px; margin-top: 10px; max-width: 90%; }
            .lb-content { max-width: 96vw; max-height: 94vh; }
            .lb-media-wrap { height: calc(100% - 50px); }
            .lb-video-wrap { border-radius: 6px; }
            .lb-embed-wrap { border-radius: 6px; max-width: 320px; }
          }

          @media (max-width: 480px) {
            .reel-card { flex-basis: 140px; }
            .lb-arrow { width: 32px; height: 32px; }
            .lb-arrow svg { width: 14px; height: 14px; }
            .lb-arrow-prev { left: 4px; }
            .lb-arrow-next { right: 4px; }
            .lb-video-controls { padding: 6px 8px 10px; gap: 6px; }
            .lb-vctrl-btn { width: 26px; height: 26px; }
            .lb-vctrl-btn svg { width: 13px; height: 13px; }
            .lb-vtime { font-size: 9px; min-width: 52px; }
            .lb-title { font-size: 12px; }
            .lb-embed-wrap { max-width: 260px; }
          }
        `}</style>

            <div className="container-x">
                <Reveal className="section-head">
                    <div>
                        <span className="eyebrow">Motion</span>
                        <h2 className="h2">Stories<br />In Motion</h2>
                        <p className="text-soft" style={{ marginTop: 8, maxWidth: 420 }}>
                            Cinematic reels from real weddings and shoots.
                        </p>
                    </div>
                </Reveal>

                <div className="reels-strip">
                    {reels.map((r, i) => (
                        <div className="reel-card" key={r.title + i} onClick={() => handleOpen(i)}>
                            <img src={assetUrl(r.poster)} alt={r.title} loading="lazy" />

                            <div className="play-ico">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {lightboxOpen && (
                <ReelLightbox items={items} initialIndex={lightboxIndex} onClose={handleClose} />
            )}
        </section>
    )
}