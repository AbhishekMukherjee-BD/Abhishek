import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useLocation } from "react-router-dom";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const location = useLocation();
  const hasFinePointer = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  useEffect(() => {
    if (!hasFinePointer) return;
    // Reset cursor on route change to prevent "stuck" states
    if (ringRef.current && dotRef.current) {
      gsap.to(ringRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
    }
  }, [location.pathname, hasFinePointer]);

  useEffect(() => {
    if (!hasFinePointer) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide default cursor on desktop
    document.body.style.cursor = "none";

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows immediately
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: "power3.out",
      });
    };

    // Ring follows with lag
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      gsap.set(ring, { x: ringX, y: ringY });
      requestAnimationFrame(animateRing);
    };

    const handleMouseEnterLink = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.6, duration: 0.3 });
      gsap.to(dot, { scale: 0, duration: 0.3 });
    };

    const handleMouseLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    document.addEventListener("mousemove", moveCursor);

    const raf = requestAnimationFrame(animateRing);

    // Attach to interactive elements
    const updateInteractives = () => {
      const interactives = document.querySelectorAll("a, button, [role='button'], .cursor-pointer, .group");
      interactives.forEach((el) => {
        el.style.cursor = "none";
        el.removeEventListener("mouseenter", handleMouseEnterLink);
        el.removeEventListener("mouseleave", handleMouseLeaveLink);
        el.addEventListener("mouseenter", handleMouseEnterLink);
        el.addEventListener("mouseleave", handleMouseLeaveLink);
      });
    };

    updateInteractives();
    
    // Set up an observer or interval to check for new elements if needed, 
    // but usually a route change check is enough.
    // For now let's just use the initial run.

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      cancelAnimationFrame(raf);
      document.body.style.cursor = "";
      const interactives = document.querySelectorAll("a, button, [role='button'], .cursor-pointer, .group");
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterLink);
        el.removeEventListener("mouseleave", handleMouseLeaveLink);
      });
    };
  }, [location.pathname, hasFinePointer]);

  if (!hasFinePointer) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none mix-blend-difference"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.8)",
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
