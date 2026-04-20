# Estado do Projeto

## Snapshot

Data da ultima atualizacao: 2026-04-19
Status geral: baseline Prisma criado; banco SQLite local possui as tabelas iniciais; Prisma Client foi gerado; base compartilhada em `packages/*` foi evoluida com contratos publicos de paciente e profissional; modulos `patients`, `professionals` e `appointments` da API estao funcionais com `POST` e `GET` persistindo em SQLite via Prisma adapter.
Proximo foco: iniciar o modulo `medical-records` reaproveitando contratos compartilhados.

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
- Migration `apps/api/prisma/migrations/20260419213000_add_patient_document_unique/migration.sql` criada e aplicada no banco local para garantir unicidade de `Patient.document`.
- Banco SQLite local criado em `apps/api/prisma/dev.db` e nao deve ser versionado.
- Prisma Client gerado em `apps/api/generated/prisma` e nao deve ser versionado.

### API

- API Fastify possui endpoint inicial `GET /health`.
- Teste de health check existe em `apps/api/test/health.spec.ts`.
- Modulo `patients` foi criado em `apps/api/src/modules/patients` com separacao de `controller`, `service`, `repository` e `schema`.
- Endpoint `POST /patients` implementado com validacao por schema compartilhado.
- Endpoint `GET /patients` implementado com resposta validada por schema compartilhado.
- Repositorio de `patients` conectado ao Prisma com adapter SQLite (`@prisma/adapter-better-sqlite3`).
- `POST /patients` agora aplica regra de dominio para conflito de `document` e retorna `409`.
- Modulo `professionals` foi criado em `apps/api/src/modules/professionals` com separacao de `controller`, `service`, `repository` e `schema`.
- Endpoint `POST /professionals` implementado com validacao por schema compartilhado.
- Endpoint `GET /professionals` implementado com resposta validada por schema compartilhado.
- `POST /professionals` retorna `409` em conflito de email (unicidade de `User.email`).
- Modulo `appointments` foi criado em `apps/api/src/modules/appointments` com separacao de `controller`, `service`, `repository` e `schema`.
- Endpoint `POST /appointments` implementado com validacao por schema compartilhado.
- Endpoint `GET /appointments` implementado com resposta validada por schema compartilhado.
- `POST /appointments` retorna `409` quando `patientId` ou `professionalId` nao existem.

### Packages

- Estrutura de pacotes existe em `packages/*`.
- `packages/types`, `packages/validation` e `packages/domain` possuem `package.json`, `tsconfig`, exports e codigo inicial.
- `packages/types` centraliza enums (`Role`, `AppointmentStatus`) e entidades (`User`, `Patient`, `Professional`, `Appointment`, `MedicalRecord`).
- `packages/types` agora inclui tipos publicos de paciente (`CreatePatientWithUserInput`, `PatientPublicUser`, `PatientResponse`).
- `packages/types` agora inclui tipos publicos de profissional (`CreateProfessionalWithUserInput`, `ProfessionalPublicUser`, `ProfessionalResponse`).
- `packages/validation` centraliza schemas Zod das entidades e inputs de criacao (`create*InputSchema`).
- `packages/validation` agora inclui `createPatientWithUserInputSchema`, `patientResponseSchema` e `patientListResponseSchema`.
- `packages/validation` agora inclui `createProfessionalWithUserInputSchema`, `professionalResponseSchema` e `professionalListResponseSchema`.
- `packages/validation` agora inclui `appointmentListResponseSchema` para listagem de consultas.
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
- `vitest run --config apps/api/vitest.config.ts apps/api/test/patients.spec.ts`: passou com 1 arquivo e 4 testes.
- `vitest run --config apps/api/vitest.config.ts apps/api/test/professionals.spec.ts`: passou com 1 arquivo e 4 testes.
- `vitest run --config apps/api/vitest.config.ts apps/api/test/appointments.spec.ts`: passou com 1 arquivo e 4 testes.
- `vitest run --config apps/api/vitest.config.ts apps/api/test/health.spec.ts apps/api/test/patients.spec.ts apps/api/test/professionals.spec.ts`: passou com 3 arquivos e 9 testes.
- `vitest run --config apps/api/vitest.config.ts apps/api/test/health.spec.ts apps/api/test/patients.spec.ts apps/api/test/professionals.spec.ts apps/api/test/appointments.spec.ts`: passou com 4 arquivos e 13 testes.
- `sqlite3 apps/api/prisma/dev.db "PRAGMA index_list('Patient');"`: confirmou indice unico `Patient_document_key`.
- `tsc --noEmit -p apps/api/tsconfig.json`: passou.
- `tsc --noEmit -p packages/types/tsconfig.json`: passou.
- `tsc --noEmit -p packages/domain/tsconfig.json`: passou.
- `tsc --noEmit -p packages/validation/tsconfig.json`: passou.
- `vitest run --config vitest.shared.config.mjs packages/domain/src/rules.spec.ts packages/validation/src/schemas.spec.ts`: passou com 2 arquivos e 17 testes.

Observacao: `pnpm` nao estava disponivel no PATH do shell usado. As validacoes foram executadas via binarios locais em `apps/api/node_modules/.bin`, e dependencias faltantes da API foram instaladas via `npm.cmd` sem gerar lockfile local da API. O Vitest precisou rodar fora do sandbox por falha `spawn EPERM` ao iniciar worker. Para evitar condicoes de corrida no SQLite compartilhado em testes de API, `apps/api/vitest.config.ts` foi configurado com `fileParallelism: false`.

## Riscos / Atencoes

- `prisma migrate dev` e `prisma db push` falharam neste ambiente com erro interno do schema-engine sem detalhe. A migration foi versionada com SQL gerado por `prisma migrate diff` e aplicada ao SQLite via `sqlite3`.
- Os documentos de contexto originais tinham problemas de encoding; arquivos novos devem permanecer em ASCII quando possivel.
- `architecture-context-ia.md` ainda menciona `packages/ui`, mas o repositorio atual possui `packages/design-tokens` e nao possui `packages/ui`.

## Proximo Passo Recomendado

Iniciar o modulo `medical-records`:

- Criar estrutura modular `controller/service/repository/schema` em `apps/api/src/modules/medical-records`.
- Reusar contratos compartilhados de `MedicalRecord` e garantir vinculo obrigatorio com `Appointment`.
- Cobrir com testes de API os fluxos iniciais de criacao e listagem.
