import { app } from "./app.js";
import { loadEnv } from "./shared/lib/env.js";

const { PORT } = loadEnv();

app.listen(PORT, () => {
  console.log(`FacePay API listening on http://localhost:${PORT}`);
});
