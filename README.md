# Amine El Aakkouchi — Game Portfolio

An original cinematic game-development portfolio built with React, TypeScript, Vite, GSAP, and React Three Fiber.

## Local setup

```bash
corepack pnpm install
corepack pnpm dev
```

Production checks:

```bash
corepack pnpm lint
corepack pnpm build
```

## Customize

- Edit all profile, project, skills, résumé, and social content in `src/data/portfolio.ts`.
- The résumé button opens a pre-addressed email request so the private source PDF is not published.
- Adjust the design tokens and responsive layout in `src/index.css`.
- Modify the procedural WebGL portal in `src/components/PortalScene.tsx`.
- Add verified LinkedIn and Itch.io URLs to `src/data/portfolio.ts` when available.

The site uses no remote images or 3D model assets. Project artwork is generated with CSS and the hero scene uses procedural Three.js geometry.
# amine-elaakkouchi.github.io
Personal portfolio website
