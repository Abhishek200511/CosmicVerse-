import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function ArthaMindPanel() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Tagline */}
      <motion.div variants={fadeUp} className="text-center">
        <h3 className="text-lg font-bold text-indigo-400 font-[family-name:var(--font-orbitron)] mb-1">
          ArthaMind
        </h3>
        <p className="text-xs text-gray-400">AI-Powered Financial Intelligence Platform</p>
      </motion.div>

      {/* Problem */}
      <motion.div variants={fadeUp} className="rounded-xl p-4 bg-white/5 border border-indigo-500/20">
        <h4 className="text-sm font-semibold text-indigo-400 mb-2 font-[family-name:var(--font-orbitron)]">
          🎯 Problem
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          Financial decision-making for individuals and small businesses often lacks data-driven 
          intelligence. ArthaMind bridges this gap by providing AI-driven insights for smarter 
          financial planning and risk assessment.
        </p>
      </motion.div>

      {/* Tech Stack */}
      <motion.div variants={fadeUp} className="rounded-xl p-4 bg-white/5 border border-indigo-500/20">
        <h4 className="text-sm font-semibold text-indigo-400 mb-3 font-[family-name:var(--font-orbitron)]">
          ⚙ Tech Stack
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {['Python', 'Machine Learning', 'FastAPI', 'React', 'PostgreSQL', 'Docker'].map((tech) => (
            <div key={tech} className="text-xs text-center py-2 px-3 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {tech}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Architecture */}
      <motion.div variants={fadeUp} className="rounded-xl p-4 bg-white/5 border border-indigo-500/20">
        <h4 className="text-sm font-semibold text-indigo-400 mb-2 font-[family-name:var(--font-orbitron)]">
          🏗 Architecture
        </h4>
        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Modular microservice-inspired backend structure</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>ML pipeline for financial prediction models</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>Containerized deployment with Docker</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span>RESTful API with real-time data processing</span>
          </div>
        </div>
      </motion.div>

      {/* Use Case */}
      <motion.div variants={fadeUp} className="rounded-xl p-4 bg-white/5 border border-indigo-500/20">
        <h4 className="text-sm font-semibold text-indigo-400 mb-2 font-[family-name:var(--font-orbitron)]">
          💡 Real-World Use Case
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          A user inputs their financial data, and ArthaMind processes it through ML models to 
          generate actionable insights — portfolio risk analysis, spending optimization, and 
          future projection dashboards.
        </p>
      </motion.div>

      {/* Deployment */}
      <motion.div variants={fadeUp} className="rounded-xl p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <h4 className="text-sm font-semibold text-indigo-400 mb-2 font-[family-name:var(--font-orbitron)]">
          🚀 Deployment
        </h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          Dockerized application with CI/CD pipeline through GitHub Actions. 
          Automated testing and deployment reflecting DevOps best practices.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="text-xs text-gray-500 text-center pt-1 italic">
        Flagship Project — Combining AI, Finance, and DevOps Engineering
      </motion.div>
    </motion.div>
  )
}
