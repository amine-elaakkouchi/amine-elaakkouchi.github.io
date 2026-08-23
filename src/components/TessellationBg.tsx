import gsap from 'gsap'
import { useEffect, useRef } from 'react'

const SVG_W = 1600
const SVG_H = 900
const GRAYS = ['#141414', '#1c1c1c', '#242424', '#2c2c2c', '#333333']

function delaunay(vertices: number[][]) {
  const EPSILON = 1 / 1048576
  const n = vertices.length
  if (n < 3 || n > 2000) return []

  const points = vertices.map((point) => [point[0], point[1]])
  const indices = Array.from({ length: n }, (_, index) => index)
  indices.sort((a, b) => points[b][0] - points[a][0])

  let xMin = Infinity
  let yMin = Infinity
  let xMax = -Infinity
  let yMax = -Infinity
  for (const [x, y] of points) {
    if (x < xMin) xMin = x
    if (x > xMax) xMax = x
    if (y < yMin) yMin = y
    if (y > yMax) yMax = y
  }
  const xDiff = xMax - xMin
  const yDiff = yMax - yMin
  const maxDiff = Math.max(xDiff, yDiff)
  const xCenter = xMin + xDiff * 0.5
  const yCenter = yMin + yDiff * 0.5
  points.push(
    [xCenter - 20 * maxDiff, yCenter - maxDiff],
    [xCenter, yCenter + 20 * maxDiff],
    [xCenter + 20 * maxDiff, yCenter - maxDiff],
  )

  const circumcircle = (i: number, j: number, k: number) => {
    const xI = points[i][0]
    const yI = points[i][1]
    const xJ = points[j][0]
    const yJ = points[j][1]
    const xK = points[k][0]
    const yK = points[k][1]
    const yDiffIJ = Math.abs(yI - yJ)
    const yDiffJK = Math.abs(yJ - yK)
    if (yDiffIJ < EPSILON && yDiffJK < EPSILON) return null
    const m1 = -((xJ - xI) / (yJ - yI))
    const m2 = -((xK - xJ) / (yK - yJ))
    const xMidIJ = (xI + xJ) / 2
    const xMidJK = (xJ + xK) / 2
    const yMidIJ = (yI + yJ) / 2
    const yMidJK = (yJ + yK) / 2
    const xC = yDiffIJ < EPSILON
      ? xMidIJ
      : yDiffJK < EPSILON
        ? xMidJK
        : (m1 * xMidIJ - m2 * xMidJK + yMidJK - yMidIJ) / (m1 - m2)
    const yC = yDiffIJ > yDiffJK ? m1 * (xC - xMidIJ) + yMidIJ : m2 * (xC - xMidJK) + yMidJK
    return { i, j, k, x: xC, y: yC, r: (xJ - xC) ** 2 + (yJ - yC) ** 2 }
  }

  const dedupeEdges = (edges: number[]) => {
    for (let j = edges.length; j; ) {
      const b = edges[--j]
      const a = edges[--j]
      for (let i = j; i; ) {
        const nEdge = edges[--i]
        const m = edges[--i]
        if ((a === m && b === nEdge) || (a === nEdge && b === m)) {
          edges.splice(j, 2)
          edges.splice(i, 2)
          break
        }
      }
    }
  }

  let candidates = [circumcircle(n, n + 1, n + 2)].filter(Boolean) as NonNullable<ReturnType<typeof circumcircle>>[]
  const locked: typeof candidates = []

  for (const c of indices) {
    const edges: number[] = []
    for (let j = candidates.length; j--; ) {
      const dx = points[c][0] - candidates[j].x
      if (dx > 0 && dx * dx > candidates[j].r) {
        locked.push(candidates[j])
        candidates.splice(j, 1)
        continue
      }
      const dy = points[c][1] - candidates[j].y
      if (dx * dx + dy * dy - candidates[j].r > EPSILON) continue
      edges.push(
        candidates[j].i, candidates[j].j,
        candidates[j].j, candidates[j].k,
        candidates[j].k, candidates[j].i,
      )
      candidates.splice(j, 1)
    }
    dedupeEdges(edges)
    for (let j = edges.length; j; ) {
      const b = edges[--j]
      const a = edges[--j]
      const next = circumcircle(a, b, c)
      if (next) candidates.push(next)
    }
  }

  locked.push(...candidates)
  const triangles: number[] = []
  for (const tri of locked) {
    if (tri.i < n && tri.j < n && tri.k < n) triangles.push(tri.i, tri.j, tri.k)
  }
  return triangles
}

