import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BlackHole({ planet, onClick, isDeployGlow }) {
  const groupRef = useRef()
  const diskRef = useRef()
  const coreRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return

    // Orbit
    const time = state.clock.elapsedTime
    const angle = time * planet.orbitSpeed
    groupRef.current.position.x = Math.cos(angle) * planet.orbitRadius
    groupRef.current.position.z = Math.sin(angle) * planet.orbitRadius

    // Disk rotation
    if (diskRef.current) {
      diskRef.current.rotation.z += 0.02
    }

    // Core pulse
    if (coreRef.current) {
      const pulse = Math.sin(time * 2) * 0.1 + 1
      coreRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Core - dark sphere */}
      <mesh
        ref={coreRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshBasicMaterial color="#050510" />
      </mesh>

      {/* Accretion disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[planet.size * 1.2, planet.size * 2.5, 64]} />
        <meshBasicMaterial
          color={isDeployGlow ? '#00ff88' : '#7c3aed'}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <ringGeometry args={[planet.size * 1.0, planet.size * 1.3, 64]} />
        <meshBasicMaterial
          color={isDeployGlow ? '#00ff88' : '#a78bfa'}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Gravitational lens effect (outer glow) */}
      <mesh>
        <sphereGeometry args={[planet.size * 2.8, 32, 32]} />
        <meshBasicMaterial
          color="#312e81"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Point light for local illumination */}
      <pointLight
        position={[0, 0, 0]}
        intensity={isDeployGlow ? 30 : 10}
        color={isDeployGlow ? '#00ff88' : '#7c3aed'}
        distance={15}
        decay={2}
      />
    </group>
  )
}
