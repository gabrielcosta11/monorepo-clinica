import type { AppointmentStatus, UserRole } from "./enums";

export type ISODateTimeString = string;
export type EntityId = string;

export interface User {
  id: EntityId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: ISODateTimeString;
}

export interface Patient {
  id: EntityId;
  userId: EntityId;
  birthDate: ISODateTimeString;
  document: string;
  phone: string;
  createdAt: ISODateTimeString;
}

export interface Professional {
  id: EntityId;
  userId: EntityId;
  specialty: string;
  document: string;
  createdAt: ISODateTimeString;
}

export interface Appointment {
  id: EntityId;
  patientId: EntityId;
  professionalId: EntityId;
  date: ISODateTimeString;
  status: AppointmentStatus;
  notes?: string | undefined;
  createdAt: ISODateTimeString;
}

export interface MedicalRecord {
  id: EntityId;
  appointmentId: EntityId;
  description: string;
  createdAt: ISODateTimeString;
}

export interface CreatePatientWithUserInput {
  user: {
    name: string;
    email: string;
    passwordHash: string;
  };
  patient: {
    birthDate: ISODateTimeString;
    document: string;
    phone: string;
  };
}

export interface PatientPublicUser {
  id: EntityId;
  name: string;
  email: string;
  role: UserRole;
  createdAt: ISODateTimeString;
}

export interface PatientResponse {
  id: EntityId;
  birthDate: ISODateTimeString;
  document: string;
  phone: string;
  createdAt: ISODateTimeString;
  user: PatientPublicUser;
}
