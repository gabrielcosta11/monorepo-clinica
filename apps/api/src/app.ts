import Fastify from "fastify";
import { appointmentsController } from "./modules/appointments";
import { professionalsController } from "./modules/professionals";
import { patientsController } from "./modules/patients";

export function buildApp() {
  const app = Fastify();

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.register(patientsController);
  app.register(professionalsController);
  app.register(appointmentsController);

  return app;
}
