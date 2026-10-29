import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AppData, CravingLog, RelapseLog, UserProfile } from '@/types'
import {
  addCravingLog,
  clearAppData,
  getStorageError,
  isStorageRecoveryRequired,
  loadAppData,
  recordRelapse,
  saveAppData,
  validateAndMigrateAppData,
} from './storage'

function createProfile(lastSmoked = new Date(Date.now() - 4 * 86400000).toISOString()): UserProfile {
  return {
    cigarettesPerDay: 20,
    packPrice: 10,
    cigarettesPerPack: 20,
    lastSmoked,
    quitReason: 'Saúde',
    triggers: ['estresse'],
    mode: 'quit',
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
  }
}

function createData(profile: UserProfile | null = null): AppData {
  return {
    profile,
    settings: { theme: 'dark', hasCompletedOnboarding: Boolean(profile), notificationsEnabled: false, reminderTime: '20:00' },
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

describe('persistência local', () => {
  it('salva e lê dados válidos', () => {
    const data = createData(createProfile())
    expect(saveAppData(data)).toBe(true)
    expect(loadAppData().profile?.cigarettesPerDay).toBe(20)
  })

  it('migra dados antigos sem schemaVersion sem perder o perfil', () => {
    const legacy = createData(createProfile())
    const raw = { ...legacy } as Record<string, unknown>
    delete raw.schemaVersion
    localStorage.setItem('respira_data', JSON.stringify(raw))

    const migrated = loadAppData()
    expect(migrated.schemaVersion).toBe(2)
    expect(migrated.profile?.cigarettesPerDay).toBe(20)
    expect(JSON.parse(localStorage.getItem('respira_data') || '{}').schemaVersion).toBe(2)
  })

  it('bloqueia gravações quando o JSON local está corrompido e preserva o conteúdo original', () => {
    const corrupted = '{"profile":'
    localStorage.setItem('respira_data', corrupted)

    expect(loadAppData().profile).toBeNull()
    expect(isStorageRecoveryRequired()).toBe(true)
    expect(saveAppData(createData())).toBe(false)
    expect(localStorage.getItem('respira_data')).toBe(corrupted)
    expect(getStorageError()).toMatch(/corrompidos|proteger/i)

    expect(clearAppData()).toBe(true)
    expect(isStorageRecoveryRequired()).toBe(false)
  })

  it('retorna erro explícito quando o navegador falha ao gravar', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota excedida', 'QuotaExceededError')
    })
    expect(saveAppData(createData())).toBe(false)
    expect(getStorageError()).toMatch(/salvar os dados/i)
  })

  it('rejeita estruturas incompletas em vez de restaurar parcialmente', () => {
    expect(validateAndMigrateAppData({ version: '1.0.0', settings: { theme: 'dark' } })).toBeNull()
  })

  it('registra uma recaída pelo diário e reinicia o contador sem duplicar dados', () => {
    const profile = createProfile()
    expect(saveAppData(createData(profile))).toBe(true)
    const timestamp = new Date().toISOString()
    const log: CravingLog = {
      id: 'craving-relapse-test',
      timestamp,
      trigger: 'estresse',
      intensity: 5,
      resisted: false,
      notes: 'Fumei depois de uma discussão',
    }

    expect(addCravingLog(log)).toBe(true)
    const saved = loadAppData()
    expect(saved.cravingLogs).toHaveLength(1)
    expect(saved.cravingLogs[0].resisted).toBe(false)
    expect(saved.profile?.lastSmoked).toBe(timestamp)
    expect(saved.relapseLogs).toHaveLength(1)
    expect(saved.relapseLogs[0].previousStreakDays).toBeGreaterThanOrEqual(3)
  })

  it('salva recaída e diário em uma única operação', () => {
    expect(saveAppData(createData(createProfile()))).toBe(true)
    const timestamp = new Date().toISOString()
    const relapse: RelapseLog = {
      id: 'relapse-atomic-test',
      timestamp,
      previousStreakDays: 4,
      previousStreakHours: 2,
      whatHappened: 'Situação de teste',
      mood: 'ansioso',
      where: 'trabalho',
      wasAutomatic: true,
      whatCouldHelp: 'Sair para caminhar',
    }
    const craving: CravingLog = {
      id: 'craving-atomic-test',
      timestamp,
      trigger: 'trabalho',
      intensity: 5,
      resisted: false,
      mood: 'ansioso',
      notes: 'Situação de teste',
    }

    expect(recordRelapse(relapse, craving)).toBe(true)
    const saved = loadAppData()
    expect(saved.relapseLogs).toHaveLength(1)
    expect(saved.cravingLogs).toHaveLength(1)
    expect(saved.profile?.lastSmoked).toBe(timestamp)
  })
})
