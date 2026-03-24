import { instance } from "@/common/instance"
import type { DefaultResponseSchema } from "@/common/types"
import type { Todolist, CreateTodolistResponse } from "./todolistsApi.types"

export const todolistsApi = {
  getTodolists() {
    return instance.get<Todolist[]>("/todo-lists")
  },
  changeTodolistTitle(payload: { id: string; title: string }) {
    const { id, title } = payload
    return instance.put<DefaultResponseSchema>(`/todo-lists/${id}`, { title })
  },
  createTodolist(title: string) {
    return instance.post<CreateTodolistResponse>("/todo-lists", { title })
  },
  deleteTodolist(id: string) {
    return instance.delete<DefaultResponseSchema>(`/todo-lists/${id}`)
  },
}
