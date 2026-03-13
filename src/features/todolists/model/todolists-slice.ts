import { changeStatusAC } from "@/app/app-slice"
import type { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums"
import { createAppSlice, handleCatchError, handleStatusCodeError } from "@/common/utils"
import { todolistsApi } from "../api/todolistsApi"
import { Todolist } from "../api"

export const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    fetchTodolistTC: create.asyncThunk(
      async (_, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          const res = await todolistsApi.getTodolists()
          dispatch(changeStatusAC({ status: "succeeded" }))
          return res.data
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (_, action) => {
          return action.payload.map((el) => ({ ...el, filter: "all", entityStatus: "idle" }))
        },
      },
    ),

    changeTodolistTitleTC: create.asyncThunk(
      async (arg: { id: string; title: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          const res = await todolistsApi.changeTodolistTitle(arg)
          if (res.data.resultCode === ResultCode.Success){
            dispatch(changeStatusAC({ status: "succeeded" }))
            return arg
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
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state[index].title = action.payload.title
          }
        },
      },
    ),

    deleteTodolistTC: create.asyncThunk(
      async (arg: { id: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          dispatch(changeTodolistEntityStatusAC({ id: arg.id, status: "pending" }))
          const res = await todolistsApi.deleteTodolist(arg.id)
          if(res.data.resultCode === ResultCode.Success){
            dispatch(changeStatusAC({ status: "succeeded" }))
            return arg
          } else {
            handleStatusCodeError(dispatch, res.data)
            return rejectWithValue(null)
          }
        } catch (error) {
          handleCatchError(error, dispatch)
          return rejectWithValue(null)
        } finally {
          dispatch(changeTodolistEntityStatusAC({ id: arg.id, status: "failed" }))
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex((todolist) => todolist.id === action.payload.id)
          if (index !== -1) {
            state.splice(index, 1)
          }
        },
      },
    ),

    createTodolistTC: create.asyncThunk(
      async (arg: { title: string }, { rejectWithValue, dispatch }) => {
        try {
          dispatch(changeStatusAC({ status: "pending" }))
          const res = await todolistsApi.createTodolist(arg.title)
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { todolist: res.data.data.item }
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
          state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" })
        },
      },
    ),

    changeTodolistEntityStatusAC: create.reducer<{ id: string; status: RequestStatus }>((state, action) => {
      const todolist = state.find((el) => el.id === action.payload.id)
      if (todolist) {
        todolist.entityStatus = action.payload.status
      }
    }),
  }),
})

export const {
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  fetchTodolistTC,
  changeTodolistTitleTC,
  deleteTodolistTC,
  createTodolistTC,
} = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}
export type FilterValues = "all" | "active" | "completed"
