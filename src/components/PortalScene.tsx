import { ContactShadows, Sparkles, useAnimations, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const avatarPath = '/models/avatar.glb'

function Avatar({ reducedMotion }: { reducedMotion: boolean }) {
  const avatar = useRef<THREE.Group>(null)
  const { pointer } = useThree()
  const { scene, animations } = useGLTF(avatarPath)
  const { actions } = useAnimations(animations, avatar)

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

  useFrame((state, delta) => {
    if (!avatar.current || reducedMotion) return
    avatar.current.rotation.y = THREE.MathUtils.damp(
      avatar.current.rotation.y,
      pointer.x * 0.16,
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

  return (
    <group>
      <primitive ref={avatar} object={scene} position={[0, -1.79, 0]} scale={1.9} />
      <ContactShadows
        position={[0, -1.79, 0]}
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
      <Avatar reducedMotion={reducedMotion} />
    </Canvas>
  )
}

useGLTF.preload(avatarPath)
