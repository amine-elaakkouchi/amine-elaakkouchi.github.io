export type Role = {
  title: string
  shortTitle: string
  description: string
  index: string
}

export type Project = {
  id: string
  title: string
  type: string
  year: string
  summary: string
  challenge: string
  contribution: string
  outcome: string
  tools: string[]
  accent: string
  status: string
}

export type Experience = {
  period: string
  role: string
  studio: string
  description: string
}

export type Social = {
  label: string
  href: string
}

export type PortfolioData = {
  profile: {
    name: string
    location: string
    availability: string
    intro: string
    about: string
    email: string
  }
  roles: Role[]
  projects: Project[]
  skills: { group: string; items: string[] }[]
  experience: Experience[]
  education: Experience[]
  resume: { label: string; href: string }
  socials: Social[]
}

export const portfolio: PortfolioData = {
  profile: {
    name: 'Amine El Aakkouchi',
    location: 'Morocco · Available worldwide',
    availability: 'Open to collaborations',
    intro:
      'I build expressive game worlds where strong systems, deliberate spaces, and memorable player moments meet.',
    about:
      'A multidisciplinary game maker focused on the complete player experience—from the first greybox to the final frame. I combine technical implementation with design intent, shaping mechanics and environments that feel clear, responsive, and alive.',
    email: 'hello@example.com',
  },
  roles: [
    {
      index: '01',
      title: 'Game Development',
      shortTitle: 'Developer',
      description:
        'Responsive gameplay, scalable architecture, AI behaviours, and polished interaction systems built with performance in mind.',
    },
    {
      index: '02',
      title: 'Game Design',
      shortTitle: 'Designer',
      description:
        'Mechanics, loops, economies, and moment-to-moment decisions designed around legibility, tension, and player agency.',
    },
    {
      index: '03',
      title: 'Level Design',
      shortTitle: 'World builder',
      description:
        'Purposeful spaces shaped through composition, pacing, encounter design, playtesting, and rapid greybox iteration.',
    },
  ],
  projects: [
    {
      id: 'echoes',
      title: 'Echoes of Atlas',
      type: 'Narrative Action · Lead Designer',
      year: '2026',
      summary:
        'A surreal third-person journey through a city that rebuilds itself around the player’s memories.',
      challenge:
        'Make an unstable world readable without losing mystery or disrupting player flow.',
      contribution:
        'Designed the core memory-shift mechanic, prototyped traversal, and built a modular encounter language for the vertical slice.',
      outcome:
        'A focused 20-minute slice with three distinct routes, systemic callbacks, and a strong visual identity.',
      tools: ['Unreal Engine', 'Blueprints', 'C++', 'Houdini'],
      accent: '#c7ff43',
      status: 'Vertical slice',
    },
    {
      id: 'afterlight',
      title: 'Afterlight Protocol',
      type: 'Systems Stealth · Gameplay Developer',
      year: '2025',
      summary:
        'A stealth sandbox where light is both your only weapon and the resource keeping you alive.',
      challenge:
        'Create AI that communicates intent clearly while adapting to a changing light-driven space.',
      contribution:
        'Implemented perception and alert systems, authored behaviour-tree tools, and tuned the feedback stack.',
      outcome:
        'Readable emergent encounters with five interacting enemy states and robust designer-facing controls.',
      tools: ['Unity', 'C#', 'Shader Graph', 'FMOD'],
      accent: '#f4bd67',
      status: 'Prototype',
    },
    {
      id: 'drift',
      title: 'Drift / Divide',
      type: 'Arcade Racer · Solo Project',
      year: '2024',
      summary:
        'A high-speed racing experiment built around switching between two overlapping realities.',
      challenge:
        'Keep a dual-world mechanic intuitive at speed and meaningful beyond a visual gimmick.',
      contribution:
        'Created the handling model, track metrics, procedural world transitions, UI, and complete content pipeline.',
      outcome:
        'A replayable three-track demo tuned through weekly playtests and telemetry-assisted iteration.',
      tools: ['Godot', 'GDScript', 'Blender', 'Substance'],
      accent: '#8ca5ff',
      status: 'Playable demo',
    },
    {
      id: 'hollow',
      title: 'Hollow Signal',
      type: 'Environmental Puzzle · Level Designer',
      year: '2024',
      summary:
        'A quiet first-person puzzle built inside an abandoned deep-space relay station.',
      challenge:
        'Teach a signal-routing language entirely through space, light, and environmental response.',
      contribution:
        'Owned greyboxing, puzzle progression, landmarks, sightlines, and the final art-pass handoff.',
      outcome:
        'Six escalating puzzle chambers with no text tutorials and consistent first-play comprehension.',
      tools: ['Unreal Engine', 'Blueprints', 'Blender'],
      accent: '#ef775f',
      status: 'Case study',
    },
  ],
  skills: [
    {
      group: 'Engines & code',
      items: ['Unreal Engine', 'Unity', 'Godot', 'C++', 'C#', 'Blueprints', 'GDScript'],
    },
    {
      group: 'Design',
      items: ['Gameplay systems', 'Level design', 'Prototyping', 'Encounter design', 'UX flows', 'Playtesting'],
    },
    {
      group: 'World craft',
      items: ['Blender', 'Houdini', 'Substance 3D', 'Lighting', 'Composition', 'Greyboxing'],
    },
    {
      group: 'Production',
      items: ['Git', 'Perforce', 'Jira', 'Agile teams', 'Documentation', 'Profiling'],
    },
  ],
  experience: [
    {
      period: '2025 — Present',
      role: 'Independent Game Developer',
      studio: 'Selected collaborations',
      description:
        'Building gameplay prototypes and supporting small teams across systems design, technical design, and level production.',
    },
    {
      period: '2024 — 2025',
      role: 'Game & Level Designer',
      studio: 'Studio Placeholder',
      description:
        'Created greyboxes, encounter layouts, and gameplay specifications for an unannounced action project.',
    },
    {
      period: '2023 — 2024',
      role: 'Gameplay Design Intern',
      studio: 'Studio Placeholder',
      description:
        'Prototyped player mechanics, supported playtests, and translated findings into focused iteration plans.',
    },
  ],
  education: [
    {
      period: '2020 — 2023',
      role: 'B.Sc. Game Design & Development',
      studio: 'School Placeholder',
      description:
        'Focused on gameplay programming, system design, 3D production, and collaborative game projects.',
    },
  ],
  resume: {
    label: 'Download résumé placeholder',
    href: '/resume-placeholder.txt',
  },
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'GitHub', href: 'https://github.com/amine-elaakkouchi' },
    { label: 'Itch.io', href: 'https://itch.io/' },
  ],
}
