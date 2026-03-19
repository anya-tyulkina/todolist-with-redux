import { z } from 'zod/v4'

export const loginSchema = z.object({
  email: z.email('incorrect email'),
  password: z.string().min(3),
  rememberMe: z.boolean(),
})

