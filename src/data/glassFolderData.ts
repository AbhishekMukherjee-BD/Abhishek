import type { ArtPreset, FolderFile } from "../components/ui/glass-folder-cards";

export interface CategoryFolder {
  id: string;
  categoryNumber: string;
  label: string;
  subtitle: string;
  details: string;
  techTags: string[];
  tone: "light" | "dark";
  art: ArtPreset;
  seed: number;
  meta: string;
  appearDelay: number;
  files: FolderFile[];
}

export const categoryFolders: CategoryFolder[] = [
  {
    id: "landing-pages",
    categoryNumber: "01",
    label: "Conversion Landing Pages",
    subtitle: "High-Impact Product Landers",
    details: "Cinematic, luxury landing pages built for high conversion, engaging typography, and fluid GSAP micro-animations.",
    techTags: ["GSAP", "Tailwind CSS", "HTML5", "Vercel"],
    tone: "dark",
    art: "aurora",
    seed: 3,
    meta: "9 Live Landers",
    appearDelay: 0,
    files: [
      {
        name: "Rolex Submariner Experience",
        meta: "Luxury 3D WebGL · Product Showcase",
        image: "/work/03-work-library/05-conversion-landing-pages/01-rolex-submariner.webp",
        href: "https://rolex-submariner-experience-ecru.vercel.app/",
      },
      {
        name: "Apex Peak Roofing",
        meta: "Architectural Roofing · High-Conversion Lander",
        image: "/work/03-work-library/05-conversion-landing-pages/02-apex-peak-roofing.webp",
        href: "https://apex-peak-roofing.whop.site",
      },
      {
        name: "SSRINI Luxury Handcrafts",
        meta: "Artisanal Fine Art · Bespoke Lander",
        image: "/work/03-work-library/05-conversion-landing-pages/03-ssrini-luxury-handcrafts.webp",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/",
      },
      {
        name: "Patent Checker SaaS",
        meta: "Legal AI Compliance · Product Lander",
        image: "/work/03-work-library/05-conversion-landing-pages/04-patent-checker-saas.webp",
        href: "https://patent-check-three.vercel.app",
      },
      {
        name: "ASP Kitchen & Dining",
        meta: "Continental Dining · Brand Showcase",
        image: "/work/03-work-library/05-conversion-landing-pages/05-asp-kitchen-dining.webp",
        href: "https://asp-cafe.vercel.app",
      },
      {
        name: "California Medical Clinic",
        meta: "Healthcare & Telehealth · Patient Portal",
        image: "/work/03-work-library/05-conversion-landing-pages/06-california-medical-clinic.webp",
        href: "https://california-medical-clinic.vercel.app",
      },
      {
        name: "ASP Kitchen Continental Menu",
        meta: "Interactive Menu & Pricing · Reservation Lander",
        image: "/work/03-work-library/05-conversion-landing-pages/07-asp-kitchen-menu.webp",
        href: "https://asp-cafe.vercel.app",
      },
      {
        name: "ASP Cafe Digital Experience",
        meta: "Hospitality Storytelling · Online Orders",
        image: "/work/03-work-library/05-conversion-landing-pages/08-asp-cafe-behala.webp",
        href: "https://cafe-webdev.vercel.app",
      },
      {
        name: "ASP Cafe Beverages & Treats",
        meta: "Specialty Beverages · Fast Checkout",
        image: "/work/03-work-library/05-conversion-landing-pages/09-asp-cafe-beverages.webp",
        href: "https://cafe-webdev.vercel.app",
      },
    ],
  },
  {
    id: "ai-automation",
    categoryNumber: "02",
    label: "AI Automation / n8n",
    subtitle: "Autonomous Agents & Pipelines",
    details: "Multi-stage autonomous n8n workflows with LLM prompt engineering, vector search, and Supabase RLS integrations.",
    techTags: ["n8n", "Supabase", "LLMs", "Python", "Webhooks"],
    tone: "dark",
    art: "ember",
    seed: 11,
    meta: "0 Systems · Coming Soon",
    appearDelay: 120,
    files: [],
  },
  {
    id: "ecom",
    categoryNumber: "03",
    label: "E-Commerce & Ordering",
    subtitle: "Digital Storefronts & Checkout",
    details: "High-performance digital commerce storefronts featuring custom micro-interactions, roast subscriptions, and instant mobile ordering.",
    techTags: ["React", "Node.js", "Tailwind CSS", "Vercel"],
    tone: "light",
    art: "verdant",
    seed: 19,
    meta: "5 Live Showcases",
    appearDelay: 240,
    files: [
      {
        name: "SSRINI Handcraft Store",
        meta: "Digital Storefront · Checkout & Cart",
        image: "/work/03-work-library/04-ecommerce-ordering/01-ssrini-store.webp",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/store/",
      },
      {
        name: "Rolex Submariner Experience",
        meta: "Luxury 3D WebGL · Horology Commerce",
        image: "/work/03-work-library/04-ecommerce-ordering/02-rolex-submariner.webp",
        href: "https://rolex-submariner-experience-ecru.vercel.app",
      },
      {
        name: "SSRINI Luxury Handcrafts",
        meta: "Fine Art · Bespoke E-Commerce",
        image: "/work/03-work-library/04-ecommerce-ordering/03-ssrini-hero.webp",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/",
      },
      {
        name: "SSRINI Bespoke Collections",
        meta: "Interactive 3D Artisanal Showcase",
        image: "/work/03-work-library/04-ecommerce-ordering/04-ssrini-collections.webp",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/",
      },
      {
        name: "SSRINI Artisanal Catalog",
        meta: "Digital Storefront & Artifacts",
        image: "/work/03-work-library/04-ecommerce-ordering/05-ssrini-gallery.webp",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/",
      },
    ],
  },
  {
    id: "clinic",
    categoryNumber: "04",
    label: "Healthcare & Clinics",
    subtitle: "Medical & Dental Portals",
    details: "Clean, conversion-optimized responsive interfaces for modern healthcare clinics with appointment booking and doctor directories.",
    techTags: ["React", "JavaScript", "HTML5", "Responsive UI"],
    tone: "light",
    art: "glacier",
    seed: 5,
    meta: "2 Live Portals",
    appearDelay: 360,
    files: [
      {
        name: "California Medical Clinic",
        meta: "Live Portal · Scheduling",
        image: "/work/03-work-library/02-healthcare-clinics/01-california-medical-clinic.webp",
        href: "https://california-medical-clinic.vercel.app",
      },
      {
        name: "Apex Peak Roofing",
        meta: "Architectural Roofing · High-Conversion Portal",
        image: "/work/03-work-library/02-healthcare-clinics/02-apex-peak-roofing.webp",
        href: "https://apex-peak-roofing.whop.site",
      },
    ],
  },
  {
    id: "restraunts",
    categoryNumber: "05",
    label: "Restaurants & Dining",
    subtitle: "Hospitality & Reservation Systems",
    details: "Immersive scrolling experiences showcasing luxury dining visuals, interactive menu reveals, and online reservation workflows.",
    techTags: ["GSAP", "React", "Tailwind CSS", "Vercel"],
    tone: "dark",
    art: "dusk",
    seed: 7,
    meta: "4 Live Experiences",
    appearDelay: 480,
    files: [
      {
        name: "ASP Kitchen & Dining",
        meta: "Continental Dining · Brand Showcase",
        image: "/work/03-work-library/03-restaurants-dining/01-asp-kitchen-dining.webp",
        href: "https://asp-cafe.vercel.app",
      },
      {
        name: "ASP Kitchen Continental Menu",
        meta: "Interactive Menu & Pricing · Reservation Lander",
        image: "/work/03-work-library/03-restaurants-dining/03-asp-kitchen-menu.webp",
        href: "https://asp-cafe.vercel.app",
      },
      {
        name: "ASP Cafe Digital Experience",
        meta: "Hospitality Storytelling · Online Orders",
        image: "/work/03-work-library/03-restaurants-dining/04-asp-cafe-behala.webp",
        href: "https://cafe-webdev.vercel.app",
      },
      {
        name: "ASP Cafe Beverages & Treats",
        meta: "Specialty Beverages · Fast Checkout",
        image: "/work/03-work-library/03-restaurants-dining/05-asp-cafe-beverages.webp",
        href: "https://cafe-webdev.vercel.app",
      },
    ],
  },
  {
    id: "dashboard-templates",
    categoryNumber: "06",
    label: "Dashboard Templates",
    subtitle: "Client Turnkey Systems & Analytics",
    details: "Production-grade analytics dashboards, turnkey admin consoles, and realtime operational telemetry portals built for client deployment.",
    techTags: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Supabase"],
    tone: "dark",
    art: "ember",
    seed: 29,
    meta: "5 Client Templates",
    appearDelay: 600,
    files: [
      {
        name: "Adjustable Glass Dashboard",
        meta: "@troyjlorents-gh · Interactive Glass",
        image: "/work/03-work-library/06-dashboard-templates/01-adjustable-glass-dashboard.webp",
        href: "https://dashboard-templates-opal.vercel.app/adjustable-glass-dashboard/index.html",
      },
      {
        name: "Analytics Bento Grid",
        meta: "@romanvasnev · Bento Analytics",
        image: "/work/03-work-library/06-dashboard-templates/02-analytics-bento.webp",
        href: "https://dashboard-templates-opal.vercel.app/analytics-bento/index.html?theme=dark",
      },
      {
        name: "App Dashboard Layout",
        meta: "@shadcnstore · SaaS Console",
        image: "/work/03-work-library/06-dashboard-templates/03-app-dashboard-layout.webp",
        href: "https://dashboard-templates-opal.vercel.app/app-1/index.html?theme=dark",
      },
      {
        name: "Revenue Charts & KPI Kit",
        meta: "@uvain · Financial KPI Kit",
        image: "/work/03-work-library/06-dashboard-templates/04-revenue-charts-kpi.webp",
        href: "https://dashboard-templates-opal.vercel.app/revenue-charts-kpi/index.html?theme=dark",
      },
      {
        name: "Ink Orbit Features Engine",
        meta: "@kedhareswer · Orbit Automation",
        image: "/work/03-work-library/06-dashboard-templates/05-ink-orbit-features.webp",
        href: "https://dashboard-templates-opal.vercel.app/ink-orbit-features/index.html?theme=dark",
      },
    ],
  },
];
