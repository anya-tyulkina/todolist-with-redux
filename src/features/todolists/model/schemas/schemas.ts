import * as z from "zod"
import { ResultCode, TaskPriority, TaskStatus } from "@/common/enums"

const baseResponseSchema = <T extends z.ZodTypeAny>(dataSchema?: T) => {

  const actualSchema = dataSchema ? z.object({ item: dataSchema }) : z.object({})

  return z.object({
    data: actualSchema,
    resultCode: z.enum(ResultCode),
    messages: z.array(z.string()),
    fieldsErrors: z.array(z.string()),
  })
}

//tasks schemas
export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  deadline: z.string().nullable(),
  startDate: z.string().nullable(),
  title: z.string(),
  id: z.string(),
  todoListId: z.string(),
  order: z.int(),
  addedDate: z.iso.datetime({ local: true }),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
})
export const responseCreateTasksSchema = baseResponseSchema(domainTaskSchema)
export const responseDeleteTasksSchema = baseResponseSchema()
export const responseUpdateTasksSchema = baseResponseSchema(domainTaskSchema)

//todolists schemas
export const todolistSchema = z.object({
  id: z.string(),
  title: z.string(),
  addedDate: z.iso.datetime({ local: true }),
  order: z.number(),
})
export const responseUpdateTodolistSchema = baseResponseSchema()
export const responseDeleteTodolistSchema = baseResponseSchema()
export const responseCreateTodolistSchema = baseResponseSchema(todolistSchema)


export type responseTodolistSchema = z.infer<typeof responseUpdateTodolistSchema>
export type responseCreateTasksType = z.infer<typeof responseCreateTasksSchema>