function makeTesselation(gridSpacing: number) {
  const gridSize = gridSpacing
  const vertices: number[][] = []
  const xOffset = (SVG_W % gridSize) / 2
  const yOffset = (SVG_H % gridSize) / 2
  for (let x = Math.floor(SVG_W / gridSize) + 1; x >= -1; x--) {
    for (let y = Math.floor(SVG_H / gridSize) + 1; y >= -1; y--) {
      vertices.push([
        xOffset + gridSize * (x + 0.75 * (Math.random() - 0.5)),
        yOffset + gridSize * (y + 0.75 * (Math.random() - 0.5)),
      ])
    }
  }

  const triangles = delaunay(vertices)
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  for (let i = triangles.length; i; ) {
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    polygon.setAttribute(
      'points',
      `${vertices[triangles[--i]][0]},${vertices[triangles[i]][1]} ${vertices[triangles[--i]][0]},${vertices[triangles[i]][1]} ${vertices[triangles[--i]][0]},${vertices[triangles[i]][1]}`,
    )
    polygon.setAttribute('fill', GRAYS[Math.floor(Math.random() * GRAYS.length)])
    polygon.style.opacity = '0'
    group.appendChild(polygon)
  }
  return group
}

export function TessellationBg({
  reducedMotion,
  overlay = false,
}: {
  reducedMotion: boolean
  overlay?: boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const gridSpacing = window.innerWidth < 680 ? 340 : 280
    const sets = Array.from({ length: reducedMotion ? 1 : 4 }, () => makeTesselation(gridSpacing))
    for (const group of sets) svg.appendChild(group)

    const peak = overlay ? 0.42 : 0.72

    const showSet = (index: number, duration: number) => {
      const faces = [...sets[index].children]
      const n = faces.length
      for (let i = n; i--; ) {
        gsap.fromTo(
          faces[i],
          { opacity: 0 },
          {
            opacity: (0.55 + 0.45 * Math.random()) * peak,
            duration: duration * 0.4,
            delay: duration * (0.3 * i / n + 0.2),
            ease: 'power2.out',
          },
        )
      }
    }

    const hideSet = (index: number, duration: number) => {
      const faces = [...sets[index].children]
      const n = faces.length
      for (let i = n; i--; ) {
        gsap.to(faces[i], {
          opacity: 0,
          duration: duration * 0.4,
          delay: duration * (0.3 * i / n),
        })
      }
    }

    showSet(0, reducedMotion ? 0 : 2.2)

    if (reducedMotion) {
      return () => {
        gsap.killTweensOf(svg.querySelectorAll('polygon'))
        for (const group of sets) group.remove()
      }
    }

    let current = 0
    let lastAt = 0
    let frame = 0
    const delay = 5500
    const duration = 2.8

    const tick = (time: number) => {
      if (!lastAt || time - lastAt > delay) {
        lastAt = time
        const next = (current + 1) % sets.length
        hideSet(current, duration)
        showSet(next, duration)
        current = next
      }
      frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      gsap.killTweensOf(svg.querySelectorAll('polygon'))
      for (const group of sets) group.remove()
    }
  }, [overlay, reducedMotion])

  return (
    <svg
      ref={svgRef}
      className={overlay ? 'tessellation-bg tessellation-bg--overlay' : 'tessellation-bg'}
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {overlay ? null : <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="#000" />}
    </svg>
  )
}
