import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { DEPLOY_LINES, PLANETS } from '../data/constants.js'

export default function DeployMode({ onComplete, onGlowUpdate }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [progress, setProgress] = useState(0)
  const terminalRef = useRef(null)

  useEffect(() => {
    const timers = []
    const totalDuration = DEPLOY_LINES[DEPLOY_LINES.length - 1].delay + 1500

    DEPLOY_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(prev => [...prev, line.text])
          setProgress(((i + 1) / DEPLOY_LINES.length) * 100)

          // Update planet glow based on progress
          const glowIdx = Math.floor((i / DEPLOY_LINES.length) * (PLANETS.length - 1))
          onGlowUpdate(glowIdx)

          // Auto-scroll terminal
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        }, line.delay)
      )
    })

    // Complete after all lines
    timers.push(
      setTimeout(() => {
        setTimeout(onComplete, 3000)
      }, totalDuration)
    )

    return () => timers.forEach(clearTimeout)
  }, [onComplete, onGlowUpdate])

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Terminal */}
      <motion.div
        className="relative z-10 w-full max-w-2xl mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Terminal Header */}
        <div className="bg-gray-800/90 rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-gray-700/50">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-gray-400 font-[family-name:var(--font-space)]">
            deploy-pipeline — bash
          </span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-green-400 font-[family-name:var(--font-space)]">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Terminal Body */}
        <div
          ref={terminalRef}
          className="bg-gray-900/95 rounded-b-lg p-5 min-h-[350px] max-h-[450px] overflow-y-auto border border-t-0 border-gray-700/30"
        >
          {visibleLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`font-[family-name:var(--font-space)] text-sm mb-1 ${
                line.startsWith('✓')
                  ? 'text-green-400'
                  : line.startsWith('🚀')
                  ? 'text-green-300 glow-text font-bold text-base mt-2'
                  : line.startsWith('$')
                  ? 'text-cyan-400'
                  : line.startsWith('Step')
                  ? 'text-gray-500'
                  : line.startsWith('Successfully')
                  ? 'text-yellow-400'
                  : 'text-gray-400'
              }`}
            >
              {line || '\u00A0'}
            </motion.div>
          ))}
          {progress < 100 && (
            <span className="terminal-cursor text-green-400 font-[family-name:var(--font-space)]">▊</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Status text */}
        <div className="mt-2 text-xs text-gray-500 text-center font-[family-name:var(--font-space)]">
          {progress < 100
            ? 'Pipeline running — planets activating sequentially...'
            : '✓ All systems deployed successfully'}
        </div>
      </motion.div>
    </motion.div>
  )
}
