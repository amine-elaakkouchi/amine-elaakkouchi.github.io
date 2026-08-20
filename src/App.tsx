import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Gamepad2,
  Mail,
  MousePointer2,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { portfolio, type Project } from './data/portfolio'

const PortalScene = lazy(() => import('./components/PortalScene'))

gsap.registerPlugin(useGSAP, ScrollTrigger)

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')),
    )
  } catch {
    return false
  }
}

function MagneticLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)

  const move = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = ref.current.getBoundingClientRect()
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.14
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.14
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }

  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <a
      ref={ref}
      href={href}
      className={`magnetic ${className}`}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </a>
  )
}

function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <div
      className={`project-visual project-visual--${project.id} ${compact ? 'project-visual--compact' : ''}`}
      style={{ '--accent': project.accent } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="visual-orbit" />
      <span className="visual-core">{project.id.slice(0, 2).toUpperCase()}</span>
      <span className="visual-grid" />
      <span className="visual-caption">{project.status}</span>
    </div>
  )
}

function SectionIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string
  title: string
  copy?: string
}) {
  return (
    <header className="section-intro reveal">
      <p className="eyebrow">
        <Asterisk size={14} aria-hidden="true" />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </header>
  )
}

function App() {
  const main = useRef<HTMLDivElement>(null)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [webGL] = useState(supportsWebGL)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useGSAP(
    () => {
      if (reducedMotion) return

      gsap.from('.hero-word > span', {
        yPercent: 115,
        duration: 1.15,
        stagger: 0.08,
        ease: 'power4.out',
        delay: 0.15,
      })

      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.from(element, {
          y: 55,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })

      gsap.to('.hero-scene', {
        yPercent: 18,
        scale: 0.92,
        opacity: 0.35,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      })

      gsap.to('.gallery-track', {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.gallery-shell',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    },
    { scope: main, dependencies: [reducedMotion] },
  )

  return (
    <div ref={main}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        <a className="nav-mark" href="#top" aria-label="Amine El Aakkouchi, home">
          AE
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Résumé</a>
        </div>
        <a className="nav-contact" href="#contact" aria-label="Go to contact section">
          Let’s talk <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </nav>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-scene" aria-label="Interactive procedural portal">
            {webGL ? (
              <Suspense fallback={<div className="scene-fallback scene-fallback--loading" />}>
                <PortalScene reducedMotion={reducedMotion} />
              </Suspense>
            ) : (
              <div className="scene-fallback" />
            )}
          </div>
          <div className="hero-vignette" />
          <div className="hero-meta">
            <p>{portfolio.profile.location}</p>
            <p className="status">
              <span />
              {portfolio.profile.availability}
            </p>
          </div>
          <div className="hero-title" aria-label="Game developer, designer, world builder">
            <h1>
              <span className="hero-word">
                <span>Game</span>
              </span>
              <span className="hero-word hero-word--outline">
                <span>Developer</span>
              </span>
            </h1>
            <div className="hero-subline">
              <p>{portfolio.profile.intro}</p>
              <span aria-hidden="true">/</span>
              <p>Designer<br />World builder</p>
            </div>
          </div>
          <a className="scroll-cue" href="#about">
            Explore <ArrowDown size={16} aria-hidden="true" />
          </a>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="marquee-group" key={group}>
                <span>PLAYABLE WORLDS</span><Asterisk /><span>SYSTEMIC STORIES</span><Asterisk />
                <span>MEANINGFUL SPACES</span><Asterisk />
              </div>
            ))}
          </div>
        </div>

        <section className="about section" id="about">
          <SectionIntro eyebrow="Profile / 01" title="Designing the space between intention and impact." />
          <div className="about-grid">
            <p className="about-lead reveal">{portfolio.profile.about}</p>
            <div className="roles">
              {portfolio.roles.map((role) => (
                <article className="role-card reveal" key={role.index}>
                  <span>{role.index}</span>
                  <h3>{role.title}</h3>
                  <p>{role.description}</p>
                  <Gamepad2 aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="work section" id="work">
          <SectionIntro
            eyebrow="Selected work / 02"
            title="Games with a point of view."
            copy="Selected prototypes and case studies spanning player systems, environmental storytelling, and world design."
          />
          <div className="featured-list">
            {portfolio.projects.slice(0, 3).map((project, index) => (
              <article className="featured-card reveal" key={project.id}>
                <div className="featured-topline">
                  <span>0{index + 1}</span>
                  <span>{project.year}</span>
                </div>
                <ProjectVisual project={project} />
                <div className="featured-content">
                  <p className="project-type">{project.type}</p>
                  <h3>{project.title}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <div className="case-grid">
                    <div><span>Challenge</span><p>{project.challenge}</p></div>
                    <div><span>My contribution</span><p>{project.contribution}</p></div>
                    <div><span>Outcome</span><p>{project.outcome}</p></div>
                  </div>
                  <ul className="tool-list" aria-label={`${project.title} tools`}>
                    {project.tools.map((tool) => <li key={tool}>{tool}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-shell section" aria-labelledby="gallery-heading">
          <div className="gallery-heading reveal">
            <p className="eyebrow"><MousePointer2 size={14} /> Explore the archive</p>
            <h2 id="gallery-heading">Other worlds,<br /><em>still in motion.</em></h2>
          </div>
          <div className="gallery-window">
            <div className="gallery-track">
              {[...portfolio.projects, ...portfolio.projects].map((project, index) => (
                <article
                  className="gallery-card"
                  key={`${project.id}-${index}`}
                  style={{ '--card-accent': project.accent } as React.CSSProperties}
                >
                  <ProjectVisual project={project} compact />
                  <div>
                    <span>{project.type.split(' · ')[0]}</span>
                    <h3>{project.title}</h3>
                    <p>{project.year} / {project.status}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="skills section" id="skills">
          <SectionIntro eyebrow="Toolkit / 03" title="Craft, code, and collaboration." />
          <div className="skills-grid">
            {portfolio.skills.map((skill, index) => (
              <article className="skill-group reveal" key={skill.group}>
                <span>0{index + 1}</span>
                <h3>{skill.group}</h3>
                <ul>
                  {skill.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="experience section" id="experience">
          <SectionIntro
            eyebrow="Résumé / 04"
            title="Experience built in production."
            copy="Professional experience across Unity games, VR prototypes, gamification, educational projects, and interactive marketing."
          />
          <div className="timeline">
            {[...portfolio.experience, ...portfolio.education].map((item, index) => (
              <article className="timeline-row reveal" key={`${item.period}-${item.role}`}>
                <span className="timeline-index">0{index + 1}</span>
                <p className="timeline-period">{item.period}</p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="timeline-studio">{item.studio}</p>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
          <MagneticLink href={portfolio.resume.href} className="resume-link">
            {portfolio.resume.label} <Mail size={18} aria-hidden="true" />
          </MagneticLink>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-orbit" aria-hidden="true"><span>AVAILABLE · COLLABORATE · SAY HELLO · </span></div>
          <p className="eyebrow reveal"><span className="status-dot" /> Have a world to build?</p>
          <h2 className="reveal">Let’s make<br /><em>something felt.</em></h2>
          <MagneticLink href={`mailto:${portfolio.profile.email}`} className="contact-mail">
            <Mail aria-hidden="true" />
            {portfolio.profile.email}
            <ArrowUpRight aria-hidden="true" />
          </MagneticLink>
        </section>
      </main>

      <footer>
        <div>
          <a href="#top" className="footer-mark">AE / 26</a>
          <p>Game development · design · worlds</p>
        </div>
        <div className="socials">
          {portfolio.socials.map((social) => (
            <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
              {social.label}<ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} {portfolio.profile.name}</p>
      </footer>
    </div>
  )
}

export default App
