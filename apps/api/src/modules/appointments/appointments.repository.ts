import type { Appointment } from "@clinica/types/index";
import type { PrismaClient } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { CreateAppointmentInput } from "./appointments.schema";

export interface AppointmentsRepository {
  create(input: CreateAppointmentInput): Promise<Appointment>;
  list(): Promise<Appointment[]>;
  patientExists(patientId: string): Promise<boolean>;
  professionalExists(professionalId: string): Promise<boolean>;
}

interface AppointmentRecord {
  id: string;
  patientId: string;
  professionalId: string;
  date: Date;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
  notes: string | null;
  createdAt: Date;
}

function toAppointment(record: AppointmentRecord): Appointment {
  return {
    id: record.id,
    patientId: record.patientId,
    professionalId: record.professionalId,
    date: record.date.toISOString(),
    status: record.status,
    notes: record.notes ?? undefined,
    createdAt: record.createdAt.toISOString(),
  };
}

export class PrismaAppointmentsRepository implements AppointmentsRepository {
  constructor(private readonly client: PrismaClient = prisma) {}

  async create(input: CreateAppointmentInput): Promise<Appointment> {
    const created = await this.client.appointment.create({
      data: {
        patientId: input.patientId,
        professionalId: input.professionalId,
        date: new Date(input.date),
        status: input.status,
        notes: input.notes ?? null,
      },
    });

    return toAppointment(created);
  }

  async list(): Promise<Appointment[]> {
    const appointments = await this.client.appointment.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return appointments.map(toAppointment);
  }

  async patientExists(patientId: string): Promise<boolean> {
    const patient = await this.client.patient.findUnique({
      where: { id: patientId },
      select: { id: true },
    });
    return Boolean(patient);
  }

  async professionalExists(professionalId: string): Promise<boolean> {
    const professional = await this.client.professional.findUnique({
      where: { id: professionalId },
      select: { id: true },
    });
    return Boolean(professional);
  }
}
