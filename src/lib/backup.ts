// ============================================================
// Respira — Backup: exportação e restauração validadas
// ============================================================

import type { AppData } from '@/types'
import { getStorageError, isStorageRecoveryRequired, loadAppData, saveAppData, validateAndMigrateAppData } from './storage'
import { localDateKey } from './dates'

export interface BackupResult {
  success: boolean
  message: string
}

export function exportBackup(): BackupResult {
  try {
    const data = loadAppData()
    if (isStorageRecoveryRequired()) {
      return { success: false, message: getStorageError() || 'Os dados locais precisam ser recuperados antes da exportação.' }
    }

    const exportData: AppData = { ...data, exportedAt: new Date().toISOString() }
    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'respira-backup-' + localDateKey(new Date()) + '.json'
    a.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    return { success: true, message: 'Backup exportado. Guarde o arquivo em local privado.' }
  } catch {
    return { success: false, message: 'Não foi possível exportar o backup neste navegador.' }
  }
}

export function importBackup(file: File): Promise<BackupResult> {
  return new Promise((resolve) => {
    if (!file || file.size === 0) {
      resolve({ success: false, message: 'Selecione um arquivo JSON não vazio.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      resolve({ success: false, message: 'O arquivo excede o limite de 5 MB.' })
      return
    }
    if (!file.name.toLowerCase().endsWith('.json')) {
      resolve({ success: false, message: 'Selecione um arquivo com extensão .json.' })
      return
    }

    const reader = new FileReader()
    reader.onerror = () => resolve({ success: false, message: 'O navegador não conseguiu ler esse arquivo.' })
    reader.onabort = () => resolve({ success: false, message: 'A leitura do arquivo foi cancelada.' })
    reader.onload = (event) => {
      try {
        const raw = event.target?.result
        if (typeof raw !== 'string') {
          resolve({ success: false, message: 'O conteúdo do arquivo não é texto válido.' })
          return
        }

        const parsed: unknown = JSON.parse(raw)
        const normalized = validateAndMigrateAppData(parsed)
        if (!normalized) {
          resolve({ success: false, message: 'Backup inválido, incompleto ou incompatível. Os dados atuais foram preservados.' })
          return
        }

        const saved = saveAppData(normalized, { allowReplaceCorrupt: true })
        if (!saved) {
          resolve({ success: false, message: getStorageError() || 'Não foi possível restaurar o backup neste navegador.' })
          return
        }

        resolve({ success: true, message: 'Backup validado e restaurado. 💚' })
      } catch {
        resolve({ success: false, message: 'Não foi possível interpretar o JSON. Os dados atuais foram preservados.' })
      }
    }

    try {
      reader.readAsText(file)
    } catch {
      resolve({ success: false, message: 'Não foi possível iniciar a leitura do arquivo.' })
    }
  })
}
