import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

function generateSunTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
  gradient.addColorStop(0, '#fff7ed')
  gradient.addColorStop(0.3, '#fbbf24')
  gradient.addColorStop(0.6, '#f97316')
  gradient.addColorStop(0.85, '#ea580c')
  gradient.addColorStop(1, '#c2410c')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const noise = Math.sin(x * 0.05 + y * 0.03) * 20 + Math.cos(x * 0.08 - y * 0.06) * 15
      data[idx] = Math.min(255, data[idx] + noise)
      data[idx + 1] = Math.max(0, data[idx + 1] + noise * 0.5)
    }
  }
  ctx.putImageData(imageData, 0, 0)
  return new THREE.CanvasTexture(canvas)
}

export default function Sun({ planet, deployGlow, hideLabels }) {
  const meshRef = useRef()
  const glow1Ref = useRef()
  const glow2Ref = useRef()
  const coronaRef = useRef()
  const texture = useMemo(() => generateSunTexture(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) meshRef.current.rotation.y += planet.rotationSpeed
    if (glow1Ref.current) {
      const pulse = Math.sin(t * 1.5) * 0.08 + 1
      glow1Ref.current.scale.setScalar(1.2 * pulse)
    }
    if (glow2Ref.current) {
      const pulse = Math.sin(t * 1.2 + 1) * 0.06 + 1
      glow2Ref.current.scale.setScalar(1.5 * pulse)
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z += 0.003
      const pulse = Math.sin(t * 0.8) * 0.1 + 1
      coronaRef.current.scale.setScalar(2.2 * pulse)
    }
  })

  const tags = planet.tags || []
  const lightColor = deployGlow ? '#00ff88' : '#ffa500'
  const glowMeshColor = deployGlow ? '#00ff88' : '#ff8c00'

  return (
    <group position={[0, 0, 0]}>
      {/* Main lights */}
      <pointLight position={[0, 0, 0]} intensity={deployGlow ? 400 : 200} color={lightColor} distance={120} decay={1.2} />
      <pointLight position={[0, 5, 0]} intensity={40} color="#ffdd88" distance={80} decay={1.5} />

      {/* Sun sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshBasicMaterial map={texture} color={deployGlow ? '#66ffaa' : '#ffffff'} />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glow1Ref} scale={1.2}>
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshBasicMaterial color={glowMeshColor} transparent opacity={0.2} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* Mid glow */}
      <mesh ref={glow2Ref} scale={1.5}>
        <sphereGeometry args={[planet.size, 32, 32]} />
        <meshBasicMaterial color={deployGlow ? '#00ff88' : '#ff6600'} transparent opacity={0.08} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* Corona */}
      <mesh ref={coronaRef} scale={2.2}>
        <sphereGeometry args={[planet.size, 16, 16]} />
        <meshBasicMaterial color={deployGlow ? '#00ff88' : '#ff4400'} transparent opacity={0.04} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* Name label using Html — hidden when panels are open */}
      {!hideLabels && (
        <Html position={[0, planet.size + 2.5, 0]} center style={{ pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', userSelect: 'none' }}>
            <div style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: '16px',
              fontWeight: 700,
              color: '#fbbf24',
              textShadow: '0 0 20px #ff8c00, 0 0 40px #ff660066',
              letterSpacing: '3px',
            }}>
              Abhishek Phukan
            </div>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              color: '#fde68a',
              marginTop: '4px',
              letterSpacing: '2px',
              opacity: 0.8,
            }}>
              DevOps Engineer | System Architect
            </div>
          </div>
        </Html>
      )}

      {/* Orbiting tags — hidden when panels are open */}
      {!hideLabels && tags.map((tag, i) => (
        <OrbitingTag key={i} text={tag} index={i} total={tags.length} sunSize={planet.size} />
      ))}
    </group>
  )
}

function OrbitingTag({ text, index, total, sunSize }) {
  const ref = useRef()
  const offset = (index / total) * Math.PI * 2

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime * 0.3 + offset
    const radius = sunSize + 3.5
    ref.current.position.x = Math.cos(time) * radius
    ref.current.position.z = Math.sin(time) * radius
    ref.current.position.y = Math.sin(time * 0.4 + index) * 1.2
  })

  return (
    <group ref={ref}>
      <Html center distanceFactor={25} style={{ pointerEvents: 'none' }}>
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '9px',
          color: '#fde68a',
          textShadow: '0 0 6px #ff8c0066',
          whiteSpace: 'nowrap',
          letterSpacing: '1px',
          opacity: 0.7,
          userSelect: 'none',
        }}>
          {text}
        </div>
      </Html>
    </group>
  )
}
