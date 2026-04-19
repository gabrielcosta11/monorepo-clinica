# Estado do Projeto

## Snapshot

Data da ultima atualizacao: 2026-04-19
Status geral: baseline Prisma criado; banco SQLite local possui as tabelas iniciais; Prisma Client foi gerado.
Proximo foco: criar contratos compartilhados em `packages/*`.

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
- Modulos de dominio ainda nao foram implementados.
- Proximo modulo recomendado: `patients`.

### Packages

- Estrutura de pacotes existe em `packages/*`.
- Pacotes compartilhados ainda nao possuem `package.json`, exports, schemas ou testes.
- Proximo foco tecnico recomendado: criar base de tipos, validacoes e regras puras.

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
- `tsc --noEmit -p apps/api/tsconfig.json`: passou.
- `vitest run` em `apps/api`: passou com 1 arquivo de teste e 1 teste.

Observacao: `pnpm` nao estava disponivel no PATH do shell usado; as validacoes foram executadas via binarios locais em `node_modules/.bin`. O Vitest precisou rodar fora do sandbox por falha `spawn EPERM` ao iniciar worker.

## Riscos / Atencoes

- `packages/*` ainda nao esta preparado para ser fonte real de contratos compartilhados.
- Sem contratos compartilhados, API, web e mobile podem comecar a duplicar DTOs e validacoes.
- `prisma migrate dev` e `prisma db push` falharam neste ambiente com erro interno do schema-engine sem detalhe. A migration foi versionada com SQL gerado por `prisma migrate diff` e aplicada ao SQLite via `sqlite3`.
- Os documentos de contexto originais tinham problemas de encoding; arquivos novos devem permanecer em ASCII quando possivel.
- `architecture-context-ia.md` ainda menciona `packages/ui`, mas o repositorio atual possui `packages/design-tokens` e nao possui `packages/ui`.

## Proximo Passo Recomendado

Criar a base compartilhada em `packages/*`:

- `packages/types`: enums e tipos publicos iniciais.
- `packages/validation`: schemas Zod para entidades e inputs iniciais.
- `packages/domain`: regras puras de dominio.
- `package.json` e scripts minimos para cada pacote compartilhado que precisar participar de typecheck/test.
