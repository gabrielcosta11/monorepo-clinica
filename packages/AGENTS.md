# AGENTS.md - Packages

Este arquivo vale para `packages/*`.

## Responsabilidade

Pacotes compartilhados existem para evitar divergencia entre API, web e mobile.

Use-os para centralizar:

- Tipos de dominio.
- Schemas e contratos Zod.
- Regras puras de negocio.
- Configuracoes comuns.
- Tokens visuais.

## Pacotes

- `packages/domain`: regras puras de dominio, sem dependencia de framework, HTTP, Prisma, React ou Expo.
- `packages/validation`: schemas Zod compartilhados para entradas, saidas e contratos.
- `packages/types`: tipos compartilhados que nao podem ser derivados diretamente de Zod.
- `packages/config`: configuracoes comuns do monorepo.
- `packages/design-tokens`: tokens de design compartilhados entre interfaces.

## Regras de dependencia

- Pacotes compartilhados nao devem depender de `apps/*`.
- `domain` deve permanecer o mais puro possivel.
- `validation` pode depender de Zod e tipos compartilhados.
- Evite ciclos entre pacotes.
- Evite duplicar enums e literais de dominio.

## Contratos

- Sempre que criar ou alterar entidade de dominio, avalie impacto em API, web e mobile.
- Schemas de entrada devem refletir regras documentadas em `docs/domainModel-context-ia.md`.
- Campos persistidos devem permanecer coerentes com `docs/databaseSchemas-context-ia.md`.
- Campos comuns de identidade, como `name` e `email`, pertencem a `User`.
- Campos especificos devem ficar nos perfis: `Patient` ou `Professional`.
- Datas em contratos devem ser ISO 8601.

## Testes

TDD e obrigatorio para regras de dominio e validacoes.

- Teste regras puras em `packages/domain`.
- Teste schemas e mensagens/formatos relevantes em `packages/validation`.
- Quando um pacote ganhar scripts, exponha pelo `package.json` para o Turbo conseguir executar.
