/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TARGET 2: WORK PAGE FLAGSHIP SQUEEZE CAROUSEL DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * Powers the interactive SqueezeCarousel showcase at the top of Work.jsx.
 *
 * IMAGE SOURCE:
 * - Images are stored in `work-manager/pic/02-work-carousel/`
 * - Served losslessly via Vite public symlink at `/work/02-work-carousel/<filename>`
 * - Aspect ratios (16:9, etc.) are dynamically fitted in-browser via CSS object-fit: cover.
 *
 * MANAGED BY:
 * - Work Manager Agent (work-manager/AGENT_BRAIN.md)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface FlagshipSlideItem {
  /** Unique kebab-case identifier (e.g. "patent-risk") */
  id: string;
  /** Primary headline for the flagship project */
  title: string;
  /** Pill category badge (e.g., "AI Engine", "Clinical Platform") */
  category: string;
  /** 1-2 sentence compelling summary of outcomes & architecture */
  description: string;
  /** High-resolution image path in public/work/02-work-carousel/ */
  image: string;
  /** CTA button text (e.g., "View Project", "View Portal", "View Experience") */
  actionText: string;
  /** External live URL or GitHub repo link */
  href: string;
}

export const flagshipSlides: FlagshipSlideItem[] = [
  {
    id: "patent-risk",
    title: "Patent Risk Analysis SaaS",
    category: "AI Engine",
    description: "Autonomous patent risk scanner evaluating 1.4M filings with instant audit reports.",
    image: "/work/02-work-carousel/01-patent-risk.svg",
    actionText: "View Project",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    id: "apexcare-health",
    title: "ApexCare Health Portal",
    category: "Clinical Platform",
    description: "Modern clinical management system with verified doctor intake and instant booking.",
    image: "/work/02-work-carousel/02-apexcare-clinic.jpg",
    actionText: "View Portal",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    id: "maison-dining",
    title: "Maison Étoilée Dining",
    category: "Cinematic WebGL",
    description: "Luxury Michelin dining experience with procedural lighting and seasonal menu reveals.",
    image: "/work/02-work-carousel/03-maison-cafe.jpg",
    actionText: "View Experience",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    id: "ai-risk-dashboard",
    title: "AI Risk Threat Matrix",
    category: "Realtime Analytics",
    description: "High-density threat intelligence rendering canvas harmonics and live pipeline logs.",
    image: "/work/02-work-carousel/04-risk-dashboard.svg",
    actionText: "View Analytics",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    id: "aura-lander",
    title: "Aura SaaS Conversion Lander",
    category: "Conversion Architecture",
    description: "High-impact product lander engineered with fluid GSAP micro-interactions.",
    image: "/work/02-work-carousel/05-aura-lander.jpg",
    actionText: "View Showcase",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
];
