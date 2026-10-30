'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStorageError, loadAppData, saveAppData } from '@/lib/storage'
import { formatDateTimeLocal, parseDateTimeLocal } from '@/lib/dates'
import { defaultTriggers, quitReasons } from '@/data/triggers'
import type { UserProfile } from '@/types'
import clsx from 'clsx'
import { ChevronRight, ChevronLeft, Leaf, Wallet, HeartPulse, Cigarette } from 'lucide-react'
import { formatCurrency } from '@/lib/stats'

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
  const [saveError, setSaveError] = useState<string | null>(null)
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
  const cigarettesPerDay = Number(form.cigarettesPerDay)
  const packPrice = Number(form.packPrice)
  const cigarettesPerPack = Number(form.cigarettesPerPack)
  const dailySmokingCost = cigarettesPerPack > 0
    ? (cigarettesPerDay / cigarettesPerPack) * packPrice
    : 0
  const monthlySmokingCost = dailySmokingCost * 30
  const annualSmokingCost = dailySmokingCost * 365
  const annualCigarettes = Math.round(cigarettesPerDay * 365)

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
    setSaveError(null)
    const cigarettesPerDay = Number(form.cigarettesPerDay)
    const packPrice = Number(form.packPrice)
    const cigarettesPerPack = Number(form.cigarettesPerPack)
    const lastSmoked = form.lastSmoked || new Date().toISOString()

    if (!Number.isFinite(cigarettesPerDay) || cigarettesPerDay <= 0 || cigarettesPerDay > 200) {
      setSaveError('Informe uma quantidade válida de cigarros por dia.')
      return
    }
    if (!Number.isFinite(packPrice) || packPrice <= 0 || !Number.isFinite(cigarettesPerPack) || cigarettesPerPack <= 0) {
      setSaveError('Confira o preço do maço e a quantidade de cigarros.')
      return
    }
    if (!Number.isFinite(Date.parse(lastSmoked)) || Date.parse(lastSmoked) > Date.now()) {
      setSaveError('Confira a data e o horário do último cigarro.')
      return
    }

    const profile: UserProfile = {
      cigarettesPerDay,
      packPrice,
      cigarettesPerPack,
      lastSmoked,
      quitReason: form.quitReason,
      triggers: form.selectedTriggers,
      mode: 'quit',
      startDate: new Date().toISOString(),
    }
    const current = loadAppData()
    const saved = saveAppData({
      ...current,
      profile,
      settings: { ...current.settings, hasCompletedOnboarding: true },
    })
    if (!saved) {
      setSaveError(getStorageError() || 'Não foi possível salvar seus dados. Tente novamente.')
      return
    }
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
        {saveError && <p role="alert" className="mb-4 rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 p-3 text-sm text-[#FDA4AF]">{saveError}</p>}
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
                Sem conta. Seus registros pessoais ficam no dispositivo. O app registra visualizações de páginas via Vercel Analytics.
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
                value={form.lastSmoked ? formatDateTimeLocal(new Date(form.lastSmoked)) : ''}
                onChange={e => setForm(f => ({ ...f, lastSmoked: parseDateTimeLocal(e.target.value) || '' }))}
                max={formatDateTimeLocal(new Date())}
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

        {/* ── APRESENTAÇÃO DO RESPIRA ── */}
        {step === 'done' && (
          <div className="flex-1 flex flex-col gap-5 animate-float-up pb-8">
            <div className="flex flex-col items-center text-center gap-3 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#34D399] flex items-center justify-center shadow-xl shadow-[#38BDF8]/20">
                <Leaf size={32} className="text-white" />
              </div>
              <p className="text-[#34D399] text-xs font-semibold uppercase tracking-[0.18em]">Antes de começar</p>
              <h2 className="text-3xl font-bold text-[#F8FAFC]">O que é o Respira?</h2>
              <p className="text-[#A7B4C2] text-sm leading-relaxed">
                O Respira é um app gratuito para apoiar você a parar de fumar, uma vontade de cada vez.
                A ideia é ajudar a interromper o ciclo da dependência da nicotina e reduzir a exposição
                contínua à fumaça do tabaco — sem culpa e sem pressão.
              </p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wallet size={18} className="text-[#38BDF8]" />
                <h3 className="text-[#F8FAFC] font-semibold">Quanto esse hábito representa no bolso</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#07111A]/70 p-3">
                  <p className="text-[#A7B4C2] text-xs">Em 30 dias</p>
                  <p className="text-2xl font-bold text-[#F8FAFC] mt-1">{formatCurrency(monthlySmokingCost)}</p>
                </div>
                <div className="rounded-xl bg-[#07111A]/70 p-3">
                  <p className="text-[#A7B4C2] text-xs">Em um ano</p>
                  <p className="text-2xl font-bold text-[#F8FAFC] mt-1">{formatCurrency(annualSmokingCost)}</p>
                </div>
              </div>
              <p className="text-[#64748B] text-xs mt-3">
                Estimativa com base no consumo e no preço informados, mantendo o mesmo padrão por 30 ou 365 dias.
              </p>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <HeartPulse size={18} className="text-[#FB7185]" />
                <h3 className="text-[#F8FAFC] font-semibold">O impacto vai além do dinheiro</h3>
              </div>
              <p className="text-[#A7B4C2] text-sm leading-relaxed">
                O tabagismo aumenta o risco de doenças cardiovasculares, doenças respiratórias crônicas
                e diversos tipos de câncer. Isso não é uma previsão sobre o que vai acontecer com você:
                é um alerta sobre riscos associados ao consumo de tabaco.
              </p>
              <div className="mt-4 rounded-xl bg-[#07111A]/70 p-3 flex items-center gap-3">
                <Cigarette size={20} className="text-[#FBBF24] shrink-0" />
                <p className="text-sm text-[#F8FAFC]">
                  No padrão informado, seriam cerca de{' '}
                  <strong>{new Intl.NumberFormat('pt-BR').format(annualCigarettes)} cigarros por ano</strong>.
                </p>
              </div>
              <a
                href="https://www.gov.br/inca/pt-br/assuntos/causas-e-prevencao-do-cancer/tabagismo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs text-[#38BDF8] underline underline-offset-2 mt-3"
              >
                Fonte: Instituto Nacional de Câncer (INCA)
              </a>
            </div>

            <div className="rounded-xl border border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.06)] p-4">
              <p className="text-[#F8FAFC] text-sm font-semibold">Como o Respira vai ajudar</p>
              <p className="text-[#A7B4C2] text-sm leading-relaxed mt-1">
                Você poderá acompanhar o tempo sem fumar, o dinheiro economizado e os cigarros evitados.
                Quando a vontade aparecer, terá o SOS para atravessar aquele momento. Seus registros
                pessoais continuam salvos no seu dispositivo. Para entender o uso do app, o Vercel Analytics registra visualizações de páginas; seus dados de tabagismo não são enviados.
              </p>
              {form.quitReason && (
                <p className="text-[#34D399] text-xs mt-3">
                  Seu motivo para começar: {form.quitReason}.
                </p>
              )}
            </div>

            <p className="text-[#64748B] text-xs text-center leading-relaxed">
              O Respira é uma ferramenta de apoio, não um tratamento médico e não substitui acompanhamento
              profissional. O SUS oferece tratamento para quem deseja parar de fumar.
            </p>

            <button
              id="btn-onboarding-done"
              onClick={finish}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-bold text-lg shadow-lg shadow-[#38BDF8]/25"
            >
              Começar minha jornada
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
