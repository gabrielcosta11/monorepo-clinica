# Modelo de Domínio

## 1. Objetivo

Definir as entidades centrais do sistema, seus atributos, relacionamentos e regras básicas de negócio.

Este modelo deve ser a fonte de verdade para:

* Banco de dados
* Contratos de API
* Regras de negócio

---

## 2. Entidades

### 2.1 Patient

Representa um paciente da clínica.

Atributos:

* id
* name
* birthDate
* document
* phone
* email
* createdAt

---

### 2.2 Professional

Representa um profissional da clínica.

Atributos:

* id
* name
* specialty
* document
* createdAt

---

### 2.3 Appointment

Representa uma consulta.

Atributos:

* id
* patientId
* professionalId
* date
* status
* notes
* createdAt

---

### 2.4 MedicalRecord

Representa o registro clínico associado a uma consulta.

Atributos:

* id
* appointmentId
* description
* createdAt

---

## 3. Relacionamentos

* Patient 1:N Appointment
* Professional 1:N Appointment
* Appointment 1:1 MedicalRecord (opcional)

---

## 4. Regras de Negócio

* Um paciente deve ter nome obrigatório
* Um profissional deve ter nome obrigatório
* Uma consulta deve possuir paciente e profissional vinculados
* Uma consulta deve possuir uma data válida
* Um prontuário só pode existir se houver uma consulta associada

---

## 5. Estados da Consulta

Appointment.status:

* SCHEDULED
* COMPLETED
* CANCELED

---

## 6. Observações

* IDs devem ser únicos
* Datas devem ser armazenadas em formato padrão (ISO 8601)
* Relacionamentos devem ser garantidos no banco de dados
