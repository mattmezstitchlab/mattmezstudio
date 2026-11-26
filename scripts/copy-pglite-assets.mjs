import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const src = "node_modules/@electric-sql/pglite/dist";
const dest = ".vercel/output/functions/__server.func/_libs";
if (!existsSync(dest)) {
  console.log("[pglite] function bundle not present, skip");
  process.exit(0);
}
for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  copyFileSync(join(src, name), join(dest, name));
}
console.log("[pglite] copied wasm and data next to the server bundle");
