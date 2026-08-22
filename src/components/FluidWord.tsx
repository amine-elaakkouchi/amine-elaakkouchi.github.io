import { useId } from 'react'

export function FluidWord({
  children,
  variant = 'fill',
}: {
  children: string
  variant?: 'fill' | 'outline'
}) {
  const id = useId().replace(/:/g, '')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <svg
      className={`fluid-word fluid-word--${variant}`}
      viewBox={variant === 'outline' ? '0 0 980 140' : '0 0 920 220'}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`fluid-fill-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4f5ee" />
          <stop offset="42%" stopColor="#d8d9d0" />
          <stop offset="100%" stopColor="#8d9186" />
        </linearGradient>
        <filter id={`fluid-warp-${id}`} x="-10%" y="-22%" width="120%" height="150%">
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
            in="SourceGraphic"
            in2="noise"
            scale={reduced ? '0' : '8'}
            xChannelSelector="R"
            yChannelSelector="G"
          >
            {!reduced && (
              <animate
                attributeName="scale"
                values="6;14;8;12;6"
                dur="7s"
                repeatCount="indefinite"
              />
            )}
          </feDisplacementMap>
        </filter>
      </defs>
      <text
        x="8"
        y={variant === 'outline' ? '108' : '188'}
        filter={`url(#fluid-warp-${id})`}
        fill={variant === 'outline' ? 'none' : `url(#fluid-fill-${id})`}
        stroke={variant === 'outline' ? 'rgba(240, 241, 233, 0.78)' : 'none'}
        strokeWidth={variant === 'outline' ? '3.2' : '0'}
      >
        {children}
      </text>
    </svg>
  )
}
