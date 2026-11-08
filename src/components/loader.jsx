import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }) {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);
  const barRef = useRef(null);
  const pctRef = useRef(null);
  const statusRef = useRef(null);
  const counterObj = useRef({ val: 0 });

  useEffect(() => {
    // 1:1 match with abhishek-brown-iota.vercel.app preloader (direct DOM for 120fps smooth performance)
    const tl = gsap.timeline({
      onComplete: () => {
        setFading(true);
        // Dispatch global events so Hero and VectorPortrait know to start drawing
        window.__portfolioExperienceReady = true;
        window.dispatchEvent(new CustomEvent("portfolio-ready"));
        if (typeof onComplete === "function") {
          onComplete();
        }

        setTimeout(() => {
          setHidden(true);
        }, 800);
      },
    });

    tl.to(counterObj.current, {
      val: 65,
      duration: 1.0,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.round(counterObj.current.val);
        if (pctRef.current) pctRef.current.textContent = `${val}%`;
        if (barRef.current) barRef.current.style.width = `${val}%`;
      },
    })
      .call(() => {
        if (statusRef.current) statusRef.current.textContent = "Vectorizing Contours...";
      })
      .to(counterObj.current, {
        val: 100,
        duration: 0.9,
        ease: "power2.out",
        onUpdate: () => {
          const val = Math.round(counterObj.current.val);
          if (pctRef.current) pctRef.current.textContent = `${val}%`;
          if (barRef.current) barRef.current.style.width = `${val}%`;
        },
      })
      .call(() => {
        if (statusRef.current) statusRef.current.textContent = "Experience Ready";
      })
      .to({}, { duration: 0.25 });

    return () => tl.kill();
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div
      id="loader"
      className={`loader-screen ${fading ? "fade-out" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#05070a",
        zIndex: 99999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition:
          "opacity 0.8s cubic-bezier(0.85, 0, 0.15, 1), visibility 0.8s cubic-bezier(0.85, 0, 0.15, 1)",
        opacity: fading ? 0 : 1,
        visibility: fading ? "hidden" : "visible",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div
        className="loader-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          maxWidth: "90%",
          textAlign: "center",
        }}
      >
        <span
          className="loader-eyebrow"
          style={{
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.4em",
            color: "rgba(255, 255, 255, 0.4)",
            textTransform: "uppercase",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          PORTFOLIO EXPERIENCE
        </span>

        <span
          className="loader-title"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 300,
            letterSpacing: "0.25em",
            color: "#ffffff",
            textTransform: "uppercase",
            textShadow: "0 0 30px rgba(255, 255, 255, 0.18)",
          }}
        >
          THE TRANSFORMATION
        </span>

        <div
          className="loader-bar-container"
          style={{
            width: "180px",
            height: "1px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            position: "relative",
            overflow: "hidden",
            margin: "10px 0",
          }}
        >
          <div
            id="loader-bar"
            ref={barRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "0%",
              backgroundColor: "#ffffff",
              transition: "width 0.08s ease",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",
            }}
          />
        </div>

        <span
          id="loader-percentage"
          ref={pctRef}
          style={{
            fontSize: "0.75rem",
            fontWeight: 300,
            letterSpacing: "0.15em",
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          0%
        </span>

        <span
          id="loader-status"
          ref={statusRef}
          style={{
            fontSize: "0.75rem",
            fontWeight: 300,
            letterSpacing: "0.15em",
            color: "rgba(255, 255, 255, 0.5)",
            textTransform: "uppercase",
            marginTop: "5px",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Tracing Portrait...
        </span>
      </div>
    </div>
  );
}
