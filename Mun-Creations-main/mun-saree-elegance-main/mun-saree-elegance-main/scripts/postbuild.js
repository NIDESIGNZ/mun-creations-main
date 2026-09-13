import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, "..");
const repoRootDir = path.resolve(appDir, "../../..");

function runPostBuild() {
  console.log("=== RUNNING COMPLETE POST-BUILD SPA & SERVERLESS API PIPELINE ===");

  const distDir = path.join(appDir, "dist");
  const staticDir = path.join(appDir, ".vercel", "output", "static");
  const functionsDir = path.join(appDir, ".vercel", "output", "functions", "__server.func");

  // 1. Ensure directories exist
  if (!fs.existsSync(staticDir)) fs.mkdirSync(staticDir, { recursive: true });
  if (!fs.existsSync(functionsDir)) fs.mkdirSync(functionsDir, { recursive: true });

  // 2. Sync Vite dist/ -> .vercel/output/static
  if (fs.existsSync(distDir)) {
    fs.cpSync(distDir, staticDir, { recursive: true });
    console.log(`[Static] Synced Vite dist/ -> ${staticDir}`);
  }

  // 3. Compile serverless API handler with esbuild
  const serverEntry = path.join(appDir, "src", "server.ts");
  const serverOutput = path.join(functionsDir, "index.mjs");
  console.log(`[API] Compiling ${serverEntry} -> ${serverOutput}...`);
  execSync(
    `npx esbuild "${serverEntry}" --bundle --platform=node --format=esm --banner:js="import { createRequire } from 'module'; const require = createRequire(import.meta.url);" --loader:.jpg=empty --loader:.png=empty --loader:.svg=empty --loader:.mp4=empty --loader:.webp=empty --outfile="${serverOutput}"`,
    { stdio: "inherit", cwd: appDir },
  );

  // 4. Write function .vc-config.json
  const vcConfig = {
    runtime: "nodejs20.x",
    handler: "index.mjs",
    launcherType: "Nodejs",
    shouldAddHelpers: false,
    supportsResponseStreaming: true,
  };
  fs.writeFileSync(
    path.join(functionsDir, ".vc-config.json"),
    JSON.stringify(vcConfig, null, 2),
    "utf-8",
  );
  console.log(`[API] Wrote ${path.join(functionsDir, ".vc-config.json")}`);

  // 5. Write .vercel/output/config.json with explicit SPA + API routing
  const config = {
    version: 3,
    framework: { name: "vite", version: "8.1.5" },
    routes: [
      {
        src: "^/(.*)$",
        has: [{ type: "host", value: "muncreation.com" }],
        headers: { Location: "https://www.muncreation.com/$1" },
        status: 301,
      },
      { headers: { "cache-control": "public, max-age=31536000, immutable" }, src: "/assets/(.*)" },
      { handle: "filesystem" },
      { src: "/api/(.*)", dest: "/__server" },
      { src: "/(.*)", dest: "/index.html" },
    ],
  };
  const appConfigFile = path.join(appDir, ".vercel", "output", "config.json");
  fs.writeFileSync(appConfigFile, JSON.stringify(config, null, 2), "utf-8");
  console.log(`[Routing] Wrote clean Vercel routing to ${appConfigFile}`);

  // 6. Sync .vercel/output to repo root
  const rootVercelOutput = path.join(repoRootDir, ".vercel", "output");
  const appVercelOutput = path.join(appDir, ".vercel", "output");
  if (fs.existsSync(appVercelOutput)) {
    fs.cpSync(appVercelOutput, rootVercelOutput, { recursive: true });
    console.log(`[Sync] Synced .vercel/output to repo root: ${rootVercelOutput}`);
  }

  console.log("=== POST-BUILD COMPLETE ===");
}

runPostBuild();
