import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const METEOR_COUNT = 18

function randomRange(min, max) {
  return Math.random() * (max - min) + min
}

function Meteor({ index }) {
  const meshRef = useRef()
  const trailRef = useRef()

  // Each meteor gets a random path configuration
  const config = useMemo(() => ({
    // Starting position — far out in different quadrants
    startX: randomRange(-120, 120),
    startY: randomRange(20, 80),
    startZ: randomRange(-120, -40),
    // Velocity direction
    vx: randomRange(-0.8, 0.8),
    vy: randomRange(-0.3, -0.15),
    vz: randomRange(0.2, 0.6),
    // Speed multiplier
    speed: randomRange(30, 70),
    // Cycle offset so meteors don't all appear at once
    offset: randomRange(0, 30),
    // Cycle duration — how long before it resets
    cycleDuration: randomRange(8, 18),
    // Size
    size: randomRange(0.04, 0.12),
    // Color temperature — varies from white to orange
    hue: randomRange(0, 1),
    // Trail length
    trailLength: randomRange(2, 5),
  }), [])

  // Compute color from hue
  const color = useMemo(() => {
    const c = new THREE.Color()
    if (config.hue < 0.5) {
      c.setRGB(1, 0.85 + config.hue * 0.3, 0.7 + config.hue * 0.6) // warm white
    } else {
      c.setRGB(1, 0.6 + (1 - config.hue) * 0.4, 0.3) // orange
    }
    return c
  }, [config.hue])

  // Trail geometry — line from head to tail
  const trailGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(6) // 2 vertices * 3
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    const t = ((time + config.offset) % config.cycleDuration) / config.cycleDuration

    // Visibility: meteor only visible for a portion of the cycle (streak across)
    const visiblePhase = t < 0.3

    if (!visiblePhase) {
      meshRef.current.visible = false
      if (trailRef.current) trailRef.current.visible = false
      return
    }

    meshRef.current.visible = true
    if (trailRef.current) trailRef.current.visible = true

    // Progress within the visible phase (0 to 1)
    const progress = t / 0.3

    // Position along path
    const px = config.startX + config.vx * config.speed * progress
    const py = config.startY + config.vy * config.speed * progress
    const pz = config.startZ + config.vz * config.speed * progress

    meshRef.current.position.set(px, py, pz)

    // Fade opacity: bright in middle, fade at start/end
    const fade = Math.sin(progress * Math.PI)
    meshRef.current.material.opacity = fade * 0.9
    meshRef.current.scale.setScalar(1 + fade * 0.5)

    // Update trail line
    if (trailRef.current) {
      const positions = trailGeometry.attributes.position.array
      // Head (meteor position)
      positions[0] = px
      positions[1] = py
      positions[2] = pz
      // Tail (behind the meteor)
      positions[3] = px - config.vx * config.trailLength
      positions[4] = py - config.vy * config.trailLength
      positions[5] = pz - config.vz * config.trailLength
      trailGeometry.attributes.position.needsUpdate = true
      trailRef.current.material.opacity = fade * 0.5
    }
  })

  return (
    <group>
      {/* Meteor head — small glowing sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.size, 6, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          depthWrite={false}
        />
      </mesh>

      {/* Meteor trail — fading line */}
      <line ref={trailRef} geometry={trailGeometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.4}
          depthWrite={false}
          linewidth={1}
        />
      </line>

      {/* Glow around head */}
      <mesh position={meshRef.current?.position || [0, 0, 0]}>
        <sphereGeometry args={[config.size * 3, 6, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

export default function Meteoroids() {
  return (
    <group>
      {Array.from({ length: METEOR_COUNT }).map((_, i) => (
        <Meteor key={i} index={i} />
      ))}
    </group>
  )
}
