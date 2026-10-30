import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { quitReasons } from '@/data/triggers'
import { loadAppData } from '@/lib/storage'
import OnboardingPage from './page'

const routerMocks = vi.hoisted(() => ({ replace: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: () => routerMocks }))

beforeEach(() => {
  localStorage.clear()
  routerMocks.replace.mockClear()
})

describe('onboarding', () => {
  it('salva o perfil e a conclusão em uma única gravação válida', () => {
    render(<OnboardingPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Começar' }))
    fireEvent.click(screen.getByRole('button', { name: /10 cigarros/ }))
    fireEvent.click(screen.getByRole('button', { name: 'R$ 10,00' }))
    fireEvent.click(screen.getByRole('button', { name: /20 cigarros/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Agora mesmo' }))
    fireEvent.click(screen.getByRole('button', { name: quitReasons[0] }))
    fireEvent.click(screen.getByRole('button', { name: 'Pular' }))

    expect(screen.getByRole('heading', { name: 'O que é o Respira?' })).toBeDefined()
    expect(screen.getByText('R$ 150,00')).toBeDefined()
    expect(screen.getByText('R$ 1.825,00')).toBeDefined()
    expect(screen.getByText('3.650 cigarros por ano')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Pular' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Começar minha jornada' }))

    const data = loadAppData()
    expect(data.profile?.cigarettesPerDay).toBe(10)
    expect(data.profile?.packPrice).toBe(10)
    expect(data.profile?.cigarettesPerPack).toBe(20)
    expect(data.settings.hasCompletedOnboarding).toBe(true)
    expect(routerMocks.replace).toHaveBeenCalledWith('/home')
  })
})
