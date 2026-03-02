import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Web3Panel() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="rounded-xl p-4 bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 font-[family-name:var(--font-space)]">
            Exploration
          </span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          My Web3 journey represents an <span className="text-purple-400 font-semibold">exploration 
          into decentralized technologies</span>. I completed one hands-on project to build 
          foundational understanding.
        </p>
      </motion.div>

      {/* Project Details */}
      <motion.div variants={fadeUp} className="rounded-xl p-5 bg-white/5 border border-purple-500/20">
        <h4 className="text-sm font-semibold text-purple-400 mb-3 font-[family-name:var(--font-orbitron)]">
          🔗 Web3 Project
        </h4>
        <div className="space-y-3 text-xs text-gray-300">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
            <span>Built a decentralized application exploring smart contract interactions</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
            <span>Gained understanding of blockchain fundamentals and on-chain transactions</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
            <span>Explored smart contract deployment processes</span>
          </div>
        </div>
      </motion.div>

      {/* Knowledge Areas */}
      <motion.div variants={fadeUp}>
        <h4 className="text-sm font-semibold text-purple-400 mb-3 font-[family-name:var(--font-orbitron)]">
          Foundational Knowledge
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {['Smart Contracts', 'Decentralization', 'Blockchain Basics', 'Web3 Ecosystem'].map((topic) => (
            <div key={topic} className="text-xs text-center py-2 px-3 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/15">
              {topic}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="text-xs text-gray-500 text-center pt-2 italic border-t border-white/5 pt-4">
        Positioned as exploration — honest about scope and depth.
        <br />
        Primary strengths remain in DevOps and system architecture.
      </motion.div>
    </motion.div>
  )
}
