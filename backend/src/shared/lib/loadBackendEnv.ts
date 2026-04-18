import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Load `backend/.env` regardless of process cwd (matches Docker `env_file: .env`). */
export function loadBackendEnv(): void {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const backendRoot = path.resolve(here, "../../..");
  config({ path: path.join(backendRoot, ".env") });
}
