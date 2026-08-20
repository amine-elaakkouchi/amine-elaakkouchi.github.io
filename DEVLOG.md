# Portfolio Dev Log

Last updated: 2026-08-20

## Active scene and build
- Active experience: cinematic single-page game-development portfolio.
- Hero scene: procedural React Three Fiber portal with pointer response, particles, and WebGL fallback.
- Build: React 19, TypeScript, Vite 8, GSAP, Three.js, Tailwind CSS 4.
- Deployment target: GitHub Pages at `https://amine-elaakkouchi.github.io`.

## Recent commits and work
- Git tip: `b3ea128` — Record CV portfolio update.
- Current CV update: `074b4de` — Replace placeholders with verified CV details.
- `162227c` — Update portfolio dev log.
- `274a576` — Build cinematic game portfolio.
- `fb5053a` — Initial commit.
- Notable uncommitted work: added LinkedIn and pre-addressed email buttons to the contact section.

## Architecture decisions
- Portfolio content is centralized in `src/data/portfolio.ts`.
- The source CV remains private because it contains a home address, phone number, age, and relationship status; the public résumé action opens an email request instead.
- Contact uses direct LinkedIn navigation and a `mailto:` link; no visitor data is collected or stored.
- Project visuals and the hero are generated locally; there are no copied template assets or remote image dependencies.
- The Three.js scene is lazy-loaded and has reduced-motion and no-WebGL fallbacks.
- Visual direction combines dark cinematic game presentation with bold editorial typography and restrained acid-green/gold accents.

## Open questions
- Confirm the exact Itch.io profile URL.
- Confirm the extracted Kokoro Games role dates and add named shipped projects where disclosure is allowed.
- Add final project screenshots and gameplay clips.
- Decide whether future project case studies should open as overlays or separate pages.

## Resume
In a future chat, @-mention `DEVLOG.md` and continue from the open questions above.
