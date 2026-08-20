import { useEffect, useRef, useState } from 'react';
import { Reveal } from './Reveal';
import { assetUrl } from '../../data/siteContent';
import type { FeaturedStory } from '../../data/siteContent';

export function FeaturedCarousel({ items }: { items: FeaturedStory[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveFromScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    let closest = 0;
    let min = Infinity;
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const diff = Math.abs(el.offsetLeft - track.scrollLeft);
      if (diff < min) {
        min = diff;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(updateActiveFromScroll, 100);
    };
    track.addEventListener('scroll', onScroll);
    return () => track.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToIndex = (i: number) => {
    const el = slideRefs.current[i];
    const track = trackRef.current;
    const first = slideRefs.current[0];
    if (!el || !track || !first) return;
    track.scrollTo({
      left: el.offsetLeft - first.offsetLeft,
      behavior: 'smooth',
    });
  };

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const first = slideRefs.current[0];
    if (!track || !first) return;
    const amount = first.getBoundingClientRect().width + 20;
    track.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <section id="featured" style={{ paddingTop: 0 }}>
      <div className="container-x">
        <Reveal className="section-head">
          <div>
            <span className="eyebrow">Recently Told</span>
            <h2 className="h2">Featured Stories</h2>
          </div>
        </Reveal>

        <Reveal className="carousel-wrap">
          <div className="carousel-track" ref={trackRef}>
            {items.map((f, i) => (
              <div
                key={f.title + i}
                className="feature-slide"
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
              >
                {/* Conditional rendering: video or image */}
                {f.video ? (
                  <video
                    src={assetUrl(f.video)}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    className="slide-media"
                  />
                ) : (
                  <img
                    alt={f.title}
                    loading="lazy"
                    className="slide-media"
                  />
                )}
                <div className="fs-info">
                  <div className="fs-tag">{f.tag}</div>
                  <div className="fs-title">{f.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-nav">
            <button
              className="car-btn"
              aria-label="Previous"
              onClick={() => step(-1)}
            >
              <svg viewBox="0 0 24 24" strokeWidth={2} fill="none">
                <path
                  d="M15 6l-6 6 6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              className="car-btn"
              aria-label="Next"
              onClick={() => step(1)}
            >
              <svg viewBox="0 0 24 24" strokeWidth={2} fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="car-dots">
              {items.map((_, i) => (
                <span
                  key={i}
                  className={i === activeIndex ? 'active' : ''}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}