import React, { useEffect, useRef } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function About() {
  const headingRef = useRef(null);
  const bioRef = useRef(null);
  const tagsRef = useRef(null);
  const eduRef = useRef(null);

  const techStack = {
    "Frontend Development": ["React 19", "Next.js", "Vite", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 / CSS3", "Responsive UI"],
    "AI & Automation": ["n8n Workflows", "LLM Prompt Engineering", "AI Chatbots & Agents", "API Orchestration", "Structured Report Gen"],
    "Creative & Motion": ["GSAP 3", "ScrollTrigger", "Canvas Sequences", "Lenis Smooth Scroll", "Vector Tracing"],
    "Backend & Cloud": ["Supabase", "RESTful APIs", "SQL / PostgreSQL", "Node.js", "Vercel", "Render"],
    "Engineering Tools": ["Git", "GitHub", "Postman", "VS Code", "Vite DevTools"],
  };

  useEffect(() => {
    // Heading reveal
    gsap.fromTo(
      headingRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 }
    );

    // Bio stagger
    const paras = bioRef.current?.querySelectorAll("p");
    if (paras) {
      gsap.fromTo(
        paras,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.5 }
      );
    }

    // Tech tags
    const tags = tagsRef.current?.querySelectorAll(".skill-tag");
    if (tags) {
      gsap.fromTo(
        tags,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.03,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: tagsRef.current,
            start: "top 75%",
          },
        }
      );
    }

    // Education & Leadership Cards
    const eduCards = eduRef.current?.querySelectorAll(".edu-card");
    if (eduCards) {
      gsap.fromTo(
        eduCards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: eduRef.current,
            start: "top 80%",
          },
        }
      );
    }

    return () => ScrollTrigger.killAll();
  }, []);

  const categoryIcons = {
    "Frontend Development": "⚡",
    "AI & Automation": "✦",
    "Creative & Motion": "◈",
    "Backend & Cloud": "◎",
    "Engineering Tools": "⊕",
  };

  return (
    <div style={{ background: "#f0efea", color: "#0a0a0a", minHeight: "100vh" }}>
      <Nav />

      <main className="px-6 sm:px-10 lg:px-24 py-16 max-w-7xl mx-auto">
        {/* Hero heading */}
        <div className="overflow-hidden mb-16">
          <h1
            ref={headingRef}
            className="font-bold leading-none text-[#0a0a0a]"
            style={{
              fontSize: "clamp(4rem, 12vw, 10rem)",
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "-0.04em",
              opacity: 0,
            }}
          >
            About<br />Me
          </h1>
        </div>

        {/* Bio grid */}
        <div ref={bioRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, color: "#0a0a0a" }}
            >
              I'm{" "}
              <span
                className="px-1.5 py-0.5"
                style={{
                  background: "#d4ff00",
                  color: "#0a0a0a",
                  fontWeight: 700,
                  borderRadius: "4px",
                }}
              >
                Abhishek Mukherjee
              </span>
              , a Frontend Developer and AI Automation Engineer specializing in building cinematic, high-production web applications and autonomous AI agent workflows.
            </p>

            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}
            >
              I build production-grade web products combining{" "}
              <strong style={{ color: "#0a0a0a" }}>React 19, Next.js, and GSAP animations</strong> with hands-on multi-stage{" "}
              <strong style={{ color: "#0a0a0a" }}>n8n automation workflows, LLM prompt engineering, and Supabase</strong> data layers.
            </p>

            <p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: "#555", fontFamily: "'Inter', sans-serif" }}
            >
              Comfortable owning a project end-to-end — from luxury UI/UX and interactive canvas sequences to backend logic, API orchestration, and deployment. Currently pursuing my B.Tech in CSE (AIML) at{" "}
              <strong style={{ color: "#0a0a0a" }}>Sister Nivedita University</strong> with a consistent <strong style={{ color: "#0a0a0a" }}>9.67 CGPA</strong>.
            </p>
          </div>

          {/* Stats sidebar */}
          <div className="flex flex-col gap-6">
            {[
              { label: "Academic Standing", value: "9.67 CGPA", note: "B.Tech CSE (AIML) Top Ranker" },
              { label: "Production Builds", value: "10+ Projects", note: "Web applications & autonomous pipelines" },
              { label: "National Outreach", value: "2 IIT Cells", note: "Ambassador: IIT Delhi & IIT Kharagpur" },
            ].map(({ label, value, note }) => (
              <div
                key={label}
                className="p-6 rounded-2xl"
                style={{ background: "rgba(10,10,10,0.04)", border: "1px solid rgba(10,10,10,0.08)" }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-2 font-mono"
                  style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}
                >
                  {label}
                </p>
                <p
                  className="font-bold text-3xl sm:text-4xl text-[#0a0a0a]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
                >
                  {value}
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "#666", fontFamily: "'Inter', sans-serif" }}
                >
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Arsenal */}
        <div className="mb-24">
          <div className="mb-12">
            <p
              className="text-xs uppercase tracking-widest mb-3 font-mono"
              style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}
            >
              Skills Directory
            </p>
            <h2
              className="font-bold leading-none text-[#0a0a0a]"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "-0.04em",
              }}
            >
              Technical Arsenal
            </h2>
          </div>

          <div
            ref={tagsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Object.entries(techStack).map(([category, items]) => (
              <div key={category} className="flex flex-col p-6 rounded-2xl bg-white/70 border border-black/5 shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider"
                    style={{ fontFamily: "'Inter', sans-serif", color: "#0a0a0a" }}
                  >
                    {category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((tech, i) => (
                    <span
                      key={i}
                      className="skill-tag px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: "rgba(10,10,10,0.06)",
                        color: "#0a0a0a",
                        border: "1px solid rgba(10,10,10,0.08)",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Leadership Section */}
        <div ref={eduRef} className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Education Timeline */}
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-3 font-mono"
                style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}
              >
                Academic Path
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-8 text-[#0a0a0a]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
              >
                Education
              </h2>

              <div className="space-y-4">
                {[
                  {
                    degree: "B.Tech CSE (AIML)",
                    school: "Sister Nivedita University, Kolkata",
                    score: "CGPA: 9.67",
                    year: "2022 – 2026",
                  },
                  {
                    degree: "Higher Secondary (Class XII)",
                    school: "ODS, Kolkata",
                    score: "Percentage: 90.1%",
                    year: "2020 – 2022",
                  },
                  {
                    degree: "Secondary Education (ICSE Class X)",
                    school: "MREC, Kolkata",
                    score: "Percentage: 92.4%",
                    year: "2018 – 2020",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="edu-card p-5 rounded-xl bg-white/70 border border-black/5 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-base text-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {item.degree}
                      </h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#d4ff00] text-black">
                        {item.score}
                      </span>
                    </div>
                    <p className="text-xs text-black/60 mt-1 font-medium">{item.school}</p>
                    <p className="text-[11px] font-mono text-black/40 mt-2">{item.year}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership & Ambassadorships */}
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-3 font-mono"
                style={{ color: "#777", fontFamily: "'Inter', sans-serif" }}
              >
                Internships &amp; Roles
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-8 text-[#0a0a0a]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
              >
                Leadership &amp; Outreach
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: "Campus Ambassador",
                    org: "eDC, IIT Delhi — Remote Internship",
                    desc: "Represented the entrepreneurship cell, managed regional campus outreach and engagement initiatives, promoted national entrepreneurship summits, and drove collegiate participation.",
                  },
                  {
                    title: "Campus Ambassador",
                    org: "Kshitij, IIT Kharagpur — Remote Internship",
                    desc: "Spearheaded digital PR and student outreach initiatives for Asia's premier techno-management fest, facilitating direct communication between central organizers and university talent.",
                  },
                  {
                    title: "Communication Languages",
                    org: "Multilingual Proficiency",
                    desc: "Fluent across professional and technical contexts in English, Bengali, and Hindi.",
                  },
                ].map((role, idx) => (
                  <div
                    key={idx}
                    className="edu-card p-5 rounded-xl bg-white/70 border border-black/5"
                  >
                    <h4 className="font-bold text-base text-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {role.title}
                    </h4>
                    <p className="text-xs text-[#0a0a0a] font-semibold mt-0.5">{role.org}</p>
                    <p className="text-xs text-black/60 mt-2 leading-relaxed">{role.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
