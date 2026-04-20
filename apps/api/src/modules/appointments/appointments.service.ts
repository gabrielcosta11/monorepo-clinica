import type { Appointment } from "@clinica/types/index";
import {
  hasRequiredAppointmentRelations,
  isValidIsoDateTime,
} from "@clinica/domain/index";
import { Prisma } from "../../../generated/prisma/client";
import type { CreateAppointmentInput } from "./appointments.schema";
import {
  PrismaAppointmentsRepository,
  type AppointmentsRepository,
} from "./appointments.repository";

export class AppointmentsConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppointmentsConflictError";
  }
}

export class AppointmentsService {
  constructor(
    private readonly repository: AppointmentsRepository = new PrismaAppointmentsRepository(),
  ) {}

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    if (
      !hasRequiredAppointmentRelations({
        patientId: input.patientId,
        professionalId: input.professionalId,
      })
    ) {
      throw new AppointmentsConflictError(
        "Appointment requires existing patient and professional.",
      );
    }

    if (!isValidIsoDateTime(input.date)) {
      throw new AppointmentsConflictError("Appointment date must be a valid ISO date.");
    }

    const [patientExists, professionalExists] = await Promise.all([
      this.repository.patientExists(input.patientId),
      this.repository.professionalExists(input.professionalId),
    ]);

    if (!patientExists || !professionalExists) {
      throw new AppointmentsConflictError(
        "Appointment requires existing patient and professional.",
      );
    }

    try {
      return await this.repository.create(input);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new AppointmentsConflictError(
          "Appointment requires existing patient and professional.",
        );
      }
      throw error;
    }
  }

  async list(): Promise<Appointment[]> {
    return this.repository.list();
  }
}
