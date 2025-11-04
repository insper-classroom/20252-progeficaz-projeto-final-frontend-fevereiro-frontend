import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Main route - protected home
  index("routes/home.tsx"),

  // Auth routes
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("verify-email", "routes/verify-email.tsx"),
  route("resend-verification", "routes/resend-verification.tsx"),

  // Thread routes
  route("thread/:id", "routes/thread.$id.tsx"),

  // Report routes
  route("reports", "routes/reports.tsx"),
  route("reports/:id", "routes/report.$id.tsx"),
] satisfies RouteConfig;
