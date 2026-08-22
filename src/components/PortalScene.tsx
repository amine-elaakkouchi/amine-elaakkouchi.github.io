import { ContactShadows, Sparkles, useAnimations, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const avatarPath = '/models/avatar.glb'

function getHeroX(width: number, height: number) {
  if (width < 700) return 0.35
  return width / height < 1.25 ? 0.9 : 1.48
}

function seededRandom(seed: { value: number }) {
  seed.value = (seed.value * 1664525 + 1013904223) >>> 0
  return seed.value / 4294967296
}

function NeuralPulse({
  position,
  phase,
  reducedMotion,
}: {
  position: [number, number, number]
  phase: number
  reducedMotion: boolean
}) {
  const pulse = useRef<THREE.Mesh>(null)
  const material = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(({ clock }) => {
    if (!pulse.current || !material.current || reducedMotion) return
    const wave = (Math.sin(clock.elapsedTime * 1.35 + phase) + 1) / 2
    pulse.current.scale.setScalar(0.75 + wave * 1.7)
    material.current.opacity = 0.16 + wave * 0.48
  })

  return (
    <mesh ref={pulse} position={position}>
      <sphereGeometry args={[0.09, 12, 12]} />
      <meshBasicMaterial
        ref={material}
        color="#b38aff"
        transparent
        opacity={reducedMotion ? 0.42 : 0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

function NeuralBackdrop({ reducedMotion }: { reducedMotion: boolean }) {
  const field = useRef<THREE.Group>(null)
  const { pointer, size } = useThree()
  const compact = size.width < 700

  const network = useMemo(() => {
    const cols = compact ? 8 : 14
    const rows = compact ? 6 : 8
    const seed = { value: 117 }
    const nodes: THREE.Vector3[] = []
    const spreadX = compact ? 3.35 : 3.55
    const spreadY = compact ? 2.9 : 3.15

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = (col / (cols - 1) - 0.5) * spreadX * 2
        const y = (row / (rows - 1) - 0.5) * spreadY * 2 + 0.12
        nodes.push(
          new THREE.Vector3(
            x + (seededRandom(seed) - 0.5) * 0.42,
            y + (seededRandom(seed) - 0.5) * 0.38,
            (seededRandom(seed) - 0.5) * 1.35,
          ),
        )
      }
    }

    const points = new Float32Array(nodes.flatMap((node) => node.toArray()))
    const links: number[] = []
    const maxLinks = compact ? 110 : 260
    const linkDistance = compact ? 1.28 : 1.18

    for (let first = 0; first < nodes.length && links.length / 6 < maxLinks; first += 1) {
      for (let second = first + 1; second < nodes.length; second += 1) {
        if (nodes[first].distanceTo(nodes[second]) < linkDistance) {
          links.push(...nodes[first].toArray(), ...nodes[second].toArray())
          if (links.length / 6 >= maxLinks) break
        }
      }
    }

    const pulseIndexes = compact
      ? [3, 12, 28, 40]
      : [6, 20, 48, 70, 90, 108]
    return {
      points,
      links: new Float32Array(links),
      pulses: pulseIndexes.map((index) => nodes[index].toArray() as [number, number, number]),
    }
  }, [compact])

  useFrame(({ clock }, delta) => {
    if (!field.current || reducedMotion) return
    const time = clock.elapsedTime
    field.current.rotation.y = THREE.MathUtils.damp(
      field.current.rotation.y,
      Math.sin(time * 0.12) * 0.12 + pointer.x * 0.1,
      2.4,
      delta,
    )
    field.current.rotation.x = THREE.MathUtils.damp(
      field.current.rotation.x,
      pointer.y * -0.08,
      2.4,
      delta,
    )
    field.current.rotation.z = Math.sin(time * 0.08) * 0.03
    field.current.position.x = THREE.MathUtils.damp(
      field.current.position.x,
      pointer.x * 0.14,
      2.4,
      delta,
    )
  })

  return (
    <group ref={field} position={[0, 0.08, -0.85]} scale={compact ? 0.95 : 1.08}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[network.points, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#9d6cff"
          size={compact ? 0.08 : 0.095}
          transparent
          opacity={0.76}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[network.links, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#7b4fd3"
          transparent
          opacity={0.28}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      {network.pulses.map((position, index) => (
        <NeuralPulse
          key={index}
          position={position}
          phase={index * 2.1}
          reducedMotion={reducedMotion}
        />
      ))}
    </group>
  )
}

function Avatar({ reducedMotion }: { reducedMotion: boolean }) {
  const avatar = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartRotation = useRef(0)
  const rotationOffset = useRef(0)
  const captureTarget = useRef<HTMLElement | null>(null)
  const [cursor, setCursor] = useState('default')
  const { pointer, size } = useThree()
  const { scene, animations } = useGLTF(avatarPath)
  const { actions } = useAnimations(animations, avatar)
  const avatarX = getHeroX(size.width, size.height)

  useEffect(() => {
    const idle = actions[animations[0]?.name]
    if (!idle || reducedMotion) return

    idle.reset().fadeIn(0.45).play()
    return () => {
      idle.fadeOut(0.25)
    }
  }, [actions, animations, reducedMotion])

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  useEffect(() => {
    document.body.style.cursor = cursor
    return () => {
      document.body.style.cursor = 'default'
    }
  }, [cursor])

  useFrame((state, delta) => {
    if (!avatar.current || reducedMotion) return
    avatar.current.rotation.y = THREE.MathUtils.damp(
      avatar.current.rotation.y,
      rotationOffset.current + (dragging.current ? 0 : pointer.x * 0.08),
      4,
      delta,
    )
    avatar.current.rotation.x = THREE.MathUtils.damp(
      avatar.current.rotation.x,
      -pointer.y * 0.025,
      4,
      delta,
    )
    avatar.current.position.y = -1.79 + Math.sin(state.clock.elapsedTime * 0.8) * 0.018
  })

  const startDrag = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    dragging.current = true
    dragStartX.current = event.clientX
    dragStartRotation.current = rotationOffset.current
    const target = event.nativeEvent.target
    if (target instanceof HTMLElement) {
      target.setPointerCapture(event.pointerId)
      captureTarget.current = target
    }
    setCursor('grabbing')
  }

  const rotateAvatar = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !avatar.current) return
    event.stopPropagation()
    rotationOffset.current =
      dragStartRotation.current + (event.clientX - dragStartX.current) * 0.012
    avatar.current.rotation.y = rotationOffset.current
  }

  const stopDrag = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return
    dragging.current = false
    if (captureTarget.current?.hasPointerCapture(event.pointerId)) {
      captureTarget.current.releasePointerCapture(event.pointerId)
    }
    captureTarget.current = null
    setCursor('grab')
  }

  return (
    <group>
      <primitive
        ref={avatar}
        object={scene}
        position={[avatarX, -1.79, 0]}
        scale={1.9}
      />
      <mesh
        position={[avatarX, 0, 0.6]}
        onPointerDown={startDrag}
        onPointerMove={rotateAvatar}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerOver={() => {
          setCursor('grab')
        }}
        onPointerOut={() => {
          if (!dragging.current) setCursor('default')
        }}
      >
        <planeGeometry args={[2.4, 4]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <ContactShadows
        position={[avatarX, -1.79, 0]}
        opacity={0.52}
        scale={5}
        blur={2.4}
        far={3.5}
        color="#050705"
      />
      {!reducedMotion && (
        <Sparkles
          count={34}
          scale={[5.5, 4.5, 2.5]}
          size={1.2}
          speed={0.18}
          color="#dfff7a"
          opacity={0.38}
        />
      )}
    </group>
  )
}

export default function PortalScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 36 }}
      dpr={[1, 1.6]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows
    >
      <ambientLight intensity={1.1} />
      <directionalLight
        castShadow
        position={[3, 5, 4]}
        intensity={3.2}
        color="#f2ffdc"
      />
      <directionalLight position={[-4, 2, 3]} intensity={2.1} color="#f0b85c" />
      <pointLight position={[0, -1, 3]} intensity={8} color="#b9ff3d" />
      <NeuralBackdrop reducedMotion={reducedMotion} />
      <Avatar reducedMotion={reducedMotion} />
    </Canvas>
  )
}

useGLTF.preload(avatarPath)
