import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Main route - protected home
  index("routes/home.tsx"),

  // Auth routes
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Thread routes
  route("threads/:threadId", "routes/threads.$threadId.tsx"),
] satisfies RouteConfig;
