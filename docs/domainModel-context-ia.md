# Modelo de Dominio

## 1. Objetivo

Definir as entidades centrais do sistema, seus atributos, relacionamentos e regras basicas de negocio.

Este modelo deve ser a fonte de verdade para:

- Banco de dados
- Contratos de API
- Regras de negocio

---

## 2. Entidades

### 2.1 User

Representa a identidade de acesso e os dados cadastrais comuns de qualquer usuario do sistema.

Atributos:

- id
- name
- email
- passwordHash
- role
- createdAt

Observacoes:

- `name` e `email` de pacientes e profissionais devem ser obtidos pela relacao com `User`.
- `email` deve ser unico no sistema.

---

### 2.2 Patient

Representa um paciente da clinica.

Atributos:

- id
- userId
- birthDate
- document
- phone
- createdAt

Observacoes:

- `Patient` possui exatamente um `User`.
- Campos comuns como `name` e `email` nao pertencem diretamente a `Patient`; eles pertencem a `User`.
- `document` representa o documento especifico do paciente.

---

### 2.3 Professional

Representa um profissional da clinica.

Atributos:

- id
- userId
- specialty
- document
- createdAt

Observacoes:

- `Professional` possui exatamente um `User`.
- Campos comuns como `name` e `email` nao pertencem diretamente a `Professional`; eles pertencem a `User`.
- `document` representa o documento especifico do profissional.

---

### 2.4 Appointment

Representa uma consulta.

Atributos:

- id
- patientId
- professionalId
- date
- status
- notes
- createdAt

---

### 2.5 MedicalRecord

Representa o registro clinico associado a uma consulta.

Atributos:

- id
- appointmentId
- description
- createdAt

---

## 3. Relacionamentos

- User 1:1 Patient (opcional)
- User 1:1 Professional (opcional)
- Patient 1:N Appointment
- Professional 1:N Appointment
- Appointment 1:1 MedicalRecord (opcional)

---

## 4. Regras de Negocio

- Um usuario deve ter nome obrigatorio.
- Um usuario deve ter email unico.
- Um paciente deve possuir um usuario vinculado.
- Um profissional deve possuir um usuario vinculado.
- Uma consulta deve possuir paciente e profissional vinculados.
- Uma consulta deve possuir uma data valida.
- Um prontuario so pode existir se houver uma consulta associada.

---

## 5. Papeis de Usuario

User.role:

- ADMIN
- PROFESSIONAL
- PATIENT

---

## 6. Estados da Consulta

Appointment.status:

- SCHEDULED
- COMPLETED
- CANCELED

---

## 7. Observacoes

- IDs devem ser unicos.
- Datas devem ser armazenadas em formato padrao (ISO 8601).
- Relacionamentos devem ser garantidos no banco de dados.
- Dados comuns devem ficar em `User`.
- Dados especificos devem ficar em `Patient` ou `Professional`.
