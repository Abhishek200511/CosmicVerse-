import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Simplex-style hash noise for realistic textures
function hash(x, y) {
  let h = x * 374761393 + y * 668265263
  h = ((h ^ (h >> 13)) * 1274126177) | 0
  return (h & 0x7fffffff) / 0x7fffffff
}

function smoothNoise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const n00 = hash(ix, iy), n10 = hash(ix + 1, iy)
  const n01 = hash(ix, iy + 1), n11 = hash(ix + 1, iy + 1)
  return n00 * (1 - sx) * (1 - sy) + n10 * sx * (1 - sy) + n01 * (1 - sx) * sy + n11 * sx * sy
}

function fbm(x, y, octaves) {
  let val = 0, amp = 0.5, freq = 1
  for (let i = 0; i < octaves; i++) {
    val += smoothNoise(x * freq, y * freq) * amp
    amp *= 0.5
    freq *= 2.1
  }
  return val
}

// Generate highly detailed procedural planet texture
function generatePlanetTexture(baseColor, type) {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const base = new THREE.Color(baseColor)

  ctx.fillStyle = baseColor
  ctx.fillRect(0, 0, size, size)

  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const u = x / size, v = y / size

      let rMod = 0, gMod = 0, bMod = 0

      if (type === 'earth') {
        // Multi-layer continents with oceans
        const continent = fbm(u * 6, v * 4, 6)
        const detail = fbm(u * 20, v * 20, 3) * 0.15
        const seaLevel = 0.42

        if (continent + detail > seaLevel) {
          // Land — vary between green, brown, tan
          const landHeight = (continent + detail - seaLevel) * 3
          const isDesert = fbm(u * 8 + 50, v * 8 + 50, 3) > 0.55
          const isMountain = landHeight > 0.7
          if (isMountain) {
            rMod = 60; gMod = 40; bMod = 30 // Brown mountains
          } else if (isDesert) {
            rMod = 70; gMod = 50; bMod = -30 // Sandy
          } else {
            rMod = -40; gMod = 50; bMod = -60 // Green forests
          }
        } else {
          // Ocean — deep blue with variation
          const depth = (seaLevel - continent) * 2
          rMod = -80 + depth * 20; gMod = -20 + depth * 10; bMod = 80 - depth * 30
        }

        // Polar ice caps
        const polarDist = Math.abs(v - 0.5) * 2
        if (polarDist > 0.82) {
          const ice = (polarDist - 0.82) * 5
          rMod += ice * 120; gMod += ice * 120; bMod += ice * 130
        }

      } else if (type === 'mars') {
        // Red rocky terrain with canyons and craters
        const terrain = fbm(u * 8, v * 6, 6)
        const craters = fbm(u * 25, v * 25, 3)
        const canyon = Math.abs(Math.sin(u * 3 + fbm(u * 5, v * 5, 3) * 2)) < 0.08 ? -50 : 0

        rMod = terrain * 60 - 20 + canyon
        gMod = terrain * 20 - 40 + canyon * 0.5
        bMod = terrain * 10 - 60 + canyon * 0.3

        // Craters — dark rings
        if (craters > 0.7) {
          const craterEdge = (craters - 0.7) * 10
          rMod -= craterEdge * 30
          gMod -= craterEdge * 25
        }

        // Polar ice
        const polar = Math.abs(v - 0.5) * 2
        if (polar > 0.88) {
          const ice = (polar - 0.88) * 8
          rMod += ice * 100; gMod += ice * 90; bMod += ice * 95
        }

      } else if (type === 'jupiter') {
        // Complex banded atmosphere with Great Red Spot
        const bandBase = Math.sin(v * 28) * 30
        const bandDetail = Math.sin(v * 56 + fbm(u * 10, v * 15, 3) * 4) * 15
        const swirl = fbm(u * 6 + Math.sin(v * 8) * 0.5, v * 3, 5) * 25
        const turbulence = fbm(u * 30, v * 30, 2) * 8

        rMod = bandBase + swirl + turbulence
        gMod = bandBase * 0.6 + swirl * 0.5 + turbulence * 0.7
        bMod = -bandBase * 0.3 + turbulence * 0.4

        // Great Red Spot
        const spotX = u - 0.35, spotY = v - 0.55
        const spotDist = Math.sqrt(spotX * spotX * 4 + spotY * spotY * 16)
        if (spotDist < 0.12) {
          const spotIntensity = (1 - spotDist / 0.12) * 60
          rMod += spotIntensity
          gMod -= spotIntensity * 0.4
          bMod -= spotIntensity * 0.6
        }

      } else if (type === 'neptune') {
        // Deep blue atmosphere with storm bands
        const atmo = fbm(u * 5 + Math.sin(v * 6) * 0.8, v * 4, 5)
        const storm = fbm(u * 12, v * 8, 4)
        const highCloud = fbm(u * 20, v * 20, 2)

        rMod = atmo * 15 - 30
        gMod = atmo * 30 - 10
        bMod = atmo * 50 + 20

        // Dark storm spot
        const stormX = u - 0.6, stormY = v - 0.45
        const stormDist = Math.sqrt(stormX * stormX * 6 + stormY * stormY * 20)
        if (stormDist < 0.08) {
          rMod -= 40; gMod -= 30; bMod += 15
        }

        // High white clouds
        if (highCloud > 0.72) {
          const cloudBright = (highCloud - 0.72) * 200
          rMod += cloudBright * 0.4; gMod += cloudBright * 0.5; bMod += cloudBright * 0.3
        }

      } else if (type === 'saturn') {
        // Subtle banded golden atmosphere
        const band = Math.sin(v * 20) * 20 + Math.sin(v * 40 + fbm(u * 8, v * 8, 3) * 2) * 10
        const haze = fbm(u * 4, v * 3, 4) * 15

        rMod = band + haze
        gMod = band * 0.8 + haze * 0.7
        bMod = -band * 0.3 + haze * 0.3

      } else if (type === 'pluto') {
        // Icy, reddish with heart-shaped bright region (Tombaugh Regio)
        const surface = fbm(u * 10, v * 8, 5)

        rMod = surface * 30 - 10
        gMod = surface * 15 - 20
        bMod = surface * 10 - 15

        // Heart-shaped bright region
        const hx = u - 0.4, hy = v - 0.45
        const heartDist = Math.sqrt(hx * hx + hy * hy)
        if (heartDist < 0.15) {
          const bright = (1 - heartDist / 0.15) * 80
          rMod += bright; gMod += bright * 0.9; bMod += bright * 0.85
        }

      } else {
        const n = fbm(u * 8, v * 6, 5)
        rMod = n * 40 - 20
        gMod = n * 30 - 15
        bMod = n * 20 - 10
      }

      data[idx] = Math.max(0, Math.min(255, data[idx] + rMod))
      data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + gMod))
      data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + bMod))
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return new THREE.CanvasTexture(canvas)
}

