/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TARGET 1: MAIN PAGE FEATURED WORKS WHEEL DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * Powers the 3D cylindrical WorksWheel showcase on Home.jsx.
 *
 * IMAGE SOURCE:
 * - Images are stored in `work-manager/pic/01-main-page/`
 * - Served losslessly via Vite public symlink at `/work/01-main-page/<filename>`
 * - Aspect ratios (16:9, etc.) are dynamically fitted in-browser via CSS object-fit: cover.
 *
 * MANAGED BY:
 * - Work Manager Agent (work-manager/AGENT_BRAIN.md)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface WheelProjectItem {
  /** Display title of the project (e.g., "Patent Risk Analysis SaaS") */
  title: string;
  /** Subtitle / discipline badge (e.g., "AI & Automation", "Healthcare", "Web Dev") */
  category: string;
  /** High-resolution image path in public/work/01-main-page/ */
  image: string;
  /** External live URL or GitHub repo link */
  href: string;
}

export const wheelProjects: WheelProjectItem[] = [
  {
    title: "Patent Risk Analysis SaaS",
    category: "AI & Automation",
    image: "/work/01-main-page/01-patent-risk.svg",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    title: "AI Risk Report Dashboard",
    category: "Analytics & Canvas",
    image: "/work/01-main-page/02-risk-dashboard.svg",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    title: "Artisan Cafe Experience",
    category: "Web Dev",
    image: "/work/01-main-page/03-artisan-cafe.jpg",
    href: "https://cafe-webdev.vercel.app",
  },
  {
    title: "California Medical Clinic",
    category: "Healthcare",
    image: "/work/01-main-page/04-california-clinic.jpg",
    href: "https://california-medical-clinic.vercel.app",
  },
  {
    title: "AI Chatbot & Booking Agent",
    category: "AI & Automation",
    image: "/work/01-main-page/05-ai-chatbot.svg",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    title: "Celestial Restaurant",
    category: "Web Dev",
    image: "/work/01-main-page/06-celestial-restaurant.jpg",
    href: "https://celestial-cafe.vercel.app",
  },
  {
    title: "Dental Clinic Healthcare Portal",
    category: "Healthcare",
    image: "/work/01-main-page/07-dental-clinic.svg",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    title: "Autonomous Report Engine",
    category: "AI & Automation",
    image: "/work/01-main-page/08-auto-report.svg",
    href: "https://github.com/AbhishekMukherjee-BD",
  },
  {
    title: "SSRINI Luxury Handcrafts",
    category: "E-Commerce",
    image: "/work/01-main-page/09-ssrini-handcraft.png",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
];
