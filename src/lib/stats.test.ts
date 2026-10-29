import { describe, expect, it } from 'vitest'
import { calculateCigarettesAvoided, calculateMoneySaved, calculateSmokeFreeSeconds, formatSmokeFreeTime } from './stats'
import type { UserProfile } from '@/types'

const profile: UserProfile = {
  cigarettesPerDay: 20,
  packPrice: 10,
  cigarettesPerPack: 20,
  lastSmoked: '2026-10-26T12:00:00.000Z',
  quitReason: 'Saúde',
  triggers: [],
  mode: 'quit',
  startDate: '2026-10-26T12:00:00.000Z',
}

describe('cálculos de progresso', () => {
  it('calcula dinheiro e cigarros evitados por um dia completo', () => {
    expect(calculateMoneySaved(profile, 86400)).toBe(10)
    expect(calculateCigarettesAvoided(profile, 86400)).toBe(20)
  })

  it('não retorna tempo sem fumar negativo para uma data futura', () => {
    expect(calculateSmokeFreeSeconds(new Date(Date.now() + 60000).toISOString())).toBe(0)
  })

  it('formata dias, horas e minutos de maneira consistente', () => {
    expect(formatSmokeFreeTime(90061)).toMatchObject({ days: 1, hours: 1, minutes: 1, secs: 1 })
  })
})
