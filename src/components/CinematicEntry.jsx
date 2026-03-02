import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TERMINAL_LINES } from '../data/constants.js'
import { startAmbientHum, playBootSound, playWarpSound, playTerminalBeep } from '../utils/sounds.js'

export default function CinematicEntry({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [exiting, setExiting] = useState(false)
  const [showWarp, setShowWarp] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const stopAmbientRef = useRef(null)
  const soundStartedRef = useRef(false)

  // Start ambient sound on first user interaction (browser policy)
  useEffect(() => {
    const startSounds = () => {
      if (soundStartedRef.current) return
      soundStartedRef.current = true
      stopAmbientRef.current = startAmbientHum()
      playBootSound()
    }
    // Try on click/keypress (browser requires user gesture for audio)
    window.addEventListener('click', startSounds, { once: true })
    window.addEventListener('keydown', startSounds, { once: true })
    // Also try immediately — works if user already interacted
    const autoTimer = setTimeout(startSounds, 500)
    return () => {
      window.removeEventListener('click', startSounds)
      window.removeEventListener('keydown', startSounds)
      clearTimeout(autoTimer)
      if (stopAmbientRef.current) stopAmbientRef.current()
    }
  }, [])

  // Starfield canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let stars = []
    const STAR_COUNT = 600

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize stars at random depths
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 3,
        y: (Math.random() - 0.5) * canvas.height * 3,
        z: Math.random() * 2000,
        pz: 0,
      })
    }

    // Meteoroids / shooting stars
    let meteors = []
    const METEOR_COUNT = 6
    function spawnMeteor() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        vx: (Math.random() - 0.3) * 8,
        vy: 3 + Math.random() * 5,
        life: 0,
        maxLife: 30 + Math.random() * 40,
        size: 1 + Math.random() * 2,
        brightness: 0.6 + Math.random() * 0.4,
      }
    }
    for (let i = 0; i < METEOR_COUNT; i++) {
      const m = spawnMeteor()
      m.life = Math.random() * m.maxLife // stagger initial appearances
      meteors.push(m)
    }

    let speed = 0
    let targetSpeed = 0.5

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2

      for (let star of stars) {
        star.pz = star.z
        star.z -= speed

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width * 3
          star.y = (Math.random() - 0.5) * canvas.height * 3
          star.z = 2000
          star.pz = 2000
        }

        const sx = (star.x / star.z) * 400 + cx
        const sy = (star.y / star.z) * 400 + cy
        const px = (star.x / star.pz) * 400 + cx
        const py = (star.y / star.pz) * 400 + cy

        const size = Math.max(0, (1 - star.z / 2000) * 3)
        const brightness = Math.max(0, (1 - star.z / 2000))

        ctx.beginPath()
        ctx.strokeStyle = `rgba(180, 220, 255, ${brightness * 0.8})`
        ctx.lineWidth = size
        ctx.moveTo(px, py)
        ctx.lineTo(sx, sy)
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = `rgba(200, 230, 255, ${brightness})`
        ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw meteors / shooting stars
      for (let m of meteors) {
        m.life++
        if (m.life > m.maxLife) {
          Object.assign(m, spawnMeteor())
          m.life = 0
        }

        m.x += m.vx
        m.y += m.vy

        const alpha = Math.sin((m.life / m.maxLife) * Math.PI) * m.brightness

        // Trail
        const trailLen = 6
        ctx.beginPath()
        ctx.strokeStyle = `rgba(220, 240, 255, ${alpha * 0.7})`
        ctx.lineWidth = m.size * 0.8
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * trailLen, m.y - m.vy * trailLen)
        ctx.stroke()

        // Head glow
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 3)
        gradient.addColorStop(0, `rgba(255, 240, 220, ${alpha})`)
        gradient.addColorStop(0.5, `rgba(255, 200, 150, ${alpha * 0.4})`)
        gradient.addColorStop(1, 'rgba(255, 200, 150, 0)')
        ctx.fillStyle = gradient
        ctx.arc(m.x, m.y, m.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Bright core
        ctx.beginPath()
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.arc(m.x, m.y, m.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      speed += (targetSpeed - speed) * 0.02
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Phase control: ramp up speed for warp effect
    const warpTimer = setTimeout(() => {
      targetSpeed = 40
      setShowWarp(true)
      playWarpSound()
    }, 5800)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', resize)
      clearTimeout(warpTimer)
    }
  }, [])

  // Show title first, then terminal
  useEffect(() => {
    const titleTimer = setTimeout(() => setShowTitle(true), 300)
    const terminalTimer = setTimeout(() => setShowTerminal(true), 1200)
    return () => { clearTimeout(titleTimer); clearTimeout(terminalTimer) }
  }, [])

  // Terminal lines
  useEffect(() => {
    if (!showTerminal) return
    const timers = TERMINAL_LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line.text])
        playTerminalBeep()
      }, line.delay)
    )

    // Auto-proceed after last line + warp
    const finishTimer = setTimeout(() => {
      if (stopAmbientRef.current) stopAmbientRef.current()
      setExiting(true)
      setTimeout(onComplete, 1000)
    }, TERMINAL_LINES[TERMINAL_LINES.length - 1].delay + 2500)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finishTimer)
    }
  }, [showTerminal, onComplete])

  const handleSkip = () => {
    if (stopAmbientRef.current) stopAmbientRef.current()
    setExiting(true)
    setTimeout(onComplete, 500)
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: exiting ? 0.3 : 1, transition: 'opacity 0.8s' }}
      />

      {/* Subtle radial spotlight */}
      <div className="absolute inset-0 spotlight pointer-events-none" />

      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-30" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="w-full h-[2px] bg-cyan-400" style={{ animation: 'scanline 3s linear infinite' }} />
      </div>

      {/* Warp flash */}
      <AnimatePresence>
        {showWarp && (
          <motion.div
            className="absolute inset-0 bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.2, times: [0, 0.1, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Center Title */}
      <AnimatePresence>
        {showTitle && !showWarp && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8 }}
          >
            {/* Hexagonal frame decoration */}
            <motion.div
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, type: 'spring' }}
            >
              {/* Rotating rings */}
              <motion.div
                className="absolute -inset-16 border rounded-full"
                style={{ borderColor: 'rgba(6,182,212,0.12)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-24 border rounded-full"
                style={{ borderColor: 'rgba(124,58,237,0.08)' }}
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              />
              {/* Third ring for depth */}
              <motion.div
                className="absolute -inset-10 border rounded-full"
                style={{ borderColor: 'rgba(6,182,212,0.06)' }}
                animate={{ rotate: -180 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />

              <h1 className="text-5xl md:text-7xl font-black font-[family-name:var(--font-orbitron)] tracking-[0.2em]"
                style={{
                  background: 'linear-gradient(135deg, #67e8f9, #3b82f6, #a78bfa, #c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(103,232,249,0.3))',
                }}
              >
                CV
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-6"
            >
              <p className="text-sm md:text-base font-[family-name:var(--font-orbitron)] tracking-[0.5em] uppercase"
                style={{
                  background: 'linear-gradient(90deg, rgba(103,232,249,0.6), rgba(167,139,250,0.6))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                CosmicVerse
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="mt-3 flex items-center gap-2"
            >
              <div className="w-6 h-[1px] bg-gradient-to-r from-transparent to-cyan-500/30" />
              <p className="text-[10px] font-[family-name:var(--font-space)] text-gray-500 tracking-[0.2em] uppercase">
                STELLAR NAVIGATION v2.0
              </p>
              <div className="w-6 h-[1px] bg-gradient-to-l from-transparent to-cyan-500/30" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal Window - bottom left */}
      <AnimatePresence>
        {showTerminal && (
          <motion.div
            className="absolute bottom-8 left-8 right-8 md:right-auto md:w-[520px] z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Terminal Header */}
            <div className="rounded-t-lg px-4 py-2.5 flex items-center gap-2 border border-b-0"
              style={{
                background: 'linear-gradient(135deg, rgba(13,17,23,0.97), rgba(8,12,20,0.97))',
                borderColor: 'rgba(48,54,61,0.5)',
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[10px] text-gray-500 font-[family-name:var(--font-space)] uppercase tracking-wider">
                sys://cosmicverse/boot
              </span>
              <span className="ml-auto text-[10px] text-green-500/60 font-[family-name:var(--font-space)] animate-flicker">
                ● LIVE
              </span>
            </div>

            {/* Terminal Body */}
            <div className="rounded-b-lg p-4 border border-t-0 max-h-[200px] overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(13,17,23,0.92), rgba(8,12,20,0.95))',
                borderColor: 'rgba(48,54,61,0.5)',
              }}
            >
              {visibleLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`font-[family-name:var(--font-space)] text-xs leading-relaxed mb-1 ${
                    line.includes('Welcome')
                      ? 'text-cyan-400 glow-text-soft text-sm mt-2 font-bold'
                      : line.includes('nominal')
                      ? 'text-green-400'
                      : 'text-green-300/70'
                  }`}
                >
                  {line}
                </motion.div>
              ))}
              {visibleLines.length > 0 && visibleLines.length < TERMINAL_LINES.length && (
                <span className="terminal-cursor text-green-400 font-[family-name:var(--font-space)] text-xs">█</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={handleSkip}
        className="absolute top-6 right-6 text-[10px] text-gray-600 hover:text-cyan-400 transition-all font-[family-name:var(--font-space)] z-30 flex items-center gap-2 group tracking-wider uppercase"
      >
        <span className="w-6 h-[1px] bg-gray-700 group-hover:bg-cyan-500 group-hover:w-10 transition-all duration-300" />
        SKIP
      </motion.button>

      {/* Status indicators top-left */}
      <motion.div
        className="absolute top-6 left-6 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-[10px] font-[family-name:var(--font-space)] tracking-[0.2em] uppercase">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 6px rgba(34,211,238,0.5)' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-cyan-300/40">Initializing Systems</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
