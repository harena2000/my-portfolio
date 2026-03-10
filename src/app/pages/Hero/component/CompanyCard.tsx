import React from 'react'
import { motion } from 'framer-motion'
import { Building2, Calendar } from 'lucide-react'

export interface Company {
  company: string
  role?: string
  details?: string
  from?: string
  to?: string
}

export function CompanyCard({ exp, index = 0 }: { exp: Company; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-5 hover:border-blue-500/30 hover:bg-blue-900/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 group"
      style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-blue-900/30 group-hover:shadow-blue-600/30 transition-all">
          {exp.company?.[0] ?? '•'}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors truncate">{exp.company}</h4>
          {exp.role && <p className="text-xs text-gray-400 truncate">{exp.role}</p>}
        </div>
      </div>

      {exp.details && (
        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{exp.details}</p>
      )}

      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Calendar className="w-3 h-3" />
        <span>{exp.from ?? '—'} — {exp.to ?? 'Present'}</span>
      </div>
    </motion.div>
  )
}

export default CompanyCard
