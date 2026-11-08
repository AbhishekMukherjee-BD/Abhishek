"use client";

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export interface SqueezeSlide {
  id?: string | number;
  title: string;
  category?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  background?: string;
  overlay?: React.ReactNode;
  actionText?: string;
  href?: string;
  onAction?: () => void;
}

export interface SqueezeCarouselProps {
  slides: SqueezeSlide[];
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  height?: string | number;
  slatWidth?: number;
  slatGap?: number;
  gap?: number;
  radius?: number;
  duration?: number;
  hoverGrow?: boolean;
  autoplay?: boolean;
  interval?: number;
  controls?: boolean;
  accent?: string;
  accentForeground?: string;
  theme?: "light" | "dark";
  label?: string;
  panelClassName?: string;
  className?: string;
  style?: React.CSSProperties;
}

const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

const toSize = (s: number | string) =>
  typeof s === "number" ? `${s}px` : s;

// Shares of extra room when resting, hovered, and neighbor-hovered
const SHARE_REST = [-0.06, 0.61, 0.3, 0.15];
const SHARE_HOVER = [0, 0.71, 0.4, 0.25];
const SHARE_NEIGHBOR = [-0.12, 0.59, 0.28, 0.13];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export default function SqueezeCarousel({
  slides,
  defaultIndex = 0,
  onIndexChange,
  height = "clamp(260px, 34cqi, 400px)",
  slatWidth = 10,
  slatGap = 8,
  gap = 16,
  radius = 6,
  duration = 900,
  hoverGrow = true,
  autoplay = false,
  interval = 6000,
  controls = true,
  accent = "#141416",
  accentForeground = "#ffffff",
  theme = "light",
  label = "Featured Works",
  panelClassName = "",
  className = "",
  style,
}: SqueezeCarouselProps) {
  const count = slides.length;
  const wrap = useCallback((idx: number) => ((idx % count) + count) % count, [count]);

  const buffer = clamp(count - 4, 1, 3);
  const windowLength = 4 + buffer;
  const prefersReduced = useReducedMotion();
  const animDuration = prefersReduced ? 0 : duration;

  const uid = useId().replace(/:/g, "");
  const nextKeyRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Initialize sliding window of slides
  const [windowItems, setWindowItems] = useState(() =>
    Array.from({ length: windowLength }, (_, i) => ({
      key: nextKeyRef.current++,
      slideIndex: wrap(defaultIndex + i),
    }))
  );

  const [shiftCount, setShiftCount] = useState(0);
  const offsetRef = useRef(0);
  const isForwardRef = useRef(true);
  const [dragOffset, setDragOffset] = useState(0);
  const [isInstant, setIsInstant] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(-1);

  const activeIndex = windowItems[-shiftCount]?.slideIndex ?? defaultIndex;
  const timersRef = useRef<any[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const resetWindow = useCallback(() => {
    setWindowItems((prev) =>
      isForwardRef.current ? prev.slice(-windowLength) : prev.slice(0, windowLength)
    );
    offsetRef.current = 0;
    setShiftCount(0);
    setDragOffset(0);
    setIsInstant(true);
  }, [windowLength]);

  useLayoutEffect(() => {
    if (!isInstant) return;
    const raf = requestAnimationFrame(() => setIsInstant(false));
    return () => cancelAnimationFrame(raf);
  }, [isInstant]);

  const shift = useCallback(
    (delta: number) => {
      if (count < 2 || delta === 0) return;
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      isForwardRef.current = delta > 0;

      if (delta > 0) {
        setWindowItems((prev) => [
          ...prev,
          ...Array.from({ length: delta }, (_, i) => ({
            key: nextKeyRef.current++,
            slideIndex: wrap(prev[prev.length - 1].slideIndex + 1 + i),
          })),
        ]);
        offsetRef.current -= delta;
        setShiftCount(offsetRef.current);
        setDragOffset((cur) => cur - delta);
      } else {
        const absDelta = -delta;
        setWindowItems((prev) => [
          ...Array.from({ length: absDelta }, (_, i) => ({
            key: nextKeyRef.current++,
            slideIndex: wrap(prev[0].slideIndex - (absDelta - i)),
          })),
          ...prev,
        ]);
        setDragOffset((cur) => cur + delta);
        setIsInstant(true);
        timersRef.current.push(
          window.setTimeout(() => setDragOffset(0), 0)
        );
      }

      timersRef.current.push(
        window.setTimeout(resetWindow, animDuration + 20)
      );
    },
    [count, animDuration, resetWindow, wrap]
  );

  useEffect(() => {
    onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange]);

  const [isHovered, setIsHovered] = useState(false);

  // Autoplay handler
  useEffect(() => {
    if (!autoplay || isHovered || prefersReduced || count < 2) return;
    const timer = window.setTimeout(() => shift(1), interval);
    return () => clearTimeout(timer);
  }, [autoplay, isHovered, prefersReduced, count, activeIndex, interval, shift]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      shift(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      shift(-1);
    }
  };

  if (!count) return null;

  const minSlat = toSize(slatWidth);
  const shares =
    hoverGrow && hoveredIdx >= 0 && hoveredIdx <= 3 && !prefersReduced
      ? null
      : SHARE_REST;

  const shareOf = (idx: number) =>
    shares
      ? SHARE_REST[idx] ?? 0.1
      : hoveredIdx === idx
      ? SHARE_HOVER[idx] ?? 0.1
      : SHARE_NEIGHBOR[idx] ?? 0.1;

  const widthOf = (idx: number) => {
    if (idx < 0 || idx > 3) return minSlat;
    if (idx === 0) {
      return `calc(var(--sq-hero) + var(--sq-room) * ${shareOf(0)})`;
    }
    return `calc(var(--sq-room) * ${shareOf(idx)})`;
  };

  const cssVars = {
    "--sq-h": toSize(height),
    "--sq-gap": toSize(gap),
    "--sq-slat-gap": toSize(slatGap),
    "--sq-radius": toSize(radius),
    "--sq-ms": `${animDuration}ms`,
    "--sq-ease": "cubic-bezier(0.16, 1, 0.3, 1)",
    "--sq-fill": accent,
    "--sq-on-fill": accentForeground,
    "--sq-hero": "calc(var(--sq-h) * 16 / 9)",
    "--sq-room": `calc(100cqi - var(--sq-hero) - ${buffer} * var(--sq-slat-gap) - 3 * var(--sq-gap) - ${buffer} * ${minSlat})`,
  } as React.CSSProperties;

  const trackTransform = `translateX(calc(${dragOffset} * (${minSlat} + var(--sq-gap))))`;

  return (
    <div
      className={`flex w-full flex-col select-none ${className}`}
      style={{
        containerType: "inline-size",
        ...cssVars,
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIdx(-1);
      }}
      onFocusCapture={() => setIsHovered(true)}
      onBlurCapture={() => setIsHovered(false)}
    >

      {/* ── Carousel Accordion Squeeze Viewport (Edgy Shape) ── */}
      <div
        className="w-full overflow-hidden rounded-lg border border-black/15 shadow-sm bg-neutral-950"
        style={{ height: "var(--sq-h)" }}
      >
        <div
          ref={trackRef}
          role="tablist"
          aria-label={label}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="flex h-full w-max"
          style={{
            transform: trackTransform,
            transition: isInstant ? "none" : "transform var(--sq-ms) var(--sq-ease)",
          }}
        >
          {windowItems.map((item, idx) => {
            const logicalIdx = idx + shiftCount;
            const slide = slides[item.slideIndex];
            const isHero = logicalIdx === 0;

            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                id={`sq-${uid}-tab-${item.key}`}
                aria-selected={isHero}
                aria-label={slide?.title}
                tabIndex={isHero ? 0 : -1}
                onMouseMove={() => hoverGrow && setHoveredIdx(logicalIdx)}
                onClick={() => logicalIdx > 0 && shift(logicalIdx)}
                className="relative isolate h-full shrink-0 cursor-pointer overflow-hidden bg-neutral-950 p-0 outline-none transition-all duration-300"
                style={{
                  width: widthOf(logicalIdx),
                  marginLeft:
                    idx === 0
                      ? 0
                      : logicalIdx < 4
                      ? "var(--sq-gap)"
                      : "var(--sq-slat-gap)",
                  borderRadius: `min(var(--sq-radius), calc(${widthOf(logicalIdx)} / 2))`,
                  transitionProperty: "width, margin-left, filter",
                  transitionDuration: isInstant ? "0s" : "var(--sq-ms)",
                  transitionTimingFunction: "var(--sq-ease)",
                  filter: isHero ? "brightness(1)" : "brightness(0.65) saturate(0.8)",
                }}
              >
                {/* Slide Artwork / Background */}
                {slide?.image ? (
                  <img
                    src={slide.image}
                    alt={slide.imageAlt || slide.title || ""}
                    draggable={false}
                    className="absolute inset-y-0 left-1/2 h-full max-w-none -translate-x-1/2 object-cover transition-transform duration-700 ease-out"
                    style={{
                      width: "var(--sq-hero)",
                      minWidth: "100%",
                      transform: isHero
                        ? "translate(-50%, 0) scale(1.0)"
                        : "translate(-50%, 0) scale(1.05)",
                    }}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-1/2 -translate-x-1/2"
                    style={{
                      background: slide?.background || "#1c1c1f",
                      width: "var(--sq-hero)",
                      minWidth: "100%",
                    }}
                  />
                )}

                {/* Hero Overlay Gradient & Tag */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end p-4 pt-16 sm:p-6 sm:pt-20"
                  style={{
                    opacity: isHero ? 1 : 0,
                    transition: "opacity var(--sq-ms) var(--sq-ease)",
                    backgroundImage:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)",
                  }}
                >
                  {slide?.category && (
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wider text-white/90 bg-white/20 backdrop-blur-md border border-white/20 shadow-sm">
                      {slide.category}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Slide Details: Bespoke Editorial Exhibition Plaque ── */}
      <div
        id={`sq-${uid}-panel`}
        role="tabpanel"
        aria-live="polite"
        className={`mt-5 grid ${panelClassName}`}
      >
        {slides.map((slide, sIdx) => {
          const isActive = sIdx === activeIndex;

          return (
            <div
              key={slide.id ?? sIdx}
              aria-hidden={!isActive}
              className={`col-start-1 row-start-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-2 transition-all duration-300 ease-out border-t ${
                theme === "dark"
                  ? "border-[#60c1e5]/15"
                  : "border-black/10"
              }`}
              style={{
                opacity: isActive ? 1 : 0,
                visibility: isActive ? "visible" : "hidden",
                pointerEvents: isActive ? "auto" : "none",
                transform: isActive ? "translateY(0)" : "translateY(4px)",
              }}
            >
              <div className="flex flex-col gap-1 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[11px] font-mono tracking-widest font-semibold ${
                      theme === "dark" ? "text-[#60c1e5]" : "text-neutral-500"
                    }`}
                  >
                    {String(sIdx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                  </span>
                  <span className={`w-1 h-1 rounded-full ${theme === "dark" ? "bg-[#a0e0ef]/60" : "bg-black/30"}`} />
                  <h3
                    className={`text-sm sm:text-base font-semibold tracking-tight ${
                      theme === "dark" ? "text-[#f0efea]" : "text-[#141416]"
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {slide.title}
                  </h3>
                </div>

                {slide.description && (
                  <p
                    className={`text-xs sm:text-[13px] leading-relaxed ${
                      theme === "dark" ? "text-[#8a99ad]" : "text-neutral-600"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {slide.description}
                  </p>
                )}
              </div>

              {/* Controls and Action Link */}
              <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                {controls && count > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Previous slide"
                      onClick={() => shift(-1)}
                      className={`grid size-7 cursor-pointer place-items-center rounded-md transition-all hover:scale-105 active:scale-95 outline-none ${
                        theme === "dark"
                          ? "bg-white/5 hover:bg-white/10 text-[#a0e0ef] border border-[#60c1e5]/20 hover:border-[#60c1e5]/40"
                          : "bg-black/5 hover:bg-black/10 text-neutral-800 border border-black/10"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M9.6 2.6 5.1 7.1h9.1v1.8H5.1l4.5 4.5-1.2 1.2-6-6L1.8 8l.6-.6 6-6 1.2 1.2Z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Next slide"
                      onClick={() => shift(1)}
                      className={`grid size-7 cursor-pointer place-items-center rounded-md transition-all hover:scale-105 active:scale-95 outline-none ${
                        theme === "dark"
                          ? "bg-white/5 hover:bg-white/10 text-[#a0e0ef] border border-[#60c1e5]/20 hover:border-[#60c1e5]/40"
                          : "bg-black/5 hover:bg-black/10 text-neutral-800 border border-black/10"
                      }`}
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                        <path d="M6.4 2.6l4.5 4.5H1.8v1.8h9.1l-4.5 4.5 1.2 1.2 6-6 .6-.6-.6-.6-6-6-1.2 1.2Z" />
                      </svg>
                    </button>
                  </div>
                )}

                {(slide.href || slide.onAction) && (
                  slide.href ? (
                    <a
                      href={slide.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95 ${
                        theme === "dark"
                          ? "text-[#a0e0ef] hover:text-white bg-[#005a9c]/30 hover:bg-[#005a9c]/60 border border-[#60c1e5]/30"
                          : "text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-black/10"
                      }`}
                    >
                      <span>{slide.actionText || "View Project"}</span>
                      <span className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={slide.onAction}
                      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95 ${
                        theme === "dark"
                          ? "text-[#a0e0ef] hover:text-white bg-[#005a9c]/30 hover:bg-[#005a9c]/60 border border-[#60c1e5]/30"
                          : "text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-black/10"
                      }`}
                    >
                      <span>{slide.actionText || "View Project"}</span>
                      <span className="text-[10px] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
