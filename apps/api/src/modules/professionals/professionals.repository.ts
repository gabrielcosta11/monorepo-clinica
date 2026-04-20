import type { PrismaClient } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type {
  CreateProfessionalWithUserInput,
  ProfessionalResponse,
} from "./professionals.schema";

export interface ProfessionalsRepository {
  create(input: CreateProfessionalWithUserInput): Promise<ProfessionalResponse>;
  list(): Promise<ProfessionalResponse[]>;
}

interface ProfessionalWithUserRecord {
  id: string;
  specialty: string;
  document: string;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "PROFESSIONAL" | "PATIENT";
    createdAt: Date;
  };
}

function toProfessionalResponse(
  record: ProfessionalWithUserRecord,
): ProfessionalResponse {
  return {
    id: record.id,
    specialty: record.specialty,
    document: record.document,
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

export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async create(
    input: CreateProfessionalWithUserInput,
  ): Promise<ProfessionalResponse> {
    const created = await this.client.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.user.name,
          email: input.user.email,
          passwordHash: input.user.passwordHash,
          role: "PROFESSIONAL",
        },
      });

      return tx.professional.create({
        data: {
          userId: user.id,
          specialty: input.professional.specialty,
          document: input.professional.document,
        },
        include: {
          user: true,
        },
      });
    });

    return toProfessionalResponse(created);
  }

  async list(): Promise<ProfessionalResponse[]> {
    const professionals = await this.client.professional.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return professionals.map(toProfessionalResponse);
  }
}
