import { beforeEach, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { buildApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

interface AppointmentActors {
  patientId: string;
  professionalId: string;
}

function uniqueValue(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

async function createAppointmentActors(): Promise<AppointmentActors> {
  const app = buildApp();
  const patientEmail = `${uniqueValue("ana")}@example.com`;
  const patientDocument = uniqueValue("doc");
  const professionalEmail = `${uniqueValue("carlos")}@example.com`;
  const professionalDocument = uniqueValue("crm");

  const patientResponse = await app.inject({
    method: "POST",
    url: "/patients",
    payload: {
      user: {
        name: "Ana Lima",
        email: patientEmail,
        passwordHash: "hash123",
      },
      patient: {
        birthDate: "1990-01-01T00:00:00.000Z",
        document: patientDocument,
        phone: "11999999999",
      },
    },
  });

  const professionalResponse = await app.inject({
    method: "POST",
    url: "/professionals",
    payload: {
      user: {
        name: "Dr. Carlos",
        email: professionalEmail,
        passwordHash: "hash123",
      },
      professional: {
        specialty: "Psiquiatria",
        document: professionalDocument,
      },
    },
  });

  return {
    patientId: patientResponse.json().id as string,
    professionalId: professionalResponse.json().id as string,
  };
}

describe("appointments module", () => {
  beforeEach(async () => {
    await prisma.medicalRecord.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.professional.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
  });

  it("POST /appointments should create appointment", async () => {
    const app = buildApp();
    const actors = await createAppointmentActors();

    const response = await app.inject({
      method: "POST",
      url: "/appointments",
      payload: {
        patientId: actors.patientId,
        professionalId: actors.professionalId,
        date: "2026-04-20T13:00:00.000Z",
        status: "SCHEDULED",
        notes: "Primeira consulta.",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: expect.any(String),
      patientId: actors.patientId,
      professionalId: actors.professionalId,
      status: "SCHEDULED",
    });
  });

  it("POST /appointments should return 400 with invalid payload", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/appointments",
      payload: {
        patientId: "",
        professionalId: "",
        date: "invalid",
        status: "UNKNOWN",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("POST /appointments should return 409 with missing relations", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/appointments",
      payload: {
        patientId: "pat-missing",
        professionalId: "pro-missing",
        date: "2026-04-20T13:00:00.000Z",
        status: "SCHEDULED",
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: "Appointment requires existing patient and professional.",
    });
  });

  it("GET /appointments should list created appointments", async () => {
    const app = buildApp();
    const actors = await createAppointmentActors();

    await app.inject({
      method: "POST",
      url: "/appointments",
      payload: {
        patientId: actors.patientId,
        professionalId: actors.professionalId,
        date: "2026-04-20T13:00:00.000Z",
        status: "SCHEDULED",
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/appointments",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveLength(1);
    expect(response.json()[0]).toMatchObject({
      patientId: actors.patientId,
      professionalId: actors.professionalId,
      status: "SCHEDULED",
    });
  });
});
