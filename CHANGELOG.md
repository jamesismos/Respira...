# CHANGELOG

All notable changes to Respira will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Initial project scaffold (Next.js 15 + TypeScript + TailwindCSS)
- Design system: dark mode, Respira color palette, animations
- TypeScript types: UserProfile, CravingLog, RelapseLog, AppSettings
- Storage layer: saveAppData / loadAppData / clearAppData (local-first)
- Stats calculator: smoke-free time, money saved, cigarettes avoided
- Backup: export and import JSON
- Motivational phrases (personal, from James)
- Default triggers and moods
- PWA manifest and service worker
- Onboarding flow
- Home screen (brutal simplicity)
- SOS Vontade screen (the core feature)
- Trigger diary
- Progress screen
- Relapse without blame screen
- Settings screen
- Donation screen (discrete, settings only)
- PRODUCT_MEMORY.md — product decisions document

---

## [1.0.0] — TBD

First public release.

> "Uma vontade de cada vez."


## [1.0.1] — 2026-10-29

### Restaurado
- Reativa a página inicial e redireciona para o onboarding ou para a Home conforme os dados locais.
- Restaura os metadados da PWA e o vínculo com o manifest.
- Adiciona lembrete diário opcional com permissão explícita, horário configurável e notificação local.
- Preserva todos os dados no armazenamento do navegador e mantém o backup JSON.
- Corrige o link para o repositório real.
- Alinha o CI ao Node.js 24, sincroniza o lockfile e usa `npm ci` para instalação reproduzível.
- Migra o service worker para Serwist, com fallback offline e tratamento seguro de cliques em notificações.
- Adiciona auditoria de dependências e verificação do service worker gerado no CI.
