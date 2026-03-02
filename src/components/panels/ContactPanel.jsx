import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const contacts = [
  {
    icon: '📧',
    label: 'Email',
    value: 'abhishekphukan11@gmail.com',
    href: 'mailto:abhishekphukan11@gmail.com',
    color: '#f87171',
    glow: 'rgba(248,113,113,0.15)',
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    value: 'linkedin.com/in/abhishek-phukan-517610293',
    href: 'https://www.linkedin.com/in/abhishek-phukan-517610293',
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.15)',
  },
  {
    icon: '🐙',
    label: 'GitHub',
    value: 'github.com/Abhishek200511',
    href: 'https://github.com/Abhishek200511',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.15)',
  },
]

export default function ContactPanel() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      {/* Signal wave header */}
      <motion.div variants={fadeUp} className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gray-600" />
          <span className="text-[10px] text-gray-500 font-[family-name:var(--font-space)] tracking-[0.3em] uppercase">
            Transmission Open
          </span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gray-600" />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
          Let's connect. Whether it's about DevOps, system architecture,
          or building something meaningful — I'm always open to conversations.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-3">
        {contacts.map((contact, i) => (
          <motion.a
            key={contact.label}
            href={contact.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={fadeUp}
            className="relative flex items-center gap-4 p-4 rounded-xl border border-white/5 transition-all group overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
            }}
            whileHover={{
              x: 6,
              borderColor: `${contact.color}40`,
              boxShadow: `0 0 30px ${contact.glow}`,
            }}
          >
            {/* Left accent line */}
            <div
              className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: contact.color }}
            />
            <span className="text-2xl relative z-10">{contact.icon}</span>
            <div className="relative z-10 min-w-0">
              <div className="text-[10px] font-[family-name:var(--font-orbitron)] tracking-wider uppercase" style={{ color: contact.color }}>
                {contact.label}
              </div>
              <div className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                {contact.value}
              </div>
            </div>
            <motion.span
              className="ml-auto text-gray-700 group-hover:text-gray-300 transition-colors text-lg relative z-10"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              →
            </motion.span>
          </motion.a>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="text-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02]">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] text-gray-400 font-[family-name:var(--font-space)] tracking-wider">
            Signal broadcast from the edge of the cosmos
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}
