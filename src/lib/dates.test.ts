import { describe, expect, it } from 'vitest'
import { formatDateTimeLocal, localDateKey, parseDateTimeLocal } from './dates'

describe('helpers de data local', () => {
  it('preserva o horário local ao converter datetime-local para ISO e voltar', () => {
    const localDate = new Date(2026, 9, 29, 19, 45, 0, 0)
    const inputValue = formatDateTimeLocal(localDate)

    expect(inputValue).toBe('2026-10-29T19:45')
    const iso = parseDateTimeLocal(inputValue)
    expect(iso).not.toBeNull()
    expect(new Date(iso as string).getTime()).toBe(localDate.getTime())
  })

  it('usa a data do calendário local, não o dia UTC', () => {
    const localDate = new Date(2026, 9, 29, 23, 55, 0, 0)
    expect(localDateKey(localDate)).toBe('2026-10-29')
  })

  it('rejeita valores de data vazios ou inválidos', () => {
    expect(parseDateTimeLocal('')).toBeNull()
    expect(parseDateTimeLocal('não é uma data')).toBeNull()
  })
})
