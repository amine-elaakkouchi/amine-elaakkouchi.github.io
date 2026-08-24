import { useEffect, useRef, useState } from 'react'

export function TypewriterText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const node = useRef<HTMLParagraphElement>(null)
  const [shown, setShown] = useState('')
  const [active, setActive] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setShown(text)
      return
    }

    const target = node.current
    if (!target) return

    let timer = 0
    let index = 0
    let started = false

    const type = () => {
      index += 1
      setShown(text.slice(0, index))
      if (index < text.length) timer = window.setTimeout(type, 16)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return
        started = true
        setActive(true)
        type()
      },
      { threshold: 0.35 },
    )

    observer.observe(target)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [text])

  return (
    <p ref={node} className={`typewriter ${className ?? ''}`.trim()}>
      {shown}
      <span className={`typewriter-caret${active ? '' : ' typewriter-caret--idle'}`} aria-hidden="true" />
    </p>
  )
}
