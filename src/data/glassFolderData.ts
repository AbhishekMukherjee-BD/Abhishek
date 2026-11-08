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
    id: "ai-automation",
    categoryNumber: "01",
    label: "AI Automation / n8n",
    subtitle: "Autonomous Agents & Pipelines",
    details: "Multi-stage autonomous n8n workflows with LLM prompt engineering, vector search, and Supabase RLS integrations.",
    techTags: ["n8n", "Supabase", "LLMs", "Python", "Webhooks"],
    tone: "dark",
    art: "ember",
    seed: 11,
    meta: "4 Production Systems",
    appearDelay: 0,
    files: [
      {
        name: "Patent Risk Analysis SaaS",
        meta: "n8n · Supabase · Python",
        image: "/work/03-work-library/01-ai-automation/01-patent-risk.svg",
        href: "https://github.com/AbhishekMukherjee-BD",
      },
      {
        name: "AI Risk Report Dashboard",
        meta: "Canvas · React · GSAP",
        image: "/work/03-work-library/01-ai-automation/02-risk-dashboard.svg",
        href: "https://github.com/AbhishekMukherjee-BD",
      },
      {
        name: "Autonomous Report Engine",
        meta: "Node.js · SQL · Supabase",
        image: "/work/03-work-library/01-ai-automation/03-auto-report.svg",
        href: "https://github.com/AbhishekMukherjee-BD",
      },
      {
        name: "AI Chatbot & Booking Agent",
        meta: "n8n · OpenRouter · Webhooks",
        image: "/work/03-work-library/01-ai-automation/04-ai-chatbot.svg",
        href: "https://github.com/AbhishekMukherjee-BD",
      },
    ],
  },
  {
    id: "clinic",
    categoryNumber: "02",
    label: "Healthcare & Clinics",
    subtitle: "Medical & Dental Portals",
    details: "Clean, conversion-optimized responsive interfaces for modern healthcare clinics with appointment booking and doctor directories.",
    techTags: ["React", "JavaScript", "HTML5", "Responsive UI"],
    tone: "light",
    art: "glacier",
    seed: 5,
    meta: "2 Active Portals",
    appearDelay: 120,
    files: [
      {
        name: "California Medical Clinic",
        meta: "Live Portal · Scheduling",
        image: "/work/03-work-library/02-healthcare-clinics/01-california-clinic.jpg",
        href: "https://california-medical-clinic.vercel.app",
      },
      {
        name: "Dental Clinic Healthcare Portal",
        meta: "General & Aesthetic Dentistry",
        image: "/work/03-work-library/02-healthcare-clinics/02-dental-clinic.svg",
        href: "https://github.com/AbhishekMukherjee-BD",
      },
      {
        name: "Intake & Triage Architecture",
        meta: "PDF · Medical Records",
        art: "glacier",
        href: "https://california-medical-clinic.vercel.app",
      },
    ],
  },
  {
    id: "restraunts",
    categoryNumber: "03",
    label: "Restaurants & Dining",
    subtitle: "Hospitality & Reservation Systems",
    details: "Immersive scrolling experiences showcasing luxury dining visuals, interactive menu reveals, and online reservation workflows.",
    techTags: ["GSAP", "React", "Tailwind CSS", "Vercel"],
    tone: "dark",
    art: "dusk",
    seed: 7,
    meta: "2 Live Experiences",
    appearDelay: 240,
    files: [
      {
        name: "Celestial Restaurant",
        meta: "Luxury Dining · Reservations",
        image: "/work/03-work-library/03-restaurants-dining/01-celestial-restaurant.jpg",
        href: "https://celestial-cafe.vercel.app",
      },
      {
        name: "Artisan Cafe Experience",
        meta: "Scrollytelling · Menu System",
        image: "/work/03-work-library/03-restaurants-dining/02-artisan-cafe.jpg",
        href: "https://cafe-webdev.vercel.app",
      },
      {
        name: "Interactive Table Booking",
        meta: "Realtime Seat Allocation",
        art: "dusk",
        href: "https://celestial-cafe.vercel.app",
      },
    ],
  },
  {
    id: "ecom",
    categoryNumber: "04",
    label: "E-Commerce & Ordering",
    subtitle: "Digital Storefronts & Checkout",
    details: "High-performance digital commerce storefronts featuring custom micro-interactions, roast subscriptions, and instant mobile ordering.",
    techTags: ["React", "Node.js", "Tailwind CSS", "Vercel"],
    tone: "light",
    art: "verdant",
    seed: 19,
    meta: "3 Storefronts",
    appearDelay: 360,
    files: [
      {
        name: "SSRINI Luxury Handcrafts",
        meta: "Fine Art · Bespoke E-Commerce",
        image: "/work/03-work-library/04-ecommerce-ordering/01-ssrini-hero.png",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/",
      },
      {
        name: "SSRINI Bespoke Collections",
        meta: "Fine Art · Product Showcase",
        image: "/work/03-work-library/04-ecommerce-ordering/02-ssrini-collections.png",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/",
      },
      {
        name: "SSRINI Artisanal Catalog",
        meta: "Handcraft Artifacts · Storefront",
        image: "/work/03-work-library/04-ecommerce-ordering/03-ssrini-handcraft.png",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/",
      },
      {
        name: "Stripe & Webhook Invoicing",
        meta: "Automated Receipts",
        art: "verdant",
        href: "https://ssrinihandcraftecom.vercel.app/ecom/",
      },
    ],
  },
  {
    id: "landing-pages",
    categoryNumber: "05",
    label: "Conversion Landing Pages",
    subtitle: "High-Impact Product Landers",
    details: "Cinematic, luxury landing pages built for high conversion, engaging typography, and fluid GSAP micro-animations.",
    techTags: ["GSAP", "Tailwind CSS", "HTML5", "Vercel"],
    tone: "dark",
    art: "aurora",
    seed: 3,
    meta: "3 High-Converting Landers",
    appearDelay: 480,
    files: [
      {
        name: "Patent Risk Analysis Lander",
        meta: "SaaS Lead Gen · Enterprise",
        image: "/work/03-work-library/05-conversion-landing-pages/01-patent-risk-lander.svg",
        href: "https://github.com/AbhishekMukherjee-BD",
      },
      {
        name: "California Clinic Consultation",
        meta: "High-Converting Intake",
        image: "/work/03-work-library/05-conversion-landing-pages/02-clinic-consultation.jpg",
        href: "https://california-medical-clinic.vercel.app",
      },
      {
        name: "Editorial Portfolio Experience",
        meta: "Cinematic 3D Scrollytelling",
        art: "aurora",
        href: "https://abhisek-portfolio-2.vercel.app",
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
    meta: "Templates Arriving Soon",
    appearDelay: 600,
    files: [],
  },
];
