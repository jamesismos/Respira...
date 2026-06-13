'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import DonationCard from '@/components/DonationCard'

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1 px-5 pt-8 pb-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/settings" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0F1B24] border border-[rgba(56,189,248,0.15)]">
            <ArrowLeft size={18} className="text-[#A7B4C2]" />
          </Link>
          <h1 className="text-lg font-bold text-[#F8FAFC]">Apoiar o projeto</h1>
        </div>

        <div className="animate-slide-in">
          <DonationCard />
        </div>

        <div className="mt-8 text-center px-4">
          <p className="text-[#64748B] text-xs leading-relaxed">
            Nenhuma funcionalidade do Respira é ou será bloqueada por pagamento. 
            O projeto é mantido por voluntariado de código aberto.
          </p>
        </div>

      </div>
    </div>
  )
}
