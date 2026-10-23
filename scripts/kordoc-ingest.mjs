// Kordoc document ingestion for clinical reference tools (Node.js >=20).
// Install in a separate trusted working directory: npm install kordoc
// Run: node scripts/kordoc-ingest.mjs input.hwpx output.json
// Do not publish patient-identifiable source documents or unreviewed outputs.
import { parse } from "kordoc";
import { writeFile } from "node:fs/promises";
import { resolve, extname } from "node:path";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node scripts/kordoc-ingest.mjs <input.hwp|hwpx|pdf> <output.json>");
  process.exit(2);
}
if (![".hwp", ".hwpx", ".pdf"].includes(extname(input).toLowerCase())) {
  throw new Error("Only HWP, HWPX and PDF are enabled for this ingestion workflow.");
}
const result = await parse(resolve(input));
if (!result.success) throw new Error("Kordoc parsing failed; source file was not imported.");
const record = {
  schemaVersion: 1,
  sourceFile: input.split(/[\\/]/).pop(),
  parser: "kordoc",
  status: "pending-human-review",
  parsedAt: new Date().toISOString(),
  metadata: result.metadata ?? null,
  markdown: result.markdown ?? "",
  blocks: result.blocks ?? []
};
await writeFile(resolve(output), JSON.stringify(record, null, 2), { flag: "wx" });
console.log("Parsed. Human verification required before publishing:", output);
