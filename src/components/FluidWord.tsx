import { useId, useRef, type PointerEvent } from 'react'

export function FluidWord({ children }: { children: string }) {
  const id = useId().replace(/:/g, '')
  const displacement = useRef<SVGFEDisplacementMapElement>(null)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const ripple = (event: PointerEvent<SVGSVGElement>) => {
    if (reduced || !displacement.current) return
    const strength = 10 + Math.min(Math.abs(event.movementX) + Math.abs(event.movementY), 22)
    displacement.current.setAttribute('scale', String(strength))
  }

  const settle = () => {
    displacement.current?.setAttribute('scale', '8')
  }

  return (
    <svg
      className="fluid-word"
      viewBox="0 0 920 220"
      role="img"
      aria-hidden="true"
      onPointerMove={ripple}
      onPointerLeave={settle}
    >
      <defs>
        <linearGradient id={`fluid-fill-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4f5ee" />
          <stop offset="42%" stopColor="#d8d9d0" />
          <stop offset="100%" stopColor="#8d9186" />
        </linearGradient>
        <filter id={`fluid-warp-${id}`} x="-8%" y="-18%" width="116%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={reduced ? '0' : '0.012'}
            numOctaves="2"
            seed="7"
            result="noise"
          >
            {!reduced && (
              <animate
                attributeName="baseFrequency"
                values="0.01;0.018;0.01"
                dur="9s"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap
            ref={displacement}
            in="SourceGraphic"
            in2="noise"
            scale={reduced ? '0' : '8'}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <text
        x="8"
        y="188"
        filter={`url(#fluid-warp-${id})`}
        fill={`url(#fluid-fill-${id})`}
      >
        {children}
      </text>
    </svg>
  )
}
