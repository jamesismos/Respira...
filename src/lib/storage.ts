// ============================================================
// Respira — Local Storage Layer
// Ponto único de acesso ao localStorage. Nenhum dado sai do dispositivo.
// ============================================================

import type { AppData, UserProfile, CravingLog, RelapseLog, AppSettings, DailyLog } from '@/types'

const STORAGE_KEY = 'respira_data'
const APP_VERSION = '1.0.0'
const CURRENT_SCHEMA_VERSION = 2

const defaultSettings: AppSettings = {
  theme: 'dark',
  hasCompletedOnboarding: false,
  notificationsEnabled: false,
  reminderTime: '20:00',
}

let recoveryRequired = false
let lastStorageError: string | null = null

function createDefaultData(): AppData {
  return {
    profile: null,
    settings: { ...defaultSettings },
    cravingLogs: [],
    relapseLogs: [],
    dailyLogs: [],
    version: APP_VERSION,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && Number.isFinite(Date.parse(value))
}

function isValidDateOnly(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(value + 'T00:00:00.000Z')
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function parseProfile(value: unknown): UserProfile | null | undefined {
  if (value === null) return null
  if (!isRecord(value)) return undefined

  const { cigarettesPerDay, packPrice, cigarettesPerPack, lastSmoked, quitReason, triggers, mode, startDate, name } = value
  if (typeof cigarettesPerDay !== 'number' || !Number.isFinite(cigarettesPerDay) || cigarettesPerDay <= 0 || cigarettesPerDay > 200) return undefined
  if (typeof packPrice !== 'number' || !Number.isFinite(packPrice) || packPrice < 0 || packPrice > 10000) return undefined
  if (typeof cigarettesPerPack !== 'number' || !Number.isFinite(cigarettesPerPack) || cigarettesPerPack <= 0 || cigarettesPerPack > 200) return undefined
  if (!isValidTimestamp(lastSmoked) || !isValidTimestamp(startDate)) return undefined
  if (typeof quitReason !== 'string' || !Array.isArray(triggers) || !triggers.every(t => typeof t === 'string')) return undefined
  if (mode !== 'quit' && mode !== 'reduce') return undefined
  if (name !== undefined && typeof name !== 'string') return undefined

  return {
    cigarettesPerDay,
    packPrice,
    cigarettesPerPack,
    lastSmoked,
    quitReason,
    triggers: [...triggers],
    mode,
    startDate,
    ...(typeof name === 'string' ? { name } : {}),
  }
}

function parseCravingLog(value: unknown): CravingLog | null {
  if (!isRecord(value)) return null
  const { id, timestamp, trigger, intensity, resisted, notes, mood, durationMinutes } = value
  if (typeof id !== 'string' || !id.trim() || !isValidTimestamp(timestamp) || typeof trigger !== 'string') return null
  if (typeof intensity !== 'number' || !Number.isInteger(intensity) || intensity < 1 || intensity > 5) return null
  if (typeof resisted !== 'boolean') return null
  if (notes !== undefined && typeof notes !== 'string') return null
  if (mood !== undefined && typeof mood !== 'string') return null
  if (durationMinutes !== undefined && (typeof durationMinutes !== 'number' || !Number.isFinite(durationMinutes) || durationMinutes < 0)) return null
  return {
    id,
    timestamp,
    trigger,
    intensity: intensity as CravingLog['intensity'],
    resisted,
    ...(typeof notes === 'string' ? { notes } : {}),
    ...(typeof mood === 'string' ? { mood } : {}),
    ...(typeof durationMinutes === 'number' ? { durationMinutes } : {}),
  }
}

function parseRelapseLog(value: unknown): RelapseLog | null {
  if (!isRecord(value)) return null
  const { id, timestamp, previousStreakDays, previousStreakHours, whatHappened, mood, where, wasAutomatic, whatCouldHelp } = value
  if (typeof id !== 'string' || !id.trim() || !isValidTimestamp(timestamp)) return null
  if (typeof previousStreakDays !== 'number' || !Number.isInteger(previousStreakDays) || previousStreakDays < 0) return null
  if (typeof previousStreakHours !== 'number' || !Number.isInteger(previousStreakHours) || previousStreakHours < 0 || previousStreakHours > 23) return null
  if (typeof whatHappened !== 'string' || typeof mood !== 'string' || typeof where !== 'string') return null
  if (typeof wasAutomatic !== 'boolean' || typeof whatCouldHelp !== 'string') return null
  return { id, timestamp, previousStreakDays, previousStreakHours, whatHappened, mood, where, wasAutomatic, whatCouldHelp }
}

function parseDailyLog(value: unknown): DailyLog | null {
  if (!isRecord(value)) return null
  const { date, cravings, resisted, relapsed } = value
  if (!isValidDateOnly(date)) return null
  for (const count of [cravings, resisted, relapsed]) {
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 0) return null
  }
  return { date, cravings: cravings as number, resisted: resisted as number, relapsed: relapsed as number }
}

function parseSettings(value: unknown, profile: UserProfile | null): AppSettings | null {
  if (!isRecord(value)) return null
  const theme = value.theme ?? defaultSettings.theme
  const hasCompletedOnboarding = value.hasCompletedOnboarding ?? Boolean(profile)
  const notificationsEnabled = value.notificationsEnabled ?? false
  const reminderTime = value.reminderTime ?? defaultSettings.reminderTime
  const motivationalName = value.motivationalName
  const lastReminderDate = value.lastReminderDate
  const lastNotifiedMilestone = value.lastNotifiedMilestone

  if (theme !== 'dark' && theme !== 'light') return null
  if (typeof hasCompletedOnboarding !== 'boolean' || typeof notificationsEnabled !== 'boolean') return null
  if (typeof reminderTime !== 'string' || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(reminderTime)) return null
  if (motivationalName !== undefined && typeof motivationalName !== 'string') return null
  if (lastReminderDate !== undefined && !isValidDateOnly(lastReminderDate)) return null
  if (lastNotifiedMilestone !== undefined && (typeof lastNotifiedMilestone !== 'number' || !Number.isFinite(lastNotifiedMilestone) || lastNotifiedMilestone < 0)) return null

  return {
    theme,
    hasCompletedOnboarding,
    notificationsEnabled,
    reminderTime,
    ...(typeof motivationalName === 'string' ? { motivationalName } : {}),
    ...(typeof lastReminderDate === 'string' ? { lastReminderDate } : {}),
    ...(typeof lastNotifiedMilestone === 'number' ? { lastNotifiedMilestone } : {}),
  }
}

/**
 * Validates a persisted app object and migrates legacy backups without schemaVersion.
 * Unknown future schemas and malformed records are rejected rather than partially restored.
 */
export function validateAndMigrateAppData(input: unknown): AppData | null {
  if (!isRecord(input)) return null

  const sourceSchema = input.schemaVersion === undefined ? 1 : input.schemaVersion
  if (typeof sourceSchema !== 'number' || !Number.isInteger(sourceSchema) || sourceSchema < 1 || sourceSchema > CURRENT_SCHEMA_VERSION) return null
  if (typeof input.version !== 'string' || !input.version.trim()) return null
  if (!Object.prototype.hasOwnProperty.call(input, 'profile')) return null
  if (!isRecord(input.settings)) return null
  if (!Array.isArray(input.cravingLogs) || !Array.isArray(input.relapseLogs) || !Array.isArray(input.dailyLogs)) return null

  const profile = parseProfile(input.profile)
  if (profile === undefined) return null
  const settings = parseSettings(input.settings, profile)
  if (!settings) return null

  const cravingLogs = input.cravingLogs.map(parseCravingLog)
  const relapseLogs = input.relapseLogs.map(parseRelapseLog)
  const dailyLogs = input.dailyLogs.map(parseDailyLog)
  if (cravingLogs.some(item => item === null) || relapseLogs.some(item => item === null) || dailyLogs.some(item => item === null)) return null
  if (input.exportedAt !== undefined && !isValidTimestamp(input.exportedAt)) return null

  return {
    profile,
    settings,
    cravingLogs: cravingLogs as CravingLog[],
    relapseLogs: relapseLogs as RelapseLog[],
    dailyLogs: dailyLogs as DailyLog[],
    version: input.version,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    ...(typeof input.exportedAt === 'string' ? { exportedAt: input.exportedAt } : {}),
  }
}

function setStorageError(message: string, requiresRecovery = false): void {
  lastStorageError = message
  if (requiresRecovery) recoveryRequired = true
  console.error('[Respira] ' + message)
}

export function getStorageError(): string | null {
  return lastStorageError
}

export function isStorageRecoveryRequired(): boolean {
  return recoveryRequired
}

export function loadAppData(): AppData {
  if (typeof window === 'undefined') return createDefaultData()

  let raw: string | null
  try {
    raw = localStorage.getItem(STORAGE_KEY)
  } catch {
    setStorageError('O navegador não permitiu acessar os dados locais. Verifique as permissões de armazenamento.', true)
    return createDefaultData()
  }

  if (raw === null) {
    recoveryRequired = false
    lastStorageError = null
    return createDefaultData()
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    setStorageError('Os dados locais estão corrompidos. O Respira preservou o conteúdo original e bloqueou novas gravações.', true)
    return createDefaultData()
  }

  const normalized = validateAndMigrateAppData(parsed)
  if (!normalized) {
    setStorageError('Os dados locais não correspondem a um esquema válido. O Respira preservou o conteúdo original e bloqueou novas gravações.', true)
    return createDefaultData()
  }

  const sourceSchema = isRecord(parsed) ? parsed.schemaVersion : undefined
  recoveryRequired = false
  lastStorageError = null

  if (sourceSchema !== CURRENT_SCHEMA_VERSION) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    } catch {
      setStorageError('Os dados foram carregados, mas a atualização interna não pôde ser salva. Libere espaço no navegador e tente novamente.')
    }
  }

  return normalized
}

