import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import manifest from '../../public/manifest.json'

describe('PWA manifest', () => {
  it('declara uma aplicação instalável e os dois tamanhos de ícone', () => {
    expect(manifest.name).toBe('Respira')
    expect(manifest.display).toBe('standalone')
    expect(manifest.start_url).toBe('/')
    expect(manifest.icons.some(icon => icon.sizes === '192x192')).toBe(true)
    expect(manifest.icons.some(icon => icon.sizes === '512x512')).toBe(true)
    expect('screenshots' in manifest).toBe(false)
  })
})

describe('recursos PWA', () => {
  it('mantém o ícone PNG real e a página offline disponíveis', () => {
    const iconPath = join(process.cwd(), 'public', 'icons', 'respira_app_icon.png')
    const icon = readFileSync(iconPath)

    expect(existsSync(iconPath)).toBe(true)
    expect(icon.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    expect(icon.readUInt32BE(16)).toBeGreaterThanOrEqual(512)
    expect(icon.readUInt32BE(20)).toBeGreaterThanOrEqual(512)
    expect(existsSync(join(process.cwd(), 'src', 'app', 'offline', 'page.tsx'))).toBe(true)
  })

  it('configura service worker com fallback offline e clique seguro da notificação', () => {
    const worker = readFileSync(join(process.cwd(), 'src', 'app', 'sw.ts'), 'utf8')
    const config = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf8')

    expect(work���q�^