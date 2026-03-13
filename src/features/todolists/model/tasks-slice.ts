import { createTodolistTC, deleteTodolistTC } from "./todolists-slice.ts"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import type { RootState } from "@/app/store.ts"
import { ResultCode } from "@/common/enums"
import { createAppSlice, handleCatchError, handleStatusCodeError } from "@/common/utils"
import { tasksApi } from "../api/tasksApi.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => ({
    fetchTasks: create.asyncThunk(
      async (todolistId: string, { rejectWithValue }) => {
        try {
          const res = await tasksApi.getTasks(todolistId)
          return { tasks: res.data.items, todolistId }
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        },
      },
    ),
    createTasksTC: create.asyncThunk(
      async (args: { todolistId: string; title: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          const res = await tasksApi.createTask(args)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleStatusCodeError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        } finally {
          dispatch(changeStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.task.todoListId]?.unshift(action.payload.task)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          const res = await tasksApi.deleteTask(args)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return args
          } else {
            handleStatusCodeError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          const tasks = state[action.payload.todolistId]
          const index = tasks.findIndex((task) => task.id === action.payload.taskId)
          if (index !== -1) {
            tasks.splice(index, 1)
          }
        },
      },
    ),
    updateTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
        { rejectWithValue, getState, dispatch },
      ) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          let task = (getState() as RootState).tasks[payload.todolistId].find((el) => el.id === payload.taskId)

          if (!task) {
            return rejectWithValue("Error")
          }

          const model: DomainTask = { ...task, ...payload.domainModel }
          const res = await tasksApi.updateTask({ model, todolistId: payload.todolistId, id: payload.taskId })
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item }
          } else {
            handleStatusCodeError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        }
      },
      {
        fulfilled: (state, action) => {
          let task = state[action.payload.task.todoListId]
          let index = task.findIndex((el) => el.id === action.payload.task.id)

          if (index !== -1) {
            task[index] = action.payload.task
          }
        },
      },
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})

export const { deleteTaskTC, createTasksTC, updateTaskTC, fetchTasks } = tasksSlice.actions
export const { selectTasks } = tasksSlice.selectors
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
