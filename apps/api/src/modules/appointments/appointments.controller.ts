import type { FastifyPluginAsync } from "fastify";
import {
  appointmentListResponseSchema,
  appointmentSchema,
  createAppointmentInputSchema,
} from "./appointments.schema";
import {
  AppointmentsConflictError,
  AppointmentsService,
} from "./appointments.service";

export const appointmentsController: FastifyPluginAsync = async (app) => {
  const service = new AppointmentsService();

  app.post("/appointments", async (request, reply) => {
    const parsedBody = createAppointmentInputSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.status(400).send({
        message: "Invalid appointment payload.",
        issues: parsedBody.error.issues,
      });
    }

    try {
      const created = await service.create(parsedBody.data);
      const parsedResponse = appointmentSchema.safeParse(created);

      if (!parsedResponse.success) {
        request.log.error(
          { issues: parsedResponse.error.issues },
          "Invalid appointment response payload.",
        );
        return reply.status(500).send({ message: "Internal server error." });
      }

      return reply.status(201).send(parsedResponse.data);
    } catch (error) {
      if (error instanceof AppointmentsConflictError) {
        return reply.status(409).send({ message: error.message });
      }
      throw error;
    }
  });

  app.get("/appointments", async (request, reply) => {
    const appointments = await service.list();
    const parsedResponse = appointmentListResponseSchema.safeParse(appointments);

    if (!parsedResponse.success) {
      request.log.error(
        { issues: parsedResponse.error.issues },
        "Invalid appointments list response payload.",
      );
      return reply.status(500).send({ message: "Internal server error." });
    }

    return reply.status(200).send(parsedResponse.data);
  });
};
