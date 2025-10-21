import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Protected routes
  layout("layouts/ProtectedLayout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("threads", "routes/threads.tsx"),
    // Add more protected routes here
  ]),
] satisfies RouteConfig;
