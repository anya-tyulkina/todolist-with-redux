import { TaskPriority, TaskStatus } from "@/common/enums/enums"
import { baseResponseSchema } from "@/common/types"
import z from "zod/v4"

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

export type DomainTask = z.infer<typeof domainTaskSchema>
export type GetTasksResponse = z.infer<typeof getTasksSchema>


export const responseOperationTasksSchema = baseResponseSchema(
  z.object({
    item: domainTaskSchema,
  })
)

export type TaskOperationResponse = z.infer<typeof responseOperationTasksSchema>

export const getTasksSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number().int().nonnegative(),
  items: domainTaskSchema.array(),
})


export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}