// Generate bump map for surface detail
function generateBumpMap(type) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)

  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const u = x / size, v = y / size
      let height = 128

      if (type === 'earth' || type === 'mars' || type === 'pluto') {
        height = fbm(u * 10, v * 8, 5) * 200 + 28
      } else if (type === 'jupiter' || type === 'saturn' || type === 'neptune') {
        height = 128 + Math.sin(v * 30) * 15 + fbm(u * 12, v * 12, 3) * 20
      } else {
        height = fbm(u * 8, v * 8, 4) * 160 + 48
      }

      const val = Math.max(0, Math.min(255, height))
      data[idx] = data[idx + 1] = data[idx + 2] = val
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
  const atmo2Ref = useRef()
  const [hovered, setHovered] = useState(false)

  // Generate texture and bump map once
  const texture = useMemo(() => generatePlanetTexture(planet.color, planet.id), [planet.color, planet.id])
  const bumpMap = useMemo(() => generateBumpMap(planet.id), [planet.id])

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

    // Second atmosphere layer
    if (atmo2Ref.current) {
      const pulse2 = Math.sin(time * 0.8 + 1) * 0.04 + 1.25
      atmo2Ref.current.scale.setScalar(pulse2)
      atmo2Ref.current.material.opacity = hovered ? 0.12 : 0.05
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
          bumpMap={bumpMap}
          bumpScale={0.04}
          emissive={isDeployGlow ? '#00ff88' : planet.emissive}
          emissiveIntensity={hovered ? 0.6 : isDeployGlow ? 1.0 : 0.2}
          roughness={0.65}
          metalness={0.1}
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

      {/* Outer atmosphere haze */}
      <mesh ref={atmo2Ref} scale={1.25}>
        <sphereGeometry args={[planet.size, 24, 24]} />
        <meshBasicMaterial
          color={planet.color}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          depthWrite={false}
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

      {/* Saturn rings — multi-layered with Cassini division */}
      {isSaturn && (
        <>
          {/* Inner bright ring (C ring) */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[planet.size * 1.3, planet.size * 1.5, 128]} />
            <meshBasicMaterial
              color="#e8d5b7"
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Main ring (B ring) */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[planet.size * 1.55, planet.size * 2.0, 128]} />
            <meshBasicMaterial
              color="#ddd6fe"
              transparent
              opacity={0.55}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Cassini Division gap */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[planet.size * 2.0, planet.size * 2.08, 128]} />
            <meshBasicMaterial
              color="#1a1a2e"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Outer ring (A ring) */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[planet.size * 2.08, planet.size * 2.5, 128]} />
            <meshBasicMaterial
              color="#c4b5fd"
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          {/* Faint outermost ring (F ring) */}
          <mesh rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[planet.size * 2.55, planet.size * 2.65, 128]} />
            <meshBasicMaterial
              color="#a78bfa"
              transparent
              opacity={0.12}
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

      {/* Jupiter moons (Galilean satellites) */}
      {planet.id === 'jupiter' && (
        <JupiterMoons planetSize={planet.size} />
      )}
    </group>
  )
}

