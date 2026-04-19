# AGENTS.md - Mobile

Este arquivo vale para `apps/mobile`.

## Responsabilidade

O mobile e uma aplicacao operacional com o mesmo escopo funcional do web.

Regra central:

- Mobile nao e versao reduzida.
- Toda funcionalidade essencial do web deve existir tambem no mobile.
- As mesmas regras de negocio e contratos de API devem ser usados.

## Stack

- Expo
- React Native
- Expo Router
- React Hook Form para formularios

## Arquitetura

- Consuma a mesma API de `apps/api`.
- Nao implemente regra de negocio apenas no app.
- Use validacao local apenas para UX; a validacao backend continua obrigatoria.
- Reuse contratos de `packages/validation`.
- Reuse tipos de `packages/types`.
- Reuse regras puras de `packages/domain` quando aplicavel.

## UX mobile

- Priorize fluxos curtos para cadastro, consulta e acompanhamento operacional.
- Trate estados de carregamento, erro, vazio e sucesso.
- Garanta navegacao clara entre pacientes, profissionais, consultas e prontuarios.
- Evite depender de recursos exclusivos de web.

## Testes e verificacao

TDD continua obrigatorio para regras e fluxos novos.

Comandos locais:

- `pnpm --filter mobile lint`
- `pnpm --filter mobile start`
- `pnpm --filter mobile android`
- `pnpm --filter mobile ios`
- `pnpm --filter mobile web`

Se adicionar testes ao mobile, integre-os ao `package.json` do app.
