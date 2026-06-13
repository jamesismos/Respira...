'use client'

import { useState } from 'react'
import { defaultTriggers, moodOptions } from '@/data/triggers'
import type { CravingLog } from '@/types'
import clsx from 'clsx'

interface TriggerFormProps {
  onSave: (log: Omit<CravingLog, 'id' | 'timestamp'>) => void
  onCancel?: () => void
  resisted?: boolean
}

export default function TriggerForm({ onSave, onCancel, resisted = true }: TriggerFormProps) {
  const [trigger, setTrigger] = useState('')
  const [mood, setMood] = useState('')
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [didResist, setDidResist] = useState(resisted)
  const [notes, setNotes] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ trigger, mood, intensity, resisted: didResist, notes: notes || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Gatilho */}
      <div>
        <label className="block text-[#A7B4C2] text-sm font-medium mb-2">O que ativou?</label>
        <div className="grid grid-cols-3 gap-2">
          {defaultTriggers.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTrigger(t.id)}
              className={clsx(
                'flex flex-col items-center gap-1 p-2.5 rounded-xl border text-xs transition-all duration-150',
                trigger === t.id
                  ? 'border-[#38BDF8] bg-[rgba(56,189,248,0.1)] text-[#38BDF8]'
                  : 'border-[rgba(56,189,248,0.15)] text-[#A7B4C2] active:bg-[#162230]'
              )}
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="leading-tight text-center">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Humor */}
      <div>
        <label className="block text-[#A7B4C2] text-sm font-medium mb-2">Como você estava?</label>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMood(m.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-150',
                mood === m.id
                  ? 'border-[#34D399] bg-[rgba(52,211,153,0.1)] text-[#34D399]'
                  : 'border-[rgba(56,189,248,0.15)] text-[#A7B4C2]'
              )}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Intensidade */}
      <div>
        <label className="block text-[#A7B4C2] text-sm font-medium mb-2">
          Intensidade da vontade: <span className="text-[#38BDF8] font-bold">{intensity}/5</span>
        </label>
        <div className="flex gap-3">
          {([1, 2, 3, 4, 5] as const).map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setIntensity(n)}
              className={clsx(
                'flex-1 h-10 rounded-xl font-bold text-sm transition-all duration-150',
                intensity === n
                  ? 'bg-gradient-to-br from-[#38BDF8] to-[#34D399] text-white shadow-lg'
                  : 'bg-[#162230] text-[#A7B4C2]'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Resistiu? */}
      <div>
        <label className="block text-[#A7B4C2] text-sm font-medium mb-2">Resultado</label>
        <div className="flex gap-3">
          {[
            { value: true, label: '💚 Resistiu', color: '#34D399' },
            { value: false, label: '🌿 Fumou', color: '#FB7185' },
          ].map(opt => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => setDidResist(opt.value)}
              style={didResist === opt.value ? { borderColor: opt.color, color: opt.color } : {}}
              className={clsx(
                'flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150',
                didResist === opt.value
                  ? 'bg-[rgba(52,211,153,0.08)]'
                  : 'border-[rgba(56,189,248,0.15)] text-[#A7B4C2]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Observação */}
      <div>
        <label className="block text-[#A7B4C2] text-sm font-medium mb-2">
          Observação <span className="text-[#64748B]">(opcional)</span>
        </label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="O que mais você quer lembrar sobre esse momento?"
          rows={2}
          className="w-full bg-[#162230] border border-[rgba(56,189,248,0.15)] rounded-xl px-4 py-3 text-[#F8FAFC] placeholder-[#64748B] text-sm resize-none focus:outline-none focus:border-[#38BDF8] transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-[rgba(56,189,248,0.15)] text-[#A7B4C2] text-sm font-medium"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={!trigger}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold text-sm disabled:opacity-40 transition-opacity active:scale-[0.98]"
        >
          Salvar registro
        </button>
      </div>
    </form>
  )
}
