// ============================================================
// Respira — Stats Calculator
// ============================================================

import type { UserProfile, SmokingStats } from '@/types'

export function calculateSmokeFreeSeconds(lastSmoked: string): number {
  const last = new Date(lastSmoked).getTime()
  const now = Date.now()
  return Math.max(0, Math.floor((now - last) / 1000))
}

export function formatSmokeFreeTime(seconds: number): {
  days: number
  hours: number
  minutes: number
  secs: number
  label: string
} {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  let label = ''
  if (days > 0) label = `${days}d ${hours}h ${minutes}m`
  else if (hours > 0) label = `${hours}h ${minutes}m ${secs}s`
  else if (minutes > 0) label = `${minutes}m ${secs}s`
  else label = `${secs}s`

  return { days, hours, minutes, secs, label }
}

export function calculateMoneySaved(profile: UserProfile, smokeFreeSeconds: number): number {
  const { cigarettesPerDay, packPrice, cigarettesPerPack } = profile
  const pricePerCigarette = packPrice / cigarettesPerPack
  const smokeFreeHours = smokeFreeSeconds / 3600
  const smokeFreedays = smokeFreeHours / 24
  return parseFloat((smokeFreedays * cigarettesPerDay * pricePerCigarette).toFixed(2))
}

export function calculateCigarettesAvoided(profile: UserProfile, smokeFreeSeconds: number): number {
  const smokeFreeHours = smokeFreeSeconds / 3600
  const smokeFreedays = smokeFreeHours / 24
  return Math.floor(smokeFreedays * profile.cigarettesPerDay)
}

export function calculateCurrentStreak(lastSmoked: string): number {
  return Math.floor(calculateSmokeFreeSeconds(lastSmoked) / 86400)
}

export function calculateStats(profile: UserProfile, bestStreakDays: number): SmokingStats {
  const smokeFreeSeconds = calculateSmokeFreeSeconds(profile.lastSmoked)
  return {
    smokeFreeSeconds,
    moneySaved: calculateMoneySaved(profile, smokeFreeSeconds),
    cigarettesAvoided: calculateCigarettesAvoided(profile, smokeFreeSeconds),
    currentStreakDays: Math.floor(smokeFreeSeconds / 86400),
    bestStreakDays: Math.max(bestStreakDays, Math.floor(smokeFreeSeconds / 86400)),
  }
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatLargeNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}
