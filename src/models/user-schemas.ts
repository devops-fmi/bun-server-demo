import { t } from 'elysia'

export const createUserSchema = t.Object({
  name: t.String({ minLength: 1 }),
  email: t.String({ format: 'email' }),
  role: t.Optional(t.Union([t.Literal('admin'), t.Literal('user')])),
})

export const patchUserSchema = t.Object({
  name: t.Optional(t.String({ minLength: 1 })),
  email: t.Optional(t.String({ format: 'email' })),
  role: t.Optional(t.Union([t.Literal('admin'), t.Literal('user')])),
})

export const userSchema = t.Object({
  id: t.String({ format: 'uuid' }),
  name: t.String({ minLength: 1 }),
  email: t.String({ format: 'email' }),
  role: t.Union([t.Literal('admin'), t.Literal('user')]),
  createdAt: t.Date(),
})

export type CreateUserInput = typeof createUserSchema.static
export type PatchUserInput = typeof patchUserSchema.static
export type User = typeof userSchema.static
