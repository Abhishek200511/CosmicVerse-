import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ResumePanel() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      className="space-y-6 text-center"
    >
      {/* Gravitational visual */}
      <motion.div
        variants={fadeUp}
        className="relative mx-auto w-40 h-40 flex items-center justify-center"
      >
        {/* Spinning rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute border border-purple-500/20 rounded-full"
            style={{
              width: `${ring * 50 + 30}px`,
              height: `${ring * 50 + 30}px`,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 8 + ring * 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
        {/* Core */}
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center text-2xl shadow-[0_0_40px_rgba(124,58,237,0.4)]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          📄
        </motion.div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <h3 className="text-lg font-bold text-purple-400 font-[family-name:var(--font-orbitron)] mb-2">
          Resume
        </h3>
        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
          A comprehensive overview of my engineering journey — skills, projects, 
          education, and the infrastructure mindset behind it all.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-3">
        <motion.a
          href="/resume.pdf"
          download
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors shadow-[0_0_20px_rgba(124,58,237,0.3)]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ⬇ Download Resume
        </motion.a>
        <p className="text-xs text-gray-600 font-[family-name:var(--font-space)]">
          PDF • Pulled by gravitational force
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="pt-4">
        <div className="text-xs text-gray-500 italic">
          "Even light can't escape a black hole,
          <br />
          but my resume can reach you."
        </div>
      </motion.div>
    </motion.div>
  )
}
