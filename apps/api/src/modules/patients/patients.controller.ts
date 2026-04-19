import type { FastifyPluginAsync } from "fastify";
import {
  createPatientWithUserInputSchema,
  patientListResponseSchema,
  patientResponseSchema,
} from "./patients.schema";
import { PatientsConflictError, PatientsService } from "./patients.service";

export const patientsController: FastifyPluginAsync = async (app) => {
  const service = new PatientsService();

  app.post("/patients", async (request, reply) => {
    const parsedBody = createPatientWithUserInputSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid patient payload.",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const created = await service.create(parsedBody.data);
      const parsedResponse = patientResponseSchema.safeParse(created);

      if (!parsedResponse.success) {
        request.log.error(
          { issues: parsedResponse.error.issues },
          "Invalid patient response payload.",
        );
        return reply.status(500).send({ message: "Internal server error." });
      }

      return reply.status(201).send(parsedResponse.data);
    } catch (error) {
      if (error instanceof PatientsConflictError) {
        return reply.status(409).send({ message: error.message });
      }

      throw error;
    }
  });

  app.get("/patients", async (request, reply) => {
    const patients = await service.list();
    const parsedResponse = patientListResponseSchema.safeParse(patients);

    if (!parsedResponse.success) {
      request.log.error(
        { issues: parsedResponse.error.issues },
        "Invalid patients list response payload.",
      );
      return reply.status(500).send({ message: "Internal server error." });
    }

    return reply.status(200).send(parsedResponse.data);
  });
};
