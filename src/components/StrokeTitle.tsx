import { useEffect, useRef, useState } from 'react'

export function StrokeTitle({
  text,
  tone = 'paper',
}: {
  text: string
  tone?: 'paper' | 'ink'
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [drawn, setDrawn] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (drawn) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDrawn(true)
      },
      { threshold: 0.45 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [drawn])

  const width = Math.max(360, text.length * 62)

  return (
    <svg
      ref={ref}
      className={`stroke-title stroke-title--${tone} ${drawn ? 'is-drawn' : ''}`}
      viewBox={`0 0 ${width} 130`}
      role="img"
      aria-label={text}
    >
      <text x="4" y="96">
        {text}
      </text>
      <line className="stroke-title-dot" x1={width - 28} y1="108" x2={width - 28} y2="108" />
    </svg>
  )
}
