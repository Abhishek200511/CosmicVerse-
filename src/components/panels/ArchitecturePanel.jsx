import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const architectureConcepts = [
  {
    icon: '🧩',
    title: 'Microservices',
    desc: 'Decomposing monolithic applications into independently deployable services for scalability and maintainability.',
    color: 'orange',
  },
  {
    icon: '📦',
    title: 'Container Orchestration',
    desc: 'Using Docker containers for consistent environments across dev, staging, and production.',
    color: 'orange',
  },
  {
    icon: '🔄',
    title: 'CI/CD Pipelines',
    desc: 'Automated build → test → deploy workflows using GitHub Actions for reliable delivery.',
    color: 'orange',
  },
  {
    icon: '📊',
    title: 'Deployment Lifecycle',
    desc: 'Understanding the full lifecycle: build, test, stage, deploy, monitor, rollback.',
    color: 'orange',
  },
  {
    icon: '🛡',
    title: 'Security Layering',
    desc: 'Defense-in-depth approach: network isolation, secrets management, least privilege access.',
    color: 'orange',
  },
]

export default function ArchitecturePanel() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.p variants={fadeUp} className="text-gray-300 text-sm leading-relaxed">
        Beyond writing code, I think about <span className="text-orange-400 font-semibold">how systems 
        are built, deployed, and scaled</span>. Architecture thinking is about making decisions that 
        enable reliability, maintainability, and growth.
      </motion.p>

      {/* Pipeline diagram */}
      <motion.div variants={fadeUp} className="rounded-xl p-4 bg-white/5 border border-orange-500/20">
        <h4 className="text-sm font-semibold text-orange-400 mb-4 font-[family-name:var(--font-orbitron)]">
          CI/CD Pipeline Flow
        </h4>
        <div className="flex items-center justify-between gap-1 text-xs overflow-x-auto pb-2">
          {['Code', 'Build', 'Test', 'Stage', 'Deploy', 'Monitor'].map((step, i) => (
            <div key={step} className="flex items-center gap-1 shrink-0">
              <motion.div
                className="px-3 py-2 rounded-lg bg-orange-500/15 text-orange-300 border border-orange-500/20 text-center font-[family-name:var(--font-space)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.12 }}
              >
                {step}
              </motion.div>
              {i < 5 && <span className="text-orange-500/50">→</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Concepts */}
      {architectureConcepts.map((concept, i) => (
        <motion.div
          key={concept.title}
          variants={fadeUp}
          className="rounded-xl p-4 bg-white/5 border border-white/5 hover:border-orange-500/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">{concept.icon}</span>
            <h3 className="text-sm font-semibold text-orange-400 font-[family-name:var(--font-orbitron)]">
              {concept.title}
            </h3>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed pl-9">{concept.desc}</p>
        </motion.div>
      ))}

      <motion.div variants={fadeUp} className="text-xs text-gray-500 text-center pt-2 italic">
        Architecture is about thinking beyond code — it's about systems.
      </motion.div>
    </motion.div>
  )
}
