import React from "react";
import Nav from "../components/Nav";
import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TextSplitter from "../components/text/TextSplitter.jsx";
import VectorPortraitHero from "../components/VectorPortraitHero.jsx";
import pimage from "../assets/images/profile/portrait_optimized.jpg";
import Footer from "../components/Footer.jsx";
import useMagnetic from "../Hooks/useMagnetic.jsx";
import { Link } from "react-router-dom";
import GradientASCII from "../components/GradientASCII.jsx";
import { WorksWheel } from "../components/ui/works-wheel";
import { wheelProjects } from "../data/homeWheelProjects";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const pathRef = useRef(null);
  const textAnimationRef = useRef(null);
  const textAnimationRef2 = useRef(null);
  const marqueeRef = useRef(null);
  const scalerRef = useRef(null);
  const scalerRef2 = useRef(null);
  const timelineRef = useRef(null);
  const button1Ref = useRef(null);
  const button2Ref = useRef(null);
  const statsRef = useRef(null);
  const servicesSectionRef = useRef(null);
  const cgpaNumberRef = useRef(null);
  const shippedNumberRef = useRef(null);

  // Reference hooks for Pinned 3D WorksWheel
  const wheelSectionRef = useRef(null);
  const wheelStickyRef = useRef(null);
  const worksWheelRef = useRef(null);
  const gradientAsciiRef = useRef(null);
  const wheelTriggerRef = useRef(null);

  // Reference hooks for 1:1 Side Social Rail and Editorial Hero
  const sideRailRef = useRef(null);
  const railTopLineRef = useRef(null);
  const railBottomLineRef = useRef(null);
  const railIconsRef = useRef([]);
  const heroHeaderRef = useRef(null);
  const heroContactRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroEntranceDoneRef = useRef(false);

  useMagnetic(button1Ref, 0.4, true);
  useMagnetic(button2Ref, 0.4, true);

  // Hero editorial text entrance & side vertical rail animation (Single-Run, Zero-Lag, Parallel)
  useEffect(() => {
    const triggerHeroEntrance = () => {
      // Guard: strictly run ONCE to eliminate any double-fire or flickering
      if (heroEntranceDoneRef.current) return;
      heroEntranceDoneRef.current = true;

      const tl = gsap.timeline();

      // 1. Side social rail entrance (starts immediately at t=0)
      if (railTopLineRef.current && railBottomLineRef.current) {
        tl.fromTo(
          railTopLineRef.current,
          { scaleY: 0 },
          { scaleY: 1, duration: 0.6, ease: "power2.out" },
          0
        )
          .fromTo(
            railIconsRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" },
            0.15
          )
          .fromTo(
            railBottomLineRef.current,
            { scaleY: 0 },
            { scaleY: 1, duration: 0.6, ease: "power2.out" },
            0.3
          );
      }

      // 2. Editorial typography entrance in parallel (no lagging behind side rail)
      if (heroHeaderRef.current) {
        tl.fromTo(
          heroHeaderRef.current,
          { y: -15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" },
          0.05
        );
      }

      if (heroContactRef.current) {
        tl.fromTo(
          heroContactRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          0.1
        );
      }

      if (heroTitleRef.current) {
        tl.fromTo(
          heroTitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power3.out" },
          0.15
        );
      }
    };

    if (window.__portfolioExperienceReady) {
      triggerHeroEntrance();
    } else {
      let timer = null;
      const handleReady = () => {
        if (timer) clearTimeout(timer);
        triggerHeroEntrance();
      };

      window.addEventListener("portfolio-ready", handleReady, { once: true });
      timer = setTimeout(() => {
        window.removeEventListener("portfolio-ready", handleReady);
        triggerHeroEntrance();
      }, 2200);

      return () => {
        window.removeEventListener("portfolio-ready", handleReady);
        if (timer) clearTimeout(timer);
      };
    }
  }, []);

  // Fade out side rail when scrolling past hero
  useEffect(() => {
    const railScroll = ScrollTrigger.create({
      trigger: "#hero-section",
      start: "center top",
      end: "bottom top",
      onEnter: () => {
        if (sideRailRef.current) gsap.to(sideRailRef.current, { opacity: 0, duration: 0.35 });
      },
      onLeaveBack: () => {
        if (sideRailRef.current) gsap.to(sideRailRef.current, { opacity: 1, duration: 0.35 });
      },
    });

    return () => railScroll.kill();
  }, []);

  // Services cards scroll-in animation
  useEffect(() => {
    const section = servicesSectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll(".service-card");
    const triggers = [];

    cards.forEach((card, i) => {
      const anim = gsap.fromTo(
        card,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 55%",
            scrub: false,
            once: true,
          },
          delay: i * 0.08,
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  // 2-second metric counting animation when stats scroll into view
  useEffect(() => {
    if (!statsRef.current) return;

    const statsObj = { cgpa: 0, shipped: 0 };

    const counterTrigger = ScrollTrigger.create({
      trigger: statsRef.current,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(statsObj, {
          cgpa: 9.67,
          shipped: 10,
          duration: 2.0,
          ease: "power2.out",
          onUpdate: () => {
            if (cgpaNumberRef.current) {
              cgpaNumberRef.current.textContent = statsObj.cgpa.toFixed(2);
            }
            if (shippedNumberRef.current) {
              shippedNumberRef.current.textContent = `${Math.round(statsObj.shipped)}+`;
            }
          },
        });
      },
    });

    return () => counterTrigger.kill();
  }, []);

  useLayoutEffect(() => {
    // Arc animation (signature green ring dome elevation as it scrolls up from the landing page)
    gsap.fromTo(
      pathRef.current,
      { y: 24, scaleY: 0.82 },
      {
        y: 0,
        scaleY: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".arch-section",
          start: "top bottom",
          end: "top 60%",
          scrub: 1.2,
        },
      }
    );

    // Text reveal
    const chars = textAnimationRef.current.querySelectorAll("span > span");
    const chars2 = textAnimationRef2.current.querySelectorAll("span > span");

    gsap.to(chars, {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: ".about-section",
        start: "20% 60%",
        end: "20% 60%",
        scrub: 2,
      },
    });

    gsap.to(chars2, {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: ".text-part-1",
        start: "70% 60%",
        end: "70% 60%",
        scrub: 2,
      },
    });

    // Image zoom: smoothly zoom white container from 0.88 up to 0.985 as photo approaches center screen
    gsap.fromTo(
      scalerRef.current,
      {
        scale: 0.88,
        borderRadius: "28px",
      },
      {
        scale: 0.985,
        borderRadius: "14px",
        ease: "power1.out",
        scrollTrigger: {
          trigger: scalerRef2.current || ".photo-text-section",
          start: "top 95%",
          end: "center center",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      }
    );

    // Inner photo zoom: expands smoothly from 0.84 to 0.985 right as photo reaches viewport center
    gsap.fromTo(
      scalerRef2.current,
      {
        scale: 0.84,
      },
      {
        scale: 0.985,
        ease: "power1.out",
        scrollTrigger: {
          trigger: scalerRef2.current || ".photo-text-section",
          start: "top 95%",
          end: "center center",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      }
    );

    // Timeline progress
    gsap.to(timelineRef.current, {
      "--progress": "100%",
      ease: "none",
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });

    // Ensure body background is luxury black on Home page
    document.body.style.backgroundColor = "#0a0a0a";
    document.body.style.color = "#f0efea";

    // Marquee with scroll direction reversal
    const marquee = marqueeRef.current;
    let x = 0;
    let direction = -1;
    const contentWidth = marquee.scrollWidth / 4;

    const dirTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        direction = self.direction === 1 ? -1 : 1;
      },
    });

    const setX = gsap.quickSetter(marquee, "x", "px");
    const speed = 90;

    const animateMarquee = (_, delta) => {
      x += (speed * direction * delta) / 1000;
      if (x <= -contentWidth) x += contentWidth;
      if (x >= 0) x -= contentWidth;
      setX(x);
    };

    gsap.ticker.add(animateMarquee);

    return () => {
      gsap.ticker.remove(animateMarquee);
      dirTrigger.kill();
    };
  }, []);

  // Pinned scroll-locking for 3D WorksWheel showcase
  useLayoutEffect(() => {
    if (!wheelSectionRef.current || !wheelStickyRef.current) return;

    // Pin distance: mobile uses a calibrated ~380px per item so touch scrolling feels fluid and natural
    const totalItems = wheelProjects.length;
    const isMobileWheel = typeof window !== "undefined" && window.innerWidth < 768;
    const pinDistance = isMobileWheel
      ? totalItems * 380
      : Math.max(window.innerHeight * 4.2, totalItems * 500);

    const trigger = ScrollTrigger.create({
      trigger: wheelSectionRef.current,
      pin: wheelStickyRef.current,
      start: "top top",
      end: `+=${pinDistance}`,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => {
        gradientAsciiRef.current?.resetIntro();
      },
      onUpdate: (self) => {
        worksWheelRef.current?.setProgress(self.progress);
        gradientAsciiRef.current?.setScrollProgress(self.progress, self.getVelocity?.() || 0);
      },
    });

    wheelTriggerRef.current = trigger;

    // Entrance trigger: triggers the intro decode animation as user approaches the section
    const entranceTrigger = ScrollTrigger.create({
      trigger: wheelSectionRef.current,
      start: "top 75%",
      onEnter: () => {
        gradientAsciiRef.current?.resetIntro();
      },
    });

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      trigger.kill();
      entranceTrigger.kill();
    };
  }, []);

  const handleWheelItemSelect = (index) => {
    if (!wheelTriggerRef.current) return;
    const trigger = wheelTriggerRef.current;
    const total = wheelProjects.length;
    const startHold = 0.02;
    const endHold = 0.90;
    const targetProgress = startHold + ((index + 1) / total) * (endHold - startHold);
    const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);
    if (window.lenis) {
      window.lenis.scrollTo(targetScroll, { duration: 1.0 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  function MarqueeContent() {
    const items = [
      "Frontend Developer",
      "AI Automation Engineer",
      "n8n Workflows",
      "React & Next.js",
      "Supabase Systems",
      "GSAP Animations",
    ];
    return (
      <div className="flex items-center">
        {items.map((item, i) => (
          <div key={i} className="flex items-center">
            <span
              className="text-[7vw] font-bold uppercase mx-8 whitespace-nowrap"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#0a0a0a" }}
            >
              {item}
            </span>
            <span className="text-[3vw] mx-2" style={{ color: "#d4ff00" }}>
              ✦
            </span>
          </div>
        ))}
      </div>
    );
  }

  // ── Service card with hover reveal ──
  const ServiceCard = ({ number, title, description, icon, tags }) => {
    return (
      <div
        className="service-card group relative overflow-hidden rounded-2xl p-8 md:p-10 cursor-pointer opacity-0"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          transition: "border-color 0.4s ease, background 0.4s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(212,255,0,0.25)";
          e.currentTarget.style.background = "rgba(212,255,0,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
        }}
      >
        <div className="flex items-start justify-between mb-8">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "#d4ff00", color: "#0a0a0a" }}
          >
            {icon}
          </div>
          <span
            className="text-xs font-mono"
            style={{ color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}
          >
            {number}
          </span>
        </div>

        <h3
          className="text-xl md:text-2xl font-bold mb-4 leading-snug"
          style={{
            color: "white",
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h3>

        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Inter', sans-serif" }}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.4)",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.03em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="absolute bottom-8 right-8 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0"
          style={{ background: "#d4ff00" }}
        >
          <i className="bi bi-arrow-up-right text-black text-xs" />
        </div>
      </div>
    );
  };

  // ── Work card (premium redesign) ──
  const WorkCard = ({ title, tag, img, url, index }) => {
    return (
      <div
        className="group cursor-pointer"
        onClick={() => window.open(url, "_blank")}
      >
        <div
          className="relative overflow-hidden rounded-2xl mb-4"
          style={{ background: "#e8e7e2" }}
        >
          <div
            className="absolute top-4 left-4 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold"
            style={{ background: "#0a0a0a", color: "white" }}
          >
            {String(index).padStart(2, "0")}
          </div>

          <div
            className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
            style={{
              background: "#d4ff00",
              color: "#0a0a0a",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {tag}
          </div>

          <div
            className="overflow-hidden relative"
            style={{ height: "260px", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}
          >
            <img
              src={img}
              alt={title}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: "rgba(10,10,10,0.55)", backdropFilter: "blur(4px)" }}
          >
            <div
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm"
              style={{ background: "#d4ff00", color: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}
            >
              Visit Site
              <i className="bi bi-arrow-up-right text-xs" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-start px-1">
          <div>
            <h3
              className="text-base font-semibold leading-snug mb-0.5 group-hover:underline"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.01em",
                textDecorationThickness: "1px",
                textUnderlineOffset: "3px",
                color: "#0a0a0a",
              }}
            >
              {title}
            </h3>
            <p
              className="text-xs"
              style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}
            >
              {tag}
            </p>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: "#0a0a0a", color: "white" }}
          >
            <i className="bi bi-arrow-up-right text-xs" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Nav />

      {/* ===== SECTION 1: HERO PORTRAIT LANDING (Exact 1:1 match with abhishek-brown-iota.vercel.app) ===== */}
      <section
        id="hero-section"
        className="hero-section w-full h-screen h-[100dvh] min-h-[100dvh] relative flex items-center justify-center overflow-hidden bg-[#050505]"
      >
        {/* Radial Depth Overlay */}
        <div
          className="hero-section-overlay absolute inset-0 z-12 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(5, 5, 5, 0.1) 0%, rgba(5, 5, 5, 0.85) 100%)",
          }}
        />

        {/* Center: Vector Wireframe Portrait Component */}
        <div className="hero-container w-full h-full flex items-center justify-center relative z-10 box-border">
          <VectorPortraitHero />
        </div>

        {/* Left Side Vertical Social Rail (Matches abhisek-portfolio-2.vercel.app with GSAP entrance) */}
        <div
          ref={sideRailRef}
          className="absolute left-6 md:left-10 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-5 z-20 pointer-events-auto"
        >
          <div ref={railTopLineRef} className="w-px h-14 bg-white/25 origin-top" />
          {[
            { href: "https://github.com/AbhishekMukherjee-BD", icon: "bi-github", label: "GitHub" },
            { href: "https://www.instagram.com/_biker_daddy_/", icon: "bi-instagram", label: "Instagram" },
            { href: "https://wa.me/918910699662", icon: "bi-whatsapp", label: "WhatsApp" },
          ].map(({ href, icon, label }, idx) => (
            <a
              key={icon}
              ref={(el) => (railIconsRef.current[idx] = el)}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/50 hover:text-white hover:scale-125 transition-all duration-300 text-base flex items-center justify-center"
            >
              <i className={`bi ${icon}`} />
            </a>
          ))}
          <div ref={railBottomLineRef} className="w-px h-14 bg-white/25 origin-bottom" />
        </div>

        {/* 4-Corner Editorial Typography Overlay */}
        <div className="hero-content-overlay absolute inset-0 z-15 flex flex-col justify-between pointer-events-none p-6 sm:p-10 md:p-14 lg:p-16">
          {/* Top Row: AM Logo + Portfolio Experience (Left) & Est. 2024 (Right) */}
          <div className="hero-header flex justify-between items-start w-full opacity-0" ref={heroHeaderRef}>
            <div className="pointer-events-auto">
              <Link to="/" style={{ textDecoration: "none" }} className="group">
                <span className="hero-logo-editorial">AM</span>
                <div className="hero-tagline-editorial group-hover:text-white/70 transition-colors">
                  Portfolio Experience
                </div>
              </Link>
            </div>
            <div className="text-right pr-24 sm:pr-32">
              <span className="hero-tagline-editorial" style={{ color: "rgba(255, 255, 255, 0.4)" }}>
                Est. 2024
              </span>
            </div>
          </div>

          {/* Bottom Row: Direct Contact Links (Left) & Display Name + Subtitle (Right) */}
          <div className="hero-footer-editorial flex flex-col md:flex-row justify-between items-start md:items-end w-full gap-6 md:gap-0 mt-auto">
            {/* Bottom Left Contact Details */}
            <div className="hero-contact-editorial opacity-0 pointer-events-auto" ref={heroContactRef}>
              <p>
                <a href="mailto:amitguddu2505@gmail.com">amitguddu2505@gmail.com</a>
              </p>
              <p>
                <a href="tel:+918910699662">+91 89106 99662</a>
              </p>
              <p style={{ marginTop: "10px" }}>
                <a
                  href="https://github.com/AbhishekMukherjee-BD"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Profile
                </a>
              </p>
            </div>

            {/* Bottom Right Title Group */}
            <div className="hero-title-group-editorial opacity-0 pointer-events-auto text-right" ref={heroTitleRef}>
              <h1 className="hero-name-editorial">
                Abhishek Mukherjee
              </h1>
              <p className="hero-subtitle-editorial">
                Frontend Developer &nbsp;|&nbsp; AI Automation &amp; Workflow Engineer &nbsp;|&nbsp; AI Chatbot Solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT ARCH SECTION ===== */}
      <div className="arch-section about-section relative overflow-visible z-20" style={{ background: "#0a0a0a" }}>
        {/* Signature Glowing Green Ring Arch Dome crowning the top of the About section */}
        <div
          ref={pathRef}
          className="arc-compo relative w-full h-[60px] sm:h-[90px] md:h-[120px] -mt-[58px] sm:-mt-[88px] md:-mt-[118px] pointer-events-none z-30 overflow-visible"
        >
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-full block overflow-visible"
          >
            <defs>
              {/* Luminous Neon Green Glow Gradient: Bright and striking at the center peak, tapering smoothly at edges */}
              <linearGradient id="arcRimGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d4ff00" stopOpacity="0.25" />
                <stop offset="18%" stopColor="#d4ff00" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#d4ff00" stopOpacity="1" />
                <stop offset="82%" stopColor="#d4ff00" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#d4ff00" stopOpacity="0.25" />
              </linearGradient>

              {/* Multi-stage Neon Aura Filter */}
              <filter id="arcGlow" x="-20%" y="-40%" width="140%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Solid #0a0a0a black dome fill beneath the curve, merging seamlessly into the About section body */}
            <path
              d="M 0 120 Q 720 0 1440 120 L 1440 120 L 0 120 Z"
              fill="#0a0a0a"
            />

            {/* Glowing neon green ring aura */}
            <path
              d="M 0 120 Q 720 0 1440 120"
              fill="none"
              stroke="url(#arcRimGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#arcGlow)"
            />

            {/* Sharp core neon line */}
            <path
              d="M 0 120 Q 720 0 1440 120"
              fill="none"
              stroke="#d4ff00"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeOpacity="0.95"
            />
          </svg>
        </div>

        <div className="about-text py-8 pb-24">
          <div
            ref={textAnimationRef}
            className="text-part-1 text-white text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-relaxed text-center pt-4 max-w-5xl mx-auto px-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
          >
            <TextSplitter
              text="I'm Abhishek Mukherjee, a Frontend Developer & AI Automation Engineer crafting fast, scalable, and immersive digital experiences that merge creativity with engineering precision."
              type="word"
              style1={true}
            />
          </div>

          <div
            ref={textAnimationRef2}
            className="text-part-2 font-light text-white text-sm sm:text-lg md:text-xl lg:text-2xl text-center pt-8 max-w-4xl mx-auto px-6"
            style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}
          >
            <TextSplitter
              text="I specialize in developing SaaS platforms, autonomous AI workflows, and interactive web experiences using React.js, Next.js, and Supabase."
              type="word"
              style1={true}
            />
          </div>

          <div className="my-14 flex justify-center px-4">
            <Link to="/about" ref={button1Ref} className="btn-pill">
              <span className="btn-main" style={{ background: "#d4ff00", color: "#0a0a0a", fontFamily: "'Inter', sans-serif" }}>
                About Me
              </span>
              <span className="btn-icon" style={{ background: "#d4ff00", color: "#0a0a0a", borderLeft: "1px solid rgba(0,0,0,0.1)" }}>
                <i className="bi bi-arrow-up-right" />
              </span>
            </Link>
          </div>

          <div
            className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 w-full md:w-2/3 mx-auto px-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif" }}>
              Scroll Down <i className="bi bi-arrow-down ml-1" />
            </p>
            <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif" }}>
              Let's connect and build something amazing together!
            </p>
          </div>
        </div>
      </div>

      {/* ===== PHOTO + MARQUEE SECTION ===== */}
      <div className="photo-text-section">
        <section className="overflow-hidden whitespace-nowrap" style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            className="scroller-image bg-white overflow-hidden"
            ref={scalerRef}
            style={{ willChange: "transform, border-radius", transformOrigin: "center center" }}
          >
            <div className="flex w-max py-4" ref={marqueeRef}>
              <MarqueeContent />
              <MarqueeContent />
              <MarqueeContent />
              <MarqueeContent />
            </div>

            <div className="w-full relative overflow-hidden">
              <img
                src={pimage}
                ref={scalerRef2}
                className="w-full px-3 sm:px-5 md:px-8 lg:px-10 py-3 md:py-4"
                style={{ willChange: "transform", transformOrigin: "center center" }}
                alt="Abhishek Mukherjee"
              />
            </div>

            <div className="text-section px-6 sm:px-10 md:px-16 lg:px-24 py-10 whitespace-normal text-[#0a0a0a]" style={{ color: "#0a0a0a" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <p
                    className="text-xl sm:text-2xl md:text-3xl text-justify pb-6 font-semibold"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: "-0.02em",
                      color: "#0a0a0a",
                      lineHeight: 1.35,
                    }}
                  >
                    Driving measurable growth and engagement through thoughtful design and engineering.
                  </p>
                </div>
                <div>
                  <p
                    className="text-base md:text-lg text-justify pb-6 leading-relaxed"
                    style={{
                      color: "#404040",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.7,
                    }}
                  >
                    Every product I build starts with understanding user goals and translating them into intuitive, high-performance experiences. From concept to launch, I focus on meaningful results—boosting user engagement, retention, and overall business impact.
                  </p>
                </div>
              </div>

              <div
                ref={statsRef}
                className="grid grid-cols-2 gap-8 mt-10 pt-10"
                style={{ borderTop: "1px solid rgba(0,0,0,0.12)" }}
              >
                {/* Metric 1: Academic CGPA (0.00 -> 9.67 in 2s) */}
                <div className="px-2">
                  <p
                    className="text-xs uppercase tracking-widest mb-3 font-bold"
                    style={{
                      color: "#0a0a0a",
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: "0.14em",
                    }}
                  >
                    Academic CGPA
                  </p>
                  <h2
                    ref={cgpaNumberRef}
                    className="text-5xl sm:text-6xl md:text-7xl pb-2 font-extrabold"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: "#d4ff00",
                      WebkitTextStroke: "2.5px #0a0a0a",
                      textShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",
                      lineHeight: 1,
                    }}
                  >
                    0.00
                  </h2>
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: "#404040", fontFamily: "'Inter', sans-serif" }}
                  >
                    Sister Nivedita University
                  </p>
                </div>

                {/* Metric 2: Shipped Systems (0+ -> 10+ in 2s) */}
                <div className="px-2">
                  <p
                    className="text-xs uppercase tracking-widest mb-3 font-bold"
                    style={{
                      color: "#0a0a0a",
                      fontFamily: "'Inter', sans-serif",
                      letterSpacing: "0.14em",
                    }}
                  >
                    Shipped Systems
                  </p>
                  <h2
                    ref={shippedNumberRef}
                    className="text-5xl sm:text-6xl md:text-7xl pb-2 font-extrabold"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: "#d4ff00",
                      WebkitTextStroke: "2.5px #0a0a0a",
                      textShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",
                      lineHeight: 1,
                    }}
                  >
                    0+
                  </h2>
                  <p
                    className="text-xs sm:text-sm font-medium"
                    style={{ color: "#404040", fontFamily: "'Inter', sans-serif" }}
                  >
                    Production web &amp; AI systems
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===== SERVICES SECTION ===== */}
      <section
        ref={servicesSectionRef}
        className="px-6 sm:px-8 md:px-12 lg:px-20 py-24"
        style={{ background: "#0a0a0a" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-6">
          <h2
            className="leading-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              color: "white",
              maxWidth: "540px",
            }}
          >
            What I do
            <span style={{ color: "#d4ff00" }}> best.</span>
          </h2>
          <p
            className="text-sm max-w-xs leading-relaxed"
            style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}
          >
            End-to-end expertise across the full product lifecycle — from design to deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              number: "01",
              icon: "⚡",
              title: "Frontend & Animated Interfaces",
              description:
                "Building scalable, high-performance web applications using React, Next.js, and GSAP. Pixel-perfect implementations with responsive layouts and micro-interactions.",
              tags: ["React", "Next.js", "GSAP", "Tailwind CSS", "TypeScript"],
            },
            {
              number: "02",
              icon: "✦",
              title: "AI Automations & Agents",
              description:
                "Designing unattended n8n automation workflows, custom AI agent toolsets, and webhook architectures connecting LLM APIs to production databases.",
              tags: ["n8n", "OpenRouter", "AI Agents", "Webhooks", "Python"],
            },
            {
              number: "03",
              icon: "◈",
              title: "Full Stack & Supabase Systems",
              description:
                "Robust backend data layers with Supabase, PostgreSQL, and Node.js. Implementing secure authentication, real-time sync, and Row-Level Security policies.",
              tags: ["Supabase", "PostgreSQL", "Node.js", "REST APIs", "RLS"],
            },
            {
              number: "04",
              icon: "◎",
              title: "API & System Architecture",
              description:
                "Production-grade APIs with strong focus on security, performance, and reliability. Structured data management, cloud hosting, and CI/CD pipelines.",
              tags: ["REST", "JWT", "PostgreSQL", "Docker", "Vercel", "CI/CD"],
            },
          ].map((card) => (
            <ServiceCard key={card.number} {...card} />
          ))}
        </div>
      </section>

      {/* ===== LATEST WORK (PINNED 3D WORKS WHEEL + GRADIENT ASCII BACKDROP) ===== */}
      <section
        ref={wheelSectionRef}
        className="latest-work relative w-full"
        style={{ background: "#050505", color: "#caf0f8" }}
      >
        <div
          ref={wheelStickyRef}
          className="w-full h-screen h-[100dvh] min-h-[100dvh] relative overflow-hidden flex flex-col justify-between"
        >
          {/* ── Layer 0: Full-Bleed Live GradientASCII Background (Behind Everything) ── */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <GradientASCII
              ref={gradientAsciiRef}
              colors={[
                "#03045e",
                "#023e8a",
                "#0077b6",
                "#0096c7",
                "#00b4d8",
                "#48cae4",
                "#90e0ef",
                "#ade8f4"
              ]}
              shape="horizon"
              characters=" =+xX0S8#@"
              cellSize={15}
              density={0.8}
              flow={0.6}
              intro={true}
              lightMode={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* ── Layer 1: Section Header (z-20) ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between px-4 sm:px-8 md:px-16 lg:px-20 pt-4 sm:pt-6 gap-3 sm:gap-4 z-20 flex-shrink-0">
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-1.5 sm:mb-2"
                style={{ color: "#90e0ef", fontFamily: "'Inter', sans-serif" }}
              >
                Recent Projects
              </p>
              <h2
                className="leading-tight text-white"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  fontSize: "clamp(1.75rem, 4.5vw, 3.6rem)",
                  color: "#ffffff",
                  textShadow: "0 2px 16px rgba(3,4,94,0.8)",
                }}
              >
                Work that speaks
                <br />for itself
              </h2>
            </div>
            <Link to="/work" ref={button2Ref} className="btn-pill self-start sm:self-auto">
              <span className="btn-main" style={{ fontFamily: "'Inter', sans-serif" }}>
                View All Work
              </span>
              <span className="btn-icon">
                <i className="bi bi-arrow-up-right text-xs" />
              </span>
            </Link>
          </div>

          {/* ── Layer 2: 3D WorksWheel Stage (z-10, transparent background so ASCII gradient shines through) ── */}
          <div className="w-full flex-1 min-h-0 relative z-10 px-2 sm:px-8 md:px-12 pb-3">
            <WorksWheel
              ref={worksWheelRef}
              items={wheelProjects}
              label="Featured Works"
              action="Visit Site"
              theme="dark"
              scrollPinned={true}
              onSelect={handleWheelItemSelect}
              className="w-full h-full bg-transparent text-white"
            />
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE TIMELINE (1:1 with abhisek-portfolio-2.vercel.app) ===== */}
      <section
        className="exp px-6 sm:px-10 lg:px-24 py-24 relative overflow-hidden"
        style={{ background: "#0a0a0a" }}
      >
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl text-center mb-20 leading-tight"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "white",
          }}
        >
          My Journey
        </h2>

        <div className="relative max-w-6xl mx-auto">
          {/* Central Vertical Timeline Track with Glowing Draw-Down Progress */}
          <div
            ref={timelineRef}
            className="timeline w-[2px] absolute left-3 md:left-1/2 top-2 bottom-8 -translate-x-1/2 opacity-100"
          />

          {[
            {
              company: "Freelance Frontend & AI Engineer",
              subtitle: "Remote • Autonomous Systems & Web Apps",
              period: "Feb 2024 – Present",
              desc: "Designed and built complete, production-ready web platforms and automated workflows. Engineered a multi-stage n8n pipeline for an AI-powered patent risk SaaS tool integrating Supabase validation, prompt-optimized LLM analysis, and custom GSAP/Canvas analytics dashboards.",
              side: "left",
            },
            {
              company: "Sister Nivedita University, Kolkata",
              subtitle: "B.Tech in Computer Science & Engineering (AI & ML)",
              period: "2022 – 2026",
              desc: "Pursuing B.Tech CSE (AIML) with an Academic CGPA of 9.67. Focused on autonomous agentic systems, modern web engineering, distributed data structures, and production-grade Supabase architectures.",
              side: "right",
            },
            {
              company: "Campus Ambassador & Outreach",
              subtitle: "eDC, IIT Delhi & Kshitij, IIT Kharagpur",
              period: "2023 – 2024",
              desc: "Led public relations and student outreach initiatives for flagship entrepreneurship and tech festivals across premier national institutes, driving technical awareness, cross-campus collaboration, and developer engagement.",
              side: "left",
            },
          ].map(({ company, subtitle, period, desc, side }) => (
            <div key={company} className="relative mb-16 md:mb-24">
              {/* Content Box: Alternating Left and Right on Desktop, Clean Indented on Mobile */}
              <div
                className={`${
                  side === "left"
                    ? "md:w-1/2 md:pr-16 md:text-right ml-10 md:ml-0"
                    : "md:w-1/2 md:ml-auto md:pl-16 ml-10 md:text-left"
                }`}
              >
                <h3
                  className="text-xl sm:text-2xl lg:text-4xl font-bold"
                  style={{
                    color: "white",
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {company}
                </h3>
                {subtitle && (
                  <p
                    className="text-sm mt-1"
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {subtitle}
                  </p>
                )}
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: "#d4ff00", fontFamily: "'Inter', sans-serif" }}
                >
                  {period}
                </p>
                <p
                  className="text-sm font-light mt-4 leading-7 text-justify md:text-inherit"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {desc}
                </p>
              </div>

              {/* Node Dot on the Central Timeline */}
              <div
                className="absolute left-3 md:left-1/2 w-3.5 h-3.5 rounded-full -translate-x-1/2 top-2"
                style={{
                  background: "#d4ff00",
                  border: "2px solid #0a0a0a",
                  boxShadow: "0 0 12px rgba(212,255,0,0.45)",
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes scrollDown {
          0%   { transform: translateY(-100%); }
          50%  { transform: translateY(0%);    }
          100% { transform: translateY(100%);  }
        }
      `}</style>
    </>
  );
}

export default Home;
