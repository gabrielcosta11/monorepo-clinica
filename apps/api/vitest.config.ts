import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const apiDir = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(apiDir, "../..");

export default defineConfig({
  test: {
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@clinica/types": path.join(workspaceRoot, "packages", "types", "src"),
      "@clinica/domain": path.join(workspaceRoot, "packages", "domain", "src"),
      "@clinica/validation": path.join(
        workspaceRoot,
        "packages",
        "validation",
        "src",
      ),
      "@clinica/config": path.join(workspaceRoot, "packages", "config", "src"),
      "@clinica/design-tokens": path.join(
        workspaceRoot,
        "packages",
        "design-tokens",
        "src",
      ),
    },
  },
});
