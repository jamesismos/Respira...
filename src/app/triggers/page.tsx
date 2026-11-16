'use client'

import { useEffect, useState } from 'react'
import { loadAppData, addCravingLog, getStorageError } from '@/lib/storage'
import type { CravingLog, RelapseLog, UserProfile } from '@/types'
import TriggerForm from '@/components/TriggerForm'
import BottomNav from '@/components/BottomNav'
import DiaryDetailModal from '@/components/DiaryDetailModal'
import { defaultTriggers, locationOptions, moodOptions } from '@/data/triggers'
import { getReportAvailability, buildReportInsights } from '@/lib/report'
import {
  Activity,
  BarChart3,
  BookOpen,
  CalendarDays,
  Cigarette,
  Clock3,
  FileDown,
  MapPin,
  Plus,
  Target,
} from 'lucide-react'

const timeLabels: Record<string, string> = {
  madrugada: 'Madrugada, 0h às 5h',
  manha: 'Manhã, 6h às 11h',
  tarde: 'Tarde, 12h às 17h',
  noite: 'Noite, 18h às 23h',
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TriggersPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [logs, setLogs] = useState<CravingLog[]>([])
  const [relapseLogs, setRelapseLogs] = useState<RelapseLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<CravingLog | null>(null)

  function reload() {
    const data = loadAppData()
    setProfile(data.profile)
    setLogs([...data.cravingLogs].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)))
    setRelapseLogs([...data.relapseLogs].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)))
  }

  useEffect(() => {
    reload()
  }, [])

  function handleSave(log: Omit<CravingLog, 'id' | 'timestamp'>) {
    setSaveError(null)
    const entry: CravingLog = {
      ...log,
      id: 'craving-' + Date.now(),
      timestamp: new Date().toISOString(),
    }

    if (!addCravingLog(entry)) {
      setSaveError(getStorageError() || 'Não foi possível salvar o registro. Tente novamente.')
      return
    }

    setShowForm(false)
    setSuccessMessage('Registro salvo. Ele ajudará a identificar seus padrões.')
    window.setTimeout(() => setSuccessMessage(null), 3500)
    reload()
  }

  if (!profile) return null

  const availability = getReportAvailability(profile.startDate)
  const insights = buildReportInsights(logs)
  const maxTriggerCount = insights.triggers[0]?.count || 1
  const exportMessage = availability.recommendedComplete
    ? 'Você completou 30 dias de acompanhamento. O relatório já pode ser exportado.'
    : availability.canExport
      ? 'O relatório já pode ser exportado. Continue registrando para enriquecer a análise.'
      : 'A exportação será liberada após 7 dias completos. O período de 30 dias oferece uma visão mais consistente.'
  const moodRows = insights.moods.map(item => ({
    ...item,
    label: moodOptions.find(option => option.id === item.key)?.label || item.key,
    emoji: moodOptions.find(option => option.id === item.key)?.emoji || '•',
  }))
  const locationRows = insights.locations.map(item => ({
    ...item,
    label: locationOptions.find(option => option.id === item.key)?.label || item.key,
    emoji: locationOptions.find(option => option.id === item.key)?.emoji || '•',
  }))

  return (
    <div className="min-h-[100dvh] bg-[#07111A] flex flex-col pb-safe mb-nav">
      <main className="page-shell page-shell--wide px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between no-print">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-[#38BDF8]" />
              <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC]">Relatório pessoal</h1>
            </div>
            <p className="text-[#A7B4C2] text-sm mt-1">
              Entenda o que desperta a vontade e em quais momentos ela aparece.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={!availability.canExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileDown size={17} />
            Exportar relatório em PDF
          </button>
        </div>

        <section className="glass-card p-4 sm:p-5 no-print" aria-labelledby="report-guidance-title">
          <div className="flex items-start gap-3">
            <CalendarDays size={20} className="text-[#38BDF8] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h2 id="report-guidance-title" className="text-[#F8FAFC] font-semibold">Construa seu relatório com os registros do dia a dia</h2>
              <p className="text-[#A7B4C2] text-sm leading-relaxed mt-1">{exportMessage}</p>
              <p className="text-[#A7B4C2] text-xs leading-relaxed mt-2">
                Registre cada vontade, mesmo quando conseguir resistir. Anote o gatilho, o horário, o humor, o local e o que estava acontecendo.
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                <span className="text-[#A7B4C2]">Dia {availability.daysUsed} do acompanhamento</span>
                <span className="text-[#38BDF8] font-semibold">{availability.progressPercent}% de 30 dias</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#162230] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399]" style={{ width: availability.progressPercent + '%' }} />
              </div>
              {!availability.canExport && (
                <p className="text-[#64748B] text-xs mt-2">
                  Faltam {availability.daysUntilExport} {availability.daysUntilExport === 1 ? 'dia' : 'dias'} completos para liberar a exportação.
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="no-print flex flex-col gap-3">
          <button
            id="btn-new-trigger"
            type="button"
            onClick={() => setShowForm(current => !current)}
            className="w-full sm:w-fit inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(56,189,248,0.25)] bg-[#0F1B24] px-4 py-3 text-sm font-semibold text-[#F8FAFC]"
          >
            <Plus size={18} className="text-[#38BDF8]" />
            {showForm ? 'Fechar registro' : 'Registrar uma vontade ou situação'}
          </button>
          {saveError && <p role="alert" className="rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 p-3 text-sm text-[#FDA4AF]">{saveError}</p>}
          {successMessage && (
            <p role="status" className="rounded-xl border border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.1)] p-3 text-sm text-[#34D399]">
              {successMessage}
            </p>
          )}
          {showForm && (
            <div className="glass-card p-4 sm:p-5">
              <h2 className="text-[#F8FAFC] font-semibold mb-1">Registrar um momento</h2>
              <p className="text-[#A7B4C2] text-xs mb-4">O horário é registrado automaticamente. Preencha o que lembrar.</p>
              <TriggerForm onSave={handleSave} onCancel={() => setShowForm(false)} />
            </div>
          )}
        </div>

        <div id="report-print-area" className="flex flex-col gap-5">
          <header className="report-print-section">
            <p className="text-[#38BDF8] text-xs font-semibold uppercase tracking-[0.16em]">Respira | Uma vontade de cada vez</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-2">Relatório de acompanhamento</h2>
            <p className="text-[#A7B4C2] text-sm mt-2">
              Período iniciado em {formatDate(profile.startDate)}. Gerado em {formatDateTime(new Date().toISOString())}.
            </p>
          </header>

          <section className="report-print-card report-print-section glass-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} className="text-[#34D399]" />
              <h3 className="font-semibold text-[#F8FAFC]">Seu ponto de partida</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#07111A]/70 p-3">
                <p className="text-[#A7B4C2] text-xs">Motivo para parar</p>
                <p className="text-[#F8FAFC] text-sm font-semibold mt-1">{profile.quitReason || 'Não informado'}</p>
              </div>
              <div className="rounded-xl bg-[#07111A]/70 p-3">
                <p className="text-[#A7B4C2] text-xs">Consumo anterior</p>
                <p className="text-[#F8FAFC] text-sm font-semibold mt-1">{profile.cigarettesPerDay} cigarros por dia</p>
              </div>
              <div className="rounded-xl bg-[#07111A]/70 p-3">
                <p className="text-[#A7B4C2] text-xs">Acompanhamento</p>
                <p className="text-[#F8FAFC] text-sm font-semibold mt-1">{availability.elapsedDays} dias completos</p>
              </div>
            </div>
          </section>

          <section className="report-print-section">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 size={18} className="text-[#38BDF8]" />
              <h3 className="font-semibold text-[#F8FAFC]">Resumo dos registros</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="report-print-card glass-card p-4">
                <p className="text-[#A7B4C2] text-xs">Vontades registradas</p>
                <p className="text-3xl font-bold text-[#F8FAFC] mt-1">{insights.total}</p>
              </div>
              <div className="report-print-card glass-card p-4">
                <p className="text-[#A7B4C2] text-xs">Resistiu</p>
                <p className="text-3xl font-bold text-[#34D399] mt-1">{insights.resisted}</p>
              </div>
              <div className="report-print-card glass-card p-4">
                <p className="text-[#A7B4C2] text-xs">Fumou</p>
                <p className="text-3xl font-bold text-[#F8FAFC] mt-1">{insights.smoked}</p>
              </div>
              <div className="report-print-card glass-card p-4">
                <p className="text-[#A7B4C2] text-xs">Intensidade média</p>
                <p className="text-3xl font-bold text-[#F8FAFC] mt-1">{insights.total ? insights.averageIntensity + '/5' : 'Não há dados'}</p>
              </div>
            </div>
            <p className="text-[#A7B4C2] text-xs mt-3">
              Taxa de resistência: {insights.total ? insights.resistanceRate + '%' : 'Sem registros suficientes'} das vontades registradas.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="report-print-card report-print-section glass-card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={17} className="text-[#FBBF24]" />
                <h3 className="font-semibold text-[#F8FAFC]">O que mais desperta vontade</h3>
              </div>
              {insights.triggers.length ? (
                <div className="flex flex-col gap-3">
                  {insights.triggers.slice(0, 6).map(item => {
                    const option = defaultTriggers.find(trigger => trigger.id === item.key)
                    return (
                      <div key={item.key} className="flex items-center gap-3">
                        <span className="text-lg">{option?.emoji || '•'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2 text-sm">
                            <span className="text-[#F8FAFC]">{option?.label || item.key}</span>
                            <span className="text-[#A7B4C2] shrink-0">{item.count} vezes</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#162230] mt-1 overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#38BDF8] to-[#34D399]" style={{ width: Math.round(item.count / maxTriggerCount * 100) + '%' }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : <p className="text-[#A7B4C2] text-sm">Os gatilhos aparecerão aqui conforme você registrar suas vontades.</p>}
            </section>

            <section className="report-print-card report-print-section glass-card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock3 size={17} className="text-[#38BDF8]" />
                <h3 className="font-semibold text-[#F8FAFC]">Em quais horários</h3>
              </div>
              {insights.timePeriods.length ? (
                <div className="flex flex-col gap-3">
                  {['madrugada', 'manha', 'tarde', 'noite'].map(key => {
                    const item = insights.timePeriods.find(period => period.key === key)
                    if (!item) return null
                    return (
                      <div key={key} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-[#F8FAFC]">{timeLabels[key]}</span>
                        <span className="text-[#A7B4C2] shrink-0">{item.count} vezes</span>
                      </div>
                    )
                  })}
                </div>
              ) : <p className="text-[#A7B4C2] text-sm">Os horários serão identificados automaticamente em cada registro.</p>}
            </section>

            <section className="report-print-card report-print-section glass-card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={17} className="text-[#34D399]" />
                <h3 className="font-semibold text-[#F8FAFC]">Como você se sentia</h3>
              </div>
              {moodRows.length ? (
                <div className="flex flex-col gap-2">
                  {moodRows.map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#F8FAFC]">{item.emoji} {item.label}</span>
                      <span className="text-[#A7B4C2]">{item.count} vezes</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-[#A7B4C2] text-sm">O humor aparecerá aqui quando for informado nos registros.</p>}
            </section>

            <section className="report-print-card report-print-section glass-card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={17} className="text-[#38BDF8]" />
                <h3 className="font-semibold text-[#F8FAFC]">Onde acontecia</h3>
              </div>
              {locationRows.length ? (
                <div className="flex flex-col gap-2">
                  {locationRows.map(item => (
                    <div key={item.key} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-[#F8FAFC]">{item.emoji} {item.label}</span>
                      <span className="text-[#A7B4C2]">{item.count} vezes</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-[#A7B4C2] text-sm">O local será incluído quando você preencher esse campo.</p>}
            </section>
          </div>

          <section className="report-print-section">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-[#38BDF8]" />
              <h3 className="font-semibold text-[#F8FAFC]">Histórico de vontades e momentos</h3>
            </div>
            {logs.length ? (
              <div className="flex flex-col gap-3">
                {logs.map(log => {
                  const trigger = defaultTriggers.find(item => item.id === log.trigger)
                  const mood = moodOptions.find(item => item.id === log.mood)
                  const location = locationOptions.find(item => item.id === log.where)
                  return (
                    <article key={log.id} className="report-print-card report-print-entry glass-card p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-2xl">{trigger?.emoji || '•'}</span>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#F8FAFC]">{trigger?.label || log.trigger}</p>
                            <p className="text-[#A7B4C2] text-xs mt-1">{formatDateTime(log.timestamp)}</p>
                          </div>
                        </div>
                        <span className={log.resisted ? 'text-[#34D399] text-xs font-semibold' : 'text-[#F8FAFC] text-xs font-semibold'}>
                          {log.resisted ? 'Resistiu' : 'Fumou'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
                        <div className="rounded-lg bg-[#07111A]/70 p-2">
                          <p className="text-[#64748B]">Intensidade</p>
                          <p className="text-[#F8FAFC] mt-1">{log.intensity}/5</p>
                        </div>
                        <div className="rounded-lg bg-[#07111A]/70 p-2">
                          <p className="text-[#64748B]">Humor</p>
                          <p className="text-[#F8FAFC] mt-1">{mood?.label || 'Não informado'}</p>
                        </div>
                        <div className="rounded-lg bg-[#07111A]/70 p-2">
                          <p className="text-[#64748B]">Local</p>
                          <p className="text-[#F8FAFC] mt-1">{location?.label || (log.where || 'Não informado')}</p>
                        </div>
                        <div className="rounded-lg bg-[#07111A]/70 p-2">
                          <p className="text-[#64748B]">Duração</p>
                          <p className="text-[#F8FAFC] mt-1">{log.durationMinutes ? log.durationMinutes + ' min' : 'Não informada'}</p>
                        </div>
                      </div>
                      {log.notes && (
                        <div className="mt-3">
                          <p className="text-[#64748B] text-xs">O que estava acontecendo</p>
                          <p className="text-[#F8FAFC] text-sm mt-1 whitespace-pre-wrap">{log.notes}</p>
                        </div>
                      )}
                      <button type="button" onClick={() => setSelectedLog(log)} className="no-print mt-3 text-xs text-[#38BDF8] underline underline-offset-4">
                        Ver registro completo
                      </button>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="report-print-card glass-card p-5">
                <p className="text-[#F8FAFC] font-medium">Ainda não há registros.</p>
                <p className="text-[#A7B4C2] text-sm mt-1">
                  Registre também as vontades que você conseguiu atravessar. Elas ajudam a revelar padrões e estratégias que funcionam.
                </p>
              </div>
            )}
          </section>

          <section className="report-print-section">
            <div className="flex items-center gap-2 mb-3">
              <Cigarette size={18} className="text-[#FBBF24]" />
              <h3 className="font-semibold text-[#F8FAFC]">Registros de recaída</h3>
            </div>
            {relapseLogs.length ? (
              <div className="flex flex-col gap-3">
                {relapseLogs.map(log => {
                  const mood = moodOptions.find(item => item.id === log.mood)
                  const location = locationOptions.find(item => item.id === log.where)
                  return (
                    <article key={log.id} className="report-print-card report-print-entry glass-card p-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <p className="font-semibold text-[#F8FAFC]">{formatDateTime(log.timestamp)}</p>
                        <span className="text-[#A7B4C2] text-xs">{log.wasAutomatic ? 'Registro automático' : 'Registro manual'}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 text-xs">
                        <div className="rounded-lg bg-[#07111A]/70 p-2">
                          <p className="text-[#64748B]">Local</p>
                          <p className="text-[#F8FAFC] mt-1">{location?.label || log.where || 'Não informado'}</p>
                        </div>
                        <div className="rounded-lg bg-[#07111A]/70 p-2">
                          <p className="text-[#64748B]">Humor</p>
                          <p className="text-[#F8FAFC] mt-1">{mood?.label || log.mood || 'Não informado'}</p>
                        </div>
                        <div className="rounded-lg bg-[#07111A]/70 p-2">
                          <p className="text-[#64748B]">Sequência anterior</p>
                          <p className="text-[#F8FAFC] mt-1">{log.previousStreakDays} dias e {log.previousStreakHours} horas</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-[#64748B] text-xs">O que aconteceu</p>
                        <p className="text-[#F8FAFC] text-sm mt-1 whitespace-pre-wrap">{log.whatHappened || 'Não informado'}</p>
                      </div>
                      {log.whatCouldHelp && (
                        <div className="mt-3">
                          <p className="text-[#64748B] text-xs">O que pode ajudar na próxima vez</p>
                          <p className="text-[#F8FAFC] text-sm mt-1 whitespace-pre-wrap">{log.whatCouldHelp}</p>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            ) : <p className="text-[#A7B4C2] text-sm">Nenhuma recaída registrada neste período.</p>}
          </section>

          <footer className="report-print-section border-t border-[rgba(56,189,248,0.15)] pt-4">
            <p className="text-[#A7B4C2] text-xs leading-relaxed">
              Este relatório reúne somente informações registradas por você neste dispositivo. Os horários são obtidos automaticamente no momento do registro. Os dados não são enviados para gerar o relatório.
            </p>
            <p className="text-[#64748B] text-xs mt-2">
              O Respira é uma ferramenta de apoio e não substitui acompanhamento profissional.
            </p>
          </footer>
        </div>

        <div className="no-print rounded-xl border border-[rgba(56,189,248,0.15)] bg-[#0F1B24] p-3">
          <p className="text-[#A7B4C2] text-xs leading-relaxed">
            A exportação abre a janela de impressão do dispositivo. Escolha “Salvar como PDF”. O arquivo é criado localmente.
          </p>
          {!availability.canExport && (
            <p className="text-[#64748B] text-xs mt-2">
              Você poderá exportar após completar uma semana de uso.
            </p>
          )}
        </div>
      </main>

      {selectedLog && <DiaryDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
      <BottomNav />
    </div>
  )
}
