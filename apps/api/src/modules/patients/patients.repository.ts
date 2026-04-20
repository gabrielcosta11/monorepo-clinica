import type { PrismaClient } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type {
  CreatePatientWithUserInput,
  PatientResponse,
} from "./patients.schema";

export interface PatientsRepository {
  create(input: CreatePatientWithUserInput): Promise<PatientResponse>;
  list(): Promise<PatientResponse[]>;
  findByDocument(document: string): Promise<PatientResponse | null>;
}

interface PatientWithUserRecord {
  id: string;
  birthDate: Date;
  document: string;
  phone: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "PROFESSIONAL" | "PATIENT";
    createdAt: Date;
  };
}

function toPatientResponse(record: PatientWithUserRecord): PatientResponse {
  return {
    id: record.id,
    birthDate: record.birthDate.toISOString(),
    document: record.document,
    phone: record.phone,
    createdAt: record.createdAt.toISOString(),
    user: {
      id: record.user.id,
      name: record.user.name,
      email: record.user.email,
      role: record.user.role,
      createdAt: record.user.createdAt.toISOString(),
    },
  };
}

export class PrismaPatientsRepository implements PatientsRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async create(input: CreatePatientWithUserInput): Promise<PatientResponse> {
    const created = await this.client.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.user.name,
          email: input.user.email,
          passwordHash: input.user.passwordHash,
          role: "PATIENT",
        },
      });

      return tx.patient.create({
        data: {
          userId: user.id,
          birthDate: new Date(input.patient.birthDate),
          document: input.patient.document,
          phone: input.patient.phone,
        },
        include: {
          user: true,
        },
      });
    });

    return toPatientResponse(created);
  }

  async list(): Promise<PatientResponse[]> {
    const patients = await this.client.patient.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return patients.map(toPatientResponse);
  }

  async findByDocument(document: string): Promise<PatientResponse | null> {
    const patient = await this.client.patient.findFirst({
      where: {
        document,
      },
      include: {
        user: true,
      },
    });

    return patient ? toPatientResponse(patient) : null;
  }
}
