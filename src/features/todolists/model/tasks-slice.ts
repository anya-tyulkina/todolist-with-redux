import { createTodolistTC, deleteTodolistTC } from "./todolists-slice.ts"
import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import type { DomainTask, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import type { RootState } from "@/app/store.ts"

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
          return res.data.data.item
        } catch (error) {
          return rejectWithValue(error)
        } finally {
          dispatch(changeStatusAC({ status: "idle" }))
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todoListId]?.unshift(action.payload)
        },
      },
    ),
    deleteTaskTC: create.asyncThunk(
      async (args: { todolistId: string; taskId: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          await tasksApi.deleteTask(args)
          dispatch(changeStatusAC({ status: "succeeded" }))
          return args
        } catch (error) {
          return rejectWithValue(error)
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
    // changeTaskStatusTC: create.asyncThunk(
    //   async (task: DomainTask, { rejectWithValue }) => {
    //     try {
    //       const res = await tasksApi.updateTask(task)
    //       return { task: res.data.data.item }
    //     } catch (error) {
    //       return rejectWithValue(error)
    //     }
    //   },
    //   {
    //     fulfilled: (state, action) => {
    //       const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
    //       if (task) {
    //         task.status = action.payload.task.status
    //       }
    //     },
    //   },
    // ),
    // changeTaskTitleTC: create.asyncThunk(
    //   async (task: DomainTask, { rejectWithValue }) => {
    //     try {
    //       // const state = getState() as RootState
    //       // const allState = state.tasks
    //       // const tasksForTodolist = allState[args.todolistId].find((el) => el.id === args.taskId)
    //       //
    //       // if (!tasksForTodolist) {
    //       //   return rejectWithValue("not task")
    //       // }
    //       //
    //       // const model: UpdateTaskModel = {
    //       //   ...tasksForTodolist,
    //       //   status: args.status,
    //       // }
    //
    //       const res = await tasksApi.updateTask(task)
    //       return { task: res.data.data.item }
    //     } catch (error) {
    //       return rejectWithValue(error)
    //     }
    //   },
    //   {
    //     fulfilled: (state, action) => {
    //       const task = state[action.payload.task.todoListId].find((task) => task.id === action.payload.task.id)
    //       if (task) {
    //         task.title = action.payload.task.title
    //       }
    //     },
    //   },
    // ),
    updateTaskTC: create.asyncThunk(
      async (
        payload: { todolistId: string; taskId: string; domainModel: Partial<UpdateTaskModel> },
        { rejectWithValue, getState, dispatch },
      ) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          let task = (getState() as RootState).tasks[payload.todolistId].find((el) =>
            el.id === payload.taskId)

          if(!task){
            return rejectWithValue('Error')
          }

          const model: DomainTask = {...task, ...payload.domainModel}
          const res = await tasksApi.updateTask({model, todolistId: payload.todolistId, id: payload.taskId})
          dispatch(changeStatusAC({ status: "succeeded" }))
          return { task: res.data.data.item }
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          let task = state[action.payload.task.todoListId]
          let index = task.findIndex(el => el.id === action.payload.task.id)

          if(index !== -1) {
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
