import { describe, expect, it } from 'vitest'
import manifest from '../../public/manifest.json'

describe('PWA manifest', () => {
  it('declara uma aplicação instalável e os dois tamanhos de ícone', () => {
    expect(manifest.name).toBe('Respira')
    expect(manifest.display).toBe('standalone')
    expect(manifest.start_url).toBe('/')
    expect(manifest.icons.some(icon => icon.sizes === '192x192')).toBe(true)
    expect(manifest.icons.some(icon => icon.sizes === '512x512')).toBe(true)
  })
})
