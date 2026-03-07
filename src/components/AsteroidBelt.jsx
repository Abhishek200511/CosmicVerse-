import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const ASTEROID_COUNT = 120

/**
 * Asteroid belt between Mars and Jupiter orbits.
 * Procedural rocky chunks orbiting at varied speeds.
 */
export default function AsteroidBelt() {
  const meshRef = useRef()

  const { matrices, speeds, offsets } = useMemo(() => {
    const mat = new THREE.Matrix4()
    const matrices = []
    const speeds = new Float32Array(ASTEROID_COUNT)
    const offsets = new Float32Array(ASTEROID_COUNT)
    const position = new THREE.Vector3()
    const rotation = new THREE.Euler()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      // Orbit between Mars (16) and Jupiter (30) — centered around 22
      const orbitRadius = 19 + Math.random() * 8
      const angle = Math.random() * Math.PI * 2
      const yOffset = (Math.random() - 0.5) * 2.5

      position.set(
        Math.cos(angle) * orbitRadius,
        yOffset,
        Math.sin(angle) * orbitRadius
      )

      rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      quaternion.setFromEuler(rotation)

      const s = 0.05 + Math.random() * 0.2
      scale.set(s * (0.5 + Math.random()), s * (0.5 + Math.random()), s * (0.5 + Math.random()))

      mat.compose(position, quaternion, scale)
      matrices.push(mat.clone())

      speeds[i] = 0.02 + Math.random() * 0.06
      offsets[i] = angle
    }

    return { matrices, speeds, offsets }
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const mat = new THREE.Matrix4()
    const position = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()

    for (let i = 0; i < ASTEROID_COUNT; i++) {
      matrices[i].decompose(position, quaternion, scale)

      // Orbit
      const r = Math.sqrt(position.x * position.x + position.z * position.z)
      const currentAngle = offsets[i] + t * speeds[i]
      position.x = Math.cos(currentAngle) * r
      position.z = Math.sin(currentAngle) * r
      position.y += Math.sin(t * speeds[i] * 2 + i) * 0.001

      // Tumble rotation
      const tumble = new THREE.Euler(
        t * speeds[i] * 3,
        t * speeds[i] * 2,
        t * speeds[i] * 1.5
      )
      quaternion.setFromEuler(tumble)

      mat.compose(position, quaternion, scale)
      meshRef.current.setMatrixAt(i, mat)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, ASTEROID_COUNT]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#6b7280"
        roughness={0.9}
        metalness={0.3}
        emissive="#374151"
        emissiveIntensity={0.1}
      />
    </instancedMesh>
  )
}
