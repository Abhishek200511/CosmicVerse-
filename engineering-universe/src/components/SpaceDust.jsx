import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const DUST_COUNT = 500

/**
 * Floating space dust / cosmic particles that drift slowly.
 * Adds depth and atmosphere to the scene.
 */
export default function SpaceDust() {
  const pointsRef = useRef()

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3)
    const colors = new Float32Array(DUST_COUNT * 3)
    const sizes = new Float32Array(DUST_COUNT)

    for (let i = 0; i < DUST_COUNT; i++) {
      // Spread across the scene volume
      positions[i * 3] = (Math.random() - 0.5) * 160
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60
      positions[i * 3 + 2] = (Math.random() - 0.5) * 160

      // Subtle blue-white-purple colors
      const t = Math.random()
      if (t < 0.33) {
        colors[i * 3] = 0.6 + Math.random() * 0.4
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 2] = 1.0
      } else if (t < 0.66) {
        colors[i * 3] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 0.85 + Math.random() * 0.15
      } else {
        colors[i * 3] = 0.7 + Math.random() * 0.3
        colors[i * 3 + 1] = 0.4 + Math.random() * 0.3
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
      }

      sizes[i] = 0.03 + Math.random() * 0.08
    }

    return { positions, colors, sizes }
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.elapsedTime

    const pos = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < DUST_COUNT; i++) {
      // Gentle drift
      pos[i * 3] += Math.sin(t * 0.1 + i * 0.01) * 0.003
      pos[i * 3 + 1] += Math.cos(t * 0.08 + i * 0.02) * 0.002
      pos[i * 3 + 2] += Math.sin(t * 0.12 + i * 0.015) * 0.003

      // Wrap around boundaries
      if (pos[i * 3] > 80) pos[i * 3] = -80
      if (pos[i * 3] < -80) pos[i * 3] = 80
      if (pos[i * 3 + 1] > 30) pos[i * 3 + 1] = -30
      if (pos[i * 3 + 1] < -30) pos[i * 3 + 1] = 30
      if (pos[i * 3 + 2] > 80) pos[i * 3 + 2] = -80
      if (pos[i * 3 + 2] < -80) pos[i * 3 + 2] = 80
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true

    // Slow overall rotation
    pointsRef.current.rotation.y = t * 0.005
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={DUST_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={DUST_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.5}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
