# Respira

**Uma vontade de cada vez.**

O Respira é um aplicativo gratuito, open source e local-first para apoiar quem quer parar de fumar. Foi criado por James Oliveira com foco no momento em que a vontade aparece: oferecer uma pausa prática, registrar gatilhos e acompanhar o progresso sem culpa.

**Acesse o app:** [respira-nine.vercel.app](https://respira-nine.vercel.app)

## Funcionalidades

- Contador de tempo desde o último cigarro.
- Estimativa de dinheiro economizado e cigarros evitados.
- SOS Vontade com respiração guiada, frases e ações curtas.
- Diário de gatilhos, humor e intensidade da vontade.
- Registro de recaídas sem apagar o histórico anterior.
- Progresso, sequências e marcos.
- Backup e restauração dos dados em JSON, com validação e migração de esquema.
- Edição de todos os dados do perfil que afetam os cálculos e os gatilhos.
- Links para apoio profissional gratuito pelo SUS, INCA e Secretaria de Saúde de Minas Gerais.
- Lembrete diário opcional por notificação do navegador.
- PWA instalável com cache de recursos e tela de contingência offline; o acesso a cada rota depende do cache disponível no navegador.

## Privacidade

- Sem conta, backend, analytics ou rastreadores.
- O app não envia os registros de tabagismo a um servidor.
- Os dados ficam no armazenamento local do navegador, vinculados ao perfil do navegador e à origem do site.
- Limpar os dados do site ou trocar de domínio/navegador pode fazer os registros deixarem de aparecer. Exporte um backup JSON antes de trocar de endereço e importe-o no novo.
- O backup é um arquivo local sob controle da usuária. Guarde-o em local privado.

## Notificações

As notificações são opcionais e exigem permissão explícita. O lembrete diário é verificado enquanto o Respira está aberto em segundo plano. Sem um servidor de push ou um app Android nativo, o navegador não garante a entrega de um lembrete agendado quando o aplicativo está totalmente fechado. O horário e a ativação são armazenados localmente.

## Executar localmente

Requisitos: Node.js 24 ou versão compatível com Next.js.

```bash
npm ci
npm run dev
```

Verificações:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Abra http://localhost:3000. Para testar a instalação PWA e notificações em outro dispositivo, use uma origem HTTPS ou localhost e conceda permissão apenas se desejar.

## Testes e qualidade

A suíte automatizada cobre conversão de datas locais, cálculos de progresso, persistência e migração, registro de recaídas, onboarding, fluxo SOS, importação de backup e metadados básicos do PWA. O CI executa lint, TypeScript, testes e build.

A instalação e o comportamento offline ainda devem ser verificados em dispositivos reais antes de cada release; o suporte a notificações varia por navegador e sistema operacional.

## Apoio profissional

O Respira é um complemento, não um substituto de cuidado clínico. O SUS oferece tratamento para cessação do tabagismo. Consulte [Como parar de fumar — INCA](https://www.gov.br/inca/pt-br/assuntos/causas-e-prevencao-do-cancer/tabagismo/como-parar-de-fumar) ou, em Minas Gerais, [Tratamento do tabagismo — SES-MG](https://www.saude.mg.gov.br/vidasaudavel/tabagismo/). O Disque Saúde 136 pode orientar sobre o acesso ao tratamento.

## Princípios do projeto

- Sem culpa: uma recaída é um evento para aprender, não um fracasso.
- Autonomia: a usuária decide o que registrar, exportar ou apagar.
- Beneficência e não maleficência: nada de notificações invasivas ou pressão comercial.
- Justiça: gratuito, sem paywall e com interface pensada para celular.

O Respira não substitui acompanhamento profissional de saúde.

## Código-fonte

[GitHub — jamesismos/Respira...](https://github.com/jamesismos/Respira...)

## Apoie o projeto

Apoio opcional disponível apenas nas Configurações do aplicativo.
