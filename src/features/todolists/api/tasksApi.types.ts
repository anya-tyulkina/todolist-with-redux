import { TaskPriority, TaskStatus } from "@/common/enums/enums"
import z from "zod/v4"
import { domainTaskSchema } from "../model"

export type DomainTask = z.infer<typeof domainTaskSchema>

export type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: DomainTask[]
}

export type UpdateTaskModel = {
  description: string | null
  title: string
  status: TaskStatus
  priority: TaskPriority
  startDate: string | null
  deadline: string | null
}
