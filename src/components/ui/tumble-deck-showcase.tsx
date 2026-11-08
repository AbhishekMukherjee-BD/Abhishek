"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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

  const cardCount = cards.length;
  const poolSize = cardCount ? depth + 4 : 0;

  // Render 3D transforms frame-by-frame
  const renderFrame = useCallback(() => {
    const curPos = posRef.current.current;
    const { gap } = metricsRef.current;
    const baseIndex = Math.floor(curPos) - 2;

    const roundedIdx = wrap(Math.round(curPos), cardCount);
    setActiveCardIndex(roundedIdx);

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

  // Inertial smooth scroll & drag ticker
  useEffect(() => {
    const root = rootRef.current;
    if (!root || cardCount === 0) return;

    let animId: number | null = null;
    let settleTimer: any = null;
    let isSettling = false;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const updateInertia = () => {
      const diff = posRef.current.target - posRef.current.current;
      // Exponential smoothing factor for velvety motion (no jerk)
      posRef.current.current += diff * 0.12;

      if (Math.abs(diff) < 0.001) {
        posRef.current.current = posRef.current.target;
        isSettling = false;
        animId = null;
      } else {
        animId = requestAnimationFrame(updateInertia);
      }
      renderFrame();
    };

    const pushTarget = (newTarget: number) => {
      posRef.current.target = newTarget;
      if (prefersReducedMotion) {
        posRef.current.current = newTarget;
        renderFrame();
      } else if (!isSettling) {
        isSettling = true;
        animId = requestAnimationFrame(updateInertia);
      }
    };

    const settleToNearest = (dir: number = 0) => {
      const cur = posRef.current.target;
      let target = Math.round(cur);
      if (dir > 0) target = Math.floor(cur + 0.65);
      else if (dir < 0) target = Math.ceil(cur - 0.65);
      pushTarget(target);
    };

    // Wheel listener
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const normalizedDelta = (delta / scrollPerCard) * 0.85;

      pushTarget(posRef.current.target + normalizedDelta);

      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
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
      clearTimeout(settleTimer);
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
      clearTimeout(settleTimer);
      if (animId) cancelAnimationFrame(animId);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
    };
  }, [cardCount, scrollPerCard, renderFrame]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault();
      posRef.current.target = Math.round(posRef.current.target) + 1;
      renderFrame();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      posRef.current.target = Math.round(posRef.current.target) - 1;
      renderFrame();
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

      {/* ── Frosted Glass Info Bar (Bottom) ── */}
      {currentCard && (
        <div
          className={`absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 z-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl pointer-events-auto transition-all duration-500 ease-out ${
            isDeckOpen
              ? "opacity-100 translate-y-0 delay-300"
              : "opacity-0 translate-y-3 pointer-events-none"
          }`}
          style={{
            background: "linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.42) 42%, rgba(252, 252, 252, 0.72) 100%)",
            WebkitBackdropFilter: "blur(22px) saturate(1.5)",
            backdropFilter: "blur(22px) saturate(1.5)",
            border: "1px solid rgba(255, 255, 255, 0.35)",
            boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 0 0 0.5px rgba(0, 0, 0, 0.06), 0 10px 30px -5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="flex flex-col">
            <h4
              className="text-sm font-semibold tracking-tight flex items-center gap-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#141416" }}
            >
              <span>{currentCard.title || currentCard.alt}</span>
            </h4>
            {currentCard.meta && (
              <p
                className="text-xs font-mono tracking-tight mt-0.5"
                style={{ fontFamily: "'Space Grotesk', monospace", color: "rgba(20, 20, 22, 0.55)" }}
              >
                {currentCard.meta}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {currentCard.href && (
              <a
                href={currentCard.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium font-mono inline-flex items-center gap-1 transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(180deg, rgba(255, 255, 255, 0.82) 0%, rgba(226, 226, 230, 0.72) 100%)",
                  WebkitBackdropFilter: "blur(10px)",
                  backdropFilter: "blur(10px)",
                  color: "#111113",
                  fontWeight: 560,
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  boxShadow: "inset 0 1px 0 #fff, inset 0 -2px 4px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.14), 0 4px 10px -4px rgba(0, 0, 0, 0.18)",
                }}
              >
                <span>View</span>
                <span className="text-[9px]">↗</span>
              </a>
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
