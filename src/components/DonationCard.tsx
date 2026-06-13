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

// Helper function to calculate CRC16 CCITT (checksum for EMV Pix payload)
function crc16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const hex = (crc & 0xFFFF).toString(16).toUpperCase();
  return hex.padStart(4, '0');
}

// Generates the official EMV Pix BR Code string that banking apps can scan
function generatePixPayload(key: string, name: string): string {
  const cleanKey = key.trim();
  const cleanName = name.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25); // remove accents
  
  const gui = '0014br.gov.bcb.pix';
  const keyField = `01${String(cleanKey.length).padStart(2, '0')}${cleanKey}`;
  const merchantAccount = `26${String(gui.length + keyField.length).padStart(2, '0')}${gui}${keyField}`;
  
  const mcc = '52040000';
  const currency = '5303986'; // BRL
  const country = '5802BR';
  
  const nameField = `59${String(cleanName.length).padStart(2, '0')}${cleanName}`;
  const cityField = '6009SAO PAULO'; // Default city
  const additionalData = '62070503***';
  
  const payloadBeforeCRC = `000201010211${merchantAccount}${mcc}${currency}${country}${nameField}${cityField}${additionalData}6304`;
  const checksum = crc16(payloadBeforeCRC);
  return `${payloadBeforeCRC}${checksum}`;
}

export default function DonationCard() {
  const [copiedPix, setCopiedPix] = useState(false)
  const [copiedBtc, setCopiedBtc] = useState(false)
  const [showQRPix, setShowQRPix] = useState(false)
  const [showQRBtc, setShowQRBtc] = useState(false)

  async function handleCopyPix() {
    const payload = generatePixPayload(donationConfig.pixKey, donationConfig.authorName)
    await navigator.clipboard.writeText(payload)
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
        
        {/* QR Code Section - Pix */}
        {showQRPix && (
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl animate-slide-in justify-center">
            <QRCodeSVG value={generatePixPayload(donationConfig.pixKey, donationConfig.authorName)} size={150} level="M" />
            <span className="text-[#07111A] text-[10px] font-bold uppercase tracking-wider">Escaneie o Pix</span>
          </div>
        )}

        {/* QR Code Section - Bitcoin */}
        {showQRBtc && (
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl animate-slide-in justify-center">
            <QRCodeSVG value={`bitcoin:${donationConfig.bitcoinAddress}`} size={150} level="M" />
            <span className="text-[#07111A] text-[10px] font-bold uppercase tracking-wider">Escaneie o Bitcoin</span>
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
              onClick={() => {
                setShowQRPix(v => !v)
                setShowQRBtc(false)
              }}
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
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyBtc}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-br from-[#38BDF8]/10 to-[#34D399]/10 border border-[rgba(52,211,153,0.15)] text-[#F8FAFC] text-xs font-semibold hover:border-[rgba(52,211,153,0.3)] transition-colors active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
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
            <button
              type="button"
              onClick={() => {
                setShowQRBtc(v => !v)
                setShowQRPix(false)
              }}
              className="px-4 py-2.5 rounded-xl border border-[rgba(56,189,248,0.15)] text-[#A7B4C2] text-xs font-medium hover:text-[#F8FAFC] hover:border-[rgba(56,189,248,0.3)] transition-colors cursor-pointer"
            >
              {showQRBtc ? 'Ocultar QR' : 'Ver QR'}
            </button>
          </div>
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
