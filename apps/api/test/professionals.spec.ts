import { beforeEach, describe, expect, it } from "vitest";
import { buildApp } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("professionals module", () => {
  beforeEach(async () => {
    await prisma.professional.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.user.deleteMany();
  });

  it("POST /professionals should create professional with user", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "Dr. Carlos",
          email: "carlos@example.com",
          passwordHash: "hash123",
        },
        professional: {
          specialty: "Psiquiatria",
          document: "CRM12345",
        },
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: expect.any(String),
      specialty: "Psiquiatria",
      user: {
        name: "Dr. Carlos",
        email: "carlos@example.com",
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

    await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "Dr. Carlos",
          email: "carlos@example.com",
          passwordHash: "hash123",
        },
        professional: {
          specialty: "Psiquiatria",
          document: "CRM12345",
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
        email: "carlos@example.com",
      },
    });
  });

  it("POST /professionals should return 409 when email already exists", async () => {
    const app = buildApp();

    await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "Dr. Carlos",
          email: "carlos@example.com",
          passwordHash: "hash123",
        },
        professional: {
          specialty: "Psiquiatria",
          document: "CRM12345",
        },
      },
    });

    const response = await app.inject({
      method: "POST",
      url: "/professionals",
      payload: {
        user: {
          name: "Dra. Julia",
          email: "carlos@example.com",
          passwordHash: "hash456",
        },
        professional: {
          specialty: "Neurologia",
          document: "CRM54321",
        },
      },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toEqual({
      message: "Professional with this email already exists.",
    });
  });
});
