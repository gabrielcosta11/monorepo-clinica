import path from "node:path";
import { fileURLToPath } from "node:url";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/client";

const currentFileDir = path.dirname(fileURLToPath(import.meta.url));
const defaultDbPath = path.resolve(currentFileDir, "../../prisma/dev.db");
const datasourceUrl = process.env.DATABASE_URL ?? `file:${defaultDbPath}`;
const adapter = new PrismaBetterSqlite3({ url: datasourceUrl });

export const prisma = new PrismaClient({ adapter });
