import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import About from "./pages/About";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Loader from "./components/loader.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Ignore mobile browser URL-bar expand/collapse resize events to prevent jitter and pin recalculation lag
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
});

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    // syncTouch: false lets mobile touch gestures scroll natively via hardware compositor with 0ms latency
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.0,
    });

    window.lenis = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);

    // Adaptive lag smoothing: prevents violent stutter on mobile when frames drop
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      window.lenis = null;
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Loader />
      <CustomCursor />
      <PageTransition />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}

export default App;
