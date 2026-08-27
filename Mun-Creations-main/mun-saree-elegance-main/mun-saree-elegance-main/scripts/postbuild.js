import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, "..");
const repoRootDir = path.resolve(appDir, "../../..");

function runPostBuild() {
  console.log("=== RUNNING POST-BUILD SPA & VERCEL OUTPUT OPTIMIZATION ===");

  const staticDir = path.join(appDir, ".vercel", "output", "static");
  const assetsDir = path.join(staticDir, "assets");

  if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
  }

  let jsFile = "assets/index.js";
  let cssLinks = "";

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const mainJs = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
    if (mainJs) jsFile = `/assets/${mainJs}`;

    const cssFiles = files.filter((f) => f.endsWith(".css"));
    cssLinks = cssFiles
      .map((c) => `    <link rel="stylesheet" href="/assets/${c}" />`)
      .join("\n");
  }

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mun Creations | Luxury Handloom Sarees</title>
    <meta name="description" content="Discover exquisite handwoven Banarasi, Kanjivaram, and Tussar silk sarees crafted by master weavers. Mun Creations — Where Heritage Meets Haute Couture." />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
${cssLinks}
  </head>
  <body class="bg-background text-foreground antialiased selection:bg-[#c5a880]/30 min-h-screen">
    <div id="root"></div>
    <script type="module" src="${jsFile}"></script>
  </body>
</html>`;

  // 1. Write index.html to .vercel/output/static
  const staticIndex = path.join(staticDir, "index.html");
  fs.writeFileSync(staticIndex, html, "utf-8");
  console.log(`Generated ${staticIndex}`);

  // 2. Configure clean Build Output API v3 config.json
  const config = {
    version: 3,
    framework: { name: "nitro", version: "3.0.260603-beta" },
    routes: [
      { headers: { "cache-control": "public, max-age=31536000, immutable" }, "src": "/assets/(.*)" },
      { handle: "filesystem" },
      { src: "/api/(.*)", dest: "/__server" },
      { src: "/(.*)", dest: "/index.html" }
    ]
  };
  const appConfigFile = path.join(appDir, ".vercel", "output", "config.json");
  fs.writeFileSync(appConfigFile, JSON.stringify(config, null, 2), "utf-8");
  console.log(`Configured clean Vercel routing in ${appConfigFile}`);

  // 3. Sync to dist/
  const distDir = path.join(appDir, "dist");
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  fs.cpSync(staticDir, distDir, { recursive: true });
  console.log(`Synced static files to ${distDir}`);

  // 4. Sync .vercel/output to repo root
  const rootVercelOutput = path.join(repoRootDir, ".vercel", "output");
  const appVercelOutput = path.join(appDir, ".vercel", "output");
  if (fs.existsSync(appVercelOutput)) {
    fs.cpSync(appVercelOutput, rootVercelOutput, { recursive: true });
    console.log(`Synced .vercel/output to repo root: ${rootVercelOutput}`);
  }

  console.log("=== POST-BUILD COMPLETE ===");
}

runPostBuild();
