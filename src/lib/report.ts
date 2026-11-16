import type { CravingLog } from '@/types'

export interface ReportAvailability {
  elapsedDays: number
  daysUsed: number
  daysUntilExport: number
  canExport: boolean
  recommendedComplete: boolean
  progressPercent: number
}

export interface ReportCount {
  key: string
  count: number
}

export interface ReportInsights {
  total: number
  resisted: number
  smoked: number
  resistanceRate: number
  averageIntensity: number
  triggers: ReportCount[]
  timePeriods: ReportCount[]
  moods: ReportCount[]
  locations: ReportCount[]
}

const DAY_IN_MS = 24 * 60 * 60 * 1000

export function getReportAvailability(startDate: string, now = new Date()): ReportAvailability {
  const start = Date.parse(startDate)
  if (!Number.isFinite(start) || now.getTime() < start) {
    return {
      elapsedDays: 0,
      daysUsed: 0,
      daysUntilExport: 7,
      canExport: false,
      recommendedComplete: false,
      progressPercent: 0,
    }
  }

  const elapsedDays = Math.floor((now.getTime() - start) / DAY_IN_MS)
  return {
    elapsedDays,
    daysUsed: elapsedDays + 1,
    daysUntilExport: Math.max(0, 7 - elapsedDays),
    canExport: elapsedDays >= 7,
    recommendedComplete: elapsedDays >= 30,
    progressPercent: Math.min(100, Math.round((elapsedDays / 30) * 100)),
  }
}

function countBy(values: string[]): ReportCount[] {
  const counts = new Map<string, number>()
  values.forEach(value => counts.set(value, (counts.get(value) || 0) + 1))
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key))
}

export function buildReportInsights(logs: CravingLog[]): ReportInsights {
  const resisted = logs.filter(log => log.resisted).length
  const smoked = logs.length - resisted
  const averageIntensity = logs.length
    ? Number((logs.reduce((total, log) => total + log.intensity, 0) / logs.length).toFixed(1))
    : 0

  const timeKeys = logs.map(log => {
    const hour = new Date(log.timestamp).getHours()
    if (hour < 6) return 'madrugada'
    if (hour < 12) return 'manha'
    if (hour < 18) return 'tarde'
    return 'noite'
  })

  return {
    total: logs.length,
    resisted,
    smoked,
    resistanceRate: logs.length ? Math.round((resisted / logs.length) * 100) : 0,
    averageIntensity,
    triggers: countBy(logs.map(log => log.trigger)),
    timePeriods: countBy(timeKeys),
    moods: countBy(logs.flatMap(log => log.mood ? [log.mood] : [])),
    locations: countBy(logs.flatMap(log => log.where ? [log.where] : [])),
  }
}
