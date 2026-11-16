import { describe, expect, it } from 'vitest'
import type { CravingLog } from '@/types'
import { buildReportInsights, getReportAvailability } from './report'

describe('relatório de acompanhamento', () => {
  it('libera exportação após sete dias completos e recomenda trinta dias', () => {
    const start = new Date('2026-01-01T12:00:00.000Z')
    const sixDays = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000)
    const sevenDays = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)
    const thirtyDays = new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000)

    expect(getReportAvailability(start.toISOString(), sixDays).canExport).toBe(false)
    expect(getReportAvailability(start.toISOString(), sevenDays).canExport).toBe(true)
    expect(getReportAvailability(start.toISOString(), thirtyDays).recommendedComplete).toBe(true)
  })

  it('resume vontades, resistência, intensidade e contexto', () => {
    const logs: CravingLog[] = [
      { id: '1', timestamp: '2026-01-01T09:00:00.000Z', trigger: 'cafe', intensity: 4, resisted: true, mood: 'ansioso', where: 'trabalho' },
      { id: '2', timestamp: '2026-01-01T20:00:00.000Z', trigger: 'estresse', intensity: 2, resisted: false, mood: 'ansioso', where: 'casa' },
    ]

    const report = buildReportInsights(logs)
    expect(report.total).toBe(2)
    expect(report.resisted).toBe(1)
    expect(report.smoked).toBe(1)
    expect(report.resistanceRate).toBe(50)
    expect(report.averageIntensity).toBe(3)
    expect(report.triggers[0]).toEqual({ key: 'cafe', count: 1 })
    expect(report.locations).toHaveLength(2)
  })
})
