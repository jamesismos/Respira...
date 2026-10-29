import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import TimerBreathing from './TimerBreathing'

afterEach(() => {
  vi.useRealTimers()
})

describe('respiração guiada', () => {
  it('avança as fases seguindo a duração de cada respiração', () => {
    vi.useFakeTimers()
    render(<TimerBreathing totalSeconds={60} onComplete={() => undefined} />)

    expect(screen.getByRole('status').textContent).toBe('Inspira...')

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.getByRole('status').textContent).toBe('Segura...')

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.getByRole('status').textContent).toBe('Expira...')

    act(() => {
      vi.advanceTimersByTime(6000)
    })
    expect(screen.getByRole('status').textContent).toBe('Pausa...')
  })

  it('pausa o cronômetro e a animação e permite retomar', () => {
    vi.useFakeTimers()
    render(<TimerBreathing totalSeconds={60} onComplete={() => undefined} />)

    const orb = screen.getByTestId('breathing-orb')
    fireEvent.click(screen.getByRole('button', { name: 'Pausar respiração guiada' }))
    expect(orb.style.animationPlayState).toBe('paused')

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByText('1:00')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toBe('Inspira...')

    fireEvent.click(screen.getByRole('button', { name: 'Retomar respiração guiada' }))
    expect(orb.style.animationPlayState).toBe('running')

    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.getByRole('status').textContent).toBe('Segura...')
  })

  it('chama onComplete exatamente uma vez quando o tempo termina', () => {
    vi.useFakeTimers()
    const onComplete = vi.fn()
    render(<TimerBreathing totalSeconds={3} onComplete={onComplete} />)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(screen.getByText('0:00')).toBeTruthy()
  })
})
