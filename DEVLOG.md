# Portfolio Dev Log

Last updated: 2026-08-20

## Active scene and build
- Active experience: cinematic single-page game-development portfolio.
- Hero scene: procedural React Three Fiber portal with pointer response, particles, and WebGL fallback.
- Build: React 19, TypeScript, Vite 8, GSAP, Three.js, Tailwind CSS 4.
- Deployment target: GitHub Pages at `https://amine-elaakkouchi.github.io`.

## Recent commits and work
- Current implementation tip: `274a576` — Build cinematic game portfolio.
- Previous commit: `fb5053a` — Initial commit.
- Notable work: complete portfolio UI, typed placeholder content, responsive/accessibility passes, and Pages workflow.

## Architecture decisions
- Portfolio content is centralized in `src/data/portfolio.ts`.
- Project visuals and the hero are generated locally; there are no copied template assets or remote image dependencies.
- The Three.js scene is lazy-loaded and has reduced-motion and no-WebGL fallbacks.
- Visual direction combines dark cinematic game presentation with bold editorial typography and restrained acid-green/gold accents.

## Open questions
- Replace placeholder email, LinkedIn, Itch.io, résumé, projects, work history, and education.
- Add final project screenshots, gameplay clips, and downloadable résumé PDF.
- Decide whether future project case studies should open as overlays or separate pages.

## Resume
In a future chat, @-mention `DEVLOG.md` and continue from the open questions above.
