import { instance } from "@/common/instance"
import type { DefaultResponseSchema } from "@/common/types"
import type { DomainTask, GetTasksResponse, TaskOperationResponse } from "./tasksApi.types"

export const tasksApi = {
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`/todo-lists/${todolistId}/tasks`)
  },
  createTask(payload: { todolistId: string; title: string }) {
    const { todolistId, title } = payload
    return instance.post<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask(payload: { model: DomainTask; todolistId: string; id: string }) {
    const { todolistId, id, model } = payload
    return instance.put<TaskOperationResponse>(`/todo-lists/${todolistId}/tasks/${id}`, model)
  },
  deleteTask(payload: { todolistId: string; taskId: string }) {
    const { todolistId, taskId } = payload
    return instance.delete<DefaultResponseSchema>(`/todo-lists/${todolistId}/tasks/${taskId}`)
  },
}
