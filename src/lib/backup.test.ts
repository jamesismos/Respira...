import { beforeEach, describe, expect, it } from 'vitest'
import type { AppData } from '@/types'
import { importBackup } from './backup'
import { clearAppData, loadAppData, saveAppData } from './storage'

function createData(): AppData {
  return {
    profile: null,
    settings: { theme: 'dark', hasCompletedOnboarding: false, notificationsEnabled: false, reminderTime: '20:00' },
    cravingLogs: [],
    relapseLogs: [],
    dailyLogs: [],
    version: '1.0.0',
    schemaVersion: 2,
  }
}

beforeEach(() => {
  localStorage.clear()
  clearAppData()
})

describe('backup', () => {
  it('recusa um backup incompleto sem substituir os dados atuais', async () => {
    expect(saveAppData(createData())).toBe(true)
    const original = localStorage.getItem('respira_data')
    const file = new File([JSON.stringify({ version: '1.0.0', settings: { theme: 'dark' } })], 'incompleto.json', { type: 'application/json' })

    const result = await importBackup(file)

    expect(result.success).toBe(false)
    expect(result.message).toMatch(/inválido|incompleto/i)
    expect(localStorage.getItem('respira_data')).toBe(original)
  })

  it('importa um backup legado válido e migra o esquema', async () => {
    const legacy = {
      version: '1.0.0',
      profile: null,
      settings: { theme: 'dark', hasCompletedOnboarding: false },
      cravingLogs: [],
      relapseLogs: [],
      dailyLogs: [],
    }
    const file = new File([JSON.stringify(legacy)], 'respira-backup.json', { type: 'application/json' })

    const result = await importBackup(file)

    expect(result.success).toBe(true)
    expect(loadAppData().schemaVersion).toBe(2)
    expect(loadAppData().settings.reminderTime).toBe('20:00')
  })

  it('rejeita JSON malformado', async () => {
    const file = new File(['{"version":'], 'quebrado.json', { type: 'application/json' })
    const result = await importBackup(file)
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/interpretar|JSON/i)
  })
})
