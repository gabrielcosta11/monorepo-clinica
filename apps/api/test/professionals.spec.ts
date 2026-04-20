import { beforeEach, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import { buildApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

function uniqueValue(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`;
}

describe("professionals module", () => {
  beforeEach(async () => {
    await prisma.medicalRecord.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.professional.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
  });

  it("POST /professionals should create professional with user", async () => {
    const app = buildApp();
    const email = `${uniqueValue("carlos")}@example.com`;
    const document = uniqueValue("crm");

    const response = await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "Dr. Carlos",
          email,
          passwordHash: "hash123",
        },
        professional: {
          specialty: "Psiquiatria",
          document,
        },
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: expect.any(String),
      specialty: "Psiquiatria",
      user: {
        name: "Dr. Carlos",
        email,
        role: "PROFESSIONAL",
      },
    });
    expect(response.json().user.passwordHash).toBeUndefined();
  });

  it("POST /professionals should return 400 with invalid payload", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "",
          email: "carlos@example.com",
          passwordHash: "hash123",
        },
        professional: {
          specialty: "",
          document: "CRM12345",
        },
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("GET /professionals should list created professionals", async () => {
    const app = buildApp();
    const email = `${uniqueValue("carlos")}@example.com`;
    const document = uniqueValue("crm");

    await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "Dr. Carlos",
          email,
          passwordHash: "hash123",
        },
        professional: {
          specialty: "Psiquiatria",
          document,
        },
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/professionals",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveLength(1);
    expect(response.json()[0]).toMatchObject({
      specialty: "Psiquiatria",
      user: {
        email,
      },
    });
  });

  it("POST /professionals should return 409 when email already exists", async () => {
    const app = buildApp();
    const sharedEmail = `${uniqueValue("carlos")}@example.com`;
    const documentA = uniqueValue("crm");
    const documentB = uniqueValue("crm");

    await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "Dr. Carlos",
          email: sharedEmail,
          passwordHash: "hash123",
        },
        professional: {
          specialty: "Psiquiatria",
          document: documentA,
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "Dra. Julia",
          email: sharedEmail,
          passwordHash: "hash456",
        },
        professional: {
          specialty: "Neurologia",
          document: documentB,
        },
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: "Professional with this email already exists.",
    });
  });
});
