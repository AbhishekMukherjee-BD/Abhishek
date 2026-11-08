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
const TAB_R = 32;       // Scaled virtual dock radius
const TAB_GAP = 36;     // Proportional dock gap
const FULL_R = 2400;    // Expands 1500px past every edge of 1600x900 canvas, eliminating any black bar

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
 * - incoming: starts at its thumbnail dot -> rises to center (0.2s power3.inOut) -> blossoms full-bleed with photographic zoom (0.4s power4.in).
 * - outgoing: waits 0.6s -> shrinks from full-bleed to center (0.35s power4.out) -> arcs down with rubber-ball bounce physics (1.0s bounce.out).
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
  const imageRef = useRef<SVGImageElement | null>(null);

  // Position calculations matching the dock coordinates exactly
  const getDockStartX = useCallback(() => {
    const totalDockWidth = total * (TAB_R * 2 + TAB_GAP) - TAB_GAP;
    return SVG_W / 2 - totalDockWidth / 2;
  }, [total]);

  const getPosSmall = useCallback(() => {
    const startX = getDockStartX();
    return {
      cx: startX + id * (TAB_R * 2 + TAB_GAP) + TAB_R,
      cy: SVG_H - 76,
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
      r: 180,
    };
  }, []);

  const getPosFull = useCallback(() => {
    return {
      cx: SVG_W / 2,
      cy: SVG_H / 2,
      r: FULL_R,
    };
  }, []);

  useEffect(() => {
    if (!circleRef.current) return;
    const el = circleRef.current;
    const img = imageRef.current;
    const transformOrigin = { transformOrigin: "center center" };

    if (role === "steady") {
      gsap.killTweensOf(el);
      if (img) gsap.killTweensOf(img);
      gsap.set(el, { ...transformOrigin, ...getPosFull() });
      if (img) gsap.set(img, { scale: 1, transformOrigin: "center center" });
      return;
    }

    if (role === "idle") {
      gsap.killTweensOf(el);
      if (img) gsap.killTweensOf(img);
      gsap.set(el, { ...transformOrigin, ...getPosSmall() });
      if (img) gsap.set(img, { scale: 1, transformOrigin: "center center" });
      return;
    }

    if (role === "incoming") {
      gsap.killTweensOf(el);
      if (img) gsap.killTweensOf(img);

      // Silky zoom effect: photo breathes in from 1.08x to 1.0x as the circle blossoms
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.08, transformOrigin: "center center" },
          { scale: 1.0, duration: 0.75, ease: "power2.out" }
        );
      }

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
          ...getPosFull(),
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
      if (img) gsap.killTweensOf(img);

      gsap
        .timeline()
        .set(el, { ...transformOrigin, ...getPosFull() })
        .to(el, {
          ...transformOrigin,
          ...getPosCenter(),
          delay: 0.6,
          duration: 0.35,
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
    getPosFull,
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
      </defs>

      <g clipPath={isRect ? undefined : `url(#clip_circle_${id})`}>
        <image
          ref={imageRef}
          href={slide.image}
          width={SVG_W}
          height={SVG_H}
          preserveAspectRatio="xMidYMid slice"
          className="size-full object-cover"
        />
      </g>
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
      {/* ── Responsive Luxury Framing Stage (Strict 16:9 Aspect Ratio on ALL Devices) ── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#60c1e5]/20 bg-[#050912] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(160,224,239,0.15)]"
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

        {/* Layer 1: Subtle Vignette & Natural Contrast Overlay (No Fake Black Bars) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-15 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        />

        {/* Layer 2: Editorial Meta Overlay (Minimal Top Counter + Bottom Headline & CTA) */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-6 lg:p-8 pointer-events-none">
          {/* Top Row: Clean Minimal Counter with No Background Box */}
          <div className="flex items-center justify-end w-full">
            <div className="text-[10px] sm:text-xs md:text-sm font-mono tracking-widest text-white/50 select-none">
              <span className="text-white font-bold">{String(active + 1).padStart(2, "0")}</span>
              <span className="mx-1.5 text-white/20">/</span>
              <span className="text-white/40">{String(total).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Bottom Row: Title, Description & Action CTA with Generous Clearance above Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-6 mt-auto pb-8 sm:pb-14 md:pb-18">
            <div className="flex-1 min-w-0 pr-1 sm:pr-4">
              <h3
                className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-0.5 sm:mb-1.5 leading-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  textShadow: "0 2px 20px rgba(0,0,0,0.9)",
                }}
              >
                {currentSlide?.title}
              </h3>
              <p
                className="text-[11px] sm:text-xs md:text-sm text-white/80 line-clamp-1 sm:line-clamp-2 leading-relaxed max-w-xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {currentSlide?.description}
              </p>
            </div>

            {currentSlide?.href && (
              <div className="shrink-0 pointer-events-auto self-start sm:self-auto">
                <ArrowFillButton
                  btnText={currentSlide.actionText || "View Live Site"}
                  href={currentSlide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="gold"
                  size="sm"
                  arrowDirection="up-right"
                  className="shadow-[0_8px_24px_rgba(212,175,55,0.35)] text-xs sm:text-sm"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Layer 3: Tactile & High-Contrast Responsive HTML Thumbnail Dock */}
        <div className="absolute bottom-1.5 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-3 md:gap-4 select-none pointer-events-auto">
          {slides.map((slide, i) => {
            const isActive = active === i;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(i)}
                disabled={isAnimating}
                aria-label={`Switch to ${slide.title}`}
                className="group/tab relative p-0.5 min-w-[32px] min-h-[32px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center cursor-pointer outline-none transition-transform duration-300 active:scale-90 disabled:cursor-default"
              >
                <div
                  className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full overflow-hidden transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-[#d4af37] ring-offset-1 sm:ring-offset-2 ring-offset-[#070d18] shadow-[0_0_18px_rgba(212,175,55,0.85)] scale-105"
                      : "ring-1 sm:ring-1.5 ring-white/40 hover:ring-white/90 opacity-70 hover:opacity-100 hover:scale-110"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="size-full object-cover pointer-events-none"
                    loading="eager"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Left Navigation Arrow (Refined Translucent Obsidian Glass) ── */}
      <button
        type="button"
        onClick={prev}
        disabled={isAnimating}
        aria-label="Previous slide"
        className="cursor-pointer absolute left-1 sm:left-2 md:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-35 flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#050912]/80 hover:bg-[#0a1220] active:scale-95 transition-all duration-300 border border-white/20 hover:border-[#d4af37]/60 text-white hover:text-[#d4af37] shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed group/arrow"
      >
        <svg
          width="16"
          height="16"
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
        className="cursor-pointer absolute right-1 sm:right-2 md:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-35 flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#050912]/80 hover:bg-[#0a1220] active:scale-95 transition-all duration-300 border border-white/20 hover:border-[#d4af37]/60 text-white hover:text-[#d4af37] shadow-[0_10px_30px_rgba(0,0,0,0.7)] backdrop-blur-md disabled:opacity-30 disabled:cursor-not-allowed group/arrow"
      >
        <svg
          width="16"
          height="16"
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
