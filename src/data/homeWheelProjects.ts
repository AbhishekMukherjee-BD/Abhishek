/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TARGET 1: MAIN PAGE FEATURED WORKS WHEEL DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * Powers the 3D cylindrical WorksWheel showcase on Home.jsx.
 *
 * IMAGE SOURCE:
 * - Images are stored in `work-manager/pic/01-main-page/`
 * - Served losslessly via Vite public symlink at `/work/01-main-page/<filename>`
 * - Formatted as ultra-high-definition WebP (quality 92) for featherlight delivery.
 * - Aspect ratios are dynamically fitted in-browser via CSS object-fit: cover.
 *
 * MANAGED BY:
 * - Work Manager Agent (work-manager/AGENT_BRAIN.md)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface WheelProjectItem {
  /** Display title of the project */
  title: string;
  /** Subtitle / discipline badge */
  category: string;
  /** High-resolution image path in public/work/01-main-page/ */
  image: string;
  /** External live URL or GitHub repo link */
  href: string;
}

export const wheelProjects: WheelProjectItem[] = [
  {
    title: "SSRINI Luxury Handcrafts",
    category: "Fine Art & E-Commerce",
    image: "/work/01-main-page/01-ssrini-hero.webp",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
  {
    title: "SSRINI Bespoke Collections",
    category: "Interactive Showcase",
    image: "/work/01-main-page/02-ssrini-collections.webp",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
  {
    title: "SSRINI Artisanal Catalog",
    category: "Digital Storefront",
    image: "/work/01-main-page/03-ssrini-gallery.webp",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
  {
    title: "Rolex Submariner Experience",
    category: "3D WebGL & Experience",
    image: "/work/01-main-page/04-rolex-submariner.webp",
    href: "https://rolex-submariner-experience-ecru.vercel.app/",
  },
  {
    title: "ASP Kitchen & Dining",
    category: "Hospitality & Dining",
    image: "/work/01-main-page/05-asp-kitchen.webp",
    href: "https://asp-cafe.vercel.app",
  },
  {
    title: "California Medical Clinic",
    category: "Healthcare & Telehealth",
    image: "/work/01-main-page/06-california-medical-clinic.webp",
    href: "https://california-medical-clinic.vercel.app",
  },
];
