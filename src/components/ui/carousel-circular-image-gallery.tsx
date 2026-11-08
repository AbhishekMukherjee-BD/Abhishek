"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

// 16:9 Virtual Geometry Coordinates
const SVG_W = 1600;
const SVG_H = 900;
const TAB_R = 14;      // thumbnail tab circle radius on SVG canvas
const TAB_GAP = 28;    // gap between tabs
const EXPAND_R = 1250; // max expansion radius (completely blankets 1600x900)

interface GalleryItemProps {
  id: number;
  total: number;
  slide: CircularGallerySlide;
  isOpen: boolean;
  isInPlace: boolean;
  onInPlace: (id: number) => void;
}

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

  // Calculate small thumbnail position along bottom dock
  const getPosSmall = useCallback(() => {
    const totalDockWidth = total * (TAB_R * 2 + TAB_GAP) - TAB_GAP;
    const startX = SVG_W / 2 - totalDockWidth / 2;
    return {
      cx: startX + id * (TAB_R * 2 + TAB_GAP) + TAB_R,
      cy: SVG_H - 52,
      r: TAB_R,
    };
  }, [id, total]);

  const getPosMid = useCallback(() => {
    const small = getPosSmall();
    return {
      cx: small.cx,
      cy: SVG_H / 2,
      r: TAB_R * 2.8,
    };
  }, [getPosSmall]);

  const getPosCenter = useCallback(() => {
    return {
      cx: SVG_W / 2,
      cy: SVG_H / 2,
      r: TAB_R * 8,
    };
  }, []);

  const getPosFull = useCallback(() => {
    return {
      cx: SVG_W / 2,
      cy: SVG_H / 2,
      r: EXPAND_R,
    };
  }, []);

  useEffect(() => {
    if (!circleRef.current) return;
    const el = circleRef.current;
    const small = getPosSmall();
    const mid = getPosMid();
    const center = getPosCenter();
    const full = getPosFull();

    if (initial) {
      setInitial(false);
      if (isOpen) {
        gsap.set(el, full);
        onInPlace(id);
      } else {
        gsap.set(el, small);
      }
      return;
    }

    if (isOpen) {
      // Balloon expansion: start at dock, rise to center, then blossom out to 16:9 full bleed
      const tl = gsap.timeline();
      tl.set(el, small)
        .to(el, {
          ...center,
          duration: 0.28,
          ease: "power2.inOut",
        })
        .to(el, {
          ...full,
          duration: 0.52,
          ease: "power4.out",
          onComplete: () => onInPlace(id),
        });
    } else {
      // Contract away back into the thumbnail dock with a smooth arc
      const tl = gsap.timeline({ overwrite: true });
      tl.to(el, {
        ...center,
        duration: 0.35,
        ease: "power3.in",
      }).to(el, {
        ...small,
        motionPath: {
          path: [mid, small],
          curviness: 1.2,
        },
        duration: 0.55,
        ease: "power2.out",
      });
    }
  }, [isOpen, initial, id, onInPlace, getPosSmall, getPosMid, getPosCenter, getPosFull]);

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
          <circle ref={circleRef} cx="800" cy="450" r={TAB_R} />
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

