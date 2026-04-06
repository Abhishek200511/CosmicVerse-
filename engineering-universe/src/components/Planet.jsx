import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Generate procedural planet texture on a canvas
function generatePlanetTexture(baseColor, type) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const base = new THREE.Color(baseColor)

  // Fill base
  ctx.fillStyle = baseColor
  ctx.fillRect(0, 0, size, size)

  // Add noise-like patterns
  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const noise1 = Math.sin(x * 0.05 + y * 0.03) * 30
      const noise2 = Math.cos(x * 0.02 - y * 0.04) * 20
      const noise3 = Math.sin((x + y) * 0.08) * 15

      // Different patterns per planet type
      let variation = 0
      if (type === 'earth') {
        // Continent-like patches
        const continent = Math.sin(x * 0.03) * Math.cos(y * 0.025) * 50
        variation = continent > 15 ? 40 : -10
        if (continent > 15) {
          data[idx + 1] = Math.min(255, data[idx + 1] + 40) // Green landmass
          data[idx + 2] = Math.max(0, data[idx + 2] - 30)
        }
      } else if (type === 'mars') {
        // Cratered surface
        variation = noise1 + noise3
        const crater = Math.sin(x * 0.1) * Math.sin(y * 0.1) * 40
        if (crater > 30) variation -= 40
      } else if (type === 'jupiter') {
        // Horizontal bands
        const band = Math.sin(y * 0.04) * 40 + Math.sin(y * 0.08 + x * 0.005) * 20
        variation = band
      } else if (type === 'neptune') {
        // Swirly deep atmosphere
        const swirl = Math.sin(x * 0.02 + Math.sin(y * 0.03) * 3) * 30
        variation = swirl + noise2
      } else if (type === 'saturn') {
        // Banded with smoother atmosphere
        const band = Math.sin(y * 0.06) * 25 + Math.sin(y * 0.12) * 15
        variation = band
      } else {
        variation = noise1 + noise2 + noise3
      }

      data[idx] = Math.max(0, Math.min(255, data[idx] + variation))
      data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + variation * 0.7))
      data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + variation * 0.5))
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return new THREE.CanvasTexture(canvas)
}

export default function Planet({ planet, onClick, isSelected, isDeployGlow }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const glowRef = useRef()
  const atmosphereRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Generate texture once
  const texture = useMemo(() => generatePlanetTexture(planet.color, planet.id), [planet.color, planet.id])

  useFrame((state) => {
    if (!groupRef.current) return

    // Orbit
    const time = state.clock.elapsedTime
    const angle = time * planet.orbitSpeed
    groupRef.current.position.x = Math.cos(angle) * planet.orbitRadius
    groupRef.current.position.z = Math.sin(angle) * planet.orbitRadius

    // Self rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += planet.rotationSpeed
    }

    // Atmosphere pulse
    if (atmosphereRef.current) {
      const pulse = Math.sin(time * 1.5) * 0.03 + 1.15
      atmosphereRef.current.scale.setScalar(pulse)
      atmosphereRef.current.material.opacity = hovered ? 0.25 : 0.12
    }

    // Hover/deploy glow
    if (glowRef.current) {
      const targetOpacity = hovered ? 0.35 : isDeployGlow ? 0.4 : 0.08
      glowRef.current.material.opacity += (targetOpacity - glowRef.current.material.opacity) * 0.06
      const targetScale = hovered ? 1.5 : isDeployGlow ? 1.6 : 1.3
      const pulse = isDeployGlow ? Math.sin(time * 4) * 0.1 + targetScale : targetScale
      glowRef.current.scale.setScalar(pulse)
    }

    // Cursor
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  })

  const glowColor = isDeployGlow ? '#00ff88' : planet.color
  const isSaturn = planet.id === 'saturn'

  return (
    <group ref={groupRef}>
      {/* Planet point light for self-illumination */}
      <pointLight
        position={[0, 0, 0]}
        intensity={hovered ? 8 : 2}
        color={planet.color}
        distance={planet.size * 6}
        decay={2}
      />

      {/* Planet mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          if (planet.clickable) onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          emissive={isDeployGlow ? '#00ff88' : planet.emissive}
          emissiveIntensity={hovered ? 0.6 : isDeployGlow ? 1.0 : 0.2}
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      {/* Atmosphere shell */}
      <mesh ref={atmosphereRef} scale={1.15}>
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[planet.size, 24, 24]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Saturn rings */}
      {isSaturn && (
        <>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[planet.size * 1.4, planet.size * 2.0, 128]} />
            <meshBasicMaterial
              color="#ddd6fe"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[planet.size * 2.0, planet.size * 2.4, 128]} />
            <meshBasicMaterial
              color="#c4b5fd"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      {/* Mars skill satellites for DevOps planet */}
      {planet.id === 'mars' && (
        <MarsSatellites planetSize={planet.size} />
      )}

      {/* Neptune electric aura for ArthaMind */}
      {planet.id === 'neptune' && (
        <NeptuneAura size={planet.size} />
      )}

      {/* Earth clouds */}
      {planet.id === 'earth' && (
        <EarthClouds size={planet.size} />
      )}
    </group>
  )
}

function EarthClouds({ size }) {
  const ref = useRef()

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.003
    }
  })

  return (
    <mesh ref={ref} scale={1.02}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  )
}

function MarsSatellites({ planetSize }) {
  const satellites = ['🐳', '🔀', '🔄', '🐧', '☁', '🏗']
  const refs = useRef([])

  useFrame((state) => {
    refs.current.forEach((ref, i) => {
      if (!ref) return
      const time = state.clock.elapsedTime * (0.6 + i * 0.08)
      const offset = (i / satellites.length) * Math.PI * 2
      const radius = planetSize + 1.5 + i * 0.2
      const inclination = (i % 3) * 0.3
      ref.position.x = Math.cos(time + offset) * radius
      ref.position.z = Math.sin(time + offset) * radius * Math.cos(inclination)
      ref.position.y = Math.sin(time + offset) * radius * Math.sin(inclination)
    })
  })

  return (
    <>
      {satellites.map((_, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)}>
          <mesh>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#ff6600"
              emissiveIntensity={2}
            />
          </mesh>
          {/* Small glow */}
          <mesh>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.15} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function NeptuneAura({ size }) {
  const ref = useRef()
  const ring1Ref = useRef()
  const ring2Ref = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      const pulse = Math.sin(t * 1.5) * 0.05 + 1.25
      ref.current.scale.setScalar(pulse)
      ref.current.material.opacity = Math.sin(t * 2) * 0.05 + 0.15
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.5
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.3
  })

  return (
    <>
      <mesh ref={ref} scale={1.25}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      {/* Electric rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[size * 1.3, size * 1.35, 64]} />
        <meshBasicMaterial color="#a5b4fc" transparent opacity={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, Math.PI / 6, 0]}>
        <ringGeometry args={[size * 1.5, size * 1.55, 64]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </>
  )
}
