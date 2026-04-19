# AGENTS.md - Infra

Este arquivo vale para `infra`.

## Responsabilidade

Infraestrutura deve apoiar o MVP academico sem adicionar complexidade desnecessaria.

## Regras

- SQLite e o banco atual do projeto.
- Nao introduza servicos externos obrigatorios sem pedido explicito.
- Nao adicione Docker, compose ou scripts de infraestrutura se a mesma necessidade puder ser atendida de forma simples pelo setup local.
- Se adicionar infraestrutura, documente como executar e como ela se conecta aos apps.
- Mantenha segredos fora do repositorio.

## Fora de escopo atual

- Microservicos.
- Mensageria.
- Orquestradores.
- Ambientes distribuidos.
- Multi-tenant.
