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
  /** Display title of the project (e.g., "SSRINI Luxury Handcrafts") */
  title: string;
  /** Subtitle / discipline badge (e.g., "Fine Art & E-Commerce") */
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
    image: "/work/01-main-page/01-ssrini-hero.png",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
  {
    title: "SSRINI Bespoke Collections",
    category: "Interactive Showcase",
    image: "/work/01-main-page/02-ssrini-collections.png",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
  {
    title: "SSRINI Artisanal Catalog",
    category: "Digital Storefront",
    image: "/work/01-main-page/03-ssrini-gallery.png",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
];
