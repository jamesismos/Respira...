'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveProfile, completeOnboarding } from '@/lib/storage'
import { defaultTriggers, quitReasons } from '@/data/triggers'
import type { UserProfile } from '@/types'
import clsx from 'clsx'
import { ChevronRight, ChevronLeft, Leaf } from 'lucide-react'

// ─── Steps ───────────────────────────────────────────────────

type StepId =
  | 'welcome'
  | 'cigarettes-per-day'
  | 'pack-price'
  | 'cigarettes-per-pack'
  | 'last-smoked'
  | 'quit-reason'
  | 'triggers'
  | 'done'

const STEP_ORDER: StepId[] = [
  'welcome',
  'cigarettes-per-day',
  'pack-price',
  'cigarettes-per-pack',
  'last-smoked',
  'quit-reason',
  'triggers',
  'done',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<StepId>('welcome')
  const [form, setForm] = useState({
    cigarettesPerDay: '',
    packPrice: '',
    cigarettesPerPack: '20',
    lastSmoked: '',
    quitReason: '',
    selectedTriggers: [] as string[],
  })

  const stepIndex = STEP_ORDER.indexOf(step)
  const totalSteps = STEP_ORDER.length - 2 // exclude welcome and done

  function next() {
    const nextIndex = stepIndex + 1
    if (nextIndex < STEP_ORDER.length) setStep(STEP_ORDER[nextIndex])
  }

  function back() {
    const prevIndex = stepIndex - 1
    if (prevIndex >= 0) setStep(STEP_ORDER[prevIndex])
  }

  function toggleTrigger(id: string) {
    setForm(f => ({
      ...f,
      selectedTriggers: f.selectedTriggers.includes(id)
        ? f.selectedTriggers.filter(t => t !== id)
        : [...f.selectedTriggers, id],
    }))
  }

  function finish() {
    const profile: UserProfile = {
      cigarettesPerDay: Number(form.cigarettesPerDay),
      packPrice: Number(form.packPrice),
      cigarettesPerPack: Number(form.cigarettesPerPack),
      lastSmoked: form.lastSmoked || new Date().toISOString(),
      quitReason: form.quitReason,
      triggers: form.selectedTriggers,
      mode: 'quit',
      startDate: new Date().toISOString(),
    }
    saveProfile(profile)
    completeOnboarding()
    router.replace('/home')
  }

  // ─── Progress bar ──────────────────────────────────────────
  const showProgress = step !== 'welcome' && step !== 'done'
  const progressValue = showProgress
    ? ((STEP_ORDER.indexOf(step) - 1) / totalSteps) * 100
    : 0

  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col">
      {/* Top progress bar */}
      {showProgress && (
        <div className="h-1 bg-[#162230]">
          <div
            className="h-full bg-gradient-to-r from-[#38BDF8] to-[#34D399] transition-all duration-500"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8">
        {/* Back button */}
        {step !== 'welcome' && step !== 'done' && (
          <button
            onClick={back}
            className="flex items-center gap-1 text-[#A7B4C2] text-sm mb-8 w-fit"
          >
            <ChevronLeft size={18} /> Voltar
          </button>
        )}

        {/* ── WELCOME ── */}
        {step === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-float-up">
            <div className="flex flex-col items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/respira_app_icon.png"
                alt="Respira"
                className="w-24 h-24 rounded-3xl shadow-xl shadow-[#38BDF8]/20"
              />
              <div className="text-center">
                <h1 className="text-4xl font-bold gradient-text">Respira.</h1>
                <p className="text-[#A7B4C2] text-base mt-2">Uma vontade de cada vez.</p>
              </div>
            </div>

            <div className="glass-card p-5 text-center">
              <p className="text-[#F8FAFC] leading-relaxed text-sm">
                Um espaço só seu. Sem julgamento, sem pressão.
                <br />
                Aqui você vai no seu ritmo.
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={next}
                id="btn-onboarding-start"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold text-base shadow-lg shadow-[#38BDF8]/25 active:scale-[0.98] transition-transform"
              >
                Começar
              </button>
              <p className="text-center text-[#64748B] text-xs">
                Sem conta. Sem dados enviados. Tudo fica aqui.
              </p>
            </div>
          </div>
        )}

        {/* ── CIGARETTES PER DAY ── */}
        {step === 'cigarettes-per-day' && (
          <div className="flex-1 flex flex-col gap-8 animate-float-up">
            <div>
              <p className="text-[#A7B4C2] text-sm">Pergunta 1 de {totalSteps}</p>
              <h2 className="text-2xl font-bold text-[#F8FAFC] mt-2">
                Quantos cigarros você fumava por dia?
              </h2>
              <p className="text-[#A7B4C2] text-sm mt-1">Uma estimativa está ótima.</p>
            </div>

            <div className="flex flex-col gap-3">
              {[5, 10, 15, 20, 30, 40].map(n => (
                <button
                  key={n}
                  onClick={() => {
                    setForm(f => ({ ...f, cigarettesPerDay: String(n) }))
                    next()
                  }}
                  className={clsx(
                    'py-4 rounded-xl border text-left px-5 transition-all',
                    form.cigarettesPerDay === String(n)
                      ? 'border-[#38BDF8] bg-[rgba(56,189,248,0.1)] text-[#38BDF8]'
                      : 'border-[rgba(56,189,248,0.15)] text-[#F8FAFC]'
                  )}
                >
                  <span className="font-semibold">{n} cigarros</span>
                  {n === 20 && <span className="text-[#A7B4C2] text-sm ml-2">— 1 maço</span>}
                  {n === 40 && <span className="text-[#A7B4C2] text-sm ml-2">— 2 maços</span>}
                </button>
              ))}
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Outro número..."
                  value={form.cigarettesPerDay && ![5,10,15,20,30,40].includes(Number(form.cigarettesPerDay)) ? form.cigarettesPerDay : ''}
                  onChange={e => setForm(f => ({ ...f, cigarettesPerDay: e.target.value }))}
                  className="flex-1 bg-[#162230] border border-[rgba(56,189,248,0.15)] rounded-xl px-4 py-3 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#38BDF8]"
                />
                <button
                  onClick={next}
                  disabled={!form.cigarettesPerDay}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-medium disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── PACK PRICE ── */}
        {step === 'pack-price' && (
          <div className="flex-1 flex flex-col gap-8 animate-float-up">
            <div>
              <p className="text-[#A7B4C2] text-sm">Pergunta 2 de {totalSteps}</p>
              <h2 className="text-2xl font-bold text-[#F8FAFC] mt-2">
                Quanto custa o maço que você fumava?
              </h2>
              <p className="text-[#A7B4C2] text-sm mt-1">Isso ajuda a calcular o dinheiro economizado.</p>
            </div>

            <div className="flex flex-col gap-3">
              {[8, 10, 12, 15, 18, 20].map(n => (
                <button
                  key={n}
                  onClick={() => {
                    setForm(f => ({ ...f, packPrice: String(n) }))
                    next()
                  }}
                  className={clsx(
                    'py-4 rounded-xl border text-left px-5 transition-all',
                    form.packPrice === String(n)
                      ? 'border-[#38BDF8] bg-[rgba(56,189,248,0.1)] text-[#38BDF8]'
                      : 'border-[rgba(56,189,248,0.15)] text-[#F8FAFC]'
                  )}
                >
                  R$ {n},00
                </button>
              ))}
              <div className="flex gap-2 items-center mt-1">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A7B4C2] text-sm">R$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.50"
                    placeholder="Outro valor..."
                    value={form.packPrice && ![8,10,12,15,18,20].includes(Number(form.packPrice)) ? form.packPrice : ''}
                    onChange={e => setForm(f => ({ ...f, packPrice: e.target.value }))}
                    className="w-full bg-[#162230] border border-[rgba(56,189,248,0.15)] rounded-xl pl-10 pr-4 py-3 text-[#F8FAFC] placeholder-[#64748B] text-sm focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
                <button
                  onClick={next}
                  disabled={!form.packPrice}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-medium disabled:opacity-40"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── CIGARETTES PER PACK ── */}
        {step === 'cigarettes-per-pack' && (
          <div className="flex-1 flex flex-col gap-8 animate-float-up">
            <div>
              <p className="text-[#A7B4C2] text-sm">Pergunta 3 de {totalSteps}</p>
              <h2 className="text-2xl font-bold text-[#F8FAFC] mt-2">
                Quantos cigarros vêm no maço?
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {[20, 25].map(n => (
                <button
                  key={n}
                  onClick={() => {
                    setForm(f => ({ ...f, cigarettesPerPack: String(n) }))
                    next()
                  }}
                  className={clsx(
                    'py-4 rounded-xl border text-left px-5 transition-all',
                    form.cigarettesPerPack === String(n)
                      ? 'border-[#38BDF8] bg-[rgba(56,189,248,0.1)] text-[#38BDF8] font-semibold'
                      : 'border-[rgba(56,189,248,0.15)] text-[#F8FAFC]'
                  )}
                >
                  {n} cigarros {n === 20 && '— padrão'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── LAST SMOKED ── */}
        {step === 'last-smoked' && (
          <div className="flex-1 flex flex-col gap-8 animate-float-up">
            <div>
              <p className="text-[#A7B4C2] text-sm">Pergunta 4 de {totalSteps}</p>
              <h2 className="text-2xl font-bold text-[#F8FAFC] mt-2">
                Quando foi o último cigarro?
              </h2>
              <p className="text-[#A7B4C2] text-sm mt-1">O contador começa a partir daqui.</p>
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="datetime-local"
                value={form.lastSmoked ? new Date(form.lastSmoked).toISOString().slice(0, 16) : ''}
                onChange={e => setForm(f => ({ ...f, lastSmoked: new Date(e.target.value).toISOString() }))}
                max={new Date().toISOString().slice(0, 16)}
                className="w-full bg-[#162230] border border-[rgba(56,189,248,0.15)] rounded-xl px-4 py-3.5 text-[#F8FAFC] text-sm focus:outline-none focus:border-[#38BDF8] [color-scheme:dark]"
              />
              <button
                onClick={() => {
                  setForm(f => ({ ...f, lastSmoked: new Date().toISOString() }))
                  next()
                }}
                className="py-3 rounded-xl border border-[rgba(56,189,248,0.2)] text-[#A7B4C2] text-sm"
              >
                Agora mesmo
              </button>
              <button
                onClick={next}
                disabled={!form.lastSmoked}
                className="py-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold disabled:opacity-40"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* ── QUIT REASON ── */}
        {step === 'quit-reason' && (
          <div className="flex-1 flex flex-col gap-8 animate-float-up">
            <div>
              <p className="text-[#A7B4C2] text-sm">Pergunta 5 de {totalSteps}</p>
              <h2 className="text-2xl font-bold text-[#F8FAFC] mt-2">
                Qual é o seu principal motivo para parar?
              </h2>
              <p className="text-[#A7B4C2] text-sm mt-1">Esse motivo vai aparecer nos momentos difíceis.</p>
            </div>
            <div className="flex flex-col gap-2">
              {quitReasons.map(reason => (
                <button
                  key={reason}
                  onClick={() => {
                    setForm(f => ({ ...f, quitReason: reason }))
                    next()
                  }}
                  className={clsx(
                    'py-3.5 rounded-xl border text-left px-5 transition-all text-sm',
                    form.quitReason === reason
                      ? 'border-[#34D399] bg-[rgba(52,211,153,0.1)] text-[#34D399]'
                      : 'border-[rgba(56,189,248,0.15)] text-[#F8FAFC]'
                  )}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TRIGGERS ── */}
        {step === 'triggers' && (
          <div className="flex-1 flex flex-col gap-8 animate-float-up">
            <div>
              <p className="text-[#A7B4C2] text-sm">Pergunta 6 de {totalSteps}</p>
              <h2 className="text-2xl font-bold text-[#F8FAFC] mt-2">
                Quais são seus principais gatilhos?
              </h2>
              <p className="text-[#A7B4C2] text-sm mt-1">Selecione quantos quiser. Você pode editar depois.</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {defaultTriggers.filter(t => t.id !== 'outro').map(t => (
                <button
                  key={t.id}
                  onClick={() => toggleTrigger(t.id)}
                  className={clsx(
                    'flex flex-col items-center gap-1 p-3 rounded-xl border text-xs transition-all',
                    form.selectedTriggers.includes(t.id)
                      ? 'border-[#38BDF8] bg-[rgba(56,189,248,0.1)] text-[#38BDF8]'
                      : 'border-[rgba(56,189,248,0.15)] text-[#A7B4C2]'
                  )}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="leading-tight text-center">{t.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={next}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-semibold"
            >
              {form.selectedTriggers.length > 0 ? `Continuar (${form.selectedTriggers.length} selecionados)` : 'Pular'}
            </button>
          </div>
        )}

        {/* ── DONE ── */}
        {step === 'done' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-float-up text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#34D399] flex items-center justify-center shadow-xl shadow-[#38BDF8]/30">
              <Leaf size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#F8FAFC]">Pronto.</h2>
              <p className="text-[#A7B4C2] mt-2 leading-relaxed">
                O contador começa agora.
                <br />
                Uma vontade de cada vez.
              </p>
            </div>
            <button
              id="btn-onboarding-done"
              onClick={finish}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-bold text-lg shadow-lg shadow-[#38BDF8]/25"
            >
              Abrir o Respira 💚
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
