'use client'

import type { CravingLog } from '@/types'
import { defaultTriggers, moodOptions } from '@/data/triggers'
import { CigaretteOff, Cigarette, X, Clock, Flame, MessageCircle } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  log: CravingLog
  onClose: () => void
}

export default function DiaryDetailModal({ log, onClose }: Props) {
  const trigger = defaultTriggers.find(t => t.id === log.trigger)
  const mood = moodOptions.find(m => m.id === log.mood)

  const date = new Date(log.timestamp)
  const formattedDate = date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#0F1B24] rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 border border-[rgba(56,189,248,0.15)] max-h-[85vh] overflow-y-auto animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{trigger?.emoji ?? '💭'}</span>
            <div>
              <h2 className="text-[#F8FAFC] font-bold text-lg">{trigger?.label ?? log.trigger}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                {log.resisted ? (
                  <span className="flex items-center gap-1 text-[#34D399] text-xs font-medium">
                    <CigaretteOff size={12} /> Resistiu
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#FB7185] text-xs font-medium">
                    <Cigarette size={12} /> Fumou
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#162230] flex items-center justify-center text-[#A7B4C2] hover:text-[#F8FAFC] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Info rows */}
        <div className="flex flex-col gap-3">
          {/* Date/time */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#07111A]">
            <Clock size={16} className="text-[#38BDF8] shrink-0" />
            <div>
              <p className="text-[#F8FAFC] text-sm font-medium capitalize">{formattedDate}</p>
              <p className="text-[#A7B4C2] text-xs">{formattedTime}</p>
            </div>
          </div>

          {/* Intensity */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#07111A]">
            <Flame size={16} className="text-[#FBBF24] shrink-0" />
            <div className="flex-1">
              <p className="text-[#A7B4C2] text-xs mb-1.5">Intensidade</p>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(n => (
                  <div
                    key={n}
                    className={clsx(
                      'w-8 h-2 rounded-full transition-colors',
                      n <= log.intensity ? 'bg-gradient-to-r from-[#38BDF8] to-[#34D399]' : 'bg-[#162230]'
                    )}
                  />
                ))}
              </div>
              <p className="text-[#A7B4C2] text-xs mt-1">
                {log.intensity <= 2 ? 'Leve' : log.intensity <= 3 ? 'Moderada' : 'Forte'}
              </p>
            </div>
          </div>

          {/* Mood */}
          {mood && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#07111A]">
              <span className="text-xl shrink-0">{mood.emoji}</span>
              <div>
                <p className="text-[#A7B4C2] text-xs">Humor</p>
                <p className="text-[#F8FAFC] text-sm font-medium">{mood.label}</p>
              </div>
            </div>
          )}

          {/* Duration */}
          {log.durationMinutes != null && log.durationMinutes > 0 && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#07111A]">
              <Clock size={16} className="text-[#A7B4C2] shrink-0" />
              <div>
                <p className="text-[#A7B4C2] text-xs">Durou</p>
                <p className="text-[#F8FAFC] text-sm font-medium">{log.durationMinutes} minutos</p>
              </div>
            </div>
          )}

          {/* Notes */}
          {log.notes && (
            <div className="flex gap-3 p-3 rounded-xl bg-[#07111A]">
              <MessageCircle size={16} className="text-[#A7B4C2] shrink-0 mt-0.5" />
              <div>
                <p className="text-[#A7B4C2] text-xs mb-1">Anotação</p>
                <p className="text-[#F8FAFC] text-sm leading-relaxed whitespace-pre-wrap">{log.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
