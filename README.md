# Respira

**Uma vontade de cada vez.**

O Respira é um aplicativo gratuito, open source e local-first para apoiar quem quer parar de fumar. Foi criado por James Oliveira com foco no momento em que a vontade aparece: oferecer uma pausa prática, registrar gatilhos e acompanhar o progresso sem culpa.

## Funcionalidades

- Contador de tempo desde o último cigarro.
- Estimativa de dinheiro economizado e cigarros evitados.
- SOS Vontade com respiração guiada, frases e ações curtas.
- Diário de gatilhos, humor e intensidade da vontade.
- Registro de recaídas sem apagar o histórico anterior.
- Progresso, sequências e marcos.
- Backup e restauração dos dados em JSON.
- Lembrete diário opcional por notificação do navegador.
- PWA instalável, com suporte offline conforme os recursos já armazenados pelo navegador.

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
npm install
npm run dev
```

Verificações:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Abra http://localhost:3000. Para testar a instalação PWA e notificações em outro dispositivo, use uma origem HTTPS ou localhost e conceda permissão apenas se desejar.

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
