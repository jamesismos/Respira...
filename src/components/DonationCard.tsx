'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { donationConfig } from '@/data/donation'
import { Copy, Check, ExternalLink, Heart } from 'lucide-react'

function Github({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

export default function DonationCard() {
  const [copiedPix, setCopiedPix] = useState(false)
  const [copiedBtc, setCopiedBtc] = useState(false)
  const [showQRPix, setShowQRPix] = useState(false)

  async function handleCopyPix() {
    await navigator.clipboard.writeText(donationConfig.pixKey)
    setCopiedPix(true)
    setTimeout(() => setCopiedPix(false), 2000)
  }

  async function handleCopyBtc() {
    await navigator.clipboard.writeText(donationConfig.bitcoinAddress)
    setCopiedBtc(true)
    setTimeout(() => setCopiedBtc(false), 2000)
  }

  return (
    <div className="glass-card p-5 border-[rgba(52,211,153,0.2)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38BDF8]/20 to-[#34D399]/20 flex items-center justify-center">
          <Heart size={18} className="text-[#34D399]" />
        </div>
        <div>
          <h3 className="text-[#F8FAFC] font-semibold text-sm">Apoio opcional</h3>
          <p className="text-[#A7B4C2] text-xs">{donationConfig.authorName}</p>
        </div>
      </div>

      {/* Text */}
      <p className="text-[#A7B4C2] text-sm leading-relaxed">
        O Respira é gratuito, sem anúncios e sem coleta de dados.
        Se quiser apoiar o projeto, sua contribuição ajuda a manter isso vivo.
      </p>

      {/* Main Donation Container */}
      <div className="flex flex-col gap-4">
        
        {/* QR Code Section */}
        {showQRPix && (
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl animate-slide-in justify-center">
            <QRCodeSVG value={donationConfig.pixKey} size={150} level="M" />
            <span className="text-[#07111A] text-[10px] font-bold uppercase tracking-wider">Escaneie o Pix</span>
          </div>
        )}

        {/* Pix Box */}
        <div className="bg-[#0F1B24] p-4 rounded-2xl border border-[rgba(56,189,248,0.08)] flex flex-col gap-2.5">
          <span className="text-[#A7B4C2] text-[10px] font-bold uppercase tracking-wider">Chave Pix (Aleatória)</span>
          <div className="bg-[#162230] rounded-xl px-3.5 py-2.5 text-[#F8FAFC] text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap border border-[rgba(56,189,248,0.05)]">
            {donationConfig.pixKey}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyPix}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-[#38BDF8]/10 to-[#34D399]/10 border border-[rgba(52,211,153,0.15)] text-[#F8FAFC] text-xs font-semibold hover:border-[rgba(52,211,153,0.3)] transition-colors active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedPix ? (
                <>
                  <Check size={14} className="text-[#34D399]" />
                  <span className="text-[#34D399]">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-[#38BDF8]" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowQRPix(v => !v)}
              className="px-4 py-2.5 rounded-xl border border-[rgba(56,189,248,0.15)] text-[#A7B4C2] text-xs font-medium hover:text-[#F8FAFC] hover:border-[rgba(56,189,248,0.3)] transition-colors cursor-pointer"
            >
              {showQRPix ? 'Ocultar QR' : 'Ver QR'}
            </button>
          </div>
        </div>

        {/* Bitcoin Box */}
        <div className="bg-[#0F1B24] p-4 rounded-2xl border border-[rgba(56,189,248,0.08)] flex flex-col gap-2.5">
          <span className="text-[#A7B4C2] text-[10px] font-bold uppercase tracking-wider">Carteira Bitcoin</span>
          <div className="bg-[#162230] rounded-xl px-3.5 py-2.5 text-[#F8FAFC] text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap border border-[rgba(56,189,248,0.05)]">
            {donationConfig.bitcoinAddress}
          </div>
          <button
            type="button"
            onClick={handleCopyBtc}
            className="w-full py-2.5 rounded-xl bg-gradient-to-br from-[#38BDF8]/10 to-[#34D399]/10 border border-[rgba(52,211,153,0.15)] text-[#F8FAFC] text-xs font-semibold hover:border-[rgba(52,211,153,0.3)] transition-colors active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            {copiedBtc ? (
              <>
                <Check size={14} className="text-[#34D399]" />
                <span className="text-[#34D399]">Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-[#38BDF8]" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Divider */}
      <div className="h-[1px] bg-[rgba(56,189,248,0.1)] my-1" />

      {/* External links */}
      <div className="flex flex-col gap-2">
        {donationConfig.githubSponsors && (
          <a
            href={donationConfig.githubSponsors}
            target="_blank"
            rel="noopener noreferrer"
            id="link-github-sponsors"
            className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-[#162230] border border-[rgba(56,189,248,0.15)] text-[#A7B4C2] text-sm transition-colors hover:text-[#F8FAFC]"
          >
            <Github size={16} className="text-[#38BDF8]" />
            GitHub Sponsors
            <ExternalLink size={12} className="ml-auto opacity-50" />
          </a>
        )}
        <a
          href={donationConfig.authorGithub}
          target="_blank"
          rel="noopener noreferrer"
          id="link-github-profile"
          className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-[#162230] border border-[rgba(56,189,248,0.15)] text-[#A7B4C2] text-sm transition-colors hover:text-[#F8FAFC]"
        >
          <Github size={16} className="text-[#A7B4C2]" />
          GitHub (jamesismos)
          <ExternalLink size={12} className="ml-auto opacity-50" />
        </a>
      </div>
    </div>
  )
}
