import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "path";

function apiServerMiddlewarePlugin(): Plugin {
  return {
    name: "api-server-middleware",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && (req.url === "/api" || req.url.startsWith("/api/"))) {
          try {
            const { default: handler } = await server.ssrLoadModule("/src/server.ts");
            await handler(req, res);
          } catch (err) {
            console.error("Vite API Server Error:", err);
            next(err);
          }
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

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
