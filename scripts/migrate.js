import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { getPool } from "../lib/cms/db.js";

const currentDir = dirname(fileURLToPath(import.meta.url));

export async function migrate() {
  const sqlPath = join(currentDir, "migrations", "001_cms.sql");
  const sql = await readFile(sqlPath, "utf8");
  const pool = getPool();
  await pool.query(sql);
  console.log("Database migration completed.");
}

const invokedFile = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedFile === fileURLToPath(import.meta.url)) {
  migrate()
    .then(() => getPool().end())
    .catch((error) => {
      console.error("Database migration failed.");
      process.exitCode = 1;
    });
}
