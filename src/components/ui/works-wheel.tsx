"use client";

// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
import * as React from "react";
import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
  /** Optional category or tag */
  category?: string;
}

export interface WorksWheelRef {
  /** Map normalized scroll progress (0 to 1) directly across the wheel's items */
  setProgress: (progress: number, immediate?: boolean) => void;
  /** Directly set target turn number (0 to count) */
  setTurn: (turnValue: number) => void;
  /** Read current active turn number */
  getTurn: () => number;
  /** Jump directly to a specific slide index */
  to: (index: number) => void;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string;
  /** Color theme: "light" for original cream/paper palette (#f0efea) or "dark". @default "light" */
  theme?: "light" | "dark";
  /** When true, wheel rotation is driven by page scroll pinning rather than intercepting window wheel events. */
  scrollPinned?: boolean;
  /** Optional callback when an item is selected from index or clicked */
  onSelect?: (index: number) => void;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius; nothing else
   makes the difference between a stack of cards and a wheel seen side on. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
/** Items either side of the front still worth drawing. Past this a card is
    edge-on, and further round it would stack up on the vanishing point. */
const CULL = 1.6;

/** How much of a wheel-notch or a dragged pixel counts as one item. */
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
/** Quiet time after the last wheel event before the wheel settles on an item. */
const SETTLE = 140;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the
    front. Zero at the front, so the piece being read stays centred. */
const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

/** Both states in one chain: the ring terms fall away as `m` reaches the drum,
    and the drum terms are still zero while the ring is up. The bow is applied
    first, in the wheel's own plane, so it slides the card sideways rather than
    turning with it - and perspective still shrinks it with distance. */
function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
  scale: number = 1,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)` +
    (scale !== 1 ? ` scale(${scale.toFixed(4)})` : "")
  );
}

export const WorksWheel = React.forwardRef<WorksWheelRef, WorksWheelProps>(
  function WorksWheel(
    {
      items,
      label = "Works '26",
      action = "View",
      theme = "light",
      scrollPinned = false,
      onSelect,
      className,
      ...props
    },
    forwardedRef,
  ) {
    const isLight = theme === "light";
    const stageRef = React.useRef<HTMLDivElement>(null);
    const wheelRef = React.useRef<HTMLDivElement>(null);
    const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
    const labelRef = React.useRef<HTMLDivElement>(null);
    const titleRef = React.useRef<HTMLDivElement>(null);

    // The wheel's position, and where it is heading. Only `active` is state -
    // everything else is written to the DOM, so turning the wheel is not a render.
    const turn = React.useRef(0);
    const target = React.useRef(0);
    const [active, setActive] = React.useState(0);
    const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

    const count = items.length;
    const last = Math.max(count - 1, 0);

    const to = React.useCallback(
      (next: number) => {
        target.current = clamp(next, 0, last + 1);
      },
      [last],
    );

    // Expose imperative API for GSAP ScrollTrigger to scrub progress smoothly
    React.useImperativeHandle(
      forwardedRef,
      () => ({
        setProgress: (progress: number, immediate = false) => {
          // Map 0 -> 1 progress across full range with comfortable hold zones at start and end
          const total = last + 1;
          const startHold = 0.02;
          const endHold = 0.90;

          let normalized = 0;
          if (progress <= startHold) {
            normalized = 0;
          } else if (progress >= endHold) {
            normalized = total;
          } else {
            normalized = ((progress - startHold) / (endHold - startHold)) * total;
          }

          const clamped = clamp(normalized, 0, total);
          target.current = clamped;
          if (immediate) {
            turn.current = clamped;
          }
        },
        setTurn: (turnValue: number) => {
          target.current = clamp(turnValue, 0, last + 1);
        },
        getTurn: () => turn.current,
        to: (idx: number) => to(idx),
      }),
      [last, to],
    );

    // Read after mount, not during render: the server has no matchMedia, and
    // branching on it inline is a hydration mismatch. Reduced motion drops the
    // easing, so the wheel lands where it is put instead of gliding there.
    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const read = () => setReduced(query.matches);
      read();
      query.addEventListener("change", read);
      return () => query.removeEventListener("change", read);
    }, []);

    React.useEffect(() => {
      const el = stageRef.current;
      if (!el) return;
      const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const metrics = React.useMemo(() => {
      const { w, h } = stage;
      const isMobile = w < 640;
      const isTablet = w < 1024;
      const maxW = isMobile ? 0.78 : isTablet ? 0.46 : CARD_MAX_W;
      const cardW = Math.min(h * (isMobile ? 0.32 : CARD_H) * CARD_RATIO, w * maxW);
      const cardH = cardW / CARD_RATIO;
      const drumR = cardH * (isMobile ? 1.85 : DRUM);
      const ringR = cardH * RING_R;
      // Shrink the ring's cards until the circle reads as a closed loop rather
      // than beads on a wire, however many pieces the wheel is given.
      const ringScale = count
        ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
        : 1;
      return {
        cardW,
        cardH,
        ringR,
        ringScale,
        drumR,
        bow: cardH * (isMobile ? 1.2 : BOW),
        depth: cardH * LENS,
        title: cardH * TITLE,
        index: cardH * INDEX,
      };
    }, [stage, count]);

    // One pass per frame: ease toward the target, then write every transform.
    React.useEffect(() => {
      if (!stage.h) return;
      let frame = 0;
      let isVisible = true;
      const { ringR, ringScale, drumR, bow } = metrics;

      const draw = () => {
        if (!isVisible) return;
        frame = requestAnimationFrame(draw);
        const gap = target.current - turn.current;
        if (Math.abs(gap) < 0.0005) turn.current = target.current;
        else turn.current += gap * (reduced ? 1 : (scrollPinned ? 0.35 : EASE));

        const t = turn.current;
        const m = clamp(t, 0, 1);
        const pos = Math.max(0, t - 1);

        // The drum is pulled back so its front face lands on the picture plane.
        // That set-back has to arrive with the drum, or the ring would sit at the
        // far side of the perspective and render at half its size.
        if (wheelRef.current) {
          wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
        }

        for (let i = 0; i < count; i++) {
          const d = i - pos;
          const drumDeg = d * STEP;
          const card = cardRefs.current[i];

          // Spotlight zoom: smoothly enlarge card by ~20% as it reaches dead-center,
          // then smoothly scale back to 1.0 as it exits the frame
          const dist = Math.abs(d);
          const spotlightWindow = 0.85;
          const norm = clamp(1 - dist / spotlightWindow, 0, 1);
          const smoothFactor = norm * norm * (3 - 2 * norm);
          const spotlightScale = lerp(1, 1 + 0.20 * smoothFactor, m);

          if (card) {
            card.style.transform = place(
              d * (360 / count),
              drumDeg,
              ringR,
              drumR,
              bow,
              m,
              spotlightScale,
            );
            // Culled by distance, not by angle: at a full turn the far side comes
            // back round to face us, and everything past the neighbours lands on
            // the vanishing point in a heap.
            card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
            card.style.zIndex = String(Math.round(100 - dist * 10));
          }
          const face = card?.firstElementChild as HTMLElement | null;
          if (face) face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
        }

        const near = clamp(Math.round(pos), 0, last);
        setActive((prev) => (prev === near ? prev : near));

        if (labelRef.current) labelRef.current.style.opacity = String(1 - m);

        if (titleRef.current) {
          // Parallel 1-finger glide (~24px): as card approaches center (pos -> near),
          // the title one-liner slides smoothly into locked position in tandem with the card zoom
          const titleDist = Math.abs(pos - near);
          const titleWindow = 0.65;
          const titleNorm = clamp(1 - titleDist / titleWindow, 0, 1);
          const titleFactor = titleNorm * titleNorm * (3 - 2 * titleNorm);

          const delta = pos - near;
          const slideX = (1 - titleFactor) * -24; // 1 finger (~24px) horizontal glide from left
          const slideY = delta * 22;               // 22px vertical directional tracking

          titleRef.current.style.transform = `translateY(calc(-50% + ${slideY.toFixed(1)}px)) translateX(${slideX.toFixed(1)}px)`;
          titleRef.current.style.opacity = String((m * titleFactor).toFixed(3));
        }
      };

      const el = stageRef.current;
      const observer = el && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              const prev = isVisible;
              isVisible = entry.isIntersecting;
              if (isVisible && !prev) {
                frame = requestAnimationFrame(draw);
              }
            },
            { threshold: 0.01 }
          )
        : null;

      if (el && observer) observer.observe(el);

      frame = requestAnimationFrame(draw);
      return () => {
        cancelAnimationFrame(frame);
        if (observer) observer.disconnect();
      };
    }, [metrics, stage.h, count, last, reduced, scrollPinned]);

    // Native listener for unpinned mode. When scrollPinned is active, page scroll drives the wheel.
    React.useEffect(() => {
      if (scrollPinned) return;

      const el = stageRef.current;
      if (!el) return;
      const onWheel = (event: WheelEvent) => {
        const next = target.current + event.deltaY / WHEEL_UNITS;
        if (next > 0 && next < last + 1) event.preventDefault();
        to(next);
        window.clearTimeout(settling.current);
        settling.current = window.setTimeout(
          () => to(Math.round(target.current)),
          SETTLE,
        );
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => {
        el.removeEventListener("wheel", onWheel);
        window.clearTimeout(settling.current);
      };
    }, [to, last, scrollPinned]);

    const drag = React.useRef<number | null>(null);
    const settling = React.useRef(0);

    return (
      <section
        aria-label={label}
        className={cn(
          "bg-background text-foreground relative h-full min-h-[30rem] w-full overflow-hidden select-none",
          className,
        )}
        {...props}
      >
        <div
          ref={stageRef}
          tabIndex={0}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`works-wheel-${active}`}
          className={cn(
            "focus-visible:outline-foreground absolute inset-0 outline-none focus-visible:outline-2 focus-visible:-outline-offset-4",
            scrollPinned
              ? "cursor-default"
              : "cursor-grab active:cursor-grabbing touch-pan-x"
          )}
          style={{ perspective: `${metrics.depth}px` }}
          onPointerDown={(event) => {
            if (scrollPinned) return;
            drag.current = event.clientY;
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (scrollPinned || drag.current === null) return;
            to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
            drag.current = event.clientY;
          }}
          onPointerUp={() => {
            if (scrollPinned) return;
            drag.current = null;
            if (target.current > 1) to(Math.round(target.current));
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
            else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
            else return;
            event.preventDefault();
          }}
        >
          <div
            ref={wheelRef}
            className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
          >
            {items.map((item, i) => {
              const isExternal = item.href?.startsWith("http");
              const Tag = (item.href ? "a" : "div") as "a";
              return (
                <React.Fragment key={item.title}>
                  <Tag
                    id={`works-wheel-${i}`}
                    role="option"
                    aria-selected={i === active}
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      if (i !== active) {
                        e.preventDefault();
                        if (onSelect) onSelect(i);
                        else to(i + 1);
                      }
                    }}
                    ref={(node: HTMLElement | null) => {
                      cardRefs.current[i] = node;
                    }}
                    className="group absolute [backface-visibility:hidden] cursor-pointer"
                    style={{
                      width: metrics.cardW,
                      height: metrics.cardH,
                      marginLeft: -metrics.cardW / 2,
                      marginTop: -metrics.cardH / 2,
                    }}
                  >
                    <span
                      className={cn(
                        "relative block size-full overflow-hidden rounded-2xl border transition-all duration-300",
                        isLight
                          ? "bg-[#0a0a0a] border-black/10 shadow-[0_22px_45px_-12px_rgba(0,0,0,0.25)] group-hover:border-black/30 group-hover:shadow-[0_28px_55px_-10px_rgba(0,0,0,0.4)]"
                          : "bg-[#0f1117] border-white/10 shadow-[0_22px_50px_-15px_rgba(0,0,0,0.8)] group-hover:border-[#d4ff00]/60"
                      )}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        loading={i < 2 ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />

                      {/* Index badge on card with bold black border */}
                      <div className="absolute top-3 left-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-black bg-black text-white border-2 border-black ring-1 ring-white/20 shadow-lg backdrop-blur-sm">
                        {String(i + 1).padStart(2, "0")}
                      </div>

                      {/* Category tag */}
                      {item.category && (
                        <div className="absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-[#d4ff00] text-[#0a0a0a] shadow-md">
                          {item.category}
                        </div>
                      )}

                      {/* Action button overlay */}
                      {action && item.href ? (
                        <span
                          className={cn(
                            "pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.72rem] font-semibold opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
                            isLight
                              ? "bg-[#0a0a0a] text-white border border-black/10 group-hover:bg-[#d4ff00] group-hover:text-[#0a0a0a]"
                              : "bg-[#0a0a0a]/90 text-white border border-white/15 group-hover:border-[#d4ff00] group-hover:text-[#d4ff00]"
                          )}
                        >
                          <svg
                            viewBox="0 0 12 12"
                            className="size-2.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M3 9 9 3M4 3h5v5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {action}
                        </span>
                      ) : null}
                    </span>
                  </Tag>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Ring title and front-card title trade places across the transition.
            Type is sized off the measured stage, not vh, so the wheel keeps its
            proportions inside a card as well as at full bleed. */}
        <div
          ref={labelRef}
          className={cn(
            "pointer-events-none absolute inset-0 grid place-items-center tracking-tight font-bold select-none",
            isLight ? "text-[#0a0a0a]/85" : "text-white/90"
          )}
          style={{
            fontSize: metrics.title,
            fontFamily: "'Space Grotesk', sans-serif",
            textShadow: isLight
              ? "0 4px 24px rgba(0,0,0,0.06)"
              : "0 0 40px rgba(212,255,0,0.25)",
          }}
        >
          {label}
        </div>
        <div
          ref={titleRef}
          className="pointer-events-none absolute hidden sm:block top-1/2 left-[6%] -translate-y-1/2 tracking-tight opacity-0 select-none max-w-sm"
          style={{
            fontSize: Math.max(metrics.title * 0.85, 20),
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            color: isLight ? "#0a0a0a" : "#ffffff",
            textShadow: isLight
              ? "0 2px 16px rgba(240,239,234,0.9)"
              : "0 4px 20px rgba(0,0,0,0.8)",
            willChange: "transform, opacity",
          }}
        >
          <span
            className={cn(
              "text-xs uppercase tracking-widest font-mono block mb-1 font-semibold",
              isLight ? "text-[#737373]" : "text-[#d4ff00]"
            )}
          >
            {items[active]?.category || "Featured Project"}
          </span>
          {items[active]?.title}
        </div>

        {/* Index list down the right-hand side */}
        <ol
          className={cn(
            "absolute top-[12%] right-[3.5%] text-right leading-[1.8] hidden sm:block z-20",
            isLight ? "text-[#0a0a0a]/40" : "text-white/40"
          )}
          style={{
            fontSize: Math.max(metrics.index, 11),
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {items.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => {
                  if (onSelect) onSelect(i);
                  else to(i + 1);
                }}
                className={cn(
                  "focus-visible:outline-foreground cursor-pointer transition-all duration-200 outline-none block ml-auto font-medium",
                  isLight
                    ? (i === active
                        ? "text-[#0a0a0a] font-bold translate-x-[-6px]"
                        : "text-[#0a0a0a]/40 hover:text-[#0a0a0a]/90")
                    : (i === active
                        ? "text-[#d4ff00] font-bold translate-x-[-6px]"
                        : "text-white/40 hover:text-white/80")
                )}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ol>

        {/* Bottom hint for scroll / drag interactions */}
        <div
          className={cn(
            "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase font-mono z-20 flex items-center gap-2",
            isLight ? "text-[#0a0a0a]/50" : "text-white/40"
          )}
        >
          <span>
            {scrollPinned
              ? "Scroll down to advance slides • Section unlocks at final slide"
              : "Scroll or drag vertically to turn wheel"}
          </span>
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full animate-pulse",
              isLight ? "bg-[#0a0a0a]" : "bg-[#d4ff00]"
            )}
          />
        </div>
      </section>
    );
  },
);

export default WorksWheel;
