import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Load `backend/.env` regardless of process cwd. */
config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env") });
