# AGENTS.md - Docs

Este arquivo vale para `docs`.

## Responsabilidade

Os documentos desta pasta sao fonte de verdade para arquitetura, dominio e dados.

Documentos principais:

- `architecture-context-ia.md`
- `domainModel-context-ia.md`
- `databaseSchemas-context-ia.md`

Documentos operacionais:

- `state.md`: estado atual do projeto, decisoes consolidadas, validacoes recentes e proximo foco.

## Regras

- Ao mudar dominio, contratos ou persistencia, atualize a documentacao junto com a implementacao.
- Mantenha os documentos coerentes entre si.
- Nao documente uma arquitetura mais complexa do que a implementacao planejada.
- Preserve o escopo academico e incremental do projeto.
- Se houver divergencia entre codigo e documentacao, registre a decisao e alinhe ambos na menor mudanca possivel.
- Ao concluir uma entrega relevante, atualize `state.md` com o novo estado e validacoes executadas.
- Nao use `state.md` para substituir specs detalhadas de feature; specs devem ficar em `docs/specs/` quando existirem.

## Fora de escopo atual

- Microservicos.
- Mensageria.
- Arquitetura distribuida.
- Autenticacao complexa.
- Multi-tenant.
