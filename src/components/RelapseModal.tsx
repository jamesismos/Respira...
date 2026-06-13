'use client'

import { useState } from 'react'
import { moodOptions } from '@/data/triggers'
import clsx from 'clsx'

interface RelapseFormData {
  whatHappened: string
  mood: string
  where: string
  wasAutomatic: boolean
  whatCouldHelp: string
}

interface RelapseModalProps {
  currentStreakDays: number
  currentStreakHours: number
  onConfirm: (data: RelapseFormData) => void
  onCancel: () => void
}

const whereOptions = [
  { id: 'casa', label: '🏠 Em casa' },
  { id: 'trabalho', label: '💼 No trabalho' },
  { id: 'social', label: '👥 Com amigos' },
  { id: 'sozinho', label: '🚶 Sozinho(a)' },
  { id: 'bar', label: '🍺 Bar/festa' },
  { id: 'carro', label: '🚗 No carro' },
  { id: 'outro', label: '📍 Outro lugar' },
]

export default function RelapseModal({ currentStreakDays, currentStreakHours, onConfirm, onCancel }: RelapseModalProps) {
  const [step, setStep] = useState<'confirm' | 'form' | 'done'>('confirm')
  const [data, setData] = useState<RelapseFormData>({
    whatHappened: '',
    mood: '',
    where: '',
    wasAutomatic: true,
    whatCouldHelp: '',
  })

  function handleConfirm() {
    if (!data.whatHappened || !data.mood || !data.where) return
    onConfirm(data)
    setStep('done')
  }

  if (step === 'confirm') {
    return (
      <div className="flex flex-col gap-6 animate-slide-in">
        {/* Header — sem vermelho, sem drama */}
        <div className="text-center">
          <div className="text-4xl mb-3">🌿</div>
          <h2 className="text-xl font-bold text-[#F8FAFC]">Tudo bem.</h2>
          <p className="text-[#A7B4C2] mt-2 leading-relaxed">
            Isso não apaga seu esforço.{' '}
            {currentStreakDays > 0 || currentStreakHours > 0
              ? `Você ficou ${currentStreakDays}d ${currentStreakHours}h sem fumar. Esse tempo é seu.`
              : 'Cada tentativa conta. Cada uma.'}
          </p>
        </div>

        <div className="glass-card p-4 text-center border-[rgba(52,211,153,0.2)]">
          <p className="text-[#A7B4C2] text-sm">
            Vamos entender o que aconteceu e recomeçar melhor.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-xl border border-[rgba(56,189,248,0.2)] text-[#A7B4C2] text-sm font-medium"
          >
            Voltar
          </button>
          <button
            onClick={() => setStep('form')}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold text-sm"
          >
            Entender o que aconteceu
          </button>
        </div>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div className="flex flex-col gap-5 animate-slide-in">
        <h2 className="text-lg font-bold text-[#F8FAFC]">O que aconteceu?</h2>

        {/* O que aconteceu */}
        <div>
          <label className="block text-[#A7B4C2] text-sm mb-2">Conte um pouco</label>
          <textarea
            value={data.whatHappened}
            onChange={e => setData(d => ({ ...d, whatHappened: e.target.value }))}
            placeholder="Sem julgamento. O que estava acontecendo?"
            rows={3}
            className="w-full bg-[#162230] border border-[rgba(56,189,248,0.15)] rounded-xl px-4 py-3 text-[#F8FAFC] placeholder-[#64748B] text-sm resize-none focus:outline-none focus:border-[#38BDF8] transition-colors"
          />
        </div>

        {/* Humor */}
        <div>
          <label className="block text-[#A7B4C2] text-sm mb-2">Como você estava?</label>
          <div className="flex flex-wrap gap-2">
            {moodOptions.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setData(d => ({ ...d, mood: m.id }))}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all',
                  data.mood === m.id
                    ? 'border-[#34D399] bg-[rgba(52,211,153,0.1)] text-[#34D399]'
                    : 'border-[rgba(56,189,248,0.15)] text-[#A7B4C2]'
                )}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Onde */}
        <div>
          <label className="block text-[#A7B4C2] text-sm mb-2">Onde você estava?</label>
          <div className="grid grid-cols-2 gap-2">
            {whereOptions.map(w => (
              <button
                key={w.id}
                type="button"
                onClick={() => setData(d => ({ ...d, where: w.id }))}
                className={clsx(
                  'py-2.5 px-3 rounded-xl border text-xs text-left transition-all',
                  data.where === w.id
                    ? 'border-[#38BDF8] bg-[rgba(56,189,248,0.1)] text-[#38BDF8]'
                    : 'border-[rgba(56,189,248,0.15)] text-[#A7B4C2]'
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        {/* Automático? */}
        <div>
          <label className="block text-[#A7B4C2] text-sm mb-2">Foi automático ou planejado?</label>
          <div className="flex gap-3">
            {[
              { value: true, label: '⚡ Automático' },
              { value: false, label: '🤔 Planejado' },
            ].map(opt => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setData(d => ({ ...d, wasAutomatic: opt.value }))}
                className={clsx(
                  'flex-1 py-2.5 rounded-xl border text-sm transition-all',
                  data.wasAutomatic === opt.value
                    ? 'border-[#38BDF8] bg-[rgba(56,189,248,0.1)] text-[#38BDF8]'
                    : 'border-[rgba(56,189,248,0.15)] text-[#A7B4C2]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* O que pode ajudar */}
        <div>
          <label className="block text-[#A7B4C2] text-sm mb-2">
            O que pode ajudar na próxima vez? <span className="text-[#64748B]">(opcional)</span>
          </label>
          <textarea
            value={data.whatCouldHelp}
            onChange={e => setData(d => ({ ...d, whatCouldHelp: e.target.value }))}
            placeholder="Respirar, beber água, sair do ambiente..."
            rows={2}
            className="w-full bg-[#162230] border border-[rgba(56,189,248,0.15)] rounded-xl px-4 py-3 text-[#F8FAFC] placeholder-[#64748B] text-sm resize-none focus:outline-none focus:border-[#38BDF8] transition-colors"
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={!data.whatHappened || !data.mood || !data.where}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold disabled:opacity-40 transition-opacity"
        >
          Registrar e recomeçar
        </button>
      </div>
    )
  }

  return null
}
