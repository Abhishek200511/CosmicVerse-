import { motion } from 'framer-motion'
import { DEVOPS_SKILLS } from '../../data/constants.js'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function DevOpsPanel() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-[1px] bg-gradient-to-r from-red-500/50 to-transparent" />
          <span className="text-[10px] text-red-400/60 font-[family-name:var(--font-space)] tracking-[0.3em] uppercase">Core Systems</span>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">
          DevOps is the <span className="text-red-400 font-semibold">core pillar</span> of my engineering identity. 
          I focus on bridging the gap between development and operations through automation, 
          containerization, and smart deployment pipelines.
        </p>
      </motion.div>

      {/* Skills Grid */}
      <motion.div variants={fadeUp} className="space-y-3">
        {DEVOPS_SKILLS.map((skill, i) => (
          <motion.div
            key={skill.name}
            variants={fadeUp}
            className="relative rounded-xl p-4 border border-white/5 transition-all group overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005))' }}
            whileHover={{ borderColor: 'rgba(239,68,68,0.2)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">{skill.icon}</span>
                <h3 className="text-sm font-semibold text-red-400 font-[family-name:var(--font-orbitron)] tracking-wide">
                  {skill.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 font-[family-name:var(--font-space)]">
                  PWR
                </span>
                <span className="text-xs text-red-400/80 font-[family-name:var(--font-space)] font-bold tabular-nums">
                  {skill.level}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">{skill.description}</p>
            {/* Skill bar with glow */}
            <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, #ef4444, #f97316)`,
                  boxShadow: '0 0 10px rgba(239,68,68,0.3)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 pt-2">
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-red-400/60"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[10px] text-gray-500 font-[family-name:var(--font-space)] tracking-wider uppercase">
          Primary focus: Infrastructure & Deployment Maturity
        </span>
      </motion.div>
    </motion.div>
  )
}
