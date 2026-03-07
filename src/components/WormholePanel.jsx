import { motion } from 'framer-motion'

export default function WormholePanel({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 backdrop-blur-lg"
        style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, rgba(0,0,0,0.85) 100%)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-12 py-16 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(10,5,30,0.96), rgba(5,0,15,0.98))',
          border: '1px solid rgba(168,85,247,0.3)',
          boxShadow: '0 0 80px rgba(124,58,237,0.2), 0 0 200px rgba(124,58,237,0.08), inset 0 0 80px rgba(124,58,237,0.05)',
          minWidth: '360px',
          maxWidth: '520px',
        }}
        initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotateY: -90 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      >
        {/* Top glow line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent, #a855f7, #7c3aed, #a855f7, transparent)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        {/* Spinning portal ring */}
        <motion.div
          className="relative w-28 h-28 mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid transparent',
              borderImage: 'linear-gradient(135deg, #a855f7, #06b6d4, #7c3aed, #22d3ee) 1',
              borderRadius: '50%',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: 'rgba(168,85,247,0.5)',
            }}
          />
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              border: '1px solid rgba(103,232,249,0.4)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full"
            style={{
              border: '1px solid rgba(168,85,247,0.3)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              className="text-4xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌀
            </motion.span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold font-[family-name:var(--font-orbitron)] mb-3 tracking-wider"
          style={{
            background: 'linear-gradient(135deg, #c084fc, #67e8f9, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.5))',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          COMING SOON
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-sm text-purple-300/60 font-[family-name:var(--font-space)] mb-2 tracking-wider"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          THIS DIMENSION IS STILL FORMING
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-xs text-gray-500 font-[family-name:var(--font-space)] max-w-xs leading-relaxed mb-8"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          A new project is warping through space-time. Stay tuned as this portal stabilizes and reveals what lies beyond.
        </motion.p>

        {/* Animated status bar */}
        <motion.div
          className="w-48 h-[3px] rounded-full overflow-hidden mb-6"
          style={{ background: 'rgba(124,58,237,0.15)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #a855f7, #06b6d4)' }}
            animate={{ width: ['0%', '65%', '40%', '65%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.span
          className="text-[10px] text-purple-400/40 font-[family-name:var(--font-space)] tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          WARP STABILITY: 42%
        </motion.span>

        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-all border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/10"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>

        {/* Bottom glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)' }}
        />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: 'linear-gradient(90deg, #a855f780, transparent)' }} />
          <div className="absolute top-0 left-0 w-[1px] h-full" style={{ background: 'linear-gradient(180deg, #a855f780, transparent)' }} />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-[1px]" style={{ background: 'linear-gradient(270deg, #06b6d480, transparent)' }} />
          <div className="absolute bottom-0 right-0 w-[1px] h-full" style={{ background: 'linear-gradient(0deg, #06b6d480, transparent)' }} />
        </div>
      </motion.div>

      {/* ESC hint */}
      <motion.div
        className="absolute bottom-6 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <kbd className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] text-gray-400 font-[family-name:var(--font-space)]">ESC</kbd>
        <span className="text-[10px] text-gray-600 font-[family-name:var(--font-space)]">to close</span>
      </motion.div>
    </motion.div>
  )
}
