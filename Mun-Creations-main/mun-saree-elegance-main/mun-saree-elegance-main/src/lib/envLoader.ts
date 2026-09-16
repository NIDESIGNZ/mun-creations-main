import fs from "fs";
import path from "path";

let envLoaded = false;

/**
 * Ensures environment variables are reliably loaded from candidate .env files.
 * Checks both inner project directory and repository root directory.
 */
export function ensureEnvLoaded(): void {
  if (typeof process === "undefined" || !process.env) return;

  const candidateDirs: string[] = [];

  try {
    if (typeof process.cwd === "function") {
      const cwd = process.cwd();
      candidateDirs.push(cwd);
      candidateDirs.push(path.resolve(cwd, ".."));
      candidateDirs.push(path.resolve(cwd, "../.."));
      candidateDirs.push(path.resolve(cwd, "../../.."));
    }
  } catch {
    // ignore
  }

  try {
    if (typeof __dirname !== "undefined") {
      candidateDirs.push(__dirname);
      candidateDirs.push(path.resolve(__dirname, ".."));
      candidateDirs.push(path.resolve(__dirname, "../.."));
      candidateDirs.push(path.resolve(__dirname, "../../.."));
    }
  } catch {
    // ignore
  }

  const uniqueDirs = Array.from(new Set(candidateDirs.filter(Boolean)));

  for (const dir of uniqueDirs) {
    for (const file of [".env.local", ".env"]) {
      try {
        const fullPath = path.join(dir, file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          for (const line of content.split(/\r?\n/)) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith("#")) continue;
            const eqIdx = trimmed.indexOf("=");
            if (eqIdx > 0) {
              const key = trimmed.substring(0, eqIdx).trim();
              let val = trimmed.substring(eqIdx + 1).trim();
              if (
                (val.startsWith('"') && val.endsWith('"')) ||
                (val.startsWith("'") && val.endsWith("'"))
              ) {
                val = val.slice(1, -1);
              }
              if (!process.env[key] && val) {
                process.env[key] = val;
              }
            }
          }
        }
      } catch {
        // ignore read errors
      }
    }
  }

  envLoaded = true;
}