interface BottomTabsProps {
  slides: CircularGallerySlide[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function BottomTabsDock({ slides, activeIndex, onSelect }: BottomTabsProps) {
  return (
    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3.5 sm:gap-4 px-4 py-2 rounded-full bg-[#0a1220]/75 backdrop-blur-md border border-[#60c1e5]/25 shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
      {slides.map((slide, idx) => {
        const isActive = activeIndex === idx;

        return (
          <button
            key={slide.id}
            type="button"
            onClick={() => onSelect(idx)}
            aria-label={`Show ${slide.title}`}
            className="group/tab relative cursor-pointer outline-none transition-transform duration-200 hover:scale-115 active:scale-95"
          >
            {/* Circular mini thumbnail */}
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden transition-all duration-300 ${
                isActive
                  ? "ring-2 ring-[#d4af37] ring-offset-2 ring-offset-[#070d18] shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                  : "ring-1 ring-white/30 opacity-70 group-hover/tab:opacity-100 group-hover/tab:ring-[#60c1e5]"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="size-full object-cover"
                loading="eager"
              />
            </div>

            {/* Hover Tooltip Title */}
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden sm:group-hover/tab:flex flex-col items-center whitespace-nowrap z-40 opacity-0 group-hover/tab:opacity-100 transition-opacity duration-200">
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#0a1220] text-[#60c1e5] border border-[#60c1e5]/30 shadow-lg">
                {slide.title}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function CarouselCircularImageGallery({
  slides,
  defaultIndex = 0,
  autoplay = true,
  interval = 6000,
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
    setActive((prev) => (prev + 1) % total);
  }, [isAnimating, total]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setActive((prev) => (prev - 1 + total) % total);
  }, [isAnimating, total]);

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

  // When active changes, flag animating state
  useEffect(() => {
    setIsAnimating(true);
  }, [active]);

  // Autoplay handler with pause-on-hover
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
        className="relative w-full aspect-[16/9] min-h-[220px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#60c1e5]/25 bg-[#050912] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(160,224,239,0.2)]"
      >
        {/* Layer 0: Image Slides with GSAP Circular Reveal */}
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="absolute inset-0 size-full"
            style={{
              zIndex: inPlace === idx ? 1 : active === idx ? 10 : 0,
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

        {/* Layer 1: Subtle Vignette & Gradient Shadows for High Readability */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#050912]/90 via-[#050912]/20 to-[#050912]/40"
        />

        {/* Layer 2: Editorial Meta Overlay (Top Category + Bottom Headline & CTA) */}
        <div className="absolute inset-0 z-25 flex flex-col justify-between p-5 sm:p-8 lg:p-10 pointer-events-none">
          {/* Top Row: Category Badge & Slide Counter */}
          <div className="flex items-center justify-between w-full">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#a0e0ef] bg-[#070d18]/85 border border-[#60c1e5]/30 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              {currentSlide?.category || "Flagship Project"}
            </span>

            <span className="text-xs sm:text-sm font-mono font-medium text-white/60 px-2.5 py-1 rounded-md bg-black/40 backdrop-blur-sm">
              {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Bottom Row: Title, Description & Action CTA */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-auto pb-10 sm:pb-8">
            <div className="max-w-xl">
              <h3
                className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mb-2 leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                }}
              >
                {currentSlide?.title}
              </h3>
              <p
                className="text-xs sm:text-sm text-[#caf0f8]/85 line-clamp-2 leading-relaxed"
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

        {/* Layer 3: Circular Thumbnail Tabs Dock */}
        <BottomTabsDock
          slides={slides}
          activeIndex={active}
          onSelect={select}
        />
      </div>

      {/* ── Left Navigation Arrow (Outside 16:9 box on desktop, floating inside on mobile) ── */}
      <button
        type="button"
        onClick={prev}
        disabled={isAnimating}
        aria-label="Previous slide"
        className="cursor-pointer absolute left-2 sm:-left-6 lg:-left-7 top-1/2 -translate-y-1/2 z-35 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0a1220]/80 hover:bg-[#0e1c32] active:scale-90 transition-all duration-300 border border-[#60c1e5]/30 text-white hover:text-[#d4af37] shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md disabled:opacity-40 disabled:cursor-not-allowed group/arrow"
      >
        <svg
          width="20"
          height="20"
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
        className="cursor-pointer absolute right-2 sm:-right-6 lg:-right-7 top-1/2 -translate-y-1/2 z-35 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0a1220]/80 hover:bg-[#0e1c32] active:scale-90 transition-all duration-300 border border-[#60c1e5]/30 text-white hover:text-[#d4af37] shadow-[0_8px_25px_rgba(0,0,0,0.6)] backdrop-blur-md disabled:opacity-40 disabled:cursor-not-allowed group/arrow"
      >
        <svg
          width="20"
          height="20"
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
