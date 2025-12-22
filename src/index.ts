import { Elysia } from "elysia";
import { openapi } from "@elysiajs/openapi";
import { healthHandler } from "./handlers/health";
import { usersHandler } from "./handlers/users";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "User API",
          version: "1.0.0",
          description: "A simple user management API",
        },
      },
    }),
  )
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: false,
    }),
  )
  .use(healthHandler)
  .use(usersHandler)
  .listen(3000);

console.log(
  `🦊 Server running at http://${app.server?.hostname}:${app.server?.port}`,
);
console.log(
  `📚 API Documentation: http://${app.server?.hostname}:${app.server?.port}/openapi`,
);

export type App = typeof app;
