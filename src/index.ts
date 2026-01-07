import cors from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";

import { booksHandler } from "./handlers/books";
import { healthHandler } from "./handlers/health";
import { librariesHandler } from "./handlers/libraries";
import { usersHandler } from "./handlers/users";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: "E-Library API",
          version: "1.0.0",
          description:
            "A comprehensive API for managing an e-library system with users, books, and library branches",
        },
      },
    }),
  )
  .use(cors())
  .use(healthHandler)
  .use(usersHandler)
  .use(booksHandler)
  .use(librariesHandler)
  .listen(PORT, () => {
    console.log(`🦊 Server running on port ${PORT}`);
    console.log(`📚 API Documentation at /openapi`);
    console.log(`📚 API JSON schema at /openapi/json`);
  });
