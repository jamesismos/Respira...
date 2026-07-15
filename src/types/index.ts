// ============================================================
// Respira — TypeScript Types
// ============================================================

export interface UserProfile {
  cigarettesPerDay: number
  packPrice: number
  cigarettesPerPack: number
  lastSmoked: string // ISO date
  quitReason: string
  triggers: string[]
  mode: 'quit' | 'reduce'
  startDate: string // ISO date (quando começou a usar o app)
  name?: string
}

export interface CravingLog {
  id: string
  timestamp: string // ISO date
  trigger: string
  intensity: 1 | 2 | 3 | 4 | 5
  resisted: boolean
  notes?: string
  mood?: string
  durationMinutes?: number
}

export interface RelapseLog {
  id: string
  timestamp: string // ISO date
  previousStreakDays: number
  previousStreakHours: number
  whatHappened: string
  mood: string
  where: string
  wasAutomatic: boolean
  whatCouldHelp: string
}

export interface SmokingStats {
  smokeFreeSeconds: number
  moneySaved: number
  cigarettesAvoided: number
  currentStreakDays: number
  bestStreakDays: number
}

export interface AppSettings {
  theme: 'dark' | 'light'
  motivationalName?: string
  notificationsEnabled?: boolean
  hasCompletedOnboarding: boolean
  lastNotifiedMilestone?: number
}

export interface DailyLog {
  date: string // YYYY-MM-DD
  cravings: number
  resisted: number
  relapsed: number
}

export interface AppData {
  profile: UserProfile | null
  settings: AppSettings
  cravingLogs: CravingLog[]
  relapseLogs: RelapseLog[]
  dailyLogs: DailyLog[]
  version: string
  exportedAt?: string
}

export type TriggerType =
  | 'cafe'
  | 'apos-refeicao'
  | 'estresse'
  | 'ansiedade'
  | 'tedio'
  | 'trabalho'
  | 'discussao'
  | 'alcool'
  | 'antes-dormir'
  | 'acordar'
  | 'social'
  | 'dirigindo'
  | 'outro'

export type MoodType =
  | 'ansioso'
  | 'estressado'
  | 'entediado'
  | 'triste'
  | 'com-raiva'
  | 'feliz'
  | 'cansado'
  | 'normal'
  | 'outro'