export function saveAppData(data: AppData, options: { allowReplaceCorrupt?: boolean } = {}): boolean {
  if (typeof window === 'undefined') return false
  if (recoveryRequired && !options.allowReplaceCorrupt) {
    setStorageError('A gravação foi bloqueada para proteger os dados locais. Importe um backup válido ou apague os dados corrompidos.')
    return false
  }

  const normalized = validateAndMigrateAppData(data)
  if (!normalized) {
    setStorageError('Os dados não passaram pela validação e não foram salvos.')
    return false
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    recoveryRequired = false
    lastStorageError = null
    return true
  } catch {
    setStorageError('Não foi possível salvar os dados neste navegador. Verifique o espaço disponível e as permissões de armazenamento.')
    return false
  }
}

export function clearAppData(): boolean {
  if (typeof window === 'undefined') return false
  try {
    localStorage.removeItem(STORAGE_KEY)
    recoveryRequired = false
    lastStorageError = null
    return true
  } catch {
    setStorageError('Não foi possível apagar os dados locais. Verifique as permissões de armazenamento do navegador.')
    return false
  }
}

export function saveProfile(profile: UserProfile): boolean {
  const data = loadAppData()
  return saveAppData({ ...data, profile })
}

export function loadProfile(): UserProfile | null {
  return loadAppData().profile
}

