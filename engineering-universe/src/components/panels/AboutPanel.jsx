import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function AboutPanel() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
          <span className="text-[10px] text-blue-400/60 font-[family-name:var(--font-space)] tracking-[0.3em] uppercase">Profile Data</span>
        </div>
        <p className="text-gray-300 leading-relaxed text-base">
          Hi, I'm <span className="text-blue-400 font-semibold">Abhishek Phukan</span> — a student 
          deeply focused on <span className="text-cyan-400 font-semibold">DevOps</span>, 
          <span className="text-cyan-400 font-semibold"> scalable systems</span>, and 
          <span className="text-cyan-400 font-semibold"> infrastructure thinking</span>.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: '🔧', title: 'Automation Mindset', desc: 'Dedicated to eliminating manual processes through scripting, CI/CD pipelines, and infrastructure-as-code.', color: '#3b82f6' },
          { icon: '🛡', title: 'Security Awareness', desc: 'Understanding secure deployment practices, environment isolation, and principle of least privilege.', color: '#06b6d4' },
          { icon: '📐', title: 'System Design', desc: 'Passionate about designing resilient architectures, from monoliths to microservices at scale.', color: '#8b5cf6' },
          { icon: '🚀', title: 'Builder Mentality', desc: 'Built ArthaMind (AI/Finance) and explored Web3 through a hands-on project.', color: '#f97316' },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="relative rounded-xl p-4 border border-white/5 transition-all group overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))' }}
            whileHover={{ borderColor: `${item.color}30`, y: -2 }}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-4 right-4 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${item.color}40, transparent)` }}
            />
            <div className="text-2xl mb-2">{item.icon}</div>
            <h3 className="text-sm font-semibold mb-1.5 font-[family-name:var(--font-orbitron)] tracking-wide" style={{ color: item.color }}>
              {item.title}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="relative pl-4">
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 via-cyan-500/30 to-transparent rounded-full" />
        <p className="text-sm text-gray-400 italic leading-relaxed">
          "I don't just write code — I think about how it gets built, shipped, monitored, and scaled."
        </p>
      </motion.div>
    </motion.div>
  )
}
