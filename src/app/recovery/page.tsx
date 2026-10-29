'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { clearAppData, getStorageError, loadAppData } from '@/lib/storage'
import BackupControls from '@/components/BackupControls'

export default function RecoveryPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    loadAppData()
    setError(getStorageError())
  }, [])

  function resetCorruptData() {
    if (!clearAppData()) {
      setError(getStorageError() || 'Não foi possível apagar os dados locais.')
      return
    }
    router.replace('/onboarding')
  }

  return (
    <main className="min-h-screen bg-[#07111A] px-5 py-12 text-[#F8FAFC]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBBF24]/10 text-[#FBBF24]">
            <AlertTriangle size={24} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Recuperar dados</h1>
            <p className="text-sm text-[#A7B4C2]">Respira</p>
          </div>
        </div>

        <section className="glass-card p-5">
          <h2 className="font-semibold">O armazenamento local precisa de atenção.</h2>
          <p className="mt-2 text-sm leading-6 text-[#A7B4C2]">
            O Respira encontrou dados inválidos e bloqueou novas gravações para evitar sobrescrever o conteúdo original. Nenhum dado foi enviado a um servidor.
          </p>
          {error && <p role="alert" className="mt-3 rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/10 p-3 text-sm text-[#FDA4AF]">{error}</p>}
        </section>

        <section className="glass-card p-5 flex flex-col gap-3">
          <h2 className="font-semibold">1. Restaurar um backup</h2>
          <p className="text-sm leading-6 text-[#A7B4C2]">
            Se você exportou um backup JSON, importe-o abaixo. O arquivo será validado antes de substituir os dados locais.
          </p>
          <BackupControls showExport={false} />
        </section>

        <section className="glass-card p-5 flex flex-col gap-3">
          <h2 className="font-semibold">2. Começar do zero</h2>
          <p className="text-sm leading-6 text-[#A7B4C2]">
            Use esta opção somente se não tiver um backup ou não quiser recuperar o histórico atual. A ação apaga os dados locais do Respira neste navegador.
          </p>
          {!confirmReset ? (
            <button type="button" onClick={() => setConfirmReset(true)} className="rounded-xl border border-[#FB7185]/30 px-4 py-3 text-sm font-semibold text-[#FDA4AF]">
              Apagar dados corrompidos
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirmReset(false)} className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-[#A7B4C2]">
                Cancelar
              </button>
              <button type="button" onClick={resetCorruptData} className="flex-1 rounded-xl bg-[#FB7185] px-4 py-3 text-sm font-semibold text-white">
                Confirmar exclusão
              </button>
            </div>
          )}
        </section>

        <p className="flex items-start gap-2 text-xs leading-5 text-[#64748B]">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          Seus dados ficam neste navegador. Para evitar perdas, exporte backups periodicamente e guarde-os em local privado.
        </p>
      </div>
    </main>
  )
}
