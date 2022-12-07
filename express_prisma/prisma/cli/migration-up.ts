import { readdirSync } from 'fs';
import * as path from 'path';
import { isMigration } from './migration';
import { PrismaClient } from "@prisma/client";

const migrationDir = path.resolve(__dirname, '../migrations');
(async () => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const files = readdirSync(migrationDir);
  for (const file of files) {
    const importedModule = await import(
      path.resolve(__dirname, migrationDir, file)
    );

    if (!isMigration(importedModule.default)) {
      continue;
    }
    const instance = new importedModule.default();

    await prisma.$queryRaw`CREATE TABLE IF NOT EXISTS "migrations" (
       "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
       "name" TEXT NOT NULL UNIQUE,
       "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`;

    const count: any[] =
      await prisma.$queryRaw`SELECT id from migrations where name = ${file}`;

    if (count.length === 0) {
      try {
        await instance.up(prisma);
        console.log(`Migrated: ${file}`);
        await prisma.$queryRaw`INSERT INTO migrations (name) values (${file})`;
      } catch (e) {
        console.error(e);
      }
    }
  }

  await prisma.$disconnect();
})();
