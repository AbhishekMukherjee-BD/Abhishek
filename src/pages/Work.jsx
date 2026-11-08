import React, { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import GlassFolder from "../components/ui/glass-folder-cards";
import CarouselCircularImageGallery from "../components/ui/carousel-circular-image-gallery";
import TechText from "../components/ui/TechText";
import TextPressure from "../components/ui/TextPressure";
import SplitFlapText from "../components/ui/SplitFlapText";
import DecryptedText from "../components/ui/DecryptedText";
import CurvedLoop from "../components/ui/CurvedLoop";
import Lanyard from "../components/ui/Lanyard";
import { categoryFolders } from "../data/glassFolderData";
import { flagshipSlides } from "../data/workFlagshipSlides";

gsap.registerPlugin(ScrollTrigger);

function Work() {
  const headingRef = useRef(null);
  const deskRef = useRef(null);
  const [openFolderId, setOpenFolderId] = useState(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out", delay: 0.2 }
    );
  }, []);

  return (
    <div style={{ background: "#070d18", color: "#f0efea", minHeight: "100vh" }} className="relative overflow-hidden selection:bg-[#60c1e5]/30">
      {/* Ambient Architectural Depth Mesh (GPU-optimized radial gradients without memory-killing blur filters) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1100px] h-[650px] rounded-full pointer-events-none opacity-80"
          style={{
            background: "radial-gradient(ellipse at center, rgba(27, 54, 93, 0.35) 0%, rgba(0, 90, 156, 0.18) 45%, rgba(7, 13, 24, 0) 70%)",
          }}
        />
        <div
          className="absolute top-[35%] right-[-15%] w-[850px] h-[550px] rounded-full pointer-events-none opacity-70"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0, 90, 156, 0.22) 0%, rgba(7, 13, 24, 0) 70%)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[-10%] w-[950px] h-[650px] rounded-full pointer-events-none opacity-75"
          style={{
            background: "radial-gradient(ellipse at center, rgba(27, 54, 93, 0.28) 0%, rgba(7, 13, 24, 0) 70%)",
          }}
        />
        {/* Subtle fine architectural grid overlay with cyan precision */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(to right, #60c1e5 1px, transparent 1px), linear-gradient(to bottom, #60c1e5 1px, transparent 1px)",
            backgroundSize: "64px 64px"
          }}
        />
      </div>

      <div className="relative z-10">
        <Nav />

        {/* ── 3D Interactive Lanyard ID Card hanging from top:0 directly under Menu button, overlapping carousel ── */}
        <div
          className="absolute top-0 right-0 sm:right-2 lg:right-4 w-[220px] sm:w-[320px] md:w-[400px] lg:w-[440px] h-[520px] sm:h-[680px] lg:h-[785px] pointer-events-none z-[120]"
          aria-hidden="true"
        >
          <div className="w-full h-full pointer-events-auto">
            <Lanyard
              frontImage="/idcard/card-front.jpg"
              backImage="/idcard/card-back.jpeg"
              imageFit="cover"
              cardColor="#ffffff"
              orientation="portrait"
              finish="glossy"
              cornerRadius={0.3}
              size={0.6}
              anchor={0.81}
              strapLength={0.52}
              strapColor="#ffffff"
              strapWidth={0.65}
              metal="silver"
              gravity={1}
              damping={0.5}
              elasticity={0.5}
              breeze={0.5}
              interactive={true}
              intro={true}
            />
          </div>
        </div>

        <main className="px-6 sm:px-10 lg:px-16 py-16 max-w-[1400px] mx-auto">
          {/* Editorial Heading: Interactive Vector Blueprint TechText */}
          <div ref={headingRef} className="relative w-full max-w-2xl h-[130px] sm:h-[170px] lg:h-[200px] pt-2 mb-2">
            <h1 className="sr-only">My Work</h1>
            <TechText
              text="My Work"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight={700}
              fontSize={130}
              color="#f0efea"
              accentColor="#60c1e5"
              letterSpacing={-0.03}
              align="left"
              dashLength={4}
              dashGap={2}
              strokeWidth={1.5}
              lineStyle="dashed"
              specks={14}
              draggable={true}
              clickKick={true}
              labels={true}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
            <p
              className="text-base sm:text-lg max-w-2xl leading-relaxed"
              style={{ color: "#8a99ad", fontFamily: "'Inter', sans-serif" }}
            >
              <DecryptedText
                text="Selected production builds, autonomous agent pipelines, and high-performance digital systems engineered for real-world operations."
                animateOn="inViewHover"
                speed={35}
                maxIterations={12}
                sequential={true}
                revealDirection="start"
                scrambleColor="#60c1e5"
                className="text-[#8a99ad]"
                encryptedClassName="text-[#a0e0ef] font-mono"
              />
            </p>
          </div>

          {/* ── Section 1: My Best (Edgy Squeeze Carousel) ── */}
          <section className="mb-28 pt-4">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <div className="w-full max-w-[520px] h-[90px] sm:h-[120px] mx-auto mb-2 relative">
                <h2 className="sr-only">My Best</h2>
                <TextPressure
                  text="My Best"
                  fontFamily="Roboto Flex"
                  fontUrl="https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap"
                  flex={false}
                  align="center"
                  width={true}
                  weight={true}
                  italic={true}
                  alpha={false}
                  stroke={false}
                  scale={false}
                  textColor="#f0efea"
                  pressureColor="#d4af37"
                  strokeColor="#60c1e5"
                  minFontSize={42}
                  maxFontSize={100}
                  minWdth={35}
                  maxWdth={150}
                  minWght={500}
                  maxWght={950}
                  textTransform="uppercase"
                  clickRipple={true}
                  radius={0.4}
                  smoothing={0.35}
                />
              </div>
              <p
                className="text-xs sm:text-[13px] text-[#8a99ad] max-w-md leading-relaxed tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <DecryptedText
                  text="Flagship client platforms deployed across enterprise automation, medical workflows, and interactive web architecture."
                  animateOn="inViewHover"
                  speed={30}
                  maxIterations={10}
                  sequential={true}
                  revealDirection="start"
                  scrambleColor="#d4af37"
                  className="text-[#8a99ad]"
                  encryptedClassName="text-[#60c1e5] font-mono"
                />
              </p>
            </div>

            <CarouselCircularImageGallery
              slides={flagshipSlides}
              autoplay={true}
              interval={5500}
            />
          </section>

          {/* ── Section 2: Work Library / Launch Ready (3D Glass Folders Desk) ── */}
          <section className="mb-16">
            {/* Marquee Ribbon: YOU IMAGINE I BUILD */}
            <div className="w-full overflow-hidden mb-6 sm:mb-8 [&_.curved-loop-jacket]:min-h-0 [&_.curved-loop-jacket]:py-2">
              <CurvedLoop
                marqueeText="YOU IMAGINE I BUILD"
                shape="line"
                speed={3.4}
                curveAmount={400}
                direction="left"
                fontSize={96}
                fontWeight={700}
                letterSpacing={0}
                separator="✦"
                outline={false}
                scrollBoost={1.9}
                edgeFade={0}
                interactive
                pauseOnHover
                color="rgba(240, 239, 234, 0.45)"
                separatorColor="#a0e0ef"
              />
            </div>

            <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 sm:mb-12">
              <h2 className="sr-only">Work Library - Launch Ready</h2>
              <div className="w-full flex justify-center py-2 overflow-x-auto">
                <SplitFlapText
                  words={['WORK LIBRARY', 'LAUNCH READY']}
                  padTo={12}
                  fontSize={32}
                  tileColor="#0a1220"
                  textColor="#f8fafc"
                  tileRadius={6}
                  gap={5}
                  flipsPerChar={6}
                  cycleDelay={2800}
                  align="center"
                />
              </div>
            </div>

            {/* ── 3D Glass Folders Desk Stage ── */}
            <div
              id="work-library"
              ref={deskRef}
              className={`relative rounded-3xl p-6 sm:p-10 lg:p-12 transition-all duration-300 ${
                openFolderId ? "overflow-visible" : "overflow-hidden"
              }`}
              style={{
                background: "linear-gradient(180deg, rgba(14, 24, 42, 0.8) 0%, rgba(8, 14, 26, 0.96) 100%)",
                border: "1px solid rgba(96, 193, 229, 0.16)",
                boxShadow: "inset 0 1px 0 rgba(160, 224, 239, 0.18), 0 30px 60px -15px rgba(0,0,0,0.6)",
              }}
            >
            {/* Subtle Dotted Desk Pattern matching cyan palette */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage: "radial-gradient(#60c1e5 1.1px, transparent 1.4px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Side-by-side consecutive Glass Folders Grid */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-16 items-start justify-items-center">
              {categoryFolders.map((folder) => {
                const isOpen = openFolderId === folder.id;

                return (
                  <div
                    key={folder.id}
                    className={`w-full max-w-[360px] flex flex-col items-center group/folder relative transition-all duration-300 ${
                      isOpen ? "z-40" : "z-10"
                    }`}
                  >
                    {/* The Interactive 3D Glass Folder Component */}
                    <div className="relative flex justify-center w-full">
                      <GlassFolder
                        label={folder.label}
                        meta={folder.meta}
                        tone={folder.tone}
                        art={folder.art}
                        seed={folder.seed}
                        action="more"
                        appear={true}
                        appearDelay={folder.appearDelay}
                        width={330}
                        files={folder.files}
                        open={isOpen}
                        onOpenChange={(next) => setOpenFolderId(next ? folder.id : null)}
                        enableTumbleDeck={true}
                        menu={[
                          {
                            label: isOpen ? "Close folder" : "Fan open folder",
                            onSelect: () => setOpenFolderId(isOpen ? null : folder.id),
                          },
                          {
                            label: "View all in GitHub",
                            onSelect: () => window.open("https://github.com/AbhishekMukherjee-BD", "_blank"),
                          },
                        ]}
                        onFileSelect={(file) => {
                          // Navigation is handled exclusively by the dedicated "View ↗" frosted button on the showcase
                        }}
                      />
                    </div>

                    {/* ── Bespoke Editorial Desk Plaque Directly Under Each Folder (No Box, No Pills) ── */}
                    <div className="mt-5 w-full pt-3.5 border-t border-[#60c1e5]/15 transition-all duration-300">
                      {/* Header Row: Index & Category Name & Trigger */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[11px] font-mono font-bold tracking-widest"
                            style={{ color: isOpen ? "#d4af37" : "#60c1e5" }}
                          >
                            {folder.categoryNumber} //
                          </span>
                          <h2
                            className="text-sm sm:text-base font-semibold leading-tight tracking-tight text-[#f0efea]"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                          >
                            {folder.label}
                          </h2>
                        </div>

                        {/* Minimal Text Trigger */}
                        <button
                          type="button"
                          onClick={() => setOpenFolderId(isOpen ? null : folder.id)}
                          className="text-[11px] font-mono tracking-wider transition-colors duration-200 cursor-pointer hover:underline"
                          style={{
                            color: isOpen ? "#d4af37" : "#a0e0ef",
                          }}
                        >
                          {isOpen ? "Close [✕]" : "Explore [▾]"}
                        </button>
                      </div>

                      {/* Subtitle */}
                      <p
                        className="text-[11px] font-mono uppercase tracking-wider mb-2 text-[#60c1e5]/70"
                      >
                        {folder.subtitle}
                      </p>

                      {/* Details Description */}
                      <p
                        className="text-xs leading-relaxed mb-3 text-[#8a99ad]"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {folder.details}
                      </p>

                      {/* Clean Technical Monospace Metadata (No Pill Boxes) */}
                      <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono tracking-wider text-[#a0e0ef]/60 uppercase">
                          {folder.techTags.join("  ·  ")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

        <Footer />
      </div>
    </div>
  );
}

export default Work;
