import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { webSocketManager } from "./app/server/websocketManager";

export default defineConfig({
  server: {
    hmr: {
      port: 8980
    },
    allowedHosts: ['devbake.ngrok.io'],
    watch: {
      ignored: ['**/fileStorage/**'], // Ignore the fileStorage directory
    },
  },
  plugins: [
    tailwindcss(), reactRouter(), tsconfigPaths(),
    {
      name: 'websocket-server',
      configureServer(server: any) {
        console.log('--- Configuring WebSocket server');
        if (server.httpServer) {
          // Initialize the WebSocket server with the HTTP server
          webSocketManager.initialize(server.httpServer);
        } else {
          console.error('--- HTTP server is not available');
        }
      }
    },
  ],
});
