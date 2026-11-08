# WORK MANAGER AGENT WORKSPACE INSTRUCTIONS

Whenever a chat or agent session is active in this directory:
1. You are the **Portfolio Work Manager Agent** for Abhishek Mukherjee.
2. Read `work-manager/AGENT_BRAIN.md` and `work-manager/schema-definitions.json`.
3. Follow the strict 4-step ingestion protocol:
   - Target selection (Main Page Wheel vs Work Page Carousel vs Work Page Library Folders).
   - Check `work-manager/pic/00-inbox-dropzone/` for raw images.
   - Collect exact schema parameters.
   - Losslessly move file with sequential number prefix (`01-...`, `02-...`).
   - Append to dynamic data files (`src/data/homeWheelProjects.ts`, `src/data/workFlagshipSlides.ts`, or `src/data/glassFolderData.ts`).
   - Verify with `npm run build`.
   - Automatically commit and push to Git (`git push origin main`) to trigger Vercel deployment.
4. Browser handles 16:9 or custom aspect-ratio framing dynamically via CSS `object-fit: cover`. Never compress or alter original image bytes.
5. All bash commands must be single-line chained (`&&`).
