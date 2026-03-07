import { useState, useEffect, useCallback, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import SolarSystem from './components/SolarSystem.jsx'
import CinematicEntry from './components/CinematicEntry.jsx'
import PlanetPanel from './components/PlanetPanel.jsx'
import WormholePanel from './components/WormholePanel.jsx'
import DeployMode from './components/DeployMode.jsx'
import HUD from './components/HUD.jsx'
import { playPlanetClickSound, playPanelCloseSound, playDeploySound } from './utils/sounds.js'

export default function App() {
  const [phase, setPhase] = useState('cinematic') // cinematic | explore
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [wormholeOpen, setWormholeOpen] = useState(false)
  const [deployActive, setDeployActive] = useState(false)
  const [deployGlowIndex, setDeployGlowIndex] = useState(-1)

  const handleEntryComplete = useCallback(() => {
    setPhase('explore')
  }, [])

  const handlePlanetClick = useCallback((planetId) => {
    playPlanetClickSound()
    setSelectedPlanet(planetId)
  }, [])

  const handleClosePanel = useCallback(() => {
    playPanelCloseSound()
    setSelectedPlanet(null)
  }, [])

  const handleWormholeClick = useCallback(() => {
    playPlanetClickSound()
    setWormholeOpen(true)
  }, [])

  const handleCloseWormhole = useCallback(() => {
    playPanelCloseSound()
    setWormholeOpen(false)
  }, [])

  const handleDeploy = useCallback(() => {
    playDeploySound()
    setDeployActive(true)
  }, [])

  const handleDeployComplete = useCallback(() => {
    setDeployActive(false)
    setDeployGlowIndex(-1)
  }, [])

  // Keyboard escape to close panels
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedPlanet) setSelectedPlanet(null)
        if (wormholeOpen) setWormholeOpen(false)
        if (deployActive) {
          setDeployActive(false)
          setDeployGlowIndex(-1)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPlanet, wormholeOpen, deployActive])

  return (
    <div className="w-full h-full relative bg-black">
      {/* Cinematic Entry */}
      <AnimatePresence>
        {phase === 'cinematic' && (
          <CinematicEntry onComplete={handleEntryComplete} />
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 25, 45], fov: 65 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SolarSystem
            visible={phase === 'explore'}
            selectedPlanet={selectedPlanet}
            onPlanetClick={handlePlanetClick}
            onWormholeClick={handleWormholeClick}
            deployGlowIndex={deployGlowIndex}
          />
        </Suspense>
      </Canvas>

      {/* HUD Overlay */}
      <AnimatePresence>
        {phase === 'explore' && !selectedPlanet && !wormholeOpen && !deployActive && (
          <HUD onDeploy={handleDeploy} />
        )}
      </AnimatePresence>

      {/* Wormhole "Coming Soon" Panel */}
      <AnimatePresence>
        {wormholeOpen && (
          <WormholePanel onClose={handleCloseWormhole} />
        )}
      </AnimatePresence>

      {/* Planet Detail Panel */}
      <AnimatePresence>
        {selectedPlanet && (
          <PlanetPanel planetId={selectedPlanet} onClose={handleClosePanel} />
        )}
      </AnimatePresence>

      {/* Deploy Mode */}
      <AnimatePresence>
        {deployActive && (
          <DeployMode
            onComplete={handleDeployComplete}
            onGlowUpdate={setDeployGlowIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
