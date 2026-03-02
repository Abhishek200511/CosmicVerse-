import { motion } from 'framer-motion'
import AboutPanel from './panels/AboutPanel.jsx'
import DevOpsPanel from './panels/DevOpsPanel.jsx'
import ArthaMindPanel from './panels/ArthaMindPanel.jsx'
import ArchitecturePanel from './panels/ArchitecturePanel.jsx'
import Web3Panel from './panels/Web3Panel.jsx'
import ContactPanel from './panels/ContactPanel.jsx'
import ResumePanel from './panels/ResumePanel.jsx'

const PANEL_MAP = {
  earth: { component: AboutPanel, title: '🌍 About Me', color: '#3b82f6', accent: '#60a5fa' },
  mars: { component: DevOpsPanel, title: '🔴 DevOps Skills', color: '#ef4444', accent: '#f87171' },
  neptune: { component: ArthaMindPanel, title: '🟣 ArthaMind', color: '#6366f1', accent: '#818cf8' },
  jupiter: { component: ArchitecturePanel, title: '🛰 System Architecture', color: '#f97316', accent: '#fb923c' },
  saturn: { component: Web3Panel, title: '🪐 Web3 Exploration', color: '#a78bfa', accent: '#c4b5fd' },
  pluto: { component: ContactPanel, title: '🌑 Contact', color: '#94a3b8', accent: '#cbd5e1' },
  blackhole: { component: ResumePanel, title: '🌌 Resume', color: '#7c3aed', accent: '#a78bfa' },
}

export default function PlanetPanel({ planetId, onClose }) {
  const panel = PANEL_MAP[planetId]
  if (!panel) return null

  const PanelContent = panel.component

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop with subtle cosmic blur */}
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.8) 100%)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-3xl max-h-[85vh] mx-4 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(8,8,32,0.96) 0%, rgba(3,3,15,0.98) 100%)',
          border: `1px solid ${panel.color}25`,
          boxShadow: `0 0 60px ${panel.color}15, 0 0 120px ${panel.color}08, inset 0 1px 0 rgba(255,255,255,0.05)`,
          backdropFilter: 'blur(40px)',
        }}
        initial={{ scale: 0.85, opacity: 0, y: 40, rotateX: 5 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        {/* Top edge glow line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${panel.color}60, ${panel.accent}80, ${panel.color}60, transparent)` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `linear-gradient(90deg, ${panel.color}80, transparent)` }} />
          <div className="absolute top-0 left-0 w-[1px] h-full" style={{ background: `linear-gradient(180deg, ${panel.color}80, transparent)` }} />
        </div>
        <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-[1px]" style={{ background: `linear-gradient(270deg, ${panel.color}80, transparent)` }} />
          <div className="absolute top-0 right-0 w-[1px] h-full" style={{ background: `linear-gradient(180deg, ${panel.color}80, transparent)` }} />
        </div>

        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{ borderBottomColor: `${panel.color}20` }}
        >
          <div className="flex items-center gap-3">
            {/* Status dot */}
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: panel.color, boxShadow: `0 0 10px ${panel.color}80` }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h2
              className="text-lg font-bold font-[family-name:var(--font-orbitron)] tracking-wider"
              style={{ color: panel.color }}
            >
              {panel.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Coordinate display */}
            <span className="text-[10px] text-gray-600 font-[family-name:var(--font-space)] hidden sm:inline tracking-wider">
              SECTOR-{planetId.toUpperCase().slice(0, 3)}::ONLINE
            </span>
            <motion.button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all border border-white/5 hover:border-white/20 hover:bg-white/5"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-60px)] custom-scrollbar">
          <PanelContent />
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${panel.color}30, transparent)` }} />
      </motion.div>

      {/* ESC hint */}
      <motion.div
        className="absolute bottom-6 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] text-gray-400 font-[family-name:var(--font-space)]">ESC</kbd>
        <span className="text-[10px] text-gray-600 font-[family-name:var(--font-space)]">to close</span>
      </motion.div>
    </motion.div>
  )
}
