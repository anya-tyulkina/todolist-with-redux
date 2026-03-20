import z from "zod/v4"
import type { todolistSchema } from "@/features/todolists/model/schemas/schemas.ts"

export type Todolist = z.infer<typeof todolistSchema>
