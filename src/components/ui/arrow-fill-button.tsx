"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ArrowFillButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  btnText: string;
  href?: string;
  variant?: "white" | "gold" | "cyan" | "custom";
  size?: "xs" | "sm" | "md" | "lg";
  arrowDirection?: "up-right" | "right";
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  fillBgColor?: string;
  fillTextColor?: string;
  hoverFillBgColor?: string;
  hoverFillTextColor?: string;
  arrowColor?: string;
  hoverArrowColor?: string;
  className?: string;
}

/**
 * ArrowFillButton
 * Inspired by @hyperiux/arrow-fill-button (21st.dev/r/hyperiux/arrow-fill-button)
 *
 * Kinetic Pill Button featuring:
 * - A circular icon badge that expands smoothly to flood the entire button on hover
 * - Simultaneous text recoloring via dynamic clipping
 * - Dual-arrow sliding animation along a cubic-bezier(0.785, 0.135, 0.15, 0.86) curve
 */
export default function ArrowFillButton({
  btnText = "Explore",
  href,
  variant = "white",
  size = "sm",
  arrowDirection = "up-right",
  bgColor,
  textColor,
  borderColor,
  fillBgColor,
  fillTextColor,
  hoverFillBgColor,
  hoverFillTextColor,
  arrowColor,
  hoverArrowColor,
  className = "",
  onClick,
  ...props
}: ArrowFillButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    props.onPointerDown?.(e as any);
    setIsPressed(true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    props.onPointerUp?.(e as any);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setIsPressed(false), 200);
  };

  // Preset variants maintaining the exact project color palettes
  const colorPresets = {
    white: {
      bg: "transparent",
      text: "#ffffff",
      border: "rgba(255, 255, 255, 0.6)",
      fillBg: "#ffffff",
      fillText: "#070d18",
      hoverFillBg: "#ffffff",
      hoverFillText: "#070d18",
      arrow: "#070d18",
      hoverArrow: "#070d18",
    },
    gold: {
      bg: "transparent",
      text: "#d4af37",
      border: "#d4af37",
      fillBg: "#d4af37",
      fillText: "#070d18",
      hoverFillBg: "#ffe066",
      hoverFillText: "#070d18",
      arrow: "#070d18",
      hoverArrow: "#070d18",
    },
    cyan: {
      bg: "transparent",
      text: "#60c1e5",
      border: "rgba(96, 193, 229, 0.6)",
      fillBg: "#60c1e5",
      fillText: "#070d18",
      hoverFillBg: "#a0e0ef",
      hoverFillText: "#070d18",
      arrow: "#070d18",
      hoverArrow: "#070d18",
    },
    custom: {
      bg: "transparent",
      text: "#ffffff",
      border: "rgba(255, 255, 255, 0.4)",
      fillBg: "#ffffff",
      fillText: "#000000",
      hoverFillBg: "#ffffff",
      hoverFillText: "#000000",
      arrow: "#000000",
      hoverArrow: "#000000",
    },
  };

  const preset = colorPresets[variant] || colorPresets.white;

  const resolved = {
    bg: bgColor || preset.bg,
    text: textColor || preset.text,
    border: borderColor || preset.border,
    fillBg: fillBgColor || preset.fillBg,
    fillText: fillTextColor || preset.fillText,
    hoverFillBg: hoverFillBgColor || preset.hoverFillBg,
    hoverFillText: hoverFillTextColor || preset.hoverFillText,
    arrow: arrowColor || preset.arrow,
    hoverArrow: hoverArrowColor || preset.hoverArrow,
  };

  // Sizing tiers
  const sizeStyles = {
    xs: "h-6 sm:h-7 px-2.5 pr-[calc(var(--icon-circle)+var(--icon-right)+6px)] text-[10px] sm:text-[11px] [--icon-circle:18px] [--icon-right:3px]",
    sm: "h-7 sm:h-8 px-3 pr-[calc(var(--icon-circle)+var(--icon-right)+8px)] text-[11px] sm:text-xs [--icon-circle:22px] [--icon-right:4px]",
    md: "h-9 sm:h-10 px-4 pr-[calc(var(--icon-circle)+var(--icon-right)+10px)] text-xs sm:text-sm [--icon-circle:26px] [--icon-right:5px]",
    lg: "h-11 sm:h-12 px-6 pr-[calc(var(--icon-circle)+var(--icon-right)+14px)] text-sm sm:text-base [--icon-circle:32px] [--icon-right:6px]",
  };

  const currentSizeClass = sizeStyles[size] || sizeStyles.sm;

  const ArrowIcon = ({ className: iconClass }: { className: string }) => {
    if (arrowDirection === "right") {
      return (
        <svg
          className={iconClass}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      );
    }
    return (
      <svg
        className={iconClass}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    );
  };

  const styleVariables = {
    "--btn-bg": resolved.bg,
    "--btn-text": resolved.text,
    "--btn-border": resolved.border,
    "--btn-fill-bg": resolved.fillBg,
    "--btn-fill-text": resolved.fillText,
    "--btn-fill-bg-hover": resolved.hoverFillBg,
    "--btn-fill-text-hover": resolved.hoverFillText,
    "--btn-arrow": resolved.arrow,
    "--btn-arrow-hover": resolved.hoverArrow,
    "--circle-inset-y": "calc((100% - var(--icon-circle)) / 2)",
    visibility: mounted ? "visible" : ("hidden" as any),
  } as React.CSSProperties;

  const content = (
    <>
      {/* ── Layer 1: Base Label ── */}
      <span className="relative z-1 pb-px whitespace-nowrap">{btnText}</span>

      {/* ── Layer 2: Expanding Circular Background Wave ── */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute z-2 rounded-full",
          "inset-[var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle))]",
          "bg-[var(--btn-fill-bg)]",
          mounted &&
            "transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:inset-0 group-hover:bg-[var(--btn-fill-bg-hover)] group-data-[pressed=true]:inset-0 group-data-[pressed=true]:bg-[var(--btn-fill-bg-hover)]"
        )}
      />

      {/* ── Layer 3: Inverted Text Layer (Revealed via Inset Clip-Path) ── */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 z-2 flex items-center whitespace-nowrap",
          "text-[var(--btn-fill-text)]",
          "px-3 pr-[calc(var(--icon-circle)+var(--icon-right)+8px)]",
          "[clip-path:inset(var(--circle-inset-y)_var(--icon-right)_var(--circle-inset-y)_calc(100%-var(--icon-right)-var(--icon-circle)))]",
          mounted &&
            "transition-all duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:[clip-path:inset(0_0_0_0)] group-hover:text-[var(--btn-fill-text-hover)] group-data-[pressed=true]:[clip-path:inset(0_0_0_0)] group-data-[pressed=true]:text-[var(--btn-fill-text-hover)]"
        )}
      >
        <span className="relative z-1 pb-px whitespace-nowrap">{btnText}</span>
      </div>

      {/* ── Layer 4: Floating Right Circular Badge with Dual Sliding Arrow Animation ── */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute right-[var(--icon-right)] top-1/2 z-3 inline-flex shrink-0 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full",
          "h-[var(--icon-circle)] w-[var(--icon-circle)]",
          "bg-[var(--btn-fill-bg)] text-[var(--btn-arrow)]",
          mounted &&
            "transition-colors duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:bg-[var(--btn-fill-bg-hover)] group-hover:text-[var(--btn-arrow-hover)] group-data-[pressed=true]:bg-[var(--btn-fill-bg-hover)] group-data-[pressed=true]:text-[var(--btn-arrow-hover)]"
        )}
      >
        {/* Arrow 1: Sliding in from the left on hover */}
        <ArrowIcon
          className={cn(
            "absolute left-1/2 top-1/2 size-3 sm:size-3.5 -translate-x-[170%] -translate-y-1/2 origin-center scale-0 text-current",
            mounted &&
              "transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 group-hover:scale-100 group-data-[pressed=true]:-translate-x-1/2 group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-100"
          )}
        />
        {/* Arrow 2: Sliding out to the right on hover */}
        <ArrowIcon
          className={cn(
            "absolute left-1/2 top-1/2 size-3 sm:size-3.5 -translate-x-1/2 -translate-y-1/2 origin-center text-current",
            mounted &&
              "transition-transform duration-450 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] motion-reduce:transition-none group-hover:translate-x-[170%] group-hover:-translate-y-1/2 group-hover:scale-0 group-data-[pressed=true]:translate-x-[170%] group-data-[pressed=true]:-translate-y-1/2 group-data-[pressed=true]:scale-0"
          )}
        />
      </span>
    </>
  );

  const baseClasses = cn(
    "group relative inline-flex w-fit min-w-fit max-w-none cursor-pointer items-center justify-center overflow-hidden rounded-full border font-mono font-semibold leading-none select-none tracking-tight",
    "border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--btn-text)]",
    currentSizeClass,
    className
  );

  if (href) {
    return (
      <a
        href={href}
        data-pressed={isPressed ? "true" : "false"}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={onClick}
        style={styleVariables}
        className={baseClasses}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      data-pressed={isPressed ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={onClick}
      style={styleVariables}
      className={baseClasses}
    >
      {content}
    </button>
  );
}
