# PRODUCT_MEMORY.md — Respira

> Este arquivo documenta as decisões de produto do Respira.
> Leia antes de criar qualquer feature, componente ou tela.
> Se uma ideia contradiz alguma dessas decisões, questione antes de implementar.

---

## O que é o Respira

App local, privado e open source para ajudar uma pessoa a parar de fumar.
Foco no **momento crítico**: quando a vontade bate, a pessoa abre o Respira.

**Slogan:** Uma vontade de cada vez.

---

## Fundamento ético — Os quatro pilares da bioética

O Respira não é um app médico, mas opera com a mesma responsabilidade ética.
Qualquer feature, copia ou decisão de produto deve ser avaliada contra esses quatro pilares.

### Beneficência — *Fazer o bem*
> Agir sempre no melhor interesse da pessoa, não do produto.
- O app existe para ajudar. Não para reter, viciar ou monetizar sofrimento.
- Nenhuma feature de engajamento que prejudique o bem-estar da usuária.
- Frases motivacionais são apoio real, não marketing.

### Não maleficência — *Evitar danos*
> Nunca causar dano ou sofrimento desnecessário.
- Nunca usar linguagem de culpa. Nunca.
- Nunca tela vermelha, nunca "você perdeu", nunca contador zerado com drama.
- Nunca prometer cura nem resultado médico individual.
- Nunca exibir doação em momentos vulneráveis (SOS, recaída, fissura).
- Transparência: informar que visualizações de página e métricas de tráfego são enviadas ao Vercel Analytics; nomes de rotas podem revelar o uso de um app de cessação do tabagismo.

### Autonomia — *Respeitar as decisões da pessoa*
> A usuária tem controle total sobre si e sobre seus dados.
- Ela pode exportar todos os seus dados a qualquer momento.
- Ela pode apagar tudo sem consequência.
- Ela pode parar de usar o app sem punishão ou friction.
- O modo de recaída é uma escolha, não uma confissão.
- Sem notificações invasivas. Sem dark patterns.

### Justiça — *Acesso equitativo*
> O app deve ser acessível a todos, sem discriminação.
- Gratuito. Sempre. Para todos.
- Sem paywall, sem premium, sem tier.
- Open source — qualquer pessoa pode auditar o código.
- Interface acessível: botões grandes, contraste adequado, linguagem simples.
- PWA instalável; o acesso offline depende dos recursos e rotas já armazenados no navegador.

---

## Decisões de produto

### Privacidade e dados
- **O Respira é local-first.** Os registros do usuário ficam no dispositivo; métricas de navegação são uma exceção explícita e limitada ao Vercel Web Analytics.
- **Sem backend de dados do usuário.** Sem conta, API de produto ou sincronização em nuvem; o script do Vercel Analytics é a única integração externa de métricas.
- **Sem login.** Sem conta, sem e-mail, sem senha.
- **Analytics limitado.** Usar somente Vercel Web Analytics (`@vercel/analytics`) para visualizações de página e métricas de tráfego; não configurar eventos personalizados nem outros trackers.
- **Dados sensíveis não saem do dispositivo.** Perfil, consumo, gatilhos, recaídas, humor e progresso permanecem no armazenamento local e não podem ser enviados ao Analytics ou a qualquer servidor.
- `localStorage` no MVP. `IndexedDB` depois, sem refatorar o app (camada de storage abstrata).
- Todo acesso ao `localStorage` passa por `src/lib/storage.ts`. Nenhum componente acessa diretamente.

### Linguagem e tom
- **O app nunca usa culpa como mecanismo.**
- **O app nunca promete cura.**
- **O app nunca afirma resultado médico individual.**
- Linguagem sempre acolhedora, direta, humana.
- Recaída é tratada como **evento**, não como **fracasso**.
- "Melhorias comuns após parar de fumar" — nunca "seu corpo já recuperou X".

