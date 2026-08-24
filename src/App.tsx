import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { FluidWord } from './components/FluidWord'
import { LayeredTitle } from './components/LayeredTitle'
import { TessellationBg } from './components/TessellationBg'
import { TypewriterText } from './components/TypewriterText'
import { portfolio, type GameCard } from './data/portfolio'

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
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      download={href.endsWith('.pdf') ? 'CV_GameDev_Refreshed.pdf' : undefined}
    >
      {children}
    </a>
  )
}

type CopiedKind = 'email' | 'discord' | 'linkedin' | 'phone'

function DiscordIcon() {
  return (
    <svg className="discord-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
      />
    </svg>
  )
}

function CopyControl({
  value,
  kind,
  copied,
  onCopy,
  label,
}: {
  value: string
  kind: CopiedKind
  copied: CopiedKind | null
  onCopy: (value: string, kind: CopiedKind) => void
  label: string
}) {
  return (
    <>
      <button
        type="button"
        className="copy-email"
        onClick={() => onCopy(value, kind)}
        aria-label={label}
        title={label}
      >
        <span className="copy-glyph" aria-hidden="true"><span /><span /></span>
      </button>
      <span className={`copy-status ${copied === kind ? 'copy-status--visible' : ''}`} role="status">
        copied!
      </span>
    </>
  )
}

function assetSrc(path: string) {
  return path
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
    .replace(/^\/?/, '/')
}

function GamePanel({ game }: { game: GameCard }) {
  const content = (
    <>
      {game.image ? (
        <img className="game-card-cover" src={assetSrc(game.image)} alt="" />
      ) : (
        <span className="game-card-fallback" aria-hidden="true" />
      )}
      {game.showcase ? (
        <img className="game-card-showcase" src={assetSrc(game.showcase)} alt="" />
      ) : null}
      <span className="game-card-info">
        <small>{game.tag}</small>
        <strong>{game.title}</strong>
      </span>
    </>
  )

  if (game.href) {
    return (
      <a className="game-card" href={game.href} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return <article className="game-card">{content}</article>
}

function GameRail({ games }: { games: GameCard[] }) {
  const scroller = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, x: 0, scroll: 0 })

  const moveBy = (direction: number) => {
    const node = scroller.current
    const card = node?.querySelector('.game-card')
    if (!node || !card) return
    node.scrollBy({ left: direction * (card.getBoundingClientRect().width + 9), behavior: 'smooth' })
  }

  return (
    <div className="game-rail">
      <button type="button" className="game-rail-btn" aria-label="Previous project" onClick={() => moveBy(-1)}>
        <ChevronLeft size={18} />
      </button>
      <div
        ref={scroller}
        className="game-accordion game-accordion--rail"
        onPointerDown={(event) => {
          drag.current = { active: true, x: event.clientX, scroll: scroller.current?.scrollLeft ?? 0 }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (!drag.current.active || !scroller.current) return
          scroller.current.scrollLeft = drag.current.scroll - (event.clientX - drag.current.x)
        }}
        onPointerUp={() => {
          drag.current.active = false
        }}
      >
        {games.map((game) => (
          <GamePanel key={game.id} game={game} />
        ))}
      </div>
      <button type="button" className="game-rail-btn" aria-label="Next project" onClick={() => moveBy(1)}>
        <ChevronRight size={18} />
      </button>
    </div>
  )
}

function ExtraCircles({ images, reducedMotion }: { images: string[]; reducedMotion: boolean }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (reducedMotion || images.length === 0) return
    const id = window.setInterval(() => setTick((value) => value + 1), 2800)
    return () => window.clearInterval(id)
  }, [images.length, reducedMotion])

  return (
    <div className="game-extra">
      <p className="eyebrow">&amp; more</p>
      <div className="game-circles" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => {
          const src = images[(tick + index) % images.length]
          return (
            <span className="game-circle" key={index}>
              <img className="game-circle-img" src={encodeURI(src)} alt="" key={src} />
            </span>
          )
        })}
      </div>
    </div>
  )
}

