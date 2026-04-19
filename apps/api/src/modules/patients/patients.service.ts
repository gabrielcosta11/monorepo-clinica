import type {
  CreatePatientWithUserInput,
  PatientResponse,
} from "./patients.schema";
import {
  InMemoryPatientsRepository,
  type PatientsRepository,
} from "./patients.repository";

export class PatientsConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PatientsConflictError";
  }
}

export class PatientsService {
  constructor(
    private readonly repository: PatientsRepository = new InMemoryPatientsRepository(),
  ) {}

  async create(input: CreatePatientWithUserInput): Promise<PatientResponse> {
    const existing = await this.repository.list();
    const hasEmail = existing.some((patient) => patient.user.email === input.user.email);

    if (hasEmail) {
      throw new PatientsConflictError("Patient with this email already exists.");
    }

    return this.repository.create(input);
  }

  async list(): Promise<PatientResponse[]> {
    return this.repository.list();
  }
}
