import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Wormhole — a swirling vortex portal.
 * Click to reveal a "Coming Soon" overlay.
 */
export default function Wormhole({ onClick, hideLabel }) {
  const groupRef = useRef()
  const spiralRef = useRef()
  const innerRef = useRef()
  const outerGlowRef = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const particlesRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Position — opposite side of black hole, at a distinct orbit
  const position = useMemo(() => ({ orbitRadius: 58, orbitSpeed: 0.018 }), [])

  // Create swirl particle positions
  const particleData = useMemo(() => {
    const count = 200
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const r = 1 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      positions[i * 3] = Math.cos(theta) * r
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5
      positions[i * 3 + 2] = Math.sin(theta) * r

      // Colors: purple → cyan gradient
      const t = Math.random()
      colors[i * 3] = 0.4 + t * 0.1       // R
      colors[i * 3 + 1] = 0.2 + t * 0.6   // G
      colors[i * 3 + 2] = 0.9 + t * 0.1   // B

      speeds[i] = 0.5 + Math.random() * 2
      offsets[i] = Math.random() * Math.PI * 2
    }

    return { positions, colors, speeds, offsets, count }
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Orbit through scene
    const angle = t * position.orbitSpeed
    groupRef.current.position.x = Math.cos(angle) * position.orbitRadius
    groupRef.current.position.z = Math.sin(angle) * position.orbitRadius
    groupRef.current.position.y = Math.sin(t * 0.15) * 2

    // Spiral disc rotation
    if (spiralRef.current) {
      spiralRef.current.rotation.z += 0.015
    }

    // Inner vortex — faster rotation
    if (innerRef.current) {
      innerRef.current.rotation.z -= 0.03
      const pulse = Math.sin(t * 2) * 0.1 + 1
      innerRef.current.scale.setScalar(pulse)
    }

    // Outer glow pulse
    if (outerGlowRef.current) {
      outerGlowRef.current.material.opacity = hovered ? 0.18 : 0.06 + Math.sin(t * 1.5) * 0.03
      const scale = hovered ? 3.5 : 3 + Math.sin(t * 0.8) * 0.2
      outerGlowRef.current.scale.setScalar(scale)
    }

    // Distortion rings — spin at different rates
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.7
      ring1Ref.current.rotation.y = t * 0.3
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.5
      ring2Ref.current.rotation.z = t * 0.4
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.6
      ring3Ref.current.rotation.z = -t * 0.35
    }

    // Animate swirl particles
    if (particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position.array
      for (let i = 0; i < particleData.count; i++) {
        const speed = particleData.speeds[i]
        const offset = particleData.offsets[i]
        const baseR = 1 + (i / particleData.count) * 3
        const r = baseR + Math.sin(t * speed + offset) * 0.5
        const theta = t * speed * 0.5 + offset

        pos[i * 3] = Math.cos(theta) * r
        pos[i * 3 + 1] = Math.sin(t * speed * 0.3 + offset) * 0.8
        pos[i * 3 + 2] = Math.sin(theta) * r
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    document.body.style.cursor = hovered ? 'pointer' : document.body.style.cursor
  })

  return (
    <group ref={groupRef}>
      {/* Clickable core */}
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
      >
        <sphereGeometry args={[2.5, 1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Dark center — the void */}
      <mesh ref={innerRef}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color="#050008" side={THREE.DoubleSide} />
      </mesh>

      {/* Spiral accretion disc */}
      <group ref={spiralRef}>
        {/* Inner ring — bright */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.8, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Mid ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.8, 2.8, 64]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Outer ring — faint */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.8, 3.8, 64]} />
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Distortion rings orbiting the vortex */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.03, 8, 64]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.8, 0.02, 8, 64]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.4, 0.025, 8, 64]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      {/* Swirl particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleData.count}
            array={particleData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleData.count}
            array={particleData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.7}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Outer glow sphere */}
      <mesh ref={outerGlowRef} scale={3}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Core light */}
      <pointLight
        color={hovered ? '#c084fc' : '#7c3aed'}
        intensity={hovered ? 30 : 15}
        distance={20}
        decay={2}
      />

      {/* Label */}
      {!hideLabel && (
        <Html position={[0, 4, 0]} center distanceFactor={20} style={{ pointerEvents: 'none' }}>
          <div style={{
            color: '#c084fc',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            textShadow: '0 0 8px #7c3aed66, 0 0 2px #000',
            whiteSpace: 'nowrap',
            letterSpacing: '1px',
            userSelect: 'none',
          }}>
            Wormhole
          </div>
        </Html>
      )}
    </group>
  )
}
