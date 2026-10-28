import { useEffect, useRef, useState } from 'react'

export function VrShowcase({ src, reducedMotion }: { src: string; reducedMotion: boolean }) {
  const thumb = useRef<HTMLDivElement>(null)
  const shine = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [idle, setIdle] = useState(false)
  const touched = useRef(false)

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!touched.current) setIdle(true)
    }, 8000)
    return () => window.clearTimeout(id)
  }, [])

  const tilt = (event: React.PointerEvent<HTMLDivElement>) => {
    touched.current = true
    setIdle(false)
    const node = thumb.current
    if (!node || reducedMotion) return
    const bounds = node.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    node.style.transform = `rotateX(${(y - 0.5) * 18}deg) rotateY(${(x - 0.5) * 16}deg)`
    if (shine.current) {
      shine.current.style.background = `radial-gradient(ellipse at ${(1 - x) * 100}% ${(1 - y) * 100}%, rgba(255,255,255,0.4) 0%, rgba(51,51,51,0) 60%)`
    }
  }

  const reset = () => {
    if (thumb.current) thumb.current.style.transform = ''
    if (shine.current) shine.current.style.background = 'none'
  }

  const toggle = () => {
    const node = video.current
    if (!node) return
    if (node.paused) {
      void node.play()
    } else {
      node.pause()
    }
  }

  return (
    <div className="vr-stage">
      <div
        ref={thumb}
        className={`vr-thumb ${idle ? 'vr-thumb--idle' : ''} ${playing ? 'vr-thumb--playing' : ''}`}
        onPointerMove={tilt}
        onPointerLeave={reset}
      >
        <div className="vr-backlight" aria-hidden="true" />
        <video
          ref={video}
          className="vr-player"
          src={`${src}#t=0.1`}
          preload="metadata"
          playsInline
          loop
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onClick={toggle}
        />
        <div ref={shine} className="vr-shine" aria-hidden="true" />
        <button
          type="button"
          className="vr-btn"
          onClick={toggle}
          aria-label={playing ? 'Pause VR and AR showreel' : 'Play VR and AR showreel'}
        />
      </div>
    </div>
  )
}