function App() {
  const main = useRef<HTMLDivElement>(null)
  const linkedin = portfolio.socials.find((social) => social.label === 'LinkedIn')
  const [copied, setCopied] = useState<CopiedKind | null>(null)
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

  const copyText = async (value: string, type: CopiedKind) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const input = document.createElement('textarea')
      input.value = value
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(type)
    window.setTimeout(() => setCopied(null), 1800)
  }

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
          <span className="nav-mark-btn">
            <svg className="nav-home" viewBox="0 0 100 100" aria-hidden="true">
              <path d="M20 52 L50 24 L80 52" />
              <path d="M34 50 V80 H66 V50" />
              <path d="M44 80 V64 H56 V80" />
            </svg>
          </span>
        </a>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#games">Games</a>
          <a href="#experience">Experience</a>
        </div>
        <a className="nav-contact" href="#contact" aria-label="Go to contact section">
          Let’s talk
        </a>
      </nav>

      <main id="main">
        <section className="hero" id="top">
          <TessellationBg reducedMotion={reducedMotion} overlay />
          <div className="hero-scene" aria-label="Interactive animated 3D avatar">
            {webGL ? (
              <Suspense fallback={<div className="scene-fallback scene-fallback--loading" />}>
                <PortalScene reducedMotion={reducedMotion} />
              </Suspense>
            ) : (
              <div className="scene-fallback" />
            )}
          </div>
          <div className="hero-vignette" />
          <div className="hero-meta" aria-label="Professional details">
            {portfolio.profile.heroDetails.map((detail) => (
              <p className="hero-detail" key={detail.label}>
                <span aria-hidden="true">{detail.icon}</span>
                {detail.label}
              </p>
            ))}
          </div>
          <div className="hero-identity">
            <strong>{portfolio.profile.heroName}</strong>
            <span>{portfolio.profile.age} years old</span>
            <small>Drag left or right · 360°</small>
          </div>
          <div className="hero-title" aria-label="Game developer, designer, world builder">
            <h1>
              <span className="hero-word hero-word--fluid">
                <span>
                  <FluidWord>GAME</FluidWord>
                </span>
              </span>
              <span className="hero-word hero-word--outline">
                <span>
                  <FluidWord variant="outline">DEVELOPER / DESIGNER</FluidWord>
                </span>
              </span>
            </h1>
          </div>
          <a className="scroll-cue" href="#about">
            Explore <ArrowDown size={16} aria-hidden="true" />
          </a>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="marquee-group" key={group}>
                <span>POLISHED CODE</span><Asterisk />
                <span>GAME DEV</span><Asterisk />
                <span>2D</span><Asterisk />
                <span>3D</span><Asterisk />
                <span>VR</span><Asterisk />
                <span>XR</span><Asterisk />
                <span>OPTIMISATION</span><Asterisk />
                <span>TEAMWORK</span><Asterisk />
                <span>GAME MANAGEMENT</span><Asterisk />
                <span>DESIGN</span><Asterisk />
                <span>PLAYABLE WORLDS</span><Asterisk />
                <span>SYSTEMATIC FEATURES</span><Asterisk />
              </div>
            ))}
          </div>
        </div>

        <div className="dark-slides">
          <TessellationBg reducedMotion={reducedMotion} />
        <section className="about section" id="about">
          <div className="about-layout">
            <aside className="about-side reveal">
              <p className="eyebrow">
                <Asterisk size={14} aria-hidden="true" />
                About / 01
              </p>
              <h2>
                <LayeredTitle text="About me" />
              </h2>
              <TypewriterText text={portfolio.profile.about} />
            </aside>
            <div className="about-games" id="work">
              <div className="game-block reveal">
                <p className="eyebrow">A314LAB / 02</p>
                <h3>Games I made at A314LAB</h3>
                <GameRail games={portfolio.a314Games} />
                <ExtraCircles images={portfolio.a314Extra} reducedMotion={reducedMotion} />
              </div>
            </div>
            <div className="game-block game-block--jam reveal" id="games">
              <p className="eyebrow">Other games / 03</p>
              <h3>Personal and jam games</h3>
              <div className="game-accordion game-accordion--cubes">
                {portfolio.otherGames.map((game) => (
                  <GamePanel key={game.id} game={game} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="skills section" id="skills">
          <header className="section-intro reveal">
            <h2>
              <LayeredTitle text="Craft, code, and collaboration." className="layered-title--xl" />
            </h2>
          </header>
          <div className="skills-grid">
            {portfolio.skills.map((skill, index) => (
              <article
                className={`skill-group skill-group--${['aqua', 'violet', 'amber', 'lime'][index] ?? 'aqua'} reveal`}
                key={skill.group}
              >
                <h3>{skill.group}</h3>
                <ul>
                  {skill.items.map((item) => (
                    <li key={item}>
                      <span className="skill-badge-dot" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="experience section" id="experience">
          <header className="section-intro reveal">
            <h2>
              <LayeredTitle text="Professional experience" className="layered-title--xl" />
            </h2>
            <TypewriterText
              className="section-copy"
              text="Professional experience across Unity games, VR prototypes, gamification, educational projects, and interactive marketing."
            />
          </header>
          <div className="timeline">
            {portfolio.experience.map((item, index) => (
              <article className="timeline-row reveal" key={`${item.period}-${item.role}`}>
                <span className="timeline-index">0{index + 1}</span>
                <p className="timeline-period">{item.period}</p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="timeline-studio">{item.studio}</p>
                  <TypewriterText text={item.description} />
                </div>
              </article>
            ))}
          </div>
          <h3 className="timeline-heading reveal">
            <LayeredTitle text="Formations & diplomas" className="layered-title--xl" />
          </h3>
          <div className="timeline">
            {portfolio.education.map((item, index) => (
              <article className="timeline-row reveal" key={`${item.period}-${item.role}`}>
                <span className="timeline-index">0{index + 1}</span>
                <p className="timeline-period">{item.period}</p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="timeline-studio">{item.studio}</p>
                  <TypewriterText text={item.description} />
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
          <h2 className="reveal">
            <LayeredTitle text="Let’s make" className="layered-title--contact" />
            <LayeredTitle text="something playable" className="layered-title--contact layered-title--gold" />
          </h2>
          <div className="contact-actions reveal">
            {linkedin && (
              <div className="contact-mail contact-mail--linkedin">
                <a
                  className="contact-email-trigger"
                  href={linkedin.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="linkedin-glyph" aria-hidden="true">in</span>
                  LinkedIn / aminelakk
                </a>
                <CopyControl
                  value="aminelakk"
                  kind="linkedin"
                  copied={copied}
                  onCopy={copyText}
                  label="Copy LinkedIn name aminelakk"
                />
              </div>
            )}
            <div className="contact-mail contact-mail--email">
              <a
                className="contact-email-trigger"
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolio.profile.email)}`}
                target="_blank"
                rel="noreferrer"
              >
                <Mail aria-hidden="true" />
                Email me
              </a>
              <CopyControl
                value={portfolio.profile.email}
                kind="email"
                copied={copied}
                onCopy={copyText}
                label={`Copy ${portfolio.profile.email}`}
              />
            </div>
            <div className="contact-mail contact-mail--phone">
              <span className="contact-email-trigger">
                <Phone aria-hidden="true" />
                Phone
              </span>
              <CopyControl
                value={portfolio.profile.phone}
                kind="phone"
                copied={copied}
                onCopy={copyText}
                label="Copy phone number"
              />
            </div>
            <div className="contact-mail contact-mail--discord">
              <a
                className="contact-email-trigger"
                href="https://discord.com/"
                target="_blank"
                rel="noreferrer"
              >
                <DiscordIcon />
                Discord / {portfolio.profile.discord}
              </a>
              <CopyControl
                value={portfolio.profile.discord}
                kind="discord"
                copied={copied}
                onCopy={copyText}
                label={`Copy Discord username ${portfolio.profile.discord}`}
              />
            </div>
          </div>
        </section>
        </div>
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
