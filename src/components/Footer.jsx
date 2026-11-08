import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Diagonal marquee banner */}
      <div
        className="super py-24 sm:py-32 min-h-[50vh] flex flex-col justify-center overflow-hidden relative"
        style={{ background: "#f0efea" }}
      >
        <div className="infinite-marquee-container relative">
          {/* Bar 1 */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%]"
            style={{ transform: "translateX(-50%) rotate(4deg)" }}
          >
            <div
              className="animate-marquee whitespace-nowrap py-4"
              style={{
                background: "#0a0a0a",
                color: "white",
                fontSize: "clamp(2rem, 5vw, 5rem)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span>
                Frontend Developer&nbsp;✦&nbsp;AI Automation Engineer&nbsp;✦&nbsp;n8n Workflows&nbsp;✦&nbsp;React & Next.js&nbsp;✦&nbsp;AI Agents&nbsp;✦&nbsp;GSAP&nbsp;✦&nbsp;
              </span>
              <span>
                Frontend Developer&nbsp;✦&nbsp;AI Automation Engineer&nbsp;✦&nbsp;n8n Workflows&nbsp;✦&nbsp;React & Next.js&nbsp;✦&nbsp;AI Agents&nbsp;✦&nbsp;GSAP&nbsp;✦&nbsp;
              </span>
            </div>
          </div>

          {/* Bar 2 */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%]"
            style={{ transform: "translateX(-50%) rotate(-4deg)" }}
          >
            <div
              className="animate-marquee-reverse whitespace-nowrap py-4"
              style={{
                background: "#d4ff00",
                color: "#0a0a0a",
                fontSize: "clamp(2rem, 5vw, 5rem)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <span>
                React.js&nbsp;✦&nbsp;TypeScript&nbsp;✦&nbsp;Python&nbsp;✦&nbsp;Tailwind CSS&nbsp;✦&nbsp;n8n Systems&nbsp;✦&nbsp;GSAP&nbsp;✦&nbsp;Vite&nbsp;✦&nbsp;Supabase&nbsp;✦&nbsp;
              </span>
              <span>
                React.js&nbsp;✦&nbsp;TypeScript&nbsp;✦&nbsp;Python&nbsp;✦&nbsp;Tailwind CSS&nbsp;✦&nbsp;n8n Systems&nbsp;✦&nbsp;GSAP&nbsp;✦&nbsp;Vite&nbsp;✦&nbsp;Supabase&nbsp;✦&nbsp;
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <footer
        className="relative overflow-hidden px-6 sm:px-10 lg:px-24 pt-16 pb-10"
        style={{ background: "#0a0a0a" }}
      >
        {/* Top: Brand + CTA */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link to="/">
              <h2
                className="text-white font-bold mb-3"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                }}
              >
                Abhishek
                <span style={{ color: "#d4ff00" }}>.</span>
              </h2>
            </Link>
            <p
              className="text-sm max-w-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}
            >
              Frontend Developer & AI Automation Engineer based in Kolkata, India. Building high-performance digital experiences and intelligent systems.
            </p>
          </div>

          {/* Email CTA */}
          <div className="flex flex-col items-start lg:items-end gap-4">
            <p
              className="text-xs uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}
            >
              Got a project?
            </p>
            <a
              href="mailto:amitguddu2505@gmail.com"
              className="flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
              style={{
                background: "#d4ff00",
                color: "#0a0a0a",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.02em",
                textDecoration: "none",
              }}
            >
              <i className="bi bi-envelope" />
              amitguddu2505@gmail.com
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "40px" }} />

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
          <div>
            <h3
              className="text-xs uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}
            >
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/work", label: "Work" },
                { to: "/contact", label: "Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm transition-colors hover:text-white"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-xs uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}
            >
              Social
            </h3>
            <ul className="space-y-3">
              {[
                { href: "https://github.com/AbhishekMukherjee-BD", label: "GitHub" },
                { href: "https://www.instagram.com/_biker_daddy_/", label: "Instagram" },
                { href: "https://wa.me/918910699662", label: "WhatsApp" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors hover:text-white"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="text-xs uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}
            >
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:amitguddu2505@gmail.com"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}
                >
                  amitguddu2505@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918910699662"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif", textDecoration: "none" }}
                >
                  +91 89106 99662
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="text-xs uppercase tracking-widest mb-5"
              style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Inter', sans-serif" }}
            >
              Location
            </h3>
            <p
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}
            >
              Kolkata, India<br />
              IST UTC+5:30
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif" }}
          >
            © {year} Abhishek Mukherjee. All rights reserved.
          </p>
          <p
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif" }}
          >
            Built with React + GSAP + Lenis
          </p>
        </div>

        {/* Background watermark */}
        <div
          className="absolute bottom-0 left-0 w-full leading-none pointer-events-none select-none"
          style={{
            fontSize: "clamp(6rem, 18vw, 18rem)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            color: "rgba(255,255,255,0.02)",
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
          }}
        >
          ABHISHEK
        </div>
      </footer>
    </>
  );
}

export default Footer;
