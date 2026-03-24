import { baseResponseSchema } from "@/common/types"
import z from "zod/v4"

export type Todolist = z.infer<typeof todolistSchema>

export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.number(),
})

export const responseOperationTodolistSchema = baseResponseSchema(
  z.object({
    item: todolistSchema
  })
)



export type CreateTodolistResponse = z.infer<typeof responseOperationTodolistSchema>