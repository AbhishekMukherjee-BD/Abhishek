"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import ArrowFillButton from "./arrow-fill-button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

export interface CircularGallerySlide {
  id: string | number;
  title: string;
  category?: string;
  description?: string;
  image: string;
  actionText?: string;
  href?: string;
}

export interface CircularImageGalleryProps {
  slides: CircularGallerySlide[];
  defaultIndex?: number;
  autoplay?: boolean;
  interval?: number;
  className?: string;
}

// 16:9 Virtual Geometry Coordinates for high-resolution vector clipping
const SVG_W = 1600;
const SVG_H = 900;
const TAB_R = 28;      // Generous, luxury tactile thumbnail radius (~46px on desktop)
const TAB_GAP = 32;    // Architectural spacing between tabs
const BIG_R = 3600;    // Full canvas span

type SlideRole = "steady" | "incoming" | "outgoing" | "idle";

interface GalleryItemProps {
  id: number;
  total: number;
  slide: CircularGallerySlide;
  role: SlideRole;
  onInPlace: (id: number) => void;
  onTransitionComplete: () => void;
}

/**
 * 1:1 Implementation of Le Thanh's (@minhxthanh) signature circular image reveal.
 * Explicitly roles each slide:
 * - incoming: starts at its thumbnail dot -> rises to center (0.2s power3.inOut) -> sweeps offscreen left (0.4s power4.in).
 * - outgoing: waits 0.6s -> shrinks from offscreen right to center (0.4s power4.out) -> arcs down with rubber-ball bounce physics (1.0s bounce.out).
 * - idle: cleanly hidden at zIndex 0 with 0 opacity so it never blocks or desyncs other slides.
 */