### Telas e UX
- **Home é brutalmente simples:** tempo sem fumar → botão SOS → dinheiro → cigarros.
- **SOS Vontade é o núcleo do produto.** É a tela mais importante. Deve ser obra-prima.
- Botões grandes, acessíveis no mobile com o polegar.
- Funciona offline. Sempre.
- Estados vazios bem escritos, nunca vagos.

### Recaída
- **Nunca apagar progresso antigo.**
- **Nunca transformar recaída em tela de erro ou fracasso.**
- Sempre registrar como evento com contexto.
- Histórico preservado integralmente.
- Contadores mantidos: sequência atual + melhor sequência + totais históricos.

### Doação
- O Respira é gratuito e sempre será.
- Doação é **opcional** e aparece apenas:
  - No rodapé discreto da tela de Configurações
  - Na tela `/settings/donate`
- **Jamais na Home, SOS, Recaída ou qualquer momento vulnerável.**
- Usar **chave Pix aleatória** — nunca expor CPF, e-mail pessoal ou telefone diretamente no código.
- Configurável em `src/data/donation.ts`.

### MVP 1.0 — escopo fechado
- Modo: **parar de vez** apenas.
- Modo "reduzir gradualmente" → MVP 1.1 (requer metas diárias, exige mais UX).
- 4 coisas que o MVP deve fazer muito bem:
  1. Contar tempo sem fumar
  2. Mostrar dinheiro e cigarros evitados
  3. Ajudar na vontade (SOS)
  4. Registrar recaída sem culpa

---

## O que não é o Respira

- Não é app médico.
- Não é terapeuta.
- Não é rede social.
- Não é startup invasiva.
- Não é app de notificações agressivas.
- Não é app cheio de gamificação vazia.

---

## Fluxo SOS — regra sagrada

```
Bateu vontade
↓
Respira 3 minutos (timer)
↓
Respiração guiada (inspira 4s → segura 4s → expira 6s → pausa 2s)
↓
Frase pessoal
↓
Água / andar / mudar ambiente
↓
Registrar gatilho (opcional)
↓
"Passei por essa" ← celebração real
```

---

## Arquitetura de dados

```
src/lib/storage.ts   ← único ponto de acesso ao localStorage
src/lib/stats.ts     ← cálculos: tempo, dinheiro, cigarros
src/lib/backup.ts    ← export/import JSON
src/types/index.ts   ← todos os tipos TypeScript
src/data/            ← dados estáticos: frases, gatilhos, doação
```

---

## Regras para agentes de IA

1. Não criar integrações externas além do Vercel Web Analytics aprovado; nunca enviar dados pessoais ou sensíveis do app.
2. Não instalar outras bibliotecas de analytics/tracking nem eventos personalizados; manter somente `@vercel/analytics` para visualizações de página.
3. Não adicionar Firebase, Supabase, Auth.js ou qualquer serviço externo.
4. Não mostrar doação fora das Configurações.
5. Não usar linguagem de culpa em nenhuma tela.
6. Não prometer resultado médico.
7. A tela SOS é prioridade máxima de qualidade.
8. Qualquer acesso a dados passa por `src/lib/storage.ts`.
9. Commits devem ser pequenos, naturais e incrementais.
10. Ler este arquivo antes de qualquer implementação nova.


---

## Reativação e notificações locais — 2026-10-29

- O projeto está ativo novamente; a página raiz deve encaminhar para onboarding ou Home conforme os dados locais.
- Notificações são opcionais, pedem permissão por ação explícita e permitem escolher um horário diário.
- Não usar push remoto nem analytics além do Vercel Web Analytics de visualizações de página; sem eventos personalizados.
- Sem backend/push, o navegador não garante notificações agendadas quando o app está totalmente fechado. A interface deve comunicar essa limitação.
- Alterar o domínio cria uma origem diferente e, portanto, outro armazenamento local. Orientar exportação/importação de backup antes da troca.
