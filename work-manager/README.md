# 💼 Work Manager Agent & Work Asset Hub

Welcome to the **Work Manager** subsystem for your portfolio. This folder is a dedicated, self-contained workspace designed so you can open it in a fresh AI chat session whenever you want to add new projects to your website without manually editing code or breaking layout files.

---

## 📂 Folder Structure

```
work-manager/
├── AGENT_BRAIN.md                  # Master prompt engineering manifesto & state machine
├── SYSTEM_PROMPT.md                # Copy-paste system prompt for fresh chat sessions
├── GEMINI.md                       # Antigravity / Gemini instruction file
├── .cursorrules                    # Cursor / VS Code agent rules
├── schema-definitions.json         # Strict JSON schemas & validation rules for all 3 sections
├── README.md                       # This manual
│
└── pic/                            # Master Image Hub (Symlinked to public/work)
    ├── 00-inbox-dropzone/          # 📥 DROPZONE: Drag & drop your raw images here
    │   └── README_DROP_NEW_IMAGES_HERE.txt
    │
    ├── 01-main-page/               # 🎯 TARGET 1: Main Page 3D WorksWheel
    │   ├── 01-patent-risk.svg
    │   ├── 02-risk-dashboard.svg
    │   ├── ...
    │   └── 08-auto-report.svg
    │
    ├── 02-work-carousel/           # 🎯 TARGET 2: Work Page Flagship SqueezeCarousel
    │   ├── 01-patent-risk.svg
    │   ├── 02-apexcare-clinic.jpg
    │   ├── ...
    │   └── 05-aura-lander.jpg
    │
    └── 03-work-library/            # 🎯 TARGET 3: Work Page 3D Glass Folders
        ├── 01-ai-automation/
        ├── 02-healthcare-clinics/
        ├── 03-restaurants-dining/
        ├── 04-ecommerce-ordering/
        └── 05-conversion-landing-pages/
```

---

## 🖥️ The 3 Portfolio Work Locations

Your portfolio features 3 showcase locations across 2 pages:

| Target | Location & Page | Component | Data File Modified | Image Folder |
| :--- | :--- | :--- | :--- | :--- |
| **[1] Main Page Wheel** | `src/pages/Home.jsx` | `WorksWheel` (3D Cylindrical rotating stage) | `src/data/homeWheelProjects.ts` | `work-manager/pic/01-main-page/` |
| **[2] Work Page Carousel** | Top of `src/pages/Work.jsx` | `SqueezeCarousel` (Interactive flagship slides) | `src/data/workFlagshipSlides.ts` | `work-manager/pic/02-work-carousel/` |
| **[3] Work Page Library** | Desk surface of `src/pages/Work.jsx` | `GlassDesk` (3D Glass folders with sliding sheets) | `src/data/glassFolderData.ts` | `work-manager/pic/03-work-library/<category>/` |

---

## 🎨 Zero-Loss Quality & In-Browser Dynamic Cropping

> **Why you never have to pre-crop images:**
> - When you drag and drop an image into `00-inbox-dropzone/`, whether it's **16:9**, **4:3**, **1:1**, or **ultrawide**, the original file is preserved with **100% byte-for-byte lossless quality**.
> - The agent **never downscales or compresses** your file.
> - The portfolio components (`WorksWheel`, `SqueezeCarousel`, and `GlassFolder`) all utilize high-performance GPU-accelerated CSS `object-fit: cover` with subpixel rendering.
> - The browser crops and scales dynamically to fit the card dimensions on any screen resolution (4K, Retina, tablet, mobile) with maximum sharpness.

---

## 🚀 How To Use in a Fresh Chat

1. **Drag & Drop Your Raw Image:**
   Drop your screenshot or project cover image into `work-manager/pic/00-inbox-dropzone/`.
2. **Open a Fresh Chat:**
   Open a new chat session in Antigravity or Cursor focused on the project or `work-manager/` folder.
   (The agent will automatically load `AGENT_BRAIN.md`, `GEMINI.md`, and `.cursorrules`).
3. **The Agent Interrogates Directly:**
   The agent will immediately ask:
   ```
   Which showcase section do you want to add this project to?
   [1] Main Page (3D WorksWheel)
   [2] Work Page Flagship (SqueezeCarousel)
   [3] Work Page Library (3D Glass Folders)
   ```
4. **Provide the Fields:**
   Respond with the target number and details.
5. **Automated Ingestion & Deployment:**
   The agent will:
   - Move your image from `00-inbox-dropzone/` to the destination folder with the next sequential number (e.g. `09-new-project.png`).
   - Append the project entry into the appropriate TypeScript dynamic array.
   - Run `npm run build` to verify zero compile errors.
   - Run `git add`, `git commit`, and `git push origin main`.
   - Vercel automatically detects the push and deploys your site live to production in ~30 seconds!

---

## 📋 Example Interaction

```text
USER:
I dropped an image called "stripe-billing-bot.png" in the dropzone.

AGENT:
Detected "stripe-billing-bot.png" in 00-inbox-dropzone.
Which showcase section do you want to place this project in?
[1] Main Page (3D WorksWheel)
[2] Work Page Flagship (SqueezeCarousel)
[3] Work Page Library (3D Glass Folders)

USER:
1

AGENT:
Target: Main Page 3D WorksWheel.
Please provide the following metadata:
1. Title (e.g., "Stripe Invoicing & Billing Agent")
2. Category (e.g., "AI & Automation")
3. Project URL (e.g., "https://github.com/AbhishekMukherjee-BD")

USER:
Title: Stripe Invoicing & Billing Agent
Category: AI & Automation
URL: https://github.com/AbhishekMukherjee-BD

AGENT:
✓ Moved "stripe-billing-bot.png" -> "work-manager/pic/01-main-page/09-stripe-invoicing-billing-agent.png" (Lossless)
✓ Appended entry to src/data/homeWheelProjects.ts
✓ Ran build check: 0 errors
✓ Git: Committed & pushed to origin/main
✓ Vercel Deployment: Triggered automatically! (Live in ~30s at https://abhisek-portfolio-2.vercel.app/)
```