export function saveSettings(settings: Partial<AppSettings>): boolean {
  const data = loadAppData()
  return saveAppData({ ...data, settings: { ...data.settings, ...settings } })
}

export function loadSettings(): AppSettings {
  return loadAppData().settings
}

export function completeOnboarding(): boolean {
  const data = loadAppData()
  return saveAppData({ ...data, settings: { ...data.settings, hasCompletedOnboarding: true } })
}

export function addCravingLog(log: CravingLog): boolean {
  const data = loadAppData()
  let updatedProfile = data.profile
  let updatedRelapseLogs = data.relapseLogs

  if (!log.resisted && data.profile) {
    updatedProfile = { ...data.profile, lastSmoked: log.timestamp }

    const lastSmokedTime = new Date(data.profile.lastSmoked).getTime()
    const logTime = new Date(log.timestamp).getTime()
    const secs = Math.max(0, Math.floor((logTime - lastSmokedTime) / 1000))
    const previousStreakDays = Math.floor(secs / 86400)
    const previousStreakHours = Math.floor((secs % 86400) / 3600)

    const alreadyHasRelapse = data.relapseLogs.some(r => r.timestamp === log.timestamp)
    if (!alreadyHasRelapse) {
      const relapseLog: RelapseLog = {
        id: 'relapse-from-craving-' + Date.now(),
        timestamp: log.timestamp,
        previousStreakDays,
        previousStreakHours,
        whatHappened: log.notes || 'Registrado via Diário. Gatilho: ' + log.trigger,
        mood: log.mood || 'outro',
        where: 'outro',
        wasAutomatic: true,
        whatCouldHelp: '',
      }
      updatedRelapseLogs = [relapseLog, ...updatedRelapseLogs]
    }
  }

  return saveAppData({
    ...data,
    profile: updatedProfile,
    cravingLogs: [log, ...data.cravingLogs],
    relapseLogs: updatedRelapseLogs,
  })
}

export function loadCravingLogs(): CravingLog[] {
  return loadAppData().cravingLogs
}

export function addRelapseLog(log: RelapseLog, newLastSmoked: string): boolean {
  const data = loadAppData()
  const updatedProfile = data.profile ? { ...data.profile, lastSmoked: newLastSmoked } : null
  const alreadyHasRelapse = data.relapseLogs.some(r => r.timestamp === log.timestamp || r.id === log.id)
  return saveAppData({
    ...data,
    profile: updatedProfile,
    relapseLogs: alreadyHasRelapse ? data.relapseLogs : [log, ...data.relapseLogs],
  })
}

/** Saves a relapse and its diary entry atomically, avoiding half-written histories. */
export function recordRelapse(log: RelapseLog, cravingLog: CravingLog): boolean {
  const data = loadAppData()
  const updatedProfile = data.profile ? { ...data.profile, lastSmoked: log.timestamp } : null
  const alreadyHasRelapse = data.relapseLogs.some(r => r.timestamp === log.timestamp || r.id === log.id)
  return saveAppData({
    ...data,
    profile: updatedProfile,
    relapseLogs: alreadyHasRelapse ? data.relapseLogs : [log, ...data.relapseLogs],
    cravingLogs: [cravingLog, ...data.cravingLogs],
  })
}

export function loadRelapseLogs(): RelapseLog[] {
  return loadAppData().relapseLogs
}

export function getBestStreakDays(): number {
  const data = loadAppData()
  if (data.relapseLogs.length === 0) return 0
  return Math.max(...data.relapseLogs.map(r => r.previousStreakDays))
}
