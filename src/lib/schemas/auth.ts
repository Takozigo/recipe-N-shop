import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export const registerSchema = z.object({
  username: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
})

export const sessionSchema = z.object({
  id: z.string(),
})
