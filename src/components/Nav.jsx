import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import gsap from "gsap";
import videoback from "../assets/video/glassy.mp4";
import useMagnetic from "../Hooks/useMagnetic";
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const menuPanelRef = useRef(null);
  const menuContentRef = useRef(null);
  const menuBtnRef = useRef(null);

  // Apply magnetic physics to the Menu button
  useMagnetic(menuBtnRef, 0.4, true);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Animate menu open/close with radial circle expand
  useLayoutEffect(() => {
    if (!menuPanelRef.current) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";

      gsap.fromTo(
        menuPanelRef.current,
        { clipPath: "circle(0% at calc(100% - 40px) 40px)", opacity: 1 },
        {
          clipPath: "circle(150% at calc(100% - 40px) 40px)",
          duration: 0.7,
          ease: "power4.inOut",
        }
      );

      if (menuContentRef.current) {
        const items = menuContentRef.current.querySelectorAll(".menu-item");
        gsap.fromTo(
          items,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power3.out", delay: 0.3 }
        );
      }
    } else {
      document.body.style.overflow = "";

      if (menuPanelRef.current) {
        gsap.to(menuPanelRef.current, {
          clipPath: "circle(0% at calc(100% - 40px) 40px)",
          duration: 0.55,
          ease: "power4.inOut",
        });
      }
    }
  }, [menuOpen]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/work", label: "Work" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <>
      {/* On non-home pages, show a clean, floating AM Monogram in the top left */}
      {location.pathname !== "/" && (
        <div className="fixed top-6 left-6 sm:top-8 sm:left-10 z-[150]">
          <Link
            to="/"
            style={{ textDecoration: "none" }}
            className="group flex flex-col items-start cursor-pointer"
          >
            <span
              className="text-2xl sm:text-3xl font-medium tracking-wide text-white transition-colors group-hover:text-white"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              AM
            </span>
          </Link>
        </div>
      )}

      {/* Floating Magnetic Menu Button — Pure Minimalist, Always Available */}
      <div className="fixed top-5 right-6 sm:top-7 sm:right-10 z-[150]">
        <button
          ref={menuBtnRef}
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex items-center gap-3 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white text-xs sm:text-sm font-medium cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 group"
          style={{
            background: "rgba(15, 15, 15, 0.88)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Animated hamburger lines */}
          <span className="flex flex-col gap-1 w-4 sm:w-4.5">
            <span className="block w-full h-[1.5px] bg-white rounded-full transition-all duration-300 group-hover:w-full" />
            <span
              className="block w-2/3 h-[1.5px] rounded-full transition-all duration-300 group-hover:w-full"
              style={{ background: "#d4ff00" }}
            />
            <span className="block w-full h-[1.5px] bg-white rounded-full transition-all duration-300 group-hover:w-full" />
          </span>

          {/* Label */}
          <span
            className="text-xs tracking-[0.2em] uppercase font-mono font-bold"
            style={{ color: "white" }}
          >
            Menu
          </span>
        </button>
      </div>

      {/* ===== FULLSCREEN OVERLAY MENU PANEL ===== */}
      <div
        ref={menuPanelRef}
        className="fixed inset-0 z-[200] flex"
        style={{
          background: "#0a0a0a",
          clipPath: "circle(0% at calc(100% - 40px) 40px)",
          pointerEvents: menuOpen ? "all" : "none",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          className="absolute z-[210] flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
          style={{
            top: "24px",
            right: "28px",
            width: "48px",
            height: "48px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "50%",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="1" y1="1" x2="15" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="1" x2="1" y2="15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Menu content */}
        <div
          ref={menuContentRef}
          className="flex flex-col md:flex-row w-full h-full p-8 md:p-16 pt-24 md:pt-16 max-w-7xl mx-auto"
        >
          {/* Left: Nav links */}
          <div className="flex flex-col justify-center flex-1 gap-2 md:gap-4">
            {navLinks.map(({ to, label }, idx) => (
              <div key={to} className="menu-item flex items-baseline gap-4 opacity-0">
                <span
                  className="text-xs sm:text-sm font-mono"
                  style={{ color: "#d4ff00" }}
                >
                  0{idx + 1}
                </span>
                <Link
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className="nav-wave-link text-white font-bold uppercase block transition-colors hover:text-[#d4ff00]"
                  style={{
                    fontSize: "clamp(2.8rem, 7vw, 6rem)",
                    letterSpacing: "-0.03em",
                    fontFamily: "'Space Grotesk', sans-serif",
                    lineHeight: 1.05,
                    textDecoration: "none",
                  }}
                >
                  {label.split("").map((char, i) => (
                    <span key={i}>
                      <i>{char}</i>
                      <i>{char}</i>
                    </span>
                  ))}
                </Link>
              </div>
            ))}
          </div>

          {/* Right: Info + video */}
          <div className="menu-item flex flex-col justify-between md:items-end mt-10 md:mt-0 gap-6 md:w-80 opacity-0">
            {/* Info */}
            <div className="md:text-right">
              <p
                className="text-xs tracking-widest uppercase mb-2 font-mono text-[#d4ff00]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Abhishek Mukherjee
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Inter', sans-serif" }}
              >
                Frontend Developer &amp; AI Automation Engineer based in Kolkata, India. Crafting cinematic web experiences and autonomous systems.
              </p>
            </div>

            {/* Video preview container */}
            <div
              className="w-full md:w-64 h-36 rounded-2xl overflow-hidden relative"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <video
                src={videoback}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            {/* Direct Contact & Socials */}
            <div className="flex flex-col gap-2 md:items-end">
              <a
                href="mailto:amitguddu2505@gmail.com"
                className="text-xs tracking-wide text-white/70 hover:text-[#d4ff00] transition-colors font-mono"
              >
                amitguddu2505@gmail.com
              </a>
              <div className="flex gap-5 mt-2">
                {[
                  { href: "https://github.com/AbhishekMukherjee-BD", label: "GitHub" },
                  { href: "https://www.instagram.com/_biker_daddy_/", label: "Instagram" },
                  { href: "https://wa.me/918910699662", label: "WhatsApp" },
                ].map(({ href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-widest uppercase transition-colors hover:text-[#d4ff00]"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Nav;
