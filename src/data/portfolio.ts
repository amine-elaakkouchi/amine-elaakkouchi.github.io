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

export type GameCard = {
  id: string
  title: string
  tag: string
  image?: string
  showcase?: string
  href?: string
}

export type PortfolioData = {
  profile: {
    name: string
    heroName: string
    age: number
    location: string
    availability: string
    heroDetails: { icon: string; label: string }[]
    intro: string
    about: string
    email: string
    discord: string
  }
  roles: Role[]
  projects: Project[]
  a314Games: GameCard[]
  a314Extra: string[]
  otherGames: GameCard[]
  skills: { group: string; items: string[] }[]
  experience: Experience[]
  education: Experience[]
  resume: { label: string; href: string }
  socials: Social[]
}

export const portfolio: PortfolioData = {
  profile: {
    name: 'Amine El Aakkouchi',
    heroName: 'Amine ELAAKKOUCHI',
    age: 31,
    location: 'Casablanca, Morocco · Available worldwide',
    availability: 'Senior Game Developer',
    heroDetails: [
      { icon: '📍', label: 'Casablanca, Morocco' },
      { icon: '🏅', label: 'Senior Game Developer' },
      { icon: '🎮', label: 'Unity · C# · VR' },
    ],
    intro:
      'I build engaging Unity experiences across games, VR, gamification, education, and brand activation.',
    about:
      'A Senior Game Developer specialized in Unity and gamification, with professional experience creating educational, VR, hyper-casual, and marketing experiences. I combine gameplay development, UI, VFX, animation, and design to turn ideas into polished interactive work.',
    email: 'amine.elaakkouchi@gmail.com',
    discord: 'amineel95',
  },
  roles: [
    {
      index: '01',
      title: 'Game Development',
      shortTitle: 'Developer',
      description:
        'Unity and C# development across gameplay mechanics, UI systems, VR prototypes, VFX, animation, and advertising integrations.',
    },
    {
      index: '02',
      title: 'Game Design',
      shortTitle: 'Designer',
      description:
        'Engaging mechanics and user experiences designed for educational games, hyper-casual projects, and gamified brand activations.',
    },
    {
      index: '03',
      title: 'Level Design',
      shortTitle: 'World builder',
      description:
        'Interactive spaces shaped through 2D and 3D design, visual composition, player guidance, iteration, and hands-on prototyping.',
    },
  ],
  projects: [
    {
      id: 'a314lab',
      title: 'Gamified Brand Experiences',
      type: 'Unity · Senior Game Developer',
      year: '2024 — Present',
      summary:
        'Games and gamified marketing experiences developed at A314LAB for a range of company campaigns.',
      challenge:
        'Translate different marketing goals into interactions that are immediate, engaging, and technically reliable.',
      contribution:
        'Develop gameplay mechanics, UI, VFX, animations, advertising integrations, and supporting marketing features in Unity.',
      outcome:
        'Playable brand activations and gamified experiences delivered for multiple companies and campaign needs.',
      tools: ['Unity', 'C#', 'UI', 'VFX', 'Animation'],
      accent: '#c7ff43',
      status: 'Professional work',
    },
    {
      id: 'kokoro',
      title: 'VR Prototypes',
      type: 'Unity / VR · Game Developer',
      year: '2021 — 2024',
      summary:
        'Immersive virtual-reality prototypes built with Unity during game-development roles at Kokoro Games.',
      challenge:
        'Turn interaction concepts into clear, testable VR experiences while learning and iterating quickly.',
      contribution:
        'Built Unity VR prototypes and contributed as both a Game Developer and Unity / VR Game Developer Intern.',
      outcome:
        'A collection of functional VR prototypes demonstrating interactive concepts and immersive mechanics.',
      tools: ['Unity', 'C#', 'VR', 'Prototyping'],
      accent: '#f4bd67',
      status: 'VR development',
    },
    {
      id: 'shinko',
      title: 'Educational & Hyper-Casual Games',
      type: 'Unity · Game Development Intern',
      year: '2020 — 2021',
      summary:
        'Accessible educational and hyper-casual games developed during an internship at Shinko Games.',
      challenge:
        'Balance simple onboarding, readable feedback, and satisfying mechanics for broad audiences.',
      contribution:
        'Developed gameplay mechanics and user interfaces in Unity with close attention to user experience.',
      outcome:
        'Educational and hyper-casual game experiences combining implementation, interface work, and design.',
      tools: ['Unity', 'C#', 'Gameplay', 'UI / UX'],
      accent: '#8ca5ff',
      status: 'Game development',
    },
  ],
  a314Games: [
    {
      id: 'shopping-runner',
      title: 'Shopping Runner',
      tag: 'Cora · Runner',
      image: '/A314Games/C - Shopping Runner.png',
      showcase: '/A314Games/C- showcase .jpg',
    },
    {
      id: 'city-runner',
      title: 'City Runner',
      tag: 'ALSA · Runner',
      image: '/A314Games/A- CityRunner for the alsa company.jpg',
      showcase: '/A314Games/A- CityRunner alsa showcase.jpg',
    },
    {
      id: 'foot-shooter',
      title: 'Foot Shooter',
      tag: 'inwi · Sports',
      image: '/A314Games/B - footshooter inwi.png',
      showcase: '/A314Games/B - footshooter inwi showcase .png',
    },
    {
      id: 'foot-runner',
      title: 'Foot Runner',
      tag: 'A314LAB · Sports',
      image: '/A314Games/D - FootRunner .jpg',
      showcase: '/A314Games/D - FootRunner showcase .png',
    },
    {
      id: 'shopping-bee',
      title: 'Shopping Bee',
      tag: 'Cora · Adventure',
      image: '/A314Games/E-shopping bee  .jpg',
      showcase: '/A314Games/E - Shopping bee showcase .png',
    },
    {
      id: 'summer-runner',
      title: 'Summer Runner',
      tag: 'A314LAB · Runner',
      image: '/A314Games/F- summer runner.png',
      showcase: '/A314Games/F-summer runner showcase.png',
    },
  ],
  a314Extra: [
    '/A314Games/A314Games-Extra/5842676f-7b43-45b3-b336-60c5bd44b655.jpg',
    '/A314Games/A314Games-Extra/5a8cc9cc-a171-45ee-841f-586826e45583.jpg',
    '/A314Games/A314Games-Extra/5db0e880-56ff-452a-854f-6ab430ee57a1.jpg',
    '/A314Games/A314Games-Extra/c48cc04f-2933-4870-bdb7-747683ee0a84.jpg',
    '/A314Games/A314Games-Extra/c614a94a-8c5b-40c7-8808-6782a91c337b.jpg',
    '/A314Games/A314Games-Extra/d4ab50f3-edb3-4bc3-b015-85fdd3c8f478.jpg',
    '/A314Games/A314Games-Extra/de823710-a3a0-43c1-a672-c71171ebb2b6.jpg',
    '/A314Games/A314Games-Extra/Capture d\'écran 2026-08-22 235947.png',
  ],
  otherGames: [
    {
      id: 'sniper-boy',
      title: 'SniperBoy',
      tag: '2D · Itch.io',
      image: '/otherGames/sniper-boy.png',
      href: 'https://amineel.itch.io/sniperboy',
    },
    {
      id: 'sheep-scramble',
      title: 'Sheep Scramble',
      tag: '3D · Itch.io',
      href: 'https://amineel.itch.io/3d-sheep-scramble',
    },
    {
      id: 'vocal-block-shift',
      title: 'VocalBlockShift',
      tag: '2D · Itch.io',
      href: 'https://amineel.itch.io/vocalblockshift',
    },
    {
      id: 'bubble-bullets',
      title: 'Bubble Bullets',
      tag: 'Educational · Itch.io',
      href: 'https://amineel.itch.io/bubble-bullets',
    },
    {
      id: 'itch-profile',
      title: 'More on itch.io',
      tag: 'All games',
      href: 'https://amineel.itch.io/',
    },
  ],
  skills: [
    {
      group: 'Engines & code',
      items: ['Unity', 'C#', 'Unreal Engine', 'Gameplay programming', 'VR development'],
    },
    {
      group: 'Design',
      items: ['Game design', 'Gamification', 'Gameplay mechanics', 'UI / UX', 'Prototyping'],
    },
    {
      group: 'World craft',
      items: ['3ds Max', 'Photoshop', '2D design', '3D design', 'VFX', 'Animation'],
    },
    {
      group: 'Languages',
      items: ['Arabic · Mother tongue', 'French · Good', 'English · Acceptable'],
    },
  ],
  experience: [
    {
      period: '2024 — Present',
      role: 'Senior Game Developer',
      studio: 'A314LAB',
      description:
        'Designing and developing Unity games and gamified experiences, including gameplay, UI, VFX, animation, advertising integrations, and marketing projects.',
    },
    {
      period: '2023 — 2024',
      role: 'Unity / VR Game Developer Intern',
      studio: 'Kokoro Games',
      description:
        'Expanded hands-on Unity and VR development experience through immersive prototype work.',
    },
    {
      period: '2021 — 2022',
      role: 'Game Developer',
      studio: 'Kokoro Games',
      description:
        'Built VR prototypes using Unity.',
    },
    {
      period: '2020 — 2021',
      role: 'Game Development Intern',
      studio: 'Shinko Games',
      description:
        'Developed educational and hyper-casual games in Unity, focusing on gameplay mechanics, UI, and user experience.',
    },
    {
      period: 'March 2019 — July 2019',
      role: 'Development Intern',
      studio: 'Institut Pasteur · Casablanca',
      description:
        'Completed a professional development internship at Institut Pasteur in Casablanca.',
    },
    {
      period: 'October 2017 — November 2018',
      role: 'Web Development Intern',
      studio: '6SOLUTIONS',
      description:
        'Completed a web development internship while building broader software-development experience.',
    },
  ],
  education: [
    {
      period: '2019 — 2020',
      role: 'Arts, Audiovisual & Game Studies',
      studio: 'Studio M · French School of Arts and Audiovisual',
      description:
        'Developed visual-production and interactive-media skills across arts, audiovisual work, and games.',
    },
    {
      period: '2016 — 2019',
      role: 'Master in Computer Engineering · MIAGE',
      studio: 'EMSI · Moroccan School of Engineering Sciences',
      description:
        'Computer Methods Applied to Business Management, combining software engineering and information systems.',
    },
    {
      period: '2013 — 2016',
      role: 'Specialized Technician · Computer Development',
      studio: 'ISTA · OFPPT',
      description:
        'Professional diploma focused on software and computer development.',
    },
    {
      period: '2012 — 2013',
      role: 'Scientific Baccalaureate · Life & Earth Sciences',
      studio: 'Amrou Ibn Al-Ass',
      description:
        'Scientific secondary education with a life and earth sciences specialization.',
    },
  ],
  resume: {
    label: 'Request my résumé',
    href: 'mailto:amine.elaakkouchi@gmail.com?subject=Résumé request',
  },
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aminelakk/' },
    { label: 'GitHub', href: 'https://github.com/amine-elaakkouchi' },
  ],
}
