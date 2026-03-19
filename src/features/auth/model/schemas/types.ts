import { z } from "zod/v4"
import { loginSchema } from "@/features/auth/model"

export type LoginInputs = z.infer<typeof loginSchema>
