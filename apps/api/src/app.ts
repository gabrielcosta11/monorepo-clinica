import Fastify from "fastify";
import { patientsController } from "./modules/patients";

export function buildApp() {
  const app = Fastify();

  app.get("/health", async () => {
    return { status: "ok" };
  });

  app.register(patientsController);

  return app;
}
