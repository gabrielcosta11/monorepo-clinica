// Prisma Schema - Clinica Psiquiatrica

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// =========================
// ENUMS
// =========================

enum Role {
  ADMIN
  PROFESSIONAL
  PATIENT
}

enum AppointmentStatus {
  SCHEDULED
  COMPLETED
  CANCELED
}

// =========================
// MODELS
// =========================

model User {
  id           String   @id @default(uuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role
  createdAt    DateTime @default(now())

  professional Professional?
  patient      Patient?
}

model Patient {
  id        String   @id @default(uuid())
  userId    String   @unique
  birthDate DateTime
  document  String
  phone     String
  createdAt DateTime @default(now())

  user         User          @relation(fields: [userId], references: [id])
  appointments Appointment[]
}

model Professional {
  id        String   @id @default(uuid())
  userId    String   @unique
  specialty String
  document  String
  createdAt DateTime @default(now())

  user         User          @relation(fields: [userId], references: [id])
  appointments Appointment[]
}

model Appointment {
  id             String            @id @default(uuid())
  patientId      String
  professionalId String
  date           DateTime
  status         AppointmentStatus
  notes          String?
  createdAt      DateTime          @default(now())

  patient       Patient        @relation(fields: [patientId], references: [id])
  professional  Professional   @relation(fields: [professionalId], references: [id])
  medicalRecord MedicalRecord?
}

model MedicalRecord {
  id            String   @id @default(uuid())
  appointmentId String   @unique
  description   String
  createdAt     DateTime @default(now())

  appointment Appointment @relation(fields: [appointmentId], references: [id])
}
