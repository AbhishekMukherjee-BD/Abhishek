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
  /** Unique kebab-case identifier (e.g. "ssrini-luxury-handcrafts") */
  id: string;
  /** Primary headline for the flagship project */
  title: string;
  /** Pill category badge (e.g., "Fine Art & E-Commerce", "Interactive Showcase") */
  category: string;
  /** 1-2 sentence compelling summary of outcomes & architecture */
  description: string;
  /** High-resolution image path in public/work/02-work-carousel/ */
  image: string;
  /** CTA button text (e.g., "View Live Site", "Explore Collection") */
  actionText: string;
  /** External live URL or GitHub repo link */
  href: string;
}

export const flagshipSlides: FlagshipSlideItem[] = [
  {
    id: "ssrini-luxury-handcrafts",
    title: "SSRINI Luxury Handcrafts",
    category: "Fine Art & E-Commerce",
    description: "Bespoke digital flagship and high-conversion e-commerce platform for handcrafted luxury artifacts.",
    image: "/work/02-work-carousel/01-ssrini-hero.png",
    actionText: "View Live Site",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
  {
    id: "ssrini-bespoke-collections",
    title: "SSRINI Bespoke Collections",
    category: "Interactive Showcase",
    description: "Immersive 3D artisanal showcase with fluid catalog reveals and high-density product inspection.",
    image: "/work/02-work-carousel/02-ssrini-collections.png",
    actionText: "Explore Collection",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
  {
    id: "ssrini-artisanal-catalog",
    title: "SSRINI Artisanal Catalog",
    category: "Digital Storefront",
    description: "Architected modern commerce storefront featuring frictionless checkout and bespoke branding.",
    image: "/work/02-work-carousel/03-ssrini-gallery.png",
    actionText: "View Catalog",
    href: "https://ssrinihandcraftecom.vercel.app/ecom/",
  },
];
