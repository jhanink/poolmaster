import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('/services/assign-guest', "server/assignGuestService.server.ts"),
  route("/services/delete-guest", "server/deleteGuestService.server.ts"),
  route("/services/save-guest", "server/saveGuestService.server.ts"),
  route("/services/storage", "server/storageService.server.ts"),
] satisfies RouteConfig;
