import React, { useEffect, useRef } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import gsap from "gsap";

function Contact() {
  const headingRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      headingRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.3 }
    ).fromTo(
      contentRef.current?.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
      "-=0.5"
    );
    return () => tl.kill();
  }, []);

  return (
    <div style={{ background: "#f0efea", color: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav />

      <main className="flex-grow px-6 sm:px-10 lg:px-24 py-16 max-w-7xl mx-auto w-full">
        {/* Heading */}
        <div className="overflow-hidden mb-16">
          <h1
            ref={headingRef}
            className="font-bold leading-none text-[#0a0a0a]"
            style={{
              fontSize: "clamp(4rem, 12vw, 10rem)",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.04em",
              color: "#0a0a0a",
              opacity: 0,
            }}
          >
            Let's<br />Talk
          </h1>
        </div>

        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          {/* Left: Info */}
          <div className="space-y-12">
            <p
              className="text-lg md:text-xl leading-relaxed max-w-md"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}
            >
              Got a project in mind? I'd love to hear about it. Let's create something great together.
            </p>

            {/* Contact items */}
            <div className="space-y-6">
              {[
                {
                  label: "Email",
                  value: "amitguddu2505@gmail.com",
                  href: "mailto:amitguddu2505@gmail.com",
                  icon: "bi-envelope",
                },
                {
                  label: "Phone",
                  value: "+91 89106 99662",
                  href: "tel:+918910699662",
                  icon: "bi-telephone",
                },
                {
                  label: "WhatsApp",
                  value: "+91 89106 99662",
                  href: "https://wa.me/918910699662",
                  icon: "bi-whatsapp",
                },
              ].map(({ label, value, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-5 group"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white flex-shrink-0"
                    style={{
                      border: "1px solid rgba(10,10,10,0.15)",
                      background: "white",
                      color: "#0a0a0a",
                    }}
                  >
                    <i className={`bi ${icon} text-base`} />
                  </div>
                  <div>
                    <p
                      className="text-xs uppercase tracking-widest mb-1"
                      style={{ color: "#999", fontFamily: "'Inter', sans-serif" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-sm font-medium group-hover:underline"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#0a0a0a" }}
                    >
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-5"
                style={{ color: "#999", fontFamily: "'Inter', sans-serif" }}
              >
                Social
              </p>
              <div className="flex gap-4">
                {[
                  { label: "GitHub", href: "https://github.com/AbhishekMukherjee-BD", icon: "bi-github" },
                  { label: "Instagram", href: "https://www.instagram.com/_biker_daddy_/", icon: "bi-instagram" },
                  { label: "WhatsApp", href: "https://wa.me/918910699662", icon: "bi-whatsapp" },
                ].map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:bg-black hover:text-white"
                    style={{
                      border: "1px solid rgba(10,10,10,0.15)",
                      background: "white",
                      color: "#0a0a0a",
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                    }}
                  >
                    <i className={`bi ${icon}`} />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Big CTA */}
          <div className="flex flex-col justify-between gap-10">
            <div
              className="p-8 sm:p-12 rounded-3xl flex flex-col gap-6"
              style={{ background: "#0a0a0a" }}
            >
              <p
                className="text-xs uppercase tracking-widest"
                style={{ color: "#d4ff00", fontFamily: "'Inter', sans-serif" }}
              >
                Available for work
              </p>
              <h3
                className="text-2xl sm:text-3xl font-bold leading-tight"
                style={{
                  color: "white",
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                Let's build something extraordinary together
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}
              >
                Whether you have an AI automation challenge, modern web project, or want to collaborate — my inbox is always open.
              </p>
              <a
                href="mailto:amitguddu2505@gmail.com"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 self-start"
                style={{
                  background: "#d4ff00",
                  color: "#0a0a0a",
                  fontFamily: "'Inter', sans-serif",
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                }}
              >
                Send me an email
                <i className="bi bi-arrow-up-right" />
              </a>

              {/* Location & time */}
              <div
                className="flex items-center gap-3 pt-6 mt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#d4ff00" }}
                />
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}
                >
                  Kolkata, India · IST +5:30 · Usually responds within 24h
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
