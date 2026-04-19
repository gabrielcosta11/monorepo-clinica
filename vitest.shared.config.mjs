import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default {
  resolve: {
    alias: {
      zod: path.join(rootDir, "apps", "api", "node_modules", "zod"),
      "@clinica/types": path.join(rootDir, "packages", "types", "src"),
      "@clinica/domain": path.join(rootDir, "packages", "domain", "src"),
      "@clinica/validation": path.join(rootDir, "packages", "validation", "src"),
    },
  },
};
