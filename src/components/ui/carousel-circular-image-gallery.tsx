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
const TAB_R = 16;
const TAB_GAP = 28;
const BIG_R = 3600; // Large radius that completely spans the 1600x900 canvas

interface GalleryItemProps {
  id: number;
  total: number;
  slide: CircularGallerySlide;
  isOpen: boolean;
  isInPlace: boolean;
  onInPlace: (id: number) => void;
}

/**
 * 1:1 Implementation of Le Thanh's (@minhxthanh) signature circular image reveal.
 * - Expanding slide: Starts at thumbnail dot -> rises to center (0.2s power3.inOut) -> blossoms offscreen left (0.4s power4.in).
 * - Closing slide: Waits 0.6s -> shrinks from offscreen right to center (0.4s power4.out) -> arcs down with bounce physics (1.0s bounce.out).
 */
function GalleryImageItem({
  id,
  total,
  slide,
  isOpen,
  isInPlace,
  onInPlace,
}: GalleryItemProps) {
  const [initial, setInitial] = useState(true);
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
      cy: SVG_H - 58,
      r: TAB_R,
    };
  }, [id, getDockStartX]);

  const getPosSmallAbove = useCallback(() => {
    const small = getPosSmall();
    return {
      cx: small.cx,
      cy: SVG_H / 2,
      r: TAB_R * 2.4,
    };
  }, [getPosSmall]);

  const getPosCenter = useCallback(() => {
    return {
      cx: SVG_W / 2,
      cy: SVG_H / 2,
      r: TAB_R * 7,
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

    const durRise = initial ? 0 : 0.2;
    const durExpand = initial ? 0 : 0.4;
    const durContract = initial ? 0 : 0.4;
    const durBounce = initial ? 0.01 : 1.0;
    const delay = initial ? 0 : 0.6;

    if (isOpen) {
      if (initial) {
        setInitial(false);
        gsap.set(el, { ...transformOrigin, ...getPosEnd() });
        onInPlace(id);
        return;
      }

      gsap
        .timeline()
        .set(el, { ...transformOrigin, ...getPosSmall() })
        .to(el, {
          ...transformOrigin,
          ...getPosCenter(),
          duration: durRise,
          ease: "power3.inOut",
        })
        .to(el, {
          ...transformOrigin,
          ...getPosEnd(),
          duration: durExpand,
          ease: "power4.in",
          onComplete: () => onInPlace(id),
        });
    } else {
      if (initial) {
        setInitial(false);
        gsap.set(el, { ...transformOrigin, ...getPosSmall() });
        return;
      }

      gsap
        .timeline({ overwrite: true })
        .set(el, { ...transformOrigin, ...getPosStart() })
        .to(el, {
          ...transformOrigin,
          ...getPosCenter(),
          delay,
          duration: durContract,
          ease: "power4.out",
        })
        .to(el, {
          ...transformOrigin,
          motionPath: {
            path: [getPosSmallAbove(), getPosSmall()],
            curviness: 1,
          },
          duration: durBounce,
          ease: "bounce.out",
        });
    }
  }, [
    isOpen,
    initial,
    id,
    onInPlace,
    getPosSmall,
    getPosSmallAbove,
    getPosCenter,
    getPosEnd,
    getPosStart,
  ]);

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

      <g clipPath={`url(#${isInPlace ? `clip_rect_${id}` : `clip_circle_${id}`})`}>
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
 * Coordinates align 1:1 with `getPosSmall(id)`, guaranteeing that the contracting circle
 * drops with physical bounce physics directly onto the exact thumbnail badge.
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
  const posY = SVG_H - 58;

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
            className={`pointer-events-auto ${disabled ? "cursor-default" : "cursor-pointer"}`}
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

            {/* Subtle frosted rim around thumbnail */}
            <circle
              cx={cx}
              cy={posY}
              r={TAB_R}
              fill="none"
              stroke="rgba(0, 0, 0, 0.4)"
              strokeWidth="1.5"
              className="pointer-events-none"
            />

            {/* Active / Inactive Dynamic Ring */}
            <circle
              cx={cx}
              cy={posY}
              r={TAB_R + 3.5}
              fill="none"
              stroke={isActive ? "#d4af37" : "rgba(255, 255, 255, 0.45)"}
              strokeWidth={isActive ? "2.5" : "1.5"}
              style={{
                filter: isActive ? "drop-shadow(0 0 8px rgba(212, 175, 55, 0.85))" : "none",
                transition: "stroke 0.3s ease, filter 0.3s ease, stroke-width 0.3s ease",
              }}
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
  const [inPlace, setInPlace] = useState(defaultIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const total = slides.length;

  const next = useCallback(() => {
    if (isAnimating) return;
    setActive((prev) => (prev + 1 >= total ? 0 : prev + 1));
  }, [isAnimating, total]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setActive((prev) => (prev - 1 < 0 ? total - 1 : prev - 1));
  }, [isAnimating, total]);

  const select = useCallback(
    (index: number) => {
      if (isAnimating || index === active) return;
      setActive(index);
    },
    [isAnimating, active]
  );

  const handleInPlace = useCallback((id: number) => {
    setInPlace(id);
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    setIsAnimating(true);
  }, [active]);

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
        {/* Layer 0: Image Slides with GSAP Circular Clip Path Reveal */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="absolute inset-0 size-full"
            style={{
              zIndex: inPlace === idx ? idx : active === idx ? total + 1 : 0,
            }}
          >
            <GalleryImageItem
              id={idx}
              total={total}
              slide={slide}
              isOpen={active === idx}
              isInPlace={inPlace === idx}
              onInPlace={handleInPlace}
            />
          </div>
        ))}

        {/* Layer 1: Subtle Vignette & Deep Bottom Gradient for Clean Editorial Legibility */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-15 bg-gradient-to-t from-[#040812]/95 via-[#040812]/30 to-transparent"
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
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-auto pb-14 sm:pb-16">
            <div className="max-w-xl">
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
              <ArrowFillButton
                btnText={currentSlide.actionText || "View Live Site"}
                href={currentSlide.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="gold"
                size="md"
                arrowDirection="up-right"
                className="pointer-events-auto self-start sm:self-auto shadow-[0_8px_24px_rgba(212,175,55,0.35)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              />
            )}
          </div>
        </div>

        {/* Layer 3: 1:1 Synchronized Native SVG Circular Thumbnail Tabs Dock */}
        <SvgTabsDock
          slides={slides}
          activeIndex={active}
          onSelect={select}
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