function EarthClouds({ size }) {
  const ref = useRef()

  const cloudTexture = useMemo(() => {
    const s = 512
    const canvas = document.createElement('canvas')
    canvas.width = s; canvas.height = s
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.clearRect(0, 0, s, s)

    const imageData = ctx.getImageData(0, 0, s, s)
    const data = imageData.data
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        const idx = (y * s + x) * 4
        const val = fbm(x / s * 8, y / s * 6, 5)
        const cloud = val > 0.45 ? ((val - 0.45) / 0.55) * 255 : 0
        data[idx] = data[idx + 1] = data[idx + 2] = 255
        data[idx + 3] = Math.min(180, cloud)
      }
    }
    ctx.putImageData(imageData, 0, s === 0 ? 0 : 0)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002
      ref.current.rotation.x += 0.0003
    }
  })

  return (
    <mesh ref={ref} scale={1.025}>
      <sphereGeometry args={[size, 48, 48]} />
      <meshStandardMaterial
        map={cloudTexture}
        transparent
        opacity={0.6}
        depthWrite={false}
        side={THREE.DoubleSide}
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

function JupiterMoons({ planetSize }) {
  const moons = useMemo(() => [
    { name: 'Io', color: '#f59e0b', size: 0.18, radius: planetSize * 2.2, speed: 1.2 },
    { name: 'Europa', color: '#e2e8f0', size: 0.15, radius: planetSize * 2.8, speed: 0.8 },
    { name: 'Ganymede', color: '#94a3b8', size: 0.22, radius: planetSize * 3.4, speed: 0.5 },
    { name: 'Callisto', color: '#78716c', size: 0.2, radius: planetSize * 4.0, speed: 0.35 },
  ], [planetSize])

  const refs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    refs.current.forEach((ref, i) => {
      if (!ref) return
      const moon = moons[i]
      const angle = t * moon.speed + i * 1.5
      ref.position.x = Math.cos(angle) * moon.radius
      ref.position.z = Math.sin(angle) * moon.radius
      ref.position.y = Math.sin(angle * 0.3) * 0.3
    })
  })

  return (
    <>
      {moons.map((moon, i) => (
        <group key={moon.name} ref={(el) => (refs.current[i] = el)}>
          <mesh>
            <sphereGeometry args={[moon.size, 16, 16]} />
            <meshStandardMaterial
              color={moon.color}
              roughness={0.8}
              metalness={0.1}
              emissive={moon.color}
              emissiveIntensity={0.15}
            />
          </mesh>
          <mesh scale={1.3}>
            <sphereGeometry args={[moon.size, 8, 8]} />
            <meshBasicMaterial color={moon.color} transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} />
          </mesh>
        </group>
      ))}
    </>
  )
}
