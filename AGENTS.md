# AGENTS.md

## Contexto do projeto

Este repositorio e um monorepo TypeScript para uma aplicacao academica de gestao de clinica psiquiatrica.

Fontes de verdade para decisoes de arquitetura, dominio e dados:

- `docs/architecture-context-ia.md`
- `docs/domainModel-context-ia.md`
- `docs/databaseSchemas-context-ia.md`

Antes de alterar regras de negocio, contratos, entidades ou persistencia, leia esses documentos e mantenha a implementacao coerente com eles.

## Stack e organizacao

- Gerenciador: `pnpm`
- Monorepo: pnpm workspaces + Turborepo
- Linguagem: TypeScript em todo o projeto
- Web: Next.js App Router + Tailwind CSS + React Hook Form
- Mobile: Expo + React Native + React Hook Form
- API: Node.js + Fastify
- Banco: SQLite para o MVP academico
- ORM: Prisma
- Validacao e contratos: Zod
- Testes: Vitest e Supertest

Estrutura esperada:

- `apps/api`: API REST unica e regras de negocio
- `apps/web`: painel web administrativo e operacional
- `apps/mobile`: app mobile com paridade funcional com o web
- `packages/domain`: regras puras de dominio
- `packages/validation`: schemas Zod compartilhados
- `packages/types`: tipos compartilhados
- `packages/config`: configuracoes compartilhadas
- `packages/design-tokens`: tokens visuais compartilhados

## Principios obrigatorios

- Simplicidade acima de sofisticacao.
- Evite over-engineering, microservicos, mensageria e arquitetura distribuida.
- A API e a unica fonte operacional de verdade.
- Web e mobile devem consumir a mesma API.
- Mobile nao e versao reduzida: deve ter o mesmo escopo funcional do web.
- Nenhuma regra de negocio deve viver apenas no frontend.
- Validacao no frontend existe para UX; validacao no backend e obrigatoria.
- Reuse tipos, validacoes e regras em `packages/*` quando fizer sentido.
- Prefira pequenas entregas incrementais.
- Codigo deve permanecer pronto para producao.

## Dominio

Entidades centrais:

- `User`: identidade e dados comuns com `name`, `email`, `passwordHash`, `role`, `createdAt`.
- `Patient`: perfil de paciente vinculado a `User`, com `birthDate`, `document` e `phone`.
- `Professional`: perfil de profissional vinculado a `User`, com `specialty` e `document`.
- `Appointment`: consulta entre paciente e profissional.
- `MedicalRecord`: registro clinico associado a uma consulta.

Estados de consulta:

- `SCHEDULED`
- `COMPLETED`
- `CANCELED`

Regras basicas:

- Usuario deve ter nome obrigatorio.
- Usuario deve ter email unico.
- Paciente deve possuir um usuario vinculado.
- Profissional deve possuir um usuario vinculado.
- Consulta deve possuir paciente e profissional vinculados.
- Consulta deve possuir data valida.
- Prontuario so pode existir se houver consulta associada.
- IDs devem ser unicos.
- Datas devem ser armazenadas e trafegadas em formato ISO 8601.
- Relacionamentos devem ser garantidos no banco.

## Diretrizes de implementacao

- Use TypeScript estrito e preserve as opcoes de `tsconfig.base.json`.
- Use os aliases `@clinica/*` definidos na raiz quando consumir pacotes compartilhados.
- Modele contratos com Zod em `packages/validation` e derive tipos quando apropriado.
- Coloque regras puras e reutilizaveis em `packages/domain`.
- Evite duplicar enums, DTOs e validacoes entre API, web e mobile.
- Nao trate `name` e `email` como campos diretos de `Patient` ou `Professional`; esses dados pertencem a `User`.
- Mantenha nomes de entidades, campos e status alinhados ao dominio documentado.
- Nao introduza autenticacao complexa, multi-tenant ou infraestrutura fora de escopo sem pedido explicito.
- Nao altere lockfiles, configuracoes globais ou schema Prisma por efeito colateral.

## TDD e verificacao

TDD e obrigatorio neste projeto.

Fluxo esperado para mudancas de comportamento:

1. Escreva ou atualize teste que descreva o comportamento.
2. Implemente a menor mudanca necessaria.
3. Rode o teste local mais especifico.
4. Rode verificacoes mais amplas quando a mudanca tocar contratos compartilhados ou integracao.

Comandos uteis na raiz:

- `pnpm test`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Use filtros do pnpm/turbo quando a mudanca for localizada.

## Banco de dados e Prisma

- O modelo de dados alvo esta em `docs/databaseSchemas-context-ia.md`.
- O schema real em `apps/api/prisma/schema.prisma` pode estar atrasado em relacao aos documentos; ao mexer em persistencia, alinhe com os documentos antes de criar codigo consumidor.
- SQLite e a escolha atual. Nao assuma PostgreSQL sem decisao explicita.
- Preserve integridade referencial entre `Patient`, `Professional`, `Appointment` e `MedicalRecord`.

## Estilo de trabalho para agentes

- Leia o contexto local antes de editar.
- Mantenha mudancas pequenas e coesas.
- Nao reverta alteracoes de usuario.
- Prefira corrigir a causa em vez de mascarar erro de tipo ou lint.
- Documente apenas decisoes relevantes; evite comentarios obvios.
- Ao finalizar, informe quais arquivos mudaram e quais verificacoes foram executadas.
