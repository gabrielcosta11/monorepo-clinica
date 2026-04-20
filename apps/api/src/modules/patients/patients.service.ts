import { Prisma } from "../../../generated/prisma/client";
import type {
  CreatePatientWithUserInput,
  PatientResponse,
} from "./patients.schema";
import {
  PrismaPatientsRepository,
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
    private readonly repository: PatientsRepository = new PrismaPatientsRepository(),
  ) {}

  async create(input: CreatePatientWithUserInput): Promise<PatientResponse> {
    try {
      return await this.repository.create(input);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new PatientsConflictError("Patient with this email already exists.");
      }

      throw error;
    }
  }

  async list(): Promise<PatientResponse[]> {
    return this.repository.list();
  }
}
