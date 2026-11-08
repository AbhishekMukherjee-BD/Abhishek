import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

export default function PageTransition() {
  const curtainRef = useRef(null);
  const labelRef = useRef(null);
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip the very first render (page load) — only animate on navigation
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const curtain = curtainRef.current;
    if (!curtain) return;

    gsap.killTweensOf([curtain, labelRef.current]);

    const tl = gsap.timeline();

    // Phase 1: Curtain sweeps UP from bottom to cover screen
    tl.set(curtain, { display: "flex", yPercent: 100 })
      .to(curtain, {
        yPercent: 0,
        duration: 0.5,
        ease: "power4.inOut",
      })
      // Phase 2: Brief pause so new page can mount
      .to({}, { duration: 0.15 })
      // Phase 3: Curtain sweeps UP off screen to reveal new page
      .to(curtain, {
        yPercent: -100,
        duration: 0.55,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(curtain, { display: "none", yPercent: 100 });
        },
      });

    const getPageLabel = () => {
      const path = location.pathname;
      if (path === "/") return "Home";
      return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
    };

    const label = getPageLabel();

    // Animate label
    if (labelRef.current) {
      labelRef.current.textContent = label;
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.1
      ).to(labelRef.current, { opacity: 0, duration: 0.2 }, 0.5);
    }

    return () => tl.kill();
  }, [location.pathname]);

  return (
    <div
      ref={curtainRef}
      className="fixed inset-0 z-[600] items-center justify-center pointer-events-none"
      style={{
        background: "#0a0a0a",
        display: "none",
      }}
    >
      {/* Centered brand mark */}
      <div className="flex flex-col items-center gap-4">
        <span
          ref={labelRef}
          className="text-white font-bold opacity-0"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            letterSpacing: "-0.04em",
          }}
        ></span>
      </div>
    </div>
  );
}
