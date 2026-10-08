// Runs during `npm run build`: creates/updates the database tables.
// Skips (with a clear message) when no database is connected yet, so the first
// Vercel deploy succeeds; connect Neon and redeploy to create the tables.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.warn("\n[treename] DATABASE_URL is not set: skipping database setup. Connect Neon in Vercel → Storage, then redeploy.\n");
  process.exit(0);
}
if (!process.env.DATABASE_URL_UNPOOLED) process.env.DATABASE_URL_UNPOOLED = process.env.DATABASE_URL;
execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: process.env });
