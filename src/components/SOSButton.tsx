'use client'

import Link from 'next/link'

interface SOSButtonProps {
  size?: 'lg' | 'xl'
}

export default function SOSButton({ size = 'xl' }: SOSButtonProps) {
  const isXL = size === 'xl'

  return (
    <Link
      href="/sos"
      id="sos-button-main"
      className="relative flex items-center justify-center group select-none"
      aria-label="SOS Vontade — abre o fluxo de crise"
    >
      {/* Pulse rings */}
      <span
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#34D399] opacity-20 sos-pulse-ring"
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#34D399] opacity-10 sos-pulse-ring"
        style={{ animationDelay: '0.5s' }}
        aria-hidden="true"
      />
      {/* Button */}
      <div
        className={`
          relative flex flex-col items-center justify-center rounded-full
          bg-gradient-to-br from-[#38BDF8] to-[#34D399]
          shadow-[0_0_40px_rgba(56,189,248,0.4)]
          transition-transform duration-150 active:scale-95 group-hover:scale-105
          ${isXL ? 'w-40 h-40' : 'w-24 h-24'}
        `}
      >
        <span className={`font-bold text-white leading-none ${isXL ? 'text-2xl' : 'text-base'}`}>
          SOS
        </span>
        <span className={`text-white/80 font-medium ${isXL ? 'text-sm mt-1' : 'text-xs'}`}>
          Vontade
        </span>
      </div>
    </Link>
  )
}
