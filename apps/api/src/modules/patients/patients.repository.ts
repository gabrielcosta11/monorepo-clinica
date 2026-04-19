import { randomUUID } from "node:crypto";
import type {
  CreatePatientWithUserInput,
  PatientResponse,
} from "./patients.schema";

export interface PatientsRepository {
  create(input: CreatePatientWithUserInput): Promise<PatientResponse>;
  list(): Promise<PatientResponse[]>;
}

function nowIso(): string {
  return new Date().toISOString();
}

export class InMemoryPatientsRepository implements PatientsRepository {
  private readonly patients: PatientResponse[] = [];

  async create(input: CreatePatientWithUserInput): Promise<PatientResponse> {
    const createdAt = nowIso();
    const created: PatientResponse = {
      id: randomUUID(),
      birthDate: input.patient.birthDate,
      document: input.patient.document,
      phone: input.patient.phone,
      createdAt,
      user: {
        id: randomUUID(),
        name: input.user.name,
        email: input.user.email,
        role: "PATIENT",
        createdAt,
      },
    };

    this.patients.push(created);
    return created;
  }

  async list(): Promise<PatientResponse[]> {
    return this.patients;
  }
}
