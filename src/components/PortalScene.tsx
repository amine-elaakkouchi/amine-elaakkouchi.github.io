import { Float, Sparkles } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Portal({ reducedMotion }: { reducedMotion: boolean }) {
  const portal = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()

  useFrame((state, delta) => {
    if (!portal.current || !core.current) return
    const speed = reducedMotion ? 0.04 : 0.22
    portal.current.rotation.z += delta * speed
    portal.current.rotation.x = THREE.MathUtils.lerp(
      portal.current.rotation.x,
      pointer.y * 0.16,
      reducedMotion ? 0.015 : 0.04,
    )
    portal.current.rotation.y = THREE.MathUtils.lerp(
      portal.current.rotation.y,
      pointer.x * 0.22,
      reducedMotion ? 0.015 : 0.04,
    )
    core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.025)
  })

  return (
    <group ref={portal}>
      <Float speed={reducedMotion ? 0.2 : 1.1} rotationIntensity={0.15} floatIntensity={0.24}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.15, 0.12, 20, 160]} />
          <meshStandardMaterial
            color="#b9ff3d"
            emissive="#78b500"
            emissiveIntensity={2.4}
            roughness={0.32}
            metalness={0.75}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.18, 0.4]}>
          <torusKnotGeometry args={[1.65, 0.035, 180, 8, 3, 5]} />
          <meshStandardMaterial
            color="#f0b85c"
            emissive="#d07a20"
            emissiveIntensity={1.8}
            roughness={0.4}
            metalness={0.82}
          />
        </mesh>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.18, 2]} />
          <meshPhysicalMaterial
            color="#121612"
            emissive="#20320d"
            emissiveIntensity={0.8}
            roughness={0.12}
            metalness={0.25}
            transmission={0.15}
            wireframe
          />
        </mesh>
      </Float>
      <Sparkles
        count={reducedMotion ? 26 : 70}
        scale={[6.5, 6.5, 3]}
        size={1.4}
        speed={reducedMotion ? 0.05 : 0.24}
        color="#dfff7a"
        opacity={0.55}
      />
    </group>
  )
}

export default function PortalScene({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.5], fov: 42 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#edffd0" />
      <pointLight position={[-4, -2, 2]} intensity={18} color="#d59135" />
      <Portal reducedMotion={reducedMotion} />
    </Canvas>
  )
}
