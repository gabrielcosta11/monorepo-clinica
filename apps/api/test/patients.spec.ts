import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app";

describe("patients module", () => {
  it("POST /patients should create patient with user", async () => {
    const app = buildApp();

    const response = await app.inject({
      method: "POST",
      url: "/patients",
      payload: {
        user: {
          name: "Ana Lima",
          email: "ana@example.com",
          passwordHash: "hash123",
        },
        patient: {
          birthDate: "1990-01-01T00:00:00.000Z",
          document: "12345678900",
          phone: "11999999999",
        },
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: expect.any(String),
      document: "12345678900",
      user: {
        name: "Ana Lima",
        email: "ana@example.com",
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

    await app.inject({
      method: "POST",
      url: "/patients",
      payload: {
        user: {
          name: "Ana Lima",
          email: "ana@example.com",
          passwordHash: "hash123",
        },
        patient: {
          birthDate: "1990-01-01T00:00:00.000Z",
          document: "12345678900",
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
      document: "12345678900",
      user: {
        email: "ana@example.com",
      },
    });
  });
});
