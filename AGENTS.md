# AGENTS.md — Respira

> Guia para agentes de IA e ferramentas de codificação automática.
> Leia PRODUCT_MEMORY.md antes de qualquer implementação.

---

## Sobre o projeto

Respira é uma PWA Next.js 15 + TypeScript + TailwindCSS.
App local para parar de fumar. Sem backend. Sem login. Sem analytics.

---

## Comandos essenciais

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Lint
npm run lint

# Tipos
npx tsc --noEmit
```

---

## Arquitetura

```
src/
  app/           ← rotas Next.js (App Router)
  components/    ← componentes reutilizáveis
  lib/           ← lógica de negócio e utilitários
  types/         ← tipos TypeScript globais
  data/          ← dados estáticos (frases, gatilhos, doação)
public/
  icons/         ← ícones do app
  manifest.json  ← PWA manifest
```

---

## Regras obrigatórias para agentes

1. **Não criar chamadas de API externa.** O app é local-first.
2. **Não instalar Firebase, Supabase, Auth.js ou similares.**
3. **Não instalar analytics ou tracking** de nenhum tipo.
4. **Não mostrar doação fora das Configurações.**
   - Proibido: Home, SOS, Recaída, Onboarding, qualquer modal de momento vulnerável.
   - Permitido: `/settings` (rodapé discreto) e `/settings/donate`.
5. **Não usar linguagem de culpa.** Recaída = evento, não fracasso.
6. **Não prometer cura nem resultado médico individual.**
   - Errado: "Seu corpo já recuperou X"
   - Certo: "Melhorias comuns após parar de fumar"
7. **Todo acesso a dados passa por `src/lib/storage.ts`.**
   - Proibido: `localStorage.setItem(...)` em componente diretamente.
8. **A tela SOS é prioridade de qualidade máxima.**
9. **Recaída preserva histórico.** Nunca deletar dados anteriores.
10. **MVP 1.0 = modo "parar de vez" apenas.** Modo "reduzir" é v1.1.

---

## Padrão de commits

Commits pequenos, naturais, incrementais. Mistura de português e inglês.

```
✨ add onboarding flow inicial
🎨 ajusta cores do SOS button
fix: contador de tempo não atualizava no background
feat: exportar backup em JSON
📝 docs: adiciona README e PRODUCT_MEMORY
refactor: separa lógica de storage em lib/storage.ts
chore: configura next-pwa e manifest
🔥 SOS flow completo com timer e respiração guiada
feat(relapse): preserva histórico ao reiniciar contador
style: ajusta espaçamento da home no mobile
```

---

## Stack

| O que | Como |
|---|---|
| Framework | Next.js 15 App Router |
| Linguagem | TypeScript strict |
| Estilo | TailwindCSS |
| Dados | localStorage → `src/lib/storage.ts` |
| PWA | manifest.json + service worker |
| Ícones | lucide-react |
| QR Code | qrcode.react |
| Backend | ❌ nenhum |

---

## Tipos principais

```typescript
UserProfile     ← dados do usuário (cigarros/dia, preço, último cigarro...)
CravingLog      ← log de vontade (gatilho, intensidade, resistiu?)
RelapseLog      ← log de recaída (o que aconteceu, humor, automático?)
AppSettings     ← configurações (tema, onboarding completo)
AppData         ← estrutura completa para backup
```

---

## Referência rápida de telas

| Rota | Tela |
|---|---|
| `/` | Redirect → onboarding ou home |
| `/onboarding` | Configuração inicial |
| `/home` | Home principal |
| `/sos` | SOS Vontade (core feature) |
| `/triggers` | Diário de gatilhos |
| `/progress` | Progresso |
| `/relapse` | Recaída sem culpa |
| `/settings` | Configurações |
| `/settings/donate` | Apoiar o projeto (discreto) |
