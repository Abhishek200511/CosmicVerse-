import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars, OrbitControls, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { PLANETS } from '../data/constants.js'
import Planet from './Planet.jsx'
import Sun from './Sun.jsx'
import BlackHole from './BlackHole.jsx'
import Meteoroids from './Meteoroids.jsx'

export default function SolarSystem({ visible, selectedPlanet, onPlanetClick, deployGlowIndex }) {
  const controlsRef = useRef()

  if (!visible) return null

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} color="#b8c7e0" />
      <directionalLight position={[10, 20, 10]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-10, -5, -10]} intensity={0.15} color="#4060ff" />

      {/* Stars background */}
      <Stars radius={300} depth={150} count={10000} factor={5} saturation={0.2} fade speed={1} />

      {/* Nebula planes */}
      <NebulaPlane position={[-80, 20, -120]} color="#1e3a5f" size={100} />
      <NebulaPlane position={[60, -15, -100]} color="#2d1b4e" size={80} />
      <NebulaPlane position={[0, 30, -150]} color="#1a2744" size={120} />

      {/* Orbit Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={120}
        autoRotate={!selectedPlanet}
        autoRotateSpeed={0.2}
        dampingFactor={0.08}
        enableDamping={true}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.15}
      />

      {/* Orbit paths */}
      {PLANETS.filter(p => p.orbitRadius > 0).map(planet => (
        <OrbitPath key={planet.id} radius={planet.orbitRadius} />
      ))}

      {/* Sun */}
      <Sun planet={PLANETS[0]} deployGlow={deployGlowIndex >= 0} hideLabels={!!selectedPlanet} />

      {/* Planets */}
      {PLANETS.slice(1).map((planet, index) => {
        if (planet.id === 'blackhole') {
          return (
            <BlackHole
              key={planet.id}
              planet={planet}
              onClick={() => onPlanetClick(planet.id)}
              isDeployGlow={deployGlowIndex >= index + 1}
            />
          )
        }
        return (
          <Planet
            key={planet.id}
            planet={planet}
            onClick={() => onPlanetClick(planet.id)}
            isSelected={selectedPlanet === planet.id}
            isDeployGlow={deployGlowIndex >= index + 1}
          />
        )
      })}

      {/* Planet Labels using Html from drei — hide when panel open */}
      {!selectedPlanet && PLANETS.filter(p => p.clickable).map(planet => (
        <PlanetLabel key={`label-${planet.id}`} planet={planet} />
      ))}

      {/* Meteoroids streaking across the scene */}
      <Meteoroids />
    </>
  )
}

function NebulaPlane({ position, color, size }) {
  const rotation = useMemo(() => [Math.random() * 0.5, Math.random() * 0.5, 0], [])
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

function OrbitPath({ radius }) {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 256; i++) {
      const angle = (i / 256) * Math.PI * 2
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
    }
    return pts
  }, [radius])

  return (
    <Line
      points={points}
      color="#4488cc"
      transparent
      opacity={0.15}
      lineWidth={1}
    />
  )
}

function PlanetLabel({ planet }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime
    const angle = time * planet.orbitSpeed
    ref.current.position.x = Math.cos(angle) * planet.orbitRadius
    ref.current.position.z = Math.sin(angle) * planet.orbitRadius
    ref.current.position.y = planet.size + 1.5
  })

  return (
    <group ref={ref}>
      <Html center distanceFactor={20} style={{ pointerEvents: 'none' }}>
        <div style={{
          color: planet.color,
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '11px',
          fontWeight: 600,
          textShadow: `0 0 8px ${planet.color}66, 0 0 2px #000`,
          whiteSpace: 'nowrap',
          letterSpacing: '1px',
          userSelect: 'none',
        }}>
          {planet.name}
        </div>
      </Html>
    </group>
  )
}
