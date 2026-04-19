# AGENTS.md - API

Este arquivo vale para `apps/api`.

## Responsabilidade

A API e o centro das regras de negocio e a unica fonte operacional de verdade para web e mobile.

Responsabilidades principais:

- Expor API REST com Fastify.
- Validar dados de entrada obrigatoriamente.
- Orquestrar regras de negocio.
- Persistir dados via Prisma e SQLite.
- Manter contratos estaveis para web e mobile.

## Arquitetura esperada

Use monolito modular. Modulos iniciais:

- `patients`
- `appointments`
- `professionals`
- `records`

Cada modulo deve evoluir com esta separacao:

- `controller`: rotas HTTP e adaptacao de request/response.
- `service`: regras de negocio e orquestracao.
- `repository`: acesso a dados.
- `schema`: validacao Zod e contratos de entrada/saida.

Evite colocar regra de negocio diretamente em handlers Fastify.

## Contratos e validacao

- A validacao backend e obrigatoria mesmo quando o frontend tambem valida.
- Prefira schemas compartilhados em `packages/validation`.
- Nao duplique DTOs manualmente quando puder derivar tipos dos schemas.
- Retorne datas em ISO 8601.
- Use os status de consulta `SCHEDULED`, `COMPLETED` e `CANCELED`.

## Prisma e dados

- Confira `docs/databaseSchemas-context-ia.md` antes de alterar modelos.
- `User` concentra os campos comuns `name`, `email`, `passwordHash`, `role` e `createdAt`.
- `Patient` e `Professional` devem ter `userId` unico e obrigatorio.
- `Patient` tem `birthDate`, `document` e `phone` como campos especificos.
- `Professional` tem `specialty` e `document` como campos especificos.
- Nao modele `name` ou `email` diretamente em `Patient` ou `Professional`.
- Preserve as relacoes:
  - `User` 1:1 `Patient` opcional
  - `User` 1:1 `Professional` opcional
  - `Patient` 1:N `Appointment`
  - `Professional` 1:N `Appointment`
  - `Appointment` 1:1 `MedicalRecord` opcional
- `MedicalRecord` so pode existir com `Appointment` associado.
- Nao introduza banco externo ao SQLite neste MVP.

## Testes

TDD e obrigatorio.

- Use Vitest para testes unitarios.
- Use Supertest ou `app.inject` para testes de integracao HTTP.
- Testes de API devem cobrir status HTTP, payload e regras de negocio relevantes.
- Para novas rotas, teste cenarios validos e invalidos.

Comandos locais:

- `pnpm --filter api test`
- `pnpm --filter api typecheck`
- `pnpm --filter api lint`
- `pnpm --filter api build`

## Padroes praticos

- Exporte uma funcao de construcao da app Fastify para testes, como `buildApp`.
- Evite iniciar servidor em testes.
- Mantenha `server.ts` apenas como entrada de runtime.
- Nao deixe regra de negocio acoplada ao Prisma quando puder ficar em `packages/domain`.
