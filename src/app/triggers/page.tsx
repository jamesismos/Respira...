'use client'

import { useEffect, useState } from 'react'
import { loadAppData, addCravingLog, getStorageError } from '@/lib/storage'
import type { CravingLog } from '@/types'
import TriggerForm from '@/components/TriggerForm'
import BottomNav from '@/components/BottomNav'
import { defaultTriggers, moodOptions } from '@/data/triggers'
import DiaryDetailModal from '@/components/DiaryDetailModal'
import { Plus, BookOpen, CigaretteOff, Cigarette } from 'lucide-react'
import clsx from 'clsx'

export default function TriggersPage() {
  const [logs, setLogs] = useState<CravingLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<CravingLog | null>(null)

  function reload() {
    const data = loadAppData()
    setLogs(data.cravingLogs.slice(0, 50))
  }

  useEffect(() => { reload() }, [])

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
    setSuccessMessage('Gatilho registrado com sucesso! 💚')
    window.setTimeout(() => setSuccessMessage(null), 3000)
    reload()
  }

  function getTriggerLabel(id: string) {
    return defaultTriggers.find(t => t.id === id)?.label ?? id
  }

  function getTriggerEmoji(id: string) {
    return defaultTriggers.find(t => t.id === id)?.emoji ?? '💭'
  }

  function getMoodEmoji(id?: string) {
    return moodOptions.find(m => m.id === id)?.emoji ?? ''
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-[#07111A] flex flex-col pb-safe mb-nav">
      <div className="max-w-md mx-auto w-full px-5 pt-10 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-[#38BDF8]" />
              <h1 className="text-xl font-bold text-[#F8FAFC]">Diário de gatilhos</h1>
            </div>
            <p className="text-[#A7B4C2] text-sm mt-0.5">
              {logs.length > 0 ? `${logs.length} registros` : 'Nenhum registro ainda'}
            </p>
          </div>
          <button
            id="btn-new-trigger"
            onClick={() => setShowForm(true)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#34D399] flex items-center justify-center shadow-lg shadow-[#38BDF8]/25"
          >
            <Plus size={20} className="text-white" />
          </button>
        </div>

        {saveError && <p role="alert" className="rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 p-3 text-sm text-[#FDA4AF]">{saveError}</p>}

        {/* Success message toast */}
        {successMessage && (
          <div className="bg-[rgba(52,211,153,0.1)] text-[#34D399] border border-[rgba(52,211,153,0.2)] p-3.5 rounded-xl text-sm font-medium animate-float-up flex items-center justify-center gap-2">
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form inline */}
        {showForm && (
          <div className="glass-card p-5 animate-slide-in">
            <h2 className="text-[#F8FAFC] font-semibold mb-4">Novo registro</h2>
            <TriggerForm onSave={handleSave} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Empty state */}
        {logs.length === 0 && !showForm && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0F1B24] border border-[rgba(56,189,248,0.15)] flex items-center justify-center">
              <BookOpen size={28} className="text-[#A7B4C2]" />
            </div>
            <div>
              <p className="text-[#F8FAFC] font-medium">Nenhum gatilho registrado</p>
              <p className="text-[#A7B4C2] text-sm mt-1">
                Quando bater vontade, registre aqui.
                <br />
                Com o tempo, padrões ficam claros.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#34D399] text-white font-medium text-sm"
            >
              Registrar primeiro gatilho
            </button>
          </div>
        )}

        {/* Log list */}
        {logs.length > 0 && (
          <div className="flex flex-col gap-3">
            {logs.map(log => (
              <button
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={clsx(
                  'glass-card p-4 flex gap-3 w-full text-left cursor-pointer active:scale-[0.98] transition-transform',
                  log.resisted
                    ? 'border-[rgba(52,211,153,0.15)]'
                    : 'border-[rgba(251,113,133,0.15)]'
                )}
              >
                <div className="text-2xl shrink-0 pt-0.5">{getTriggerEmoji(log.trigger)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[#F8FAFC] font-medium text-sm truncate">
                      {getTriggerLabel(log.trigger)}
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      {log.resisted
                        ? <CigaretteOff size={14} className="text-[#34D399]" />
                        : <Cigarette size={14} className="text-[#FB7185]" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#A7B4C2] text-xs">{formatDate(log.timestamp)}</span>
                    {log.mood && <span className="text-xs">{getMoodEmoji(log.mood)}</span>}
                    {/* Intensity dots */}
                    <div className="flex gap-0.5 ml-auto">
                      {[1,2,3,4,5].map(n => (
                        <div
                          key={n}
                          className={clsx(
                            'w-1.5 h-1.5 rounded-full',
                            n <= log.intensity ? 'bg-[#38BDF8]' : 'bg-[#162230]'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  {log.notes && (
                    <p className="text-[#A7B4C2] text-xs mt-1.5 line-clamp-2">{log.notes}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedLog && (
        <DiaryDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}

      <BottomNav />
    </div>
  )
}
