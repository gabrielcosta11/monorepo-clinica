import { Prisma } from "../../../generated/prisma/client";
import type {
  CreateProfessionalWithUserInput,
  ProfessionalResponse,
} from "./professionals.schema";
import {
  PrismaProfessionalsRepository,
  type ProfessionalsRepository,
} from "./professionals.repository";

export class ProfessionalsConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfessionalsConflictError";
  }
}

export class ProfessionalsService {
  constructor(
    private readonly repository: ProfessionalsRepository = new PrismaProfessionalsRepository(),
  ) {}

  async create(
    input: CreateProfessionalWithUserInput,
  ): Promise<ProfessionalResponse> {
    try {
      return await this.repository.create(input);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ProfessionalsConflictError(
          "Professional with this email already exists.",
        );
      }

      throw error;
    }
  }

  async list(): Promise<ProfessionalResponse[]> {
    return this.repository.list();
  }
}
