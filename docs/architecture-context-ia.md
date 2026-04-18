# Arquitetura e Stack do Projeto

## 1. Visão Geral

Este projeto consiste no desenvolvimento de uma aplicação acadêmica para gestão de uma clínica psiquiátrica, com foco em simplicidade, clareza de domínio e boas práticas de engenharia.

A aplicação será composta por:

* Web (painel administrativo e operação)
* Mobile (uso operacional com mesmo escopo funcional)
* Backend (API única)
* Banco de dados

IMPORTANTE:
O mobile NÃO é uma versão reduzida. Ele deve possuir o mesmo escopo funcional do web.

---

## 2. Princípios de Arquitetura

* Simplicidade acima de sofisticação
* Evitar over-engineering
* Uma única fonte de verdade (API central)
* Reuso máximo entre camadas
* Evolução incremental (small releases)
* Código sempre pronto para produção

---

## 3. Stack Tecnológica

### 3.1 Linguagem

* TypeScript (em todo o projeto)

Motivo:

* Tipagem compartilhada entre frontend, mobile e backend
* Redução de inconsistências de contrato

---

### 3.2 Monorepo

* pnpm workspaces
* Turborepo

Motivo:

* Compartilhamento de código entre web, mobile e backend
* Centralização de configuração
* Build e cache otimizados

---

### 3.3 Web

* Next.js (App Router)
* Tailwind CSS
* React Hook Form

Responsabilidades:

* Gestão de pacientes
* Gestão de consultas
* Visualização de dados
* Operação administrativa

---

### 3.4 Mobile

* React Native
* Expo
* React Hook Form

IMPORTANTE:

* Deve ter paridade funcional com o web
* Mesmas regras de negócio
* Mesmos contratos de API

Responsabilidades:

* Cadastro e consulta de pacientes
* Gestão de consultas
* Acompanhamento operacional

---

### 3.5 Backend

* Node.js
* Fastify
* TypeScript

Responsabilidades:

* Expor API REST
* Centralizar regras de negócio
* Validar dados
* Orquestrar persistência

---

### 3.6 Banco de Dados

* SQLite (MVP acadêmico)

Motivo:

* Simplicidade
* Zero overhead de infraestrutura

Plano futuro:

* Possível migração para PostgreSQL

---

### 3.7 ORM

* Prisma

Responsabilidades:

* Modelagem de dados
* Migrations
* Acesso ao banco

---

### 3.8 Validação e Contratos

* Zod

Responsabilidades:

* Validação de inputs
* Definição de contratos
* Compartilhamento entre frontend e backend

---

### 3.9 Testes

- Vitest
- Supertest

Diretriz:

- TDD como metodologia obrigatória

Responsabilidades:

- Testes unitários
- Testes de integração da API
- Validação contínua de regras de negócio

## 4. Estrutura do Repositório

```
/apps
  /web
  /mobile
  /api

/packages
  /ui
  /types
  /validation
  /domain
  /config
```

---

## 5. Descrição dos Módulos

### /apps/web

Aplicação web baseada em Next.js

Responsável por:

* Interface administrativa
* Gestão completa da clínica

---

### /apps/mobile

Aplicação mobile baseada em Expo

Responsável por:

* Interface mobile
* Mesmas funcionalidades do web

---

### /apps/api

Backend da aplicação

Responsável por:

* Regras de negócio
* Persistência
* Exposição de endpoints

---

### /packages/ui

Componentes reutilizáveis

---

### /packages/types

Tipos compartilhados

---

### /packages/validation

Schemas Zod compartilhados

---

### /packages/domain

Regras de domínio

---

### /packages/config

Configurações globais

---

## 6. Arquitetura do Backend

Arquitetura: Monolito Modular

### Módulos iniciais

* patients
* appointments
* professionals
* records (prontuário simplificado)

Cada módulo deve conter:

* controller
* service
* repository
* schema (validação)

---

## 7. Fluxo de Comunicação

* Web e Mobile consomem a mesma API
* Nenhuma regra de negócio deve ficar no frontend
* Validação ocorre em:

  * Frontend (UX)
  * Backend (obrigatório)

---

## 8. Diretrizes de Desenvolvimento

- TDD obrigatório
- Vitest como framework de testes principal
- Supertest para testes de integração da API
- Pequenas entregas
- Refatoração contínua
- Código simples e legível

---

## 9. Decisões Importantes

### 9.1 API única

Motivo:

* Evita duplicação de lógica
* Garante consistência

---

### 9.2 Monorepo

Motivo:

* Compartilhamento de código
* Menor complexidade de integração

---

### 9.3 SQLite no início

Motivo:

* Simplicidade

Risco:

* Escalabilidade limitada

---

### 9.4 Paridade Web/Mobile

Regra:

* Mobile NÃO pode ser versão reduzida
* Todas funcionalidades devem existir em ambos

---

## 10. Fora de Escopo (por enquanto)

* Microserviços
* Mensageria
* Arquitetura distribuída
* Autenticação complexa
* Multi-tenant

---

## 11. Observações Finais

Este projeto prioriza:

* Clareza
* Organização
* Evolução contínua

Evitar complexidade desnecessária é um requisito, não uma sugestão.
