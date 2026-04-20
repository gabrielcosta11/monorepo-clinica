# Estado do Projeto

## Snapshot

Data da ultima atualizacao: 2026-04-19
Status geral: baseline Prisma criado; banco SQLite local possui as tabelas iniciais; Prisma Client foi gerado; base compartilhada em `packages/*` foi evoluida com contratos publicos de paciente; modulo `patients` da API esta funcional com `POST /patients` e `GET /patients` persistindo em SQLite via Prisma adapter.
Proximo foco: evoluir o modulo `patients` (filtros, paginacao e tratamento de conflitos de dominio) e iniciar o modulo `professionals`.

## Decisoes Consolidadas

- O projeto e um monorepo TypeScript com pnpm workspaces e Turborepo.
- A API Fastify e a unica fonte operacional de verdade para web e mobile.
- Web e mobile devem manter paridade funcional.
- SQLite e o banco do MVP academico.
- Prisma e o ORM do projeto.
- Zod sera usado para validacao e contratos compartilhados.
- TDD e obrigatorio para mudancas de comportamento.
- `User` guarda campos comuns de identidade e cadastro: `name`, `email`, `passwordHash`, `role`, `createdAt`.
- `Patient` guarda apenas campos especificos do paciente: `userId`, `birthDate`, `document`, `phone`, `createdAt`.
- `Professional` guarda apenas campos especificos do profissional: `userId`, `specialty`, `document`, `createdAt`.
- `name` e `email` de pacientes e profissionais sao obtidos via relacionamento com `User`.
- `document` permanece separado em `Patient` e `Professional`.

## Estado por Area

### Documentacao

- Documentos de contexto existem para arquitetura, dominio e schema de banco.
- `AGENTS.md` foi organizado por escopo de diretorio.
- `domainModel-context-ia.md` e `databaseSchemas-context-ia.md` foram alinhados ao modelo com `User` como base comum.
- Este arquivo acompanha o estado atual do projeto.
- `tasks.md` nao sera usado; acompanhamento operacional deve ficar neste `state.md`.

### Dominio e Banco

- Modelo conceitual consolidado com `User`, `Patient`, `Professional`, `Appointment` e `MedicalRecord`.
- Estados de consulta definidos: `SCHEDULED`, `COMPLETED`, `CANCELED`.
- Papeis de usuario definidos: `ADMIN`, `PROFESSIONAL`, `PATIENT`.
- Schema Prisma real em `apps/api/prisma/schema.prisma` esta alinhado aos documentos de dominio e banco.
- Configuracao do Prisma esta centralizada em `prisma.config.ts`, apontando para o schema da API.
- Migration inicial versionada em `apps/api/prisma/migrations/20260419170000_init_clinic_schema/migration.sql`.
- Banco SQLite local criado em `apps/api/prisma/dev.db` e nao deve ser versionado.
- Prisma Client gerado em `apps/api/generated/prisma` e nao deve ser versionado.

### API

- API Fastify possui endpoint inicial `GET /health`.
- Teste de health check existe em `apps/api/test/health.spec.ts`.
- Modulo `patients` foi criado em `apps/api/src/modules/patients` com separacao de `controller`, `service`, `repository` e `schema`.
- Endpoint `POST /patients` implementado com validacao por schema compartilhado.
- Endpoint `GET /patients` implementado com resposta validada por schema compartilhado.
- Repositorio de `patients` conectado ao Prisma com adapter SQLite (`@prisma/adapter-better-sqlite3`).

### Packages

- Estrutura de pacotes existe em `packages/*`.
- `packages/types`, `packages/validation` e `packages/domain` possuem `package.json`, `tsconfig`, exports e codigo inicial.
- `packages/types` centraliza enums (`Role`, `AppointmentStatus`) e entidades (`User`, `Patient`, `Professional`, `Appointment`, `MedicalRecord`).
- `packages/types` agora inclui tipos publicos de paciente (`CreatePatientWithUserInput`, `PatientPublicUser`, `PatientResponse`).
- `packages/validation` centraliza schemas Zod das entidades e inputs de criacao (`create*InputSchema`).
- `packages/validation` agora inclui `createPatientWithUserInputSchema`, `patientResponseSchema` e `patientListResponseSchema`.
- `packages/domain` centraliza regras puras iniciais (`isValidUserName`, `hasRequiredAppointmentRelations`, `isValidIsoDateTime`, `canCreateMedicalRecord`).
- Testes iniciais de dominio e validacao foram criados em cada pacote.
- Existe um config de teste local `vitest.shared.config.mjs` para resolver alias e `zod` no ambiente atual.
- Proximo foco tecnico recomendado: reutilizar os contratos no modulo `professionals` e nos proximos endpoints de `appointments`.

### Web

- App Next.js existe em `apps/web`.
- Regras locais de agente foram documentadas.
- Fluxos funcionais de clinica ainda nao foram implementados.

### Mobile

- App Expo existe em `apps/mobile`.
- Regras locais de agente foram documentadas.
- Fluxos funcionais de clinica ainda nao foram implementados.

### Infra

- Infra deve permanecer minima para o MVP.
- SQLite segue como banco atual.
- Nao ha servicos externos obrigatorios definidos.

## Validacoes Recentes

- `prisma validate`: passou usando `prisma.config.ts`.
- SQL da migration inicial aplicado ao SQLite local.
- Verificacao SQLite confirmou tabelas `User`, `Patient`, `Professional`, `Appointment` e `MedicalRecord`.
- Verificacao SQLite confirmou indices unicos principais e FKs de `Appointment` e `MedicalRecord`.
- `vitest run --config apps/api/vitest.config.ts apps/api/test/patients.spec.ts`: passou com 1 arquivo e 3 testes.
- `vitest run --config apps/api/vitest.config.ts apps/api/test/health.spec.ts apps/api/test/patients.spec.ts`: passou com 2 arquivos e 4 testes.
- `tsc --noEmit -p apps/api/tsconfig.json`: passou.
- `tsc --noEmit -p packages/types/tsconfig.json`: passou.
- `tsc --noEmit -p packages/domain/tsconfig.json`: passou.
- `tsc --noEmit -p packages/validation/tsconfig.json`: passou.
- `vitest run --config vitest.shared.config.mjs packages/domain/src/rules.spec.ts packages/validation/src/schemas.spec.ts`: passou com 2 arquivos e 14 testes.

Observacao: `pnpm` nao estava disponivel no PATH do shell usado. As validacoes foram executadas via binarios locais em `apps/api/node_modules/.bin`, e dependencias faltantes da API foram instaladas via `npm.cmd` sem gerar lockfile local da API. O Vitest precisou rodar fora do sandbox por falha `spawn EPERM` ao iniciar worker.

## Riscos / Atencoes

- `prisma migrate dev` e `prisma db push` falharam neste ambiente com erro interno do schema-engine sem detalhe. A migration foi versionada com SQL gerado por `prisma migrate diff` e aplicada ao SQLite via `sqlite3`.
- Os documentos de contexto originais tinham problemas de encoding; arquivos novos devem permanecer em ASCII quando possivel.
- `architecture-context-ia.md` ainda menciona `packages/ui`, mas o repositorio atual possui `packages/design-tokens` e nao possui `packages/ui`.

## Proximo Passo Recomendado

Evoluir o modulo `patients` e iniciar novos modulos:

- Adicionar filtros e paginacao em `GET /patients`.
- Adicionar tratamento de conflito por `document` no dominio (se essa regra for formalizada no schema de banco).
- Reaplicar o mesmo padrao modular (`controller/service/repository/schema`) em `professionals`.
