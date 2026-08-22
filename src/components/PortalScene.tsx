import { ContactShadows, Sparkles, useAnimations, useGLTF } from '@react-three/drei'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const avatarPath = '/models/avatar.glb'

function Avatar({ reducedMotion }: { reducedMotion: boolean }) {
  const avatar = useRef<THREE.Group>(null)
  const dragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartRotation = useRef(0)
  const rotationOffset = useRef(0)
  const { gl, pointer, size } = useThree()
  const { scene, animations } = useGLTF(avatarPath)
  const { actions } = useAnimations(animations, avatar)
  const avatarX =
    size.width < 700 ? 0.18 : size.width / size.height < 1.25 ? 0.8 : 1.12

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
    gl.domElement.setPointerCapture(event.pointerId)
    gl.domElement.style.cursor = 'grabbing'
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
    if (gl.domElement.hasPointerCapture(event.pointerId)) {
      gl.domElement.releasePointerCapture(event.pointerId)
    }
    gl.domElement.style.cursor = 'grab'
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
          gl.domElement.style.cursor = 'grab'
        }}
        onPointerOut={() => {
          if (!dragging.current) gl.domElement.style.cursor = 'default'
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
      <Avatar reducedMotion={reducedMotion} />
    </Canvas>
  )
}

useGLTF.preload(avatarPath)
