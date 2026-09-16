import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "path";
import fs from "fs";

function apiServerMiddlewarePlugin(): Plugin {
  return {
    name: "api-server-middleware",
    configureServer(server) {
      // Also watch root .env files so updating root .env automatically triggers reload
      const rootDir = path.resolve(__dirname, "../../..");
      const rootEnvPath = path.join(rootDir, ".env");
      const rootEnvLocalPath = path.join(rootDir, ".env.local");
      if (fs.existsSync(rootEnvPath)) server.watcher.add(rootEnvPath);
      if (fs.existsSync(rootEnvLocalPath)) server.watcher.add(rootEnvLocalPath);

      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url === "/api" || req.url.startsWith("/api/"))) {
          try {
            const { default: handler } = await server.ssrLoadModule("/src/server.ts");
            await handler(req, res);
          } catch (err) {
            console.error("Vite API Server Error:", err);
            next(err);
          }
          return;
        }

        // Static image fallback for /src/assets/* or /assets/* image requests in dev
        if (req.url && (req.url.startsWith("/src/assets/") || req.url.startsWith("/assets/"))) {
          const rawPath = req.url.split("?")[0];
          const filename = path.basename(rawPath);
          const candidates = [
            path.join(__dirname, "public", "images", "products", filename),
            path.join(__dirname, "public", "images", filename),
            path.join(__dirname, "public", "assets", filename),
            path.join(__dirname, "src", "assets", filename),
          ];
          const found = candidates.find((p) => fs.existsSync(p));
          if (found) {
            const ext = path.extname(found).toLowerCase();
            const mimeTypes: Record<string, string> = {
              ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg",
              ".png": "image/png",
              ".webp": "image/webp",
              ".svg": "image/svg+xml",
              ".mp4": "video/mp4",
            };
            const contentType = mimeTypes[ext] || "application/octet-stream";
            res.setHeader("Content-Type", contentType);
            res.setHeader("Cache-Control", "public, max-age=3600");
            fs.createReadStream(found).pipe(res);
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(__dirname, "../../..");
  const innerEnv = loadEnv(mode, __dirname, "");
  const rootEnv = fs.existsSync(rootDir) ? loadEnv(mode, rootDir, "") : {};
  const cwdEnv =
    process.cwd() !== __dirname && process.cwd() !== rootDir ? loadEnv(mode, process.cwd(), "") : {};

  // Merge envs: inner project defaults first, then cwd, and root directory overrides so root .env edits take immediate effect
  const mergedEnv = {
    ...innerEnv,
    ...cwdEnv,
    ...rootEnv,
  };
  Object.assign(process.env, mergedEnv);

  return {
    plugins: [tailwindcss(), tsConfigPaths(), react(), apiServerMiddlewarePlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
    },
  };
});
