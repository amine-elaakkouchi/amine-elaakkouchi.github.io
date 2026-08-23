import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Mail,
} from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { FluidWord } from './components/FluidWord'
import { LayeredTitle } from './components/LayeredTitle'
import { StrokeTitle } from './components/StrokeTitle'
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
    >
      {children}
    </a>
  )
}

function GamePanel({ game }: { game: GameCard }) {
  const content = (
    <>
      {game.image ? (
        <img src={encodeURI(game.image)} alt="" />
      ) : (
        <span className="game-card-fallback" aria-hidden="true" />
      )}
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
  const contactDialog = useRef<HTMLDialogElement>(null)
  const linkedin = portfolio.socials.find((social) => social.label === 'LinkedIn')
  const [copied, setCopied] = useState<'email' | 'discord' | null>(null)
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

  const copyText = async (value: string, type: 'email' | 'discord') => {
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

  const sendContact = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const sender = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')
    const subject = encodeURIComponent('Portfolio inquiry')
    const body = encodeURIComponent(`From: ${sender}\n\n${message}`)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(portfolio.profile.email)}&su=${subject}&body=${body}`
    contactDialog.current?.close()
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
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
          <img src="/ae-mark.svg" alt="" />
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
        </div>
        <a className="nav-contact" href="#contact" aria-label="Go to contact section">
          Let’s talk <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </nav>

      <main id="main">
        <section className="hero" id="top">
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
              <p>{portfolio.profile.about}</p>
            </aside>
            <div className="about-games" id="work">
              <div className="game-block reveal">
                <p className="eyebrow">A314LAB / 02</p>
                <h3>Games I made at A314LAB</h3>
                <div className="game-accordion">
                  {portfolio.a314Games.map((game) => (
                    <GamePanel key={game.id} game={game} />
                  ))}
                </div>
              </div>
              <div className="game-block reveal">
                <p className="eyebrow">Other games / 03</p>
                <h3>Personal and jam games</h3>
                <div className="game-accordion">
                  {portfolio.otherGames.map((game) => (
                    <GamePanel key={game.id} game={game} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="skills section" id="skills">
          <SectionIntro eyebrow="Toolkit / 04" title="Craft, code, and collaboration." />
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
          <header className="section-intro reveal">
            <p className="eyebrow">
              <Asterisk size={14} aria-hidden="true" />
              Experience / 05
            </p>
            <h2>
              <StrokeTitle text="Professional experience" />
            </h2>
            <p className="section-copy">
              Professional experience across Unity games, VR prototypes, gamification, educational projects, and interactive marketing.
            </p>
          </header>
          <div className="timeline">
            {portfolio.experience.map((item, index) => (
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
          <h3 className="timeline-heading reveal">Formations &amp; diplomas</h3>
          <div className="timeline">
            {portfolio.education.map((item, index) => (
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
          <div className="contact-actions reveal">
            {linkedin && (
              <a
                href={linkedin.href}
                className="contact-mail contact-mail--linkedin"
                target="_blank"
                rel="noreferrer"
              >
                <span className="linkedin-glyph" aria-hidden="true">in</span>
                LinkedIn / aminelakk
                <ArrowUpRight aria-hidden="true" />
              </a>
            )}
            <div className="contact-mail contact-mail--email">
              <button
                type="button"
                className="contact-email-trigger"
                onClick={() => contactDialog.current?.showModal()}
              >
                <Mail aria-hidden="true" />
                Email me
              </button>
              <button
                type="button"
                className="copy-email"
                onClick={() => copyText(portfolio.profile.email, 'email')}
                aria-label={`Copy ${portfolio.profile.email}`}
                title="Copy email address"
              >
                <span className="copy-glyph" aria-hidden="true"><span /><span /></span>
              </button>
              <span className={`copy-status ${copied === 'email' ? 'copy-status--visible' : ''}`} role="status">
                Copied
              </span>
            </div>
            <button
              type="button"
              className="contact-mail contact-mail--discord"
              onClick={() => copyText(portfolio.profile.discord, 'discord')}
              aria-label={`Copy Discord username ${portfolio.profile.discord}`}
            >
              <span className="discord-glyph" aria-hidden="true"><span /><span /></span>
              Discord / {portfolio.profile.discord}
              <span className="copy-glyph" aria-hidden="true"><span /><span /></span>
              <span className={`copy-status ${copied === 'discord' ? 'copy-status--visible' : ''}`} role="status">
                Copied
              </span>
            </button>
          </div>
        </section>
      </main>

      <dialog className="contact-dialog" ref={contactDialog}>
        <button
          type="button"
          className="dialog-close"
          onClick={() => contactDialog.current?.close()}
          aria-label="Close contact form"
        >
          ×
        </button>
        <p className="eyebrow"><span className="status-dot" /> Start a conversation</p>
        <h2>Tell me about<br /><em>your project.</em></h2>
        <form className="contact-form" onSubmit={sendContact}>
          <label>
            Your email address
            <input
              type="email"
              name="email"
              placeholder="example@gmail.com"
              autoComplete="email"
              pattern="[a-zA-Z0-9._%+\-]+@gmail\.com"
              title="Enter a Gmail address, such as example@gmail.com"
              required
            />
          </label>
          <label>
            Your message
            <textarea
              name="message"
              placeholder="What would you like to build?"
              rows={7}
              required
            />
          </label>
          <button type="submit" className="send-message">
            Send email
            <ArrowUpRight aria-hidden="true" />
          </button>
        </form>
        <p className="dialog-note">
          Gmail will open with your message ready. Review it, then click Send.
        </p>
      </dialog>

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
