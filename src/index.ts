import { Elysia } from 'elysia'
import { openapi } from '@elysiajs/openapi'
import { healthHandler } from './handlers/health'
import { usersHandler } from './handlers/users'
import { booksHandler } from './handlers/books'
import { librariesHandler } from './handlers/libraries'

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: 'E-Library API',
          version: '1.0.0',
          description: 'A comprehensive API for managing an e-library system with users, books, and library branches',
        },
      },
    })
  )
  .use(healthHandler)
  .use(usersHandler)
  .use(booksHandler)
  .use(librariesHandler)
  .listen(3000)

console.log(
  `🦊 Server running at http://${app.server?.hostname}:${app.server?.port}`
)
console.log(
  `📚 API Documentation: http://${app.server?.hostname}:${app.server?.port}/openapi`
)
console.log(
  `📚 API JSON schema: http://${app.server?.hostname}:${app.server?.port}/openapi/json`
)

export type App = typeof app
