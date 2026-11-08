"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  ticks?: number[];
  showTooltip?: boolean;
  tooltipContent?: (value: number) => React.ReactNode;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  trackRef?: React.Ref<HTMLDivElement>;
  thumbRef?: React.Ref<HTMLDivElement>;
  rangeRef?: React.Ref<HTMLDivElement>;
}

/**
 * Origin UI Slider Component (Pure White Edition)
 * Inspired by @originui/slider (21st.dev/r/originui/slider)
 * Features:
 * - Crisp pure-white range fill and glowing circular thumb
 * - Hover / active tracking tooltip bubble
 * - Stepped tick marks
 * - Fluid pointer capture for 60/120fps touch & mouse scrubbing
 */
export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value: controlledValue,
      defaultValue = 0,
      min = 0,
      max = 100,
      step = 1,
      ticks,
      showTooltip = false,
      tooltipContent,
      onValueChange,
      disabled = false,
      trackRef: externalTrackRef,
      thumbRef: externalThumbRef,
      rangeRef: externalRangeRef,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<number>(
      isControlled ? controlledValue : defaultValue
    );
    const [isDragging, setIsDragging] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const internalTrackRef = React.useRef<HTMLDivElement | null>(null);
    const internalThumbRef = React.useRef<HTMLDivElement | null>(null);
    const internalRangeRef = React.useRef<HTMLDivElement | null>(null);

    const currentValue = isControlled ? controlledValue : internalValue;
    const range = max - min || 1;
    const percent = Math.max(0, Math.min(100, ((currentValue - min) / range) * 100));

    React.useEffect(() => {
      if (isControlled) {
        setInternalValue(controlledValue);
      }
    }, [isControlled, controlledValue]);

    const updateValueFromPointer = React.useCallback(
      (clientX: number) => {
        const track = internalTrackRef.current;
        if (!track || disabled) return;
        const rect = track.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const rawVal = min + ratio * (max - min);
        const steppedVal = step ? Math.round(rawVal / step) * step : rawVal;
        const clampedVal = Math.max(min, Math.min(max, steppedVal));

        if (!isControlled) {
          setInternalValue(clampedVal);
        }
        onValueChange?.(clampedVal);
      },
      [disabled, min, max, step, isControlled, onValueChange]
    );

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
      updateValueFromPointer(e.clientX);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || disabled) return;
      e.preventDefault();
      e.stopPropagation();
      updateValueFromPointer(e.clientX);
    };

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    };

    // Keyboard support
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      let delta = 0;
      if (e.key === "ArrowRight" || e.key === "ArrowUp") delta = step || 1;
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") delta = -(step || 1);
      else if (e.key === "Home") delta = min - currentValue;
      else if (e.key === "End") delta = max - currentValue;
      else return;

      e.preventDefault();
      const nextVal = Math.max(min, Math.min(max, currentValue + delta));
      if (!isControlled) setInternalValue(nextVal);
      onValueChange?.(nextVal);
    };

    const setRefs = (node: HTMLDivElement | null) => {
      internalTrackRef.current = node;
      if (typeof externalTrackRef === "function") {
        externalTrackRef(node);
      } else if (externalTrackRef && "current" in externalTrackRef) {
        (externalTrackRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    const setThumbRefs = (node: HTMLDivElement | null) => {
      internalThumbRef.current = node;
      if (typeof externalThumbRef === "function") {
        externalThumbRef(node);
      } else if (externalThumbRef && "current" in externalThumbRef) {
        (externalThumbRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    const setRangeRefs = (node: HTMLDivElement | null) => {
      internalRangeRef.current = node;
      if (typeof externalRangeRef === "function") {
        externalRangeRef(node);
      } else if (externalRangeRef && "current" in externalRangeRef) {
        (externalRangeRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    return (
      <div
        ref={ref}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={currentValue}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative flex w-full touch-none select-none items-center py-2 cursor-pointer outline-none group/slider",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {/* Track */}
        <div
          ref={setRefs}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative grow h-1.5 w-full rounded-full bg-white/20 overflow-visible"
          data-slot="slider-track"
        >
          {/* Active Range Fill (Pure White) */}
          <div
            ref={setRangeRefs}
            className="absolute left-0 top-0 bottom-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-[width] duration-75"
            style={{ width: `${percent}%` }}
            data-slot="slider-range"
          />

          {/* Stepped Tick Marks */}
          {ticks &&
            ticks.map((tickVal) => {
              const tickPercent = Math.max(0, Math.min(100, ((tickVal - min) / range) * 100));
              const isPassed = currentValue >= tickVal;
              return (
                <div
                  key={tickVal}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-1.5 rounded-full transition-all duration-150 pointer-events-none z-10",
                    isPassed ? "bg-white shadow-[0_0_4px_rgba(255,255,255,0.9)]" : "bg-white/40"
                  )}
                  style={{ left: `${tickPercent}%` }}
                />
              );
            })}

          {/* Thumb (Pure White Origin UI Style) */}
          <div
            ref={setThumbRefs}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 block size-4 shrink-0 rounded-full border-2 border-white bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] outline-none transition-[transform,box-shadow] z-20 pointer-events-none",
              isDragging
                ? "scale-125 ring-4 ring-white/30"
                : isHovered
                ? "scale-115 ring-2 ring-white/20"
                : ""
            )}
            style={{ left: `${percent}%` }}
            data-slot="slider-thumb"
            data-dragging={isDragging || undefined}
          >
            {/* Origin UI Tracking Value Tooltip */}
            {showTooltip && (
              <div
                className={cn(
                  "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap z-30 transition-all duration-150 pointer-events-none bg-white text-black shadow-lg",
                  isDragging || isHovered
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-1"
                )}
              >
                {tooltipContent ? tooltipContent(currentValue) : Math.round(currentValue)}
                {/* Micro caret */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Slider.displayName = "Slider";
export default Slider;
