"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ArrowFillButton from "./arrow-fill-button";

export interface TumbleCardItem {
  src: string;
  alt: string;
  title?: string;
  meta?: string;
  href?: string;
}

export interface TumbleDeckProps {
  cards: TumbleCardItem[];
  height?: number | string;
  aspect?: number;
  scrollPerCard?: number;
  depth?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  onCardClick?: (card: TumbleCardItem, index: number) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  isDeckOpen?: boolean;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const wrap = (v: number, n: number) => (n ? ((v % n) + n) % n : 0);

/**
 * Fall angle curve:
 * Accelerates cubically until t = 0.78 (-90deg),
 * then executes a gentle, damped rebound bounce before settling flat.
 */
function fallAngle(progress: number): number {
  const p = clamp01(progress);
  const cutoff = 0.78;
  if (p <= cutoff) {
    const r = p / cutoff;
    return -90 * r * r * r;
  }
  const bounce = (p - cutoff) / (1 - cutoff);
  return -90 + 6 * Math.sin(Math.PI * bounce) * (1 - bounce);
}

/**
 * Smooth step curve advancing rear cards forward in Z-space as the front card falls.
 */
function deckAdvance(scrollPos: number): number {
  const floorPos = Math.floor(scrollPos);
  const fraction = scrollPos - floorPos;
  const t = clamp01((fraction - 0.28) / 0.6);
  return floorPos + t * t * (3 - 2 * t);
}

/**
 * Computes 3D pose (rotation, depth, vertical lift, opacity) for card at index `idx`.
 */
function cardPose(idx: number, scrollPos: number, maxDepth: number) {
  const delta = scrollPos - idx;
  const lift = (idx - Math.floor(scrollPos) + 3) * 0.8; // subtle floor lift offset

  if (delta >= 1) {
    // Card has fallen completely flat onto the floor plane
    return {
      angle: -90,
      z: 0,
      lift,
      opacity: delta < 3 ? 1 : 0,
      flat: true,
    };
  }

  if (delta > 0) {
    // Card is currently tumbling forward
    return {
      angle: fallAngle(delta),
      z: 0,
      lift,
      opacity: 1,
      flat: false,
    };
  }

  // Card is in the rear waiting stack
  const stackOffset = idx - deckAdvance(scrollPos);
  const opacity = clamp01(maxDepth + 1 - stackOffset);

  return {
    angle: 0,
    z: -Math.max(stackOffset, 0),
    lift: 0,
    opacity,
    flat: false,
  };
}

export default function TumbleDeckShowcase({
  cards,
  height = "380px",
  aspect = 1.85,
  scrollPerCard = 220,
  depth = 4,
  className = "",
  style,
  ariaLabel = "Interactive 3D Project Showcase",
  onCardClick,
  onClose,
  showCloseButton = false,
  isDeckOpen = true,
}: TumbleDeckProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const activeIndicesRef = useRef<number[]>([]);

  const posRef = useRef({ current: 0, target: 0 });
  const metricsRef = useRef({ h: 180, gap: 42 });
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const sliderThumbRef = useRef<HTMLDivElement>(null);
  const sliderFillRef = useRef<HTMLDivElement>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  const animIdRef = useRef<number | null>(null);
  const settleTimerRef = useRef<any>(null);
  const isSettlingRef = useRef(false);

  const cardCount = cards.length;
  const poolSize = cardCount ? depth + 4 : 0;

  // Render 3D transforms frame-by-frame
  const renderFrame = useCallback(() => {
    const curPos = posRef.current.current;
    const { gap } = metricsRef.current;
    const baseIndex = Math.floor(curPos) - 2;

    const roundedIdx = wrap(Math.round(curPos), cardCount);
    setActiveCardIndex((prev) => (prev !== roundedIdx ? roundedIdx : prev));

    // Update Slider track & thumb directly for 60fps smoothness without re-render latency
    if (sliderThumbRef.current && sliderFillRef.current && cardCount > 1) {
      const normalized = (wrap(curPos, cardCount) / (cardCount - 1)) * 100;
      const clampedPercent = Math.max(0, Math.min(100, normalized));
      sliderThumbRef.current.style.left = `${clampedPercent}%`;
      sliderFillRef.current.style.width = `${clampedPercent}%`;
    }

    cardRefs.current.forEach((cardEl, poolIdx) => {
      const imgEl = imgRefs.current[poolIdx];
      if (!cardEl || !imgEl || poolIdx >= poolSize) return;

      const logicalIndex = baseIndex + wrap(poolIdx - baseIndex, poolSize);

      if (activeIndicesRef.current[poolIdx] !== logicalIndex) {
        activeIndicesRef.current[poolIdx] = logicalIndex;
        const cardData = cards[wrap(logicalIndex, cardCount)];
        if (cardData) {
          imgEl.src = cardData.src;
          imgEl.alt = cardData.alt || cardData.title || "";
        }
      }

      const pose = cardPose(logicalIndex, curPos, depth);

      cardEl.style.transform = `translate3d(0, ${-pose.lift}px, ${
        pose.z * gap
      }px) rotateX(${pose.angle}deg)`;
      cardEl.style.opacity = String(pose.opacity);
      cardEl.style.visibility = pose.opacity > 0 ? "visible" : "hidden";

      const shade = pose.flat ? 0.08 : (-pose.angle / 90) * 0.08;
      cardEl.style.setProperty("--td-shade", String(shade));
    });
  }, [depth, poolSize, cards, cardCount]);

  useLayoutEffect(() => {
    activeIndicesRef.current = [];
  }, [cards]);

  // Fit and perspective calculations based on container dimensions
  useLayoutEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;

    const fitScene = () => {
      const width = root.clientWidth;
      const hVal = typeof height === "number" ? height : root.clientHeight || 380;

      // Card sizing calculations
      const scaleFactor = width < 480 ? 0.85 : 0.72;
      const cardHeight = Math.max(90, Math.min((width * scaleFactor) / aspect, hVal * 0.48, 280));
      const cardWidth = cardHeight * aspect;
      const cardTop = hVal / 2 - 0.58 * cardHeight;

      metricsRef.current = {
        h: cardHeight,
        gap: 0.28 * cardHeight,
      };

      scene.style.perspective = `${5.5 * cardHeight}px`;
      scene.style.perspectiveOrigin = `50% ${cardTop - 1.4 * cardHeight}px`;

      root.style.setProperty("--td-w", `${cardWidth}px`);
      root.style.setProperty("--td-h", `${cardHeight}px`);
      root.style.setProperty("--td-top", `${cardTop}px`);

      renderFrame();
    };

    fitScene();
    const ro = new ResizeObserver(fitScene);
    ro.observe(root);
    return () => ro.disconnect();
  }, [aspect, height, renderFrame]);

  const startInertia = useCallback(() => {
    if (isSettlingRef.current) return;
    isSettlingRef.current = true;

    const updateInertia = () => {
      const diff = posRef.current.target - posRef.current.current;
      posRef.current.current += diff * 0.14;

      if (Math.abs(diff) < 0.001) {
        posRef.current.current = posRef.current.target;
        isSettlingRef.current = false;
        animIdRef.current = null;
      } else {
        animIdRef.current = requestAnimationFrame(updateInertia);
      }
      renderFrame();
    };

    animIdRef.current = requestAnimationFrame(updateInertia);
  }, [renderFrame]);

  const pushTarget = useCallback(
    (newTarget: number, immediate: boolean = false) => {
      posRef.current.target = newTarget;
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion || immediate) {
        posRef.current.current = newTarget;
        renderFrame();
      } else if (!isSettlingRef.current) {
        startInertia();
      }
    },
    [renderFrame, startInertia]
  );

  const settleToNearest = useCallback(
    (dir: number = 0) => {
      const cur = posRef.current.target;
      let target = Math.round(cur);
      if (dir > 0) target = Math.floor(cur + 0.65);
      else if (dir < 0) target = Math.ceil(cur - 0.65);
      pushTarget(target);
    },
    [pushTarget]
  );

  // Slider Drag & Scrub Mechanics
  const calculateTargetFromPointer = useCallback(
    (clientX: number) => {
      const track = sliderTrackRef.current;
      if (!track || cardCount <= 1) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetCardIdx = ratio * (cardCount - 1);

      const curPos = posRef.current.current;
      const currentRev = Math.floor(curPos / cardCount) * cardCount;
      pushTarget(currentRev + targetCardIdx, false);
    },
    [cardCount, pushTarget]
  );

  const onSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSlider(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    calculateTargetFromPointer(e.clientX);
  };

  const onSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSlider) return;
    e.preventDefault();
    e.stopPropagation();
    calculateTargetFromPointer(e.clientX);
  };

  const onSliderPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSlider) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingSlider(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    settleToNearest();
  };

  const goToCard = (idx: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const curPos = posRef.current.current;
    const currentRev = Math.floor(curPos / cardCount) * cardCount;
    pushTarget(currentRev + idx);
  };

  const prevCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pushTarget(Math.round(posRef.current.target) - 1);
  };

  const nextCard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    pushTarget(Math.round(posRef.current.target) + 1);
  };

  // Inertial smooth scroll & drag ticker (keeps current scroll interaction 100% active)
  useEffect(() => {
    const root = rootRef.current;
    if (!root || cardCount === 0) return;

    // Wheel listener (Existing Scroll Interaction Preserved)
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const normalizedDelta = (delta / scrollPerCard) * 0.85;

      pushTarget(posRef.current.target + normalizedDelta);

      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        settleToNearest(Math.sign(delta));
      }, 160);
    };

    // Pointer Drag Tracking
    let pointerState: { id: number; y: number; travel: number; lastDir: number } | null = null;
    let isDragging = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      pointerState = {
        id: e.pointerId,
        y: e.clientY,
        travel: 0,
        lastDir: 0,
      };
      isDragging = false;
      clearTimeout(settleTimerRef.current);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointerState || e.pointerId !== pointerState.id) return;
      const deltaY = pointerState.y - e.clientY;
      pointerState.y = e.clientY;
      pointerState.travel += Math.abs(deltaY);

      if (deltaY !== 0) {
        pointerState.lastDir = Math.sign(deltaY);
      }

      if (pointerState.travel > 6 && !isDragging) {
        isDragging = true;
        root.setPointerCapture(e.pointerId);
      }

      if (isDragging) {
        const moveRatio = deltaY / (metricsRef.current.h * 1.2);
        pushTarget(posRef.current.target + moveRatio);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!pointerState || e.pointerId !== pointerState.id) return;
      if (isDragging) {
        settleToNearest(pointerState.lastDir);
      }
      pointerState = null;
      isDragging = false;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);

    renderFrame();

    return () => {
      clearTimeout(settleTimerRef.current);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
    };
  }, [cardCount, scrollPerCard, renderFrame, pushTarget, settleToNearest]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      pushTarget(Math.round(posRef.current.target) + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      pushTarget(Math.round(posRef.current.target) - 1);
    } else if (e.key === "Escape" && onClose) {
      e.preventDefault();
      onClose();
    }
  };

  const currentCard = cards[activeCardIndex] || cards[0];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`td-root relative w-full touch-none overflow-hidden outline-none select-none ${className}`}
      data-lenis-prevent="true"
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
    >
      <style>{`
        .td-scene {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          pointer-events: auto;
        }
        .td-card {
          position: absolute;
          left: 50%;
          top: var(--td-top, 60px);
          width: var(--td-w, 280px);
          height: var(--td-h, 160px);
          margin-left: calc(var(--td-w, 280px) / -2);
          transform-origin: 50% 100%;
          transform-style: preserve-3d;
          backface-visibility: visible;
          will-change: transform, opacity;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          background: #141416;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 20px 45px -12px rgba(0, 0, 0, 0.65),
            0 0 0 0.5px rgba(255, 255, 255, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .td-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 24px 50px -10px rgba(0, 0, 0, 0.75),
            0 0 0 0.5px rgba(255, 255, 255, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .td-card img {
          display: block;
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          object-position: 50% 20%;
          pointer-events: none;
          background: #1c1c1f;
        }
        .td-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: #000000;
          opacity: var(--td-shade, 0);
          transition: opacity 0.1s linear;
        }
        .td-root:focus-visible {
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.25);
        }
      `}</style>

      {/* Top controls removed — close via outside click or Escape */}

      {/* ── Interactive 3D Perspective Scene ── */}
      <div ref={sceneRef} className="td-scene">
        {Array.from({ length: poolSize }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="td-card group"
            onClick={() => {
              const curIndex = wrap(
                Math.floor(posRef.current.current) - 2 + wrap(i - (Math.floor(posRef.current.current) - 2), poolSize),
                cardCount
              );
              const card = cards[curIndex];
              if (onCardClick) onCardClick(card, curIndex);
              // External link navigation is strictly handled by the dedicated "View ↗" frosted glass button
            }}
          >
            <img
              ref={(el) => {
                imgRefs.current[i] = el;
              }}
              alt=""
              width={640}
              height={Math.round(640 / aspect)}
              draggable={false}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* ── Frosted Glass Info & Interactive Slider Scrubber Bar (Bottom) ── */}
      {currentCard && (
        <div
          className={`absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-20 flex flex-col gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl pointer-events-auto transition-all duration-500 ease-out ${
            isDeckOpen
              ? "opacity-100 translate-y-0 delay-300"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
          style={{
            background: "linear-gradient(180deg, rgba(10, 18, 32, 0.92) 0%, rgba(6, 11, 20, 0.97) 100%)",
            WebkitBackdropFilter: "blur(24px) saturate(1.8)",
            backdropFilter: "blur(24px) saturate(1.8)",
            border: "1px solid rgba(96, 193, 229, 0.3)",
            boxShadow: "inset 0 1px 0 rgba(160, 224, 239, 0.25), 0 18px 40px -10px rgba(0, 0, 0, 0.75)",
          }}
        >
          {/* ── Row 1: Origin UI Pure White Slider Scrubber Ribbon ── */}
          <div className="flex items-center gap-2.5 w-full select-none">
            {/* Step Prev Button (White) */}
            <button
              type="button"
              onClick={prevCard}
              aria-label="Previous card in stack"
              className="shrink-0 cursor-pointer flex items-center justify-center w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white border border-white/20 shadow-xs"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Origin UI Slider Scrubber Track (White Theme) */}
            <div
              ref={sliderTrackRef}
              onPointerDown={onSliderPointerDown}
              onPointerMove={onSliderPointerMove}
              onPointerUp={onSliderPointerUp}
              onPointerCancel={onSliderPointerUp}
              onMouseEnter={() => setIsSliderHovered(true)}
              onMouseLeave={() => setIsSliderHovered(false)}
              className="relative flex-1 h-7 flex items-center cursor-pointer group/slider py-1 touch-none"
              title="Slide or scroll to flip through cards"
              data-slot="slider"
            >
              {/* Background Track Rail (White/20) */}
              <div
                className="relative w-full h-1.5 rounded-full bg-white/20 overflow-visible"
                data-slot="slider-track"
              >
                {/* Active Range Fill (Pure White with Glow) */}
                <div
                  ref={sliderFillRef}
                  className="absolute left-0 top-0 bottom-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.85)] transition-[width] duration-75"
                  style={{ width: `${cardCount > 1 ? (activeCardIndex / (cardCount - 1)) * 100 : 0}%` }}
                  data-slot="slider-range"
                />

                {/* Origin UI Stepped Tick Marks (White) */}
                {Array.from({ length: cardCount }, (_, idx) => {
                  const percent = cardCount > 1 ? (idx / (cardCount - 1)) * 100 : 50;
                  const isPassed = activeCardIndex >= idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => goToCard(idx, e)}
                      aria-label={`Jump to card ${idx + 1}`}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all duration-150 z-10 cursor-pointer"
                      style={{
                        left: `${percent}%`,
                        background: isPassed ? "#ffffff" : "rgba(255, 255, 255, 0.45)",
                        boxShadow: isPassed ? "0 0 6px rgba(255, 255, 255, 0.9)" : "none",
                        transform: idx === activeCardIndex ? "translate(-50%, -50%) scale(1.4)" : "translate(-50%, -50%) scale(1)",
                      }}
                    />
                  );
                })}

                {/* Origin UI Pure White Thumb with Dynamic Tracking Tooltip */}
                <div
                  ref={sliderThumbRef}
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 block size-4 shrink-0 rounded-full border-2 border-white bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)] outline-none transition-[transform,box-shadow] z-20 pointer-events-none ${
                    isDraggingSlider
                      ? "scale-125 ring-4 ring-white/35"
                      : isSliderHovered
                      ? "scale-115 ring-2 ring-white/25"
                      : ""
                  }`}
                  style={{
                    left: `${cardCount > 1 ? (activeCardIndex / (cardCount - 1)) * 100 : 0}%`,
                  }}
                  data-slot="slider-thumb"
                  data-dragging={isDraggingSlider || undefined}
                >
                  {/* Origin UI Floating Value Tooltip (White Theme) */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap z-30 transition-all duration-150 pointer-events-none bg-white text-black shadow-[0_4px_12px_rgba(0,0,0,0.6)] ${
                      isDraggingSlider || isSliderHovered
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1 group-hover/slider:opacity-100 group-hover/slider:translate-y-0"
                    }`}
                  >
                    <span>
                      {currentCard?.title
                        ? `${String(activeCardIndex + 1).padStart(2, "0")} · ${currentCard.title}`
                        : `Slide ${String(activeCardIndex + 1).padStart(2, "0")}`}
                    </span>
                    {/* Tooltip downward caret */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Step Next Button (White) */}
            <button
              type="button"
              onClick={nextCard}
              aria-label="Next card in stack"
              className="shrink-0 cursor-pointer flex items-center justify-center w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 active:scale-90 transition-all text-white border border-white/20 shadow-xs"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Slide Index Badge (Pure White Monospace) */}
            <span className="shrink-0 font-mono text-[10px] font-bold text-white px-2 py-0.5 rounded bg-white/10 border border-white/20 whitespace-nowrap shadow-xs">
              <span className="text-white font-extrabold">{String(activeCardIndex + 1).padStart(2, "0")}</span> / {String(cardCount).padStart(2, "0")}
            </span>
          </div>

          {/* ── Row 2: Card Title, Meta & View CTA ── */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
            <div className="flex flex-col min-w-0 pr-2">
              <h4
                className="text-xs sm:text-sm font-semibold tracking-tight text-white truncate"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {currentCard.title || currentCard.alt}
              </h4>
              {currentCard.meta && (
                <p
                  className="text-[10px] sm:text-[11px] font-mono text-white/70 truncate mt-0.5"
                >
                  {currentCard.meta}
                </p>
              )}
            </div>

            {currentCard.href && (
              <ArrowFillButton
                btnText="View"
                href={currentCard.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                variant="white"
                size="xs"
                arrowDirection="up-right"
                className="shrink-0 font-bold"
              />
            )}
          </div>
        </div>
      )}

      {/* Accessibility Announcements */}
      <span className="sr-only" aria-live="polite">
        {cardCount} portfolio showcase slides. Scroll, drag, or press arrow keys to flip through.
      </span>
    </div>
  );
}
