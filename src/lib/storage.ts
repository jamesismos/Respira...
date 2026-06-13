// ============================================================
// Respira — Local Storage Layer
// Ponto ÚNICO de acesso ao localStorage.
// Nenhum componente acessa localStorage diretamente.
// Tudo local. Nenhum dado sai do dispositivo.
// ============================================================

import type { AppData, UserProfile, CravingLog, RelapseLog, AppSettings } from '@/types'

const STORAGE_KEY = 'respira_data'
const APP_VERSION = '1.0.0'

const defaultSettings: AppSettings = {
  theme: 'dark',
  hasCompletedOnboarding: false,
}

const defaultData: AppData = {
  profile: null,
  settings: defaultSettings,
  cravingLogs: [],
  relapseLogs: [],
  dailyLogs: [],
  version: APP_VERSION,
}

// ─── Core ────────────────────────────────────────────────────

export function loadAppData(): AppData {
  if (typeof window === 'undefined') return defaultData
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultData }
    const parsed = JSON.parse(raw) as Partial<AppData>
    return {
      profile: parsed.profile || null,
      settings: { ...defaultSettings, ...(parsed.settings ?? {}) },
      cravingLogs: Array.isArray(parsed.cravingLogs) ? parsed.cravingLogs : [],
      relapseLogs: Array.isArray(parsed.relapseLogs) ? parsed.relapseLogs : [],
      dailyLogs: Array.isArray(parsed.dailyLogs) ? parsed.dailyLogs : [],
      version: parsed.version || APP_VERSION,
    }
  } catch {
    return { ...defaultData }
  }
}

export function saveAppData(data: AppData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('[Respira] Falha ao salvar dados:', e)
  }
}

export function clearAppData(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

// ─── Profile ─────────────────────────────────────────────────

export function saveProfile(profile: UserProfile): void {
  const data = loadAppData()
  saveAppData({ ...data, profile })
}

export function loadProfile(): UserProfile | null {
  return loadAppData().profile
}

// ─── Settings ────────────────────────────────────────────────

export function saveSettings(settings: AppSettings): void {
  const data = loadAppData()
  saveAppData({ ...data, settings })
}

export function loadSettings(): AppSettings {
  return loadAppData().settings
}

export function completeOnboarding(): void {
  const data = loadAppData()
  saveAppData({ ...data, settings: { ...data.settings, hasCompletedOnboarding: true } })
}

// ─── Craving Logs ────────────────────────────────────────────

export function addCravingLog(log: CravingLog): void {
  const data = loadAppData()
  saveAppData({ ...data, cravingLogs: [log, ...data.cravingLogs] })
}

export function loadCravingLogs(): CravingLog[] {
  return loadAppData().cravingLogs
}

// ─── Relapse Logs ────────────────────────────────────────────

export function addRelapseLog(log: RelapseLog, newLastSmoked: string): void {
  const data = loadAppData()
  const updatedProfile = data.profile
    ? { ...data.profile, lastSmoked: newLastSmoked }
    : null
  saveAppData({
    ...data,
    profile: updatedProfile,
    relapseLogs: [log, ...data.relapseLogs],
  })
}

export function loadRelapseLogs(): RelapseLog[] {
  return loadAppData().relapseLogs
}

// ─── Best Streak ─────────────────────────────────────────────

export function getBestStreakDays(): number {
  const data = loadAppData()
  if (data.relapseLogs.length === 0) return 0
  return Math.max(...data.relapseLogs.map(r => r.previousStreakDays))
}
