'use client'

import { useState } from 'react'
import { addCravingLog } from '@/lib/storage'
import type { CravingLog } from '@/types'
import TimerBreathing from '@/components/TimerBreathing'
import MotivationalPhrase from '@/components/MotivationalPhrase'
import TriggerForm from '@/components/TriggerForm'
import BottomNav from '@/components/BottomNav'
import { sosCompletionPhrases } from '@/data/phrases'
import { ArrowLeft, Droplets, Wind, Footprints, CheckCircle } from 'lucide-react'
import Link from 'next/link'

// ── Fluxo SOS ─────────────────────────────────────────────
// Bateu vontade → Respira 3min → Frase → Dicas → Gatilho → Passei
type SOSPhase = 'breathing' | 'phrase' | 'tips' | 'log' | 'done'

const tips = [
  { icon: Droplets, label: 'Beba água', desc: 'Um copo de água agora.' },
  { icon: Wind, label: 'Muda o ambiente', desc: 'Sai da sala, abre a janela.' },
  { icon: Footprints, label: 'Anda um pouco', desc: 'Uns 2 minutos é suficiente.' },
]

export default function SOSPage() {
  const [phase, setPhase] = useState<SOSPhase>('breathing')
  const [completionPhrase] = useState(
    () => sosCompletionPhrases[Math.floor(Math.random() * sosCompletionPhrases.length)]
  )

  function handleTimerComplete() {
    setPhase('phrase')
  }

  function handleSaveTrigger(log: Omit<CravingLog, 'id' | 'timestamp'>) {
    const entry: CravingLog = {
      ...log,
      id: `craving-${Date.now()}`,
      timestamp: new Date().toISOString(),
      resisted: true,
    }
    addCravingLog(entry)
    setPhase('done')
  }

  function handleSkipLog() {
    // Still counts as resisted — just no details
    const entry: CravingLog = {
      id: `craving-${Date.now()}`,
      timestamp: new Date().toISOString(),
      trigger: 'outro',
      intensity: 3,
      resisted: true,
    }
    addCravingLog(entry)
    setPhase('done')
  }

  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col pb-safe mb-nav">
      <div className="max-w-md mx-auto w-full flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-8 pb-4">
          <Link href="/home" id="btn-sos-back" className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0F1B24] border border-[rgba(56,189,248,0.15)]">
            <ArrowLeft size={18} className="text-[#A7B4C2]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#F8FAFC]">SOS Vontade</h1>
            <p className="text-[#A7B4C2] text-xs">
              {phase === 'breathing' && 'Respira. Só isso agora.'}
              {phase === 'phrase' && 'Você está atravessando.'}
              {phase === 'tips' && 'Muda o ambiente.'}
              {phase === 'log' && 'O que ativou isso?'}
              {phase === 'done' && 'Você conseguiu. 💚'}
            </p>
          </div>
        </div>

        {/* ── FASE: BREATHING ── */}
        {phase === 'breathing' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 animate-float-up">
            <div className="text-center">
              <p className="text-[#A7B4C2] text-sm leading-relaxed">
                Você não precisa vencer a vida inteira agora.
                <br />
                <span className="text-[#38BDF8] font-medium">Só os próximos 3 minutos.</span>
              </p>
            </div>

            <TimerBreathing totalSeconds={180} onComplete={handleTimerComplete} />

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleTimerComplete}
                className="w-full py-3 rounded-xl text-[#A7B4C2] text-sm border border-[rgba(56,189,248,0.15)] active:bg-[#162230] transition-colors"
              >
                Avançar sem timer
              </button>
            </div>
          </div>
        )}

        {/* ── FASE: PHRASE ── */}
        {phase === 'phrase' && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-10 animate-float-up">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#38BDF8]/20 to-[#34D399]/20 border border-[#34D399]/40 flex items-center justify-center animate-breathe">
              <span className="text-2xl">🍃</span>
            </div>

            <div className="glass-card p-6 w-full border-[rgba(52,211,153,0.2)]">
              <MotivationalPhrase className="text-lg font-medium leading-relaxed" interval={10000} />
            </div>

            <div className="flex flex-col gap-3 w-full">
              <button
                id="btn-sos-to-tips"
                onClick={() => setPhase('tips')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold shadow-lg shadow-[#38BDF8]/25"
              >
                Continua aqui ↓
              </button>
              <button
                onClick={() => setPhase('breathing')}
                className="text-[#A7B4C2] text-sm text-center underline underline-offset-4"
              >
                Ainda estou com vontade — voltar à respiração
              </button>
            </div>
          </div>
        )}

        {/* ── FASE: TIPS ── */}
        {phase === 'tips' && (
          <div className="flex-1 flex flex-col px-6 py-6 gap-8 animate-float-up">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#F8FAFC]">Muda o estado.</h2>
              <p className="text-[#A7B4C2] text-sm mt-1">Pequenas ações quebram o ciclo da fissura.</p>
            </div>

            <div className="flex flex-col gap-3">
              {tips.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8]/20 to-[#34D399]/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#38BDF8]" />
                  </div>
                  <div>
                    <p className="text-[#F8FAFC] font-medium text-sm">{label}</p>
                    <p className="text-[#A7B4C2] text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button
                id="btn-sos-to-log"
                onClick={() => setPhase('log')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold"
              >
                Registrar o que aconteceu
              </button>
              <button
                onClick={handleSkipLog}
                className="text-[#A7B4C2] text-sm text-center underline underline-offset-4"
              >
                Pular registro
              </button>
            </div>
          </div>
        )}

        {/* ── FASE: LOG ── */}
        {phase === 'log' && (
          <div className="flex-1 flex flex-col px-6 py-4 overflow-y-auto animate-float-up">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#F8FAFC]">Registrar o gatilho</h2>
              <p className="text-[#A7B4C2] text-sm mt-1">
                Entender o que ativou a vontade ajuda na próxima vez.
              </p>
            </div>
            <TriggerForm
              resisted={true}
              onSave={handleSaveTrigger}
              onCancel={handleSkipLog}
            />
          </div>
        )}

        {/* ── FASE: DONE ── */}
        {phase === 'done' && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8 animate-float-up text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#34D399] flex items-center justify-center shadow-xl shadow-[#34D399]/30">
                <CheckCircle size={40} className="text-white" />
              </div>
              {/* Sparkles */}
              <div className="absolute -top-1 -right-1 text-xl animate-bounce">✨</div>
              <div className="absolute -bottom-1 -left-1 text-lg animate-bounce" style={{ animationDelay: '0.2s' }}>🍃</div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#F8FAFC]">{completionPhrase}</h2>
              <p className="text-[#A7B4C2] mt-3 leading-relaxed text-sm">
                Mais uma vontade atravessada.
                <br />
                Esse momento é seu.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Link
                href="/home"
                id="btn-sos-done-home"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold text-center block"
              >
                Voltar ao início
              </Link>
              <Link
                href="/progress"
                id="btn-sos-done-progress"
                className="w-full py-3 rounded-2xl border border-[rgba(56,189,248,0.2)] text-[#A7B4C2] text-sm text-center block"
              >
                Ver meu progresso
              </Link>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
