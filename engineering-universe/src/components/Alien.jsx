import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Alien UFO that flies through the solar system on a weaving path.
 * Built from procedural geometry — no external models.
 */
export default function Alien() {
  const groupRef = useRef()
  const beamRef = useRef()
  const domeGlowRef = useRef()
  const bodyGlowRef = useRef()
  const lightRef1 = useRef()
  const lightRef2 = useRef()
  const lightRef3 = useRef()

  // Flight path parameters
  const flight = useMemo(() => ({
    radiusX: 35,
    radiusZ: 28,
    height: 6,
    speed: 0.12,
    wobbleSpeed: 1.8,
    wobbleAmp: 2.5,
    tiltAmp: 0.15,
  }), [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    // Smooth weaving flight path
    const angle = t * flight.speed
    const x = Math.cos(angle) * flight.radiusX + Math.sin(angle * 2.3) * 8
    const z = Math.sin(angle) * flight.radiusZ + Math.cos(angle * 1.7) * 6
    const y = flight.height + Math.sin(t * flight.wobbleSpeed) * flight.wobbleAmp

    groupRef.current.position.set(x, y, z)

    // Banking — tilt into turns
    const dx = -Math.sin(angle) * flight.radiusX * flight.speed + Math.cos(angle * 2.3) * 8 * 2.3 * flight.speed
    const dz = Math.cos(angle) * flight.radiusZ * flight.speed - Math.sin(angle * 1.7) * 6 * 1.7 * flight.speed
    const heading = Math.atan2(dx, dz)
    groupRef.current.rotation.y = heading
    groupRef.current.rotation.z = Math.sin(t * 0.8) * flight.tiltAmp
    groupRef.current.rotation.x = Math.cos(t * 0.6) * 0.05

    // Abduction beam pulse
    if (beamRef.current) {
      const beamPulse = (Math.sin(t * 3) * 0.5 + 0.5) * 0.25 + 0.1
      beamRef.current.material.opacity = beamPulse
      beamRef.current.scale.y = 1 + Math.sin(t * 2) * 0.15
    }

    // Dome glow breathing
    if (domeGlowRef.current) {
      domeGlowRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 4) * 0.8
    }

    // Body perimeter glow
    if (bodyGlowRef.current) {
      bodyGlowRef.current.material.opacity = 0.3 + Math.sin(t * 5) * 0.15
    }

    // Rotating rim lights
    if (lightRef1.current) {
      const lAngle = t * 3
      lightRef1.current.position.set(Math.cos(lAngle) * 1.1, -0.1, Math.sin(lAngle) * 1.1)
      lightRef2.current.position.set(Math.cos(lAngle + 2.09) * 1.1, -0.1, Math.sin(lAngle + 2.09) * 1.1)
      lightRef3.current.position.set(Math.cos(lAngle + 4.19) * 1.1, -0.1, Math.sin(lAngle + 4.19) * 1.1)
    }
  })

  return (
    <group ref={groupRef}>
      {/* ---- Saucer body ---- */}
      {/* Top half — flattened sphere */}
      <mesh position={[0, 0.1, 0]} scale={[1.3, 0.3, 1.3]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#708090"
          metalness={0.9}
          roughness={0.15}
          emissive="#334155"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Bottom half — inverted dome */}
      <mesh position={[0, 0.1, 0]} scale={[1.3, 0.18, 1.3]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.85}
          roughness={0.2}
          emissive="#1e293b"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Thin ring around the middle (rim) */}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.05, 8, 48]} />
        <meshStandardMaterial
          color="#22d3ee"
          emissive="#06b6d4"
          emissiveIntensity={3}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* ---- Glass dome on top ---- */}
      <mesh ref={domeGlowRef} position={[0, 0.35, 0]} scale={[0.5, 0.45, 0.5]}>
        <sphereGeometry args={[1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#67e8f9"
          transparent
          opacity={0.5}
          emissive="#22d3ee"
          emissiveIntensity={1.5}
          metalness={0.2}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Little alien face inside dome (sphere head + eyes) */}
      <mesh position={[0, 0.55, 0.12]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#4ade80"
          emissive="#22c55e"
          emissiveIntensity={0.8}
          roughness={0.5}
        />
      </mesh>
      {/* Left eye */}
      <mesh position={[-0.07, 0.58, 0.26]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Right eye */}
      <mesh position={[0.07, 0.58, 0.26]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* ---- Rotating rim lights ---- */}
      <pointLight ref={lightRef1} color="#22d3ee" intensity={3} distance={5} decay={2} />
      <pointLight ref={lightRef2} color="#a78bfa" intensity={3} distance={5} decay={2} />
      <pointLight ref={lightRef3} color="#34d399" intensity={3} distance={5} decay={2} />

      {/* Fixed bottom lights (landing gear style) */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.9, -0.08, Math.sin(a) * 0.9]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
          </mesh>
        )
      })}

      {/* ---- Abduction / tractor beam ---- */}
      <mesh ref={beamRef} position={[0, -2.5, 0]}>
        <coneGeometry args={[2.2, 5, 32, 1, true]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Body glow shell */}
      <mesh ref={bodyGlowRef} scale={1.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Engine glow underneath */}
      <pointLight position={[0, -0.5, 0]} color="#22d3ee" intensity={8} distance={12} decay={2} />
    </group>
  )
}
