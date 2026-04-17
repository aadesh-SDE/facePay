import { app } from "./app.js";
import { loadEnv } from "./shared/lib/env.js";

const { PORT } = loadEnv();
const port = Number(PORT);

app.listen(port, "0.0.0.0", () => {
  console.log(`FacePay API listening on 0.0.0.0:${port}`);
});
