import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import type { AppData, UserProfile } from '@/types'
import { loadAppData, saveAppData } from '@/lib/storage'
import SOSPage from './page'

vi.mock('next/link', () => ({
  default: (props: { href: string; children: ReactNode }) => <a href={props.href}>{props.children}</a>,
}))
vi.mock('@/components/TimerBreathing', () => ({ default: () => <div data-testid="breathing-timer" /> }))
vi.mock('@/components/MotivationalPhrase', () => ({ default: () => <p>Frase de apoio</p> }))
vi.mock('@/components/BottomNav', () => ({ default: () => null }))

const profile: UserProfile = {
  cigarettesPerDay: 20,
  packPrice: 10,
  cigarettesPerPack: 20,
  lastSmoked: new Date(Date.now() - 4 * 86400000).toISOString(),
  quitReason: 'Saúde',
  triggers: ['estresse'],
  mode: 'quit',
  startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
}
const initialData: AppData = {
  profile,
  settings: { theme: 'dark', hasCompletedOnboarding: true, notificationsEnabled: false, reminderTime: '20:00' },
  cravingLogs: [],
  relapseLogs: [],
  dailyLogs: [],
  version: '1.0.0',
  schemaVersion: 2,
}

beforeEach(() => {
  localStorage.clear()
  saveAppData(initialData)
})

describe('fluxo SOS', () => {
  it('preserva a escolha de recaída e registra o resultado sem julgamento', () => {
    render(<SOSPage />)

    fireEvent.click(screen.getByRole('button', { name: 'Avançar sem timer' }))
    fireEvent.click(screen.getByRole('button', { name: /Continua aqui/ }))
    fireEvent.click(screen.getByRole('button', { name: /Registrar o que aconteceu/ }))
    fireEvent.click(screen.getByRole('button', { name: /Fumou/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar registro' }))

    const data = loadAppData()
    expect(data.cravingLogs).toHaveLength(1)
    expect(data.cravingLogs[0].resisted).toBe(false)
    expect(data.relapseLogs).toHaveLength(1)
    expect(data.profile?.lastSmoked).toBe(data.cravingLogs[0].timestamp)
    expect(screen.getByText('Você registrou o que aconteceu.')).toBeTruthy()
    expect(screen.getByText(/Uma recaída não apaga seu esforço/)).toBeTruthy()
  })
})
