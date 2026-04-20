import { beforeEach, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { buildApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

function uniqueValue(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

describe("patients module", () => {
  beforeEach(async () => {
    await prisma.medicalRecord.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.professional.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
  });

  it("POST /patients should create patient with user", async () => {
    const app = buildApp();
    const email = `${uniqueValue("ana")}@example.com`;
    const document = uniqueValue("doc");

    const response = await app.inject({
      method: "POST",
      url: "/patients",
      payload: {
        user: {
          name: "Ana Lima",
          email,
          passwordHash: "hash123",
        },
        patient: {
          birthDate: "1990-01-01T00:00:00.000Z",
          document,
          phone: "11999999999",
        },
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: expect.any(String),
      document,
      user: {
        name: "Ana Lima",
        email,
        role: "PATIENT",
      },
    });
    expect(response.json().user.passwordHash).toBeUndefined();
  });

  it("POST /patients should return 400 with invalid payload", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/patients",
      payload: {
        user: {
          name: "",
          email: "ana@example.com",
          passwordHash: "hash123",
        },
        patient: {
          birthDate: "invalid-date",
          document: "12345678900",
          phone: "11999999999",
        },
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("GET /patients should list created patients", async () => {
    const app = buildApp();
    const email = `${uniqueValue("ana")}@example.com`;
    const document = uniqueValue("doc");

    await app.inject({
      method: "POST",
      url: "/patients",
      payload: {
        user: {
          name: "Ana Lima",
          email,
          passwordHash: "hash123",
        },
        patient: {
          birthDate: "1990-01-01T00:00:00.000Z",
          document,
          phone: "11999999999",
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/patients",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveLength(1);
    expect(response.json()[0]).toMatchObject({
      document,
      user: {
        email,
      },
    });
  });

  it("POST /patients should return 409 when document already exists", async () => {
    const app = buildApp();
    const emailA = `${uniqueValue("ana")}@example.com`;
    const emailB = `${uniqueValue("bruno")}@example.com`;
    const document = uniqueValue("doc");

    await app.inject({
      method: "POST",
      url: "/patients",
      payload: {
        user: {
          name: "Ana Lima",
          email: emailA,
          passwordHash: "hash123",
        },
        patient: {
          birthDate: "1990-01-01T00:00:00.000Z",
          document,
          phone: "11999999999",
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/patients",
      payload: {
        user: {
          name: "Bruno Souza",
          email: emailB,
          passwordHash: "hash456",
        },
        patient: {
          birthDate: "1988-01-01T00:00:00.000Z",
          document,
          phone: "11888888888",
        },
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: "Patient with this document already exists.",
    });
  });
});
