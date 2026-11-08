import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import wireframeImg from "../assets/images/profile/wireframe_source.jpg";

export default function VectorPortraitHero({ onReady }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [paths, setPaths] = useState([]);
  const [viewBox, setViewBox] = useState("0 0 1376 768");
  const [isTracing, setIsTracing] = useState(true);
  const isAnimatedRef = useRef(false);

  useEffect(() => {
    // Check if paths were already computed in this session for zero-lag re-renders
    if (window.__tracedPortraitPaths && window.__tracedPortraitViewBox) {
      setPaths(window.__tracedPortraitPaths);
      setViewBox(window.__tracedPortraitViewBox);
      setIsTracing(false);
      return;
    }

    let isMounted = true;

    const runTracing = () => {
      if (typeof window.ImageTracer === "undefined") {
        setTimeout(runTracing, 60);
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = wireframeImg;

      img.onload = () => {
        if (!isMounted) return;

        try {
          // Exact trace options from MY_PORTFOLIO/portfolio/index.html
          const traceOptions = {
            ltres: 1.5,
            qtres: 1.5,
            pathomit: 32,
            rightangleenhance: false,
            colorsampling: 2,
            numberofcolors: 5,
            mincolorratio: 0.01,
            colorquantcycles: 2,
            layering: 0,
            scale: 1,
            roundcoords: 1,
            viewbox: true,
            desc: false,
            blurradius: 4,
            blurdelta: 25,
          };

          window.ImageTracer.imageToSVG(
            wireframeImg,
            (svgString) => {
              if (!isMounted) return;

              try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgString, "image/svg+xml");
                const svgEl = doc.querySelector("svg");

                if (!svgEl) {
                  setIsTracing(false);
                  return;
                }

                const vb = svgEl.getAttribute("viewBox") || "0 0 1376 768";
                const [, , svgWidth, svgHeight] = vb.split(" ").map(Number);

                // Filter outer border paths matching MY_PORTFOLIO/portfolio/index.html
                const filteredPaths = Array.from(doc.querySelectorAll("path"))
                  .map((p) => p.getAttribute("d"))
                  .filter((d) => {
                    if (!d) return false;
                    const coords = d.match(/[-+]?[0-9]*\.?[0-9]+/g);
                    if (!coords || coords.length < 4) return true;

                    let pMinX = Infinity,
                      pMaxX = -Infinity;
                    let pMinY = Infinity,
                      pMaxY = -Infinity;

                    for (let i = 0; i < coords.length; i += 2) {
                      const x = Number(coords[i]);
                      const y = Number(coords[i + 1]);
                      if (!isNaN(x) && !isNaN(y)) {
                        if (x < pMinX) pMinX = x;
                        if (x > pMaxX) pMaxX = x;
                        if (y < pMinY) pMinY = y;
                        if (y > pMaxY) pMaxY = y;
                      }
                    }

                    const pWidth = pMaxX - pMinX;
                    const pHeight = pMaxY - pMinY;
                    const isOuterBorder =
                      pWidth > svgWidth * 0.95 && pHeight > svgHeight * 0.95;
                    return !isOuterBorder;
                  });

                window.__tracedPortraitPaths = filteredPaths;
                window.__tracedPortraitViewBox = vb;

                setPaths(filteredPaths);
                setViewBox(vb);
                setIsTracing(false);

                if (typeof onReady === "function") {
                  onReady();
                }
              } catch (err) {
                console.error("Vector parsing error:", err);
                setIsTracing(false);
              }
            },
            traceOptions
          );
        } catch (e) {
          console.error("ImageTracer error:", e);
          setIsTracing(false);
        }
      };

      img.onerror = () => {
        setIsTracing(false);
      };
    };

    runTracing();

    return () => {
      isMounted = false;
    };
  }, [onReady]);

  // GSAP Stroke-Dashoffset Drawing Animation & Fine Pointer Mouse Parallax
  useEffect(() => {
    if (paths.length === 0 || !svgRef.current || isAnimatedRef.current) return;

    const svg = svgRef.current;
    const pathElements = svg.querySelectorAll(".vector-path");

    // Hide paths initially with strokeDashoffset
    pathElements.forEach((path) => {
      try {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.style.opacity = "0.9";
      } catch (e) {
        path.style.strokeDasharray = "1000";
        path.style.strokeDashoffset = "1000";
      }
    });

    const triggerDrawAnimation = () => {
      if (isAnimatedRef.current) return;
      isAnimatedRef.current = true;

      const tl = gsap.timeline({
        onComplete: () => {
          // Idle breathing glow on the single parent SVG node (Hardware GPU composited, 0% CPU overhead)
          if (svgRef.current) {
            gsap.to(svgRef.current, {
              opacity: 0.85,
              duration: 3.5,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          }
        },
      });

      tl.to(pathElements, {
        strokeDashoffset: 0,
        duration: 2.0,
        ease: "power2.out",
        stagger: 0.006,
      });
    };

    // If preloader is already completed or if event is fired
    if (window.__portfolioExperienceReady) {
      triggerDrawAnimation();
    } else {
      let fallbackTimer = null;
      const handleReady = () => {
        if (fallbackTimer) clearTimeout(fallbackTimer);
        triggerDrawAnimation();
      };
      window.addEventListener("portfolio-ready", handleReady, { once: true });
      // Fallback timeout in case event was missed
      fallbackTimer = setTimeout(() => {
        window.removeEventListener("portfolio-ready", handleReady);
        triggerDrawAnimation();
      }, 2400);
      return () => {
        window.removeEventListener("portfolio-ready", handleReady);
        if (fallbackTimer) clearTimeout(fallbackTimer);
      };
    }
  }, [paths]);

  // Mouse Parallax for fine pointer (desktop)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const hasFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;

    let handleMouseMove = null;

    if (hasFinePointer) {
      handleMouseMove = (e) => {
        const xMove = (e.clientX - window.innerWidth / 2) * -0.012;
        const yMove = (e.clientY - window.innerHeight / 2) * -0.012;

        gsap.to(svg, {
          x: xMove,
          y: yMove,
          duration: 1.0,
          ease: "power2.out",
        });
      };
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [paths]);

  // Pause rendering when scrolled out of view to preserve 100% CPU on mobile
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (svgRef.current) {
          svgRef.current.style.visibility = entry.isIntersecting ? "visible" : "hidden";
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-container relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none"
    >
      {/* Ambient background glow behind vector portrait */}
      <div
        className="absolute w-[360px] sm:w-[500px] md:w-[680px] h-[360px] sm:h-[500px] md:h-[680px] rounded-full blur-[110px] md:blur-[160px] -z-10 pointer-events-none opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(212,255,0,0.12) 35%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* SVG Canvas for Vector Lines - Hardware-accelerated with 100dvh support */}
      {paths.length > 0 && (
        <svg
          ref={svgRef}
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-[48dvh] sm:max-h-[80vh] md:max-h-[88vh] max-w-[92vw] md:max-w-[88vw] z-10"
          style={{
            filter: "drop-shadow(0 0 16px rgba(255, 255, 255, 0.12))",
            pointerEvents: "none",
            willChange: "opacity, transform",
          }}
        >
          {paths.map((d, index) => (
            <path
              key={index}
              className="vector-path"
              d={d}
              fill="none"
              stroke="rgba(255, 255, 255, 0.72)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
        </svg>
      )}

      {/* Fallback indicator while initial tracing computes */}
      {isTracing && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            <span className="text-[11px] font-mono text-white/40 tracking-widest uppercase">
              Rendering Contours...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
