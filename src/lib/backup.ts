// ============================================================
// Respira — Backup: Export & Import
// ============================================================

import type { AppData } from '@/types'
import { loadAppData, saveAppData } from './storage'

export function exportBackup(): void {
  const data = loadAppData()
  const exportData: AppData = {
    ...data,
    exportedAt: new Date().toISOString(),
  }
  const json = JSON.stringify(exportData, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().split('T')[0]
  a.href = url
  a.download = `respira-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importBackup(file: File): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string
        const data = JSON.parse(raw) as AppData
        // Validação mínima
        if (!data.version || !data.settings) {
          resolve({ success: false, message: 'Arquivo inválido ou corrompido.' })
          return
        }
        saveAppData(data)
        resolve({ success: true, message: 'Backup restaurado com sucesso! 💚' })
      } catch {
        resolve({ success: false, message: 'Não foi possível ler o arquivo.' })
      }
    }
    reader.readAsText(file)
  })
}
