import type { FastifyPluginAsync } from "fastify";
import {
  createProfessionalWithUserInputSchema,
  professionalListResponseSchema,
  professionalResponseSchema,
} from "./professionals.schema";
import {
  ProfessionalsConflictError,
  ProfessionalsService,
} from "./professionals.service";

export const professionalsController: FastifyPluginAsync = async (app) => {
  const service = new ProfessionalsService();

  app.post("/professionals", async (request, reply) => {
    const parsedBody = createProfessionalWithUserInputSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid professional payload.",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const created = await service.create(parsedBody.data);
      const parsedResponse = professionalResponseSchema.safeParse(created);

      if (!parsedResponse.success) {
        request.log.error(
          { issues: parsedResponse.error.issues },
          "Invalid professional response payload.",
        );
        return reply.status(500).send({ message: "Internal server error." });
      }

      return reply.status(201).send(parsedResponse.data);
    } catch (error) {
      if (error instanceof ProfessionalsConflictError) {
        return reply.status(409).send({ message: error.message });
      }

      throw error;
    }
  });

  app.get("/professionals", async (request, reply) => {
    const professionals = await service.list();
    const parsedResponse = professionalListResponseSchema.safeParse(professionals);

    if (!parsedResponse.success) {
      request.log.error(
        { issues: parsedResponse.error.issues },
        "Invalid professionals list response payload.",
      );
      return reply.status(500).send({ message: "Internal server error." });
    }

    return reply.status(200).send(parsedResponse.data);
  });
};
