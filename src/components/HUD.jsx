import { motion } from 'framer-motion'

export default function HUD({ onDeploy }) {
  return (
    <motion.div
      className="fixed inset-0 z-20 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top-left: Title with futuristic frame */}
      <div className="absolute top-6 left-6">
        <div className="flex items-center gap-3 mb-1">
          {/* Status indicator */}
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 8px #22d3ee' }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <h1 className="text-lg font-bold font-[family-name:var(--font-orbitron)] tracking-[0.15em]"
            style={{
              background: 'linear-gradient(135deg, #e0f2fe, #67e8f9, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 8px rgba(103,232,249,0.3))',
            }}
          >
            CosmicVerse
          </h1>
        </div>
        <div className="flex items-center gap-2 ml-5">
          <div className="w-12 h-[1px] bg-gradient-to-r from-cyan-500/40 to-transparent" />
          <p className="text-[10px] text-cyan-300/40 font-[family-name:var(--font-space)] uppercase tracking-[0.3em]">
            Abhishek Phukan | Stellar Portfolio
          </p>
        </div>
      </div>

      {/* Top-right: Controls with holographic feel */}
      <div className="absolute top-6 right-6 text-right">
        <div className="px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02]">
          <div className="text-[10px] text-cyan-300/30 font-[family-name:var(--font-space)] mb-2 tracking-wider uppercase">
            Navigation
          </div>
          <div className="text-[11px] text-gray-500 font-[family-name:var(--font-space)] space-y-1">
            <p className="flex items-center justify-end gap-2">
              <span className="text-gray-600">SCROLL</span>
              <span className="text-cyan-500/60">→</span>
              <span>Zoom</span>
            </p>
            <p className="flex items-center justify-end gap-2">
              <span className="text-gray-600">DRAG</span>
              <span className="text-cyan-500/60">→</span>
              <span>Orbit</span>
            </p>
            <p className="flex items-center justify-end gap-2">
              <span className="text-gray-600">CLICK</span>
              <span className="text-cyan-500/60">→</span>
              <span>Explore</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom-left: Deploy button with enhanced glow */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <motion.button
          onClick={onDeploy}
          className="relative flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-[family-name:var(--font-space)] transition-all overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.08))',
            border: '1px solid rgba(16,185,129,0.25)',
            color: '#34d399',
          }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(16,185,129,0.2)' }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Scan line animation on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
            <motion.div
              className="w-full h-[1px] bg-green-400/30"
              animate={{ y: [0, 48, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <motion.span
            className="w-2.5 h-2.5 rounded-full bg-green-400"
            style={{ boxShadow: '0 0 8px #34d399' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="relative z-10">Deploy Universe</span>
        </motion.button>
      </div>

      {/* Bottom-right: Navigation legend with compact holographic cards */}
      <div className="absolute bottom-6 right-6">
        <div className="flex flex-wrap gap-1.5 justify-end max-w-xs">
          {[
            { emoji: '☀', name: 'Identity', color: '#fbbf24' },
            { emoji: '🌍', name: 'About', color: '#3b82f6' },
            { emoji: '🔴', name: 'DevOps', color: '#ef4444' },
            { emoji: '🟣', name: 'ArthaMind', color: '#6366f1' },
            { emoji: '🛰', name: 'Arch', color: '#f97316' },
            { emoji: '🪐', name: 'Web3', color: '#a78bfa' },
            { emoji: '🌑', name: 'Contact', color: '#94a3b8' },
            { emoji: '🌌', name: 'Resume', color: '#7c3aed' },
            { emoji: '🌀', name: 'Wormhole', color: '#c084fc' },
            { emoji: '🛸', name: 'UFO', color: '#22d3ee' },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md border border-white/5"
              style={{
                color: item.color,
                background: `${item.color}08`,
              }}
            >
              <span className="text-xs">{item.emoji}</span>
              <span className="font-[family-name:var(--font-space)] tracking-wider">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Side decorative lines */}
      <div className="absolute top-1/4 left-0 w-16 h-[1px] bg-gradient-to-r from-cyan-500/20 to-transparent" />
      <div className="absolute top-1/3 left-0 w-8 h-[1px] bg-gradient-to-r from-cyan-500/10 to-transparent" />
      <div className="absolute bottom-1/4 right-0 w-16 h-[1px] bg-gradient-to-l from-purple-500/20 to-transparent" />
      <div className="absolute bottom-1/3 right-0 w-8 h-[1px] bg-gradient-to-l from-purple-500/10 to-transparent" />
    </motion.div>
  )
}
