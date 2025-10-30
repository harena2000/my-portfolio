import React from 'react'

export interface Company {
  company: string
  role?: string
  details?: string
  from?: string
  to?: string
}

export function CompanyCard({ exp }: { exp: Company }) {
  return (
    <div
      className="rounded-2xl bg-white/2 border border-white/10 p-6 hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] transition"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">
          {exp.company?.[0] ?? '•'}
        </div>
        <div>
          <h4 className="font-semibold text-white">{exp.company}</h4>
          {exp.role && <p className="text-sm text-gray-400">{exp.role}</p>}
        </div>
      </div>

      {exp.details && <p className="text-gray-300 text-sm mb-3">{exp.details}</p>}

      <div className="text-xs text-gray-400">
        {exp.from ?? '—'} - {exp.to ?? 'Present'}
      </div>
    </div>
  )
}

export default CompanyCard