import z from "zod/v4"
import { TaskPriority, TaskStatus } from "@/common/enums"

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  deadline: z.string().nullable(),
  startDate: z.string().nullable(),
  title: z.string(),
  id: z.string(),
  todoListId: z.string(),
  order: z.int(),
  addedDate: z.iso.datetime({local: true}),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
})
