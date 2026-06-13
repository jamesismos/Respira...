'use client'

import { useRef, useState } from 'react'
import { exportBackup, importBackup } from '@/lib/backup'
import { Download, Upload, Check, AlertCircle } from 'lucide-react'

export default function BackupControls() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null)

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await importBackup(file)
    setImportStatus(result)
    if (result.success) {
      setTimeout(() => window.location.reload(), 1500)
    }
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        id="btn-export-backup"
        onClick={exportBackup}
        className="flex items-center gap-3 w-full py-3.5 px-4 rounded-xl bg-[#162230] border border-[rgba(56,189,248,0.15)] text-[#F8FAFC] text-sm font-medium transition-colors active:bg-[#1e2f3f]"
      >
        <Download size={18} className="text-[#38BDF8]" />
        Exportar backup (.json)
      </button>

      <button
        id="btn-import-backup"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-3 w-full py-3.5 px-4 rounded-xl bg-[#162230] border border-[rgba(56,189,248,0.15)] text-[#F8FAFC] text-sm font-medium transition-colors active:bg-[#1e2f3f]"
      >
        <Upload size={18} className="text-[#34D399]" />
        Importar backup (.json)
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />

      {importStatus && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
            importStatus.success
              ? 'bg-[rgba(52,211,153,0.1)] text-[#34D399] border border-[rgba(52,211,153,0.2)]'
              : 'bg-[rgba(251,113,133,0.1)] text-[#FB7185] border border-[rgba(251,113,133,0.2)]'
          }`}
        >
          {importStatus.success ? <Check size={16} /> : <AlertCircle size={16} />}
          {importStatus.message}
        </div>
      )}
    </div>
  )
}