function GalleryImageItem({
  id,
  total,
  slide,
  role,
  onInPlace,
  onTransitionComplete,
}: GalleryItemProps) {
  const circleRef = useRef<SVGCircleElement | null>(null);

  // Position calculations matching the dock coordinates exactly
  const getDockStartX = useCallback(() => {
    const totalDockWidth = total * (TAB_R * 2 + TAB_GAP) - TAB_GAP;
    return SVG_W / 2 - totalDockWidth / 2;
  }, [total]);

  const getPosSmall = useCallback(() => {
    const startX = getDockStartX();
    return {
      cx: startX + id * (TAB_R * 2 + TAB_GAP) + TAB_R,
      cy: SVG_H - 64,
      r: TAB_R,
    };
  }, [id, getDockStartX]);

  const getPosSmallAbove = useCallback(() => {
    const small = getPosSmall();
    return {
      cx: small.cx,
      cy: SVG_H / 2,
      r: TAB_R * 2.5,
    };
  }, [getPosSmall]);

  const getPosCenter = useCallback(() => {
    return {
      cx: SVG_W / 2,
      cy: SVG_H / 2,
      r: TAB_R * 6.5,
    };
  }, []);

  const getPosEnd = useCallback(() => {
    return {
      cx: SVG_W / 2 - BIG_R,
      cy: SVG_H / 2,
      r: BIG_R,
    };
  }, []);

  const getPosStart = useCallback(() => {
    return {
      cx: SVG_W / 2 + BIG_R,
      cy: SVG_H / 2,
      r: BIG_R,
    };
  }, []);

  useEffect(() => {
    if (!circleRef.current) return;
    const el = circleRef.current;
    const transformOrigin = { transformOrigin: "center center" };

    if (role === "steady") {
      gsap.killTweensOf(el);
      gsap.set(el, { ...transformOrigin, ...getPosEnd() });
      return;
    }

    if (role === "idle") {
      gsap.killTweensOf(el);
      gsap.set(el, { ...transformOrigin, ...getPosSmall() });
      return;
    }

    if (role === "incoming") {
      gsap.killTweensOf(el);
      gsap
        .timeline()
        .set(el, { ...transformOrigin, ...getPosSmall() })
        .to(el, {
          ...transformOrigin,
          ...getPosCenter(),
          duration: 0.2,
          ease: "power3.inOut",
        })
        .to(el, {
          ...transformOrigin,
          ...getPosEnd(),
          duration: 0.4,
          ease: "power4.in",
          onComplete: () => {
            onInPlace(id);
          },
        });
      return;
    }

    if (role === "outgoing") {
      gsap.killTweensOf(el);
      gsap
        .timeline()
        .set(el, { ...transformOrigin, ...getPosStart() })
        .to(el, {
          ...transformOrigin,
          ...getPosCenter(),
          delay: 0.6,
          duration: 0.4,
          ease: "power4.out",
        })
        .to(el, {
          ...transformOrigin,
          motionPath: {
            path: [getPosSmallAbove(), getPosSmall()],
            curviness: 1,
          },
          duration: 1.0,
          ease: "bounce.out",
          onComplete: () => {
            onTransitionComplete();
          },
        });
      return;
    }
  }, [
    role,
    id,
    onInPlace,
    onTransitionComplete,
    getPosSmall,
    getPosSmallAbove,
    getPosCenter,
    getPosEnd,
    getPosStart,
  ]);

  const isRect = role === "steady";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full pointer-events-none"
    >
      <defs>
        <clipPath id={`clip_circle_${id}`}>
          <circle ref={circleRef} cx={SVG_W / 2} cy={SVG_H / 2} r={TAB_R} />
        </clipPath>
        <clipPath id={`clip_rect_${id}`}>
          <rect width={SVG_W} height={SVG_H} rx="24" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${isRect ? `clip_rect_${id}` : `clip_circle_${id}`})`}>
        <image
          href={slide.image}
          width={SVG_W}
          height={SVG_H}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </svg>
  );
}

/**
 * Native SVG Circular Tabs Dock
 * Thumbnails are sized generously (radius 28px = 56px virtual diameter),
 * with an expanded invisible 104px hit target so they are instantly clickable on both desktop and mobile.
 */
interface SvgTabsProps {
  slides: CircularGallerySlide[];
  activeIndex: number;
  onSelect: (index: number) => void;
  disabled: boolean;
}

function SvgTabsDock({ slides, activeIndex, onSelect, disabled }: SvgTabsProps) {
  const total = slides.length;
  const totalDockWidth = total * (TAB_R * 2 + TAB_GAP) - TAB_GAP;
  const startX = SVG_W / 2 - totalDockWidth / 2;

  const getPosX = (i: number) => startX + i * (TAB_R * 2 + TAB_GAP) + TAB_R;
  const posY = SVG_H - 64;

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full pointer-events-none z-30"
    >
      {slides.map((slide, i) => {
        const isActive = activeIndex === i;
        const cx = getPosX(i);

        return (
          <g
            key={slide.id}
            className={`pointer-events-auto group/tab ${disabled ? "cursor-default" : "cursor-pointer"}`}
            onClick={() => {
              if (!disabled) onSelect(i);
            }}
          >
            <defs>
              <clipPath id={`tab_thumb_${i}_clip`}>
                <circle cx={cx} cy={posY} r={TAB_R} />
              </clipPath>
            </defs>

            {/* Thumbnail Image inside circle */}
            <image
              x={cx - TAB_R}
              y={posY - TAB_R}
              width={TAB_R * 2}
              height={TAB_R * 2}
              href={slide.image}
              clipPath={`url(#tab_thumb_${i}_clip)`}
              preserveAspectRatio="xMidYMid slice"
              className="pointer-events-none"
            />

            {/* Dark inner rim for crisp photographic contrast */}
            <circle
              cx={cx}
              cy={posY}
              r={TAB_R}
              fill="none"
              stroke="rgba(0, 0, 0, 0.45)"
              strokeWidth="2"
              className="pointer-events-none"
            />

            {/* Active / Inactive Dynamic Ring with Luxury Gold Glow */}
            <circle
              cx={cx}
              cy={posY}
              r={TAB_R + 4.5}
              fill="none"
              stroke={isActive ? "#d4af37" : "rgba(255, 255, 255, 0.4)"}
              strokeWidth={isActive ? "3.2" : "1.8"}
              style={{
                filter: isActive ? "drop-shadow(0 0 10px rgba(212, 175, 55, 0.95))" : "none",
                transition: "stroke 0.3s ease, filter 0.3s ease, stroke-width 0.3s ease",
              }}
            />

            {/* Expanded Invisible Hit Target for Effortless Clickability (104px diameter) */}
            <circle
              cx={cx}
              cy={posY}
              r={TAB_R + 24}
              fill="transparent"
              className="cursor-pointer"
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function CarouselCircularImageGallery({
  slides,
  defaultIndex = 0,
  autoplay = true,
  interval = 4500,
  className = "",
}: CircularImageGalleryProps) {
  const [active, setActive] = useState(defaultIndex);
  const [prevActive, setPrevActive] = useState<number | null>(null);
  const [inPlace, setInPlace] = useState(defaultIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;

  const goToSlide = useCallback(
    (targetIndex: number) => {
      if (isAnimating || targetIndex === active) return;
      setPrevActive(active);
      setActive(targetIndex);
      setIsAnimating(true);
    },
    [isAnimating, active]
  );

  const next = useCallback(() => {
    if (isAnimating) return;
    const target = (active + 1) % total;
    goToSlide(target);
  }, [isAnimating, active, total, goToSlide]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    const target = (active - 1 + total) % total;
    goToSlide(target);
  }, [isAnimating, active, total, goToSlide]);

  const handleInPlace = useCallback((id: number) => {
    setInPlace(id);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setIsAnimating(false);
    setPrevActive(null);
  }, []);

  // Autoplay handler with 4500ms interval matching Le Thanh's original, paused on hover
  useEffect(() => {
    if (!autoplay || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(next, interval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, isHovered, next, interval]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const currentSlide = slides[active];

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[1140px] mx-auto select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── 16:9 Widescreen Luxury Framing Stage ── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[16/9] min-h-[240px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#60c1e5]/20 bg-[#050912] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(160,224,239,0.15)]"
      >
        {/* Layer 0: Image Slides with Synchronized Role-Based GSAP Circular Clip Path Reveal */}
        {slides.map((slide, idx) => {
          let role: SlideRole = "idle";
          let zIndex = 0;

          if (isAnimating) {
            if (idx === active) {
              role = "incoming";
              zIndex = 20; // Blossoms on top of outgoing
            } else if (idx === prevActive) {
              role = "outgoing";
              // Sits beneath incoming while expanding, then pops to 30 to bounce on top
              zIndex = inPlace === active ? 30 : 10;
            } else {
              role = "idle";
              zIndex = 0;
            }
          } else {
            if (idx === active) {
              role = "steady";
              zIndex = 10;
            } else {
              role = "idle";
              zIndex = 0;
            }
          }

          const isVisible = role !== "idle";

          return (
            <div
              key={slide.id}
              className="absolute inset-0 size-full pointer-events-none"
              style={{
                zIndex,
                opacity: isVisible ? 1 : 0,
                visibility: isVisible ? "visible" : "hidden",
              }}
            >
              <GalleryImageItem
                id={idx}
                total={total}
                slide={slide}
                role={role}
                onInPlace={handleInPlace}
                onTransitionComplete={handleTransitionComplete}
              />
            </div>
          );
        })}

        {/* Layer 1: Subtle Vignette & Deep Bottom Gradient for Clean Editorial Legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-15 bg-gradient-to-t from-[#040812]/95 via-[#040812]/35 to-transparent"
        />

        {/* Layer 2: Editorial Meta Overlay (Minimal Top Counter + Bottom Headline & CTA) */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-5 sm:p-8 lg:p-10 pointer-events-none">
          {/* Top Row: Clean Minimal Counter with No Background Box */}
          <div className="flex items-center justify-end w-full">
            <div className="text-xs sm:text-sm font-mono tracking-widest text-white/40 select-none">
              <span className="text-white font-bold">{String(active + 1).padStart(2, "0")}</span>
              <span className="mx-1.5 text-white/20">/</span>
              <span className="text-white/40">{String(total).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Bottom Row: Title, Description & Action CTA with Generous Clearance above Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-8 mt-auto pb-16 sm:pb-20">
            <div className="flex-1 min-w-0 pr-4">
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  textShadow: "0 2px 24px rgba(0,0,0,0.8)",
                }}
              >
                {currentSlide?.title}
              </h3>
              <p
                className="text-xs sm:text-sm text-white/75 line-clamp-2 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {currentSlide?.description}
              </p>
            </div>

            {currentSlide?.href && (
              <div className="shrink-0 pointer-events-auto">
                <ArrowFillButton
                  btnText={currentSlide.actionText || "View Live Site"}
                  href={currentSlide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="gold"
                  size="md"
                  arrowDirection="up-right"
                  className="shadow-[0_8px_24px_rgba(212,175,55,0.35)]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Layer 3: 1:1 Synchronized Native SVG Circular Thumbnail Tabs Dock */}
        <SvgTabsDock
          slides={slides}
          activeIndex={active}
          onSelect={goToSlide}
          disabled={isAnimating}
        />
      </div>

      {/* ── Left Navigation Arrow (Refined Translucent Obsidian Glass) ── */}
      <button
        type="button"
        onClick={prev}
        disabled={isAnimating}
        aria-label="Previous slide"
        className="cursor-pointer absolute left-2 sm:-left-6 lg:-left-7 top-1/2 -translate-y-1/2 z-35 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#050912]/80 hover:bg-[#0a1220] active:scale-95 transition-all duration-300 border border-white/20 hover:border-[#d4af37]/60 text-white hover:text-[#d4af37] shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed group/arrow"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover/arrow:-translate-x-0.5"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* ── Right Navigation Arrow ── */}
      <button
        type="button"
        onClick={next}
        disabled={isAnimating}
        aria-label="Next slide"
        className="cursor-pointer absolute right-2 sm:-right-6 lg:-right-7 top-1/2 -translate-y-1/2 z-35 flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#050912]/80 hover:bg-[#0a1220] active:scale-95 transition-all duration-300 border border-white/20 hover:border-[#d4af37]/60 text-white hover:text-[#d4af37] shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed group/arrow"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover/arrow:translate-x-0.5"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
