import { Elysia, t } from "elysia";

export const healthHandler = new Elysia({
  prefix: "/health",
  detail: {
    tags: ["Health"],
    description: "Health check endpoints",
  },
}).get(
  "/",
  () => ({
    status: "ok" as const,
    timestamp: new Date().toISOString(),
  }),
  {
    response: t.Object({
      status: t.Literal("ok"),
      timestamp: t.String(),
    }),
    detail: {
      summary: "Health check",
      description: "Returns the health status of the server",
    },
  },
);
