// Copies the three self-hosted fonts from their npm packages into src/fonts
// so next/font/local can load them. Runs automatically after `npm install`.
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const nm = "node_modules";
const jobs = [
  ["@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2", "InterTight-Variable.woff2"],
  ["@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2", "InstrumentSerif-Regular.woff2"],
  ["@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2", "InstrumentSerif-Italic.woff2"],
  ["@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", "JetBrainsMono-Variable.woff2"],
];

mkdirSync("src/fonts", { recursive: true });
let missing = 0;
for (const [from, to] of jobs) {
  const src = join(nm, from);
  if (existsSync(src)) copyFileSync(src, join("src/fonts", to));
  else { console.warn("font missing:", src); missing++; }
}
if (missing) {
  console.warn("\nSome fonts were not found. Run `npm install` first, or put the .woff2 files into src/fonts by hand.");
  process.exitCode = 0;
}
