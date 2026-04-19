<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes; APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md - Web

Este arquivo vale para `apps/web`.

## Responsabilidade

A aplicacao web e o painel administrativo e operacional da clinica.

Ela deve cobrir:

- Gestao de pacientes.
- Gestao de profissionais.
- Gestao de consultas.
- Visualizacao operacional de dados.
- Operacao administrativa.

## Regras de arquitetura

- Use Next.js App Router.
- Consuma a API unica em `apps/api`.
- Nao implemente regra de negocio apenas no frontend.
- Use validacao no frontend para UX, mantendo a validacao obrigatoria no backend.
- Reuse contratos e schemas de `packages/validation` quando disponiveis.
- Reuse tipos de `packages/types` e regras puras de `packages/domain`.
- Mantenha paridade funcional com `apps/mobile`.

## UI e formularios

- Use Tailwind CSS para estilos.
- Use React Hook Form para formularios.
- Estados de carregamento, erro, vazio e sucesso devem ser tratados explicitamente.
- Fluxos administrativos devem ser simples e diretos.
- Evite telas meramente demonstrativas quando a funcionalidade real for esperada.

## Next.js

- Esta app usa Next.js 16.2.4.
- Antes de alterar APIs especificas do Next.js, consulte a documentacao local em `node_modules/next/dist/docs/`.
- Prefira Server Components quando fizer sentido, mas preserve interatividade em Client Components quando houver formulario, estado local ou eventos do usuario.

## Testes e verificacao

Quando adicionar comportamento, siga TDD sempre que viavel.

Comandos locais:

- `pnpm --filter web lint`
- `pnpm --filter web build`

Se adicionar testes ao web, mantenha-os proximos do comportamento e integre ao script do pacote.
