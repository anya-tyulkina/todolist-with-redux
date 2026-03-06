import { createAsyncThunk, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"
import { createAppSlice } from "@/common/utils/createAppSlice.ts"
import { changeStatusAC } from "@/app/app-slice.ts"

const todolistsSlice = createAppSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    fetchTodolistTC: create.asyncThunk(
      async (_, thunkAPI) => {
        try {
          const res = await todolistsApi.getTodolists()
          return res.data
        } catch (error) {
          return thunkAPI.rejectWithValue(error)
        }
      },
      {
        fulfilled: (_, action) => {
          return action.payload.map((el) => ({ ...el, filter: "all" }))
        }
      }
    ),
  }),
  selectors: {
    selectTodolists: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolistTC.rejected, (_, action: any) => {
        alert(action.payload.message)
      })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.push(action.payload)
      })
  },
})

export const { changeTodolistFilterAC, fetchTodolistTC } = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors
export const todolistsReducer = todolistsSlice.reducer

// export const fetchTodolistTC = createAsyncThunk(
//   `${todolistsSlice.name}/fetchTodolistTC`,
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await todolistsApi.getTodolists()
//       return res.data
//     } catch (error) {
//       return rejectWithValue(error)
//     }
//   },
// )

export const changeTodolistTitleTC = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitleTC`,
  async (arg: { id: string; title: string }, { rejectWithValue }) => {
    try {
      await todolistsApi.changeTodolistTitle(arg)
      return arg
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const deleteTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolistTC`,
  async (arg: { id: string }, { rejectWithValue }) => {
    try {
      await todolistsApi.deleteTodolist(arg.id)
      return arg
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const createTodolistTC = createAsyncThunk(
  `${todolistsSlice.name}/createTodolistTC`,
  async (arg: { title: string }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(changeStatusAC({status: "pending" }))
      const newTodolist: DomainTodolist = {
        addedDate: "",
        order: 0,
        filter: "all",
        title: arg.title,
        id: nanoid(),
      }
      await todolistsApi.createTodolist(arg.title)
      dispatch(changeStatusAC({status: "succeeded" }))
      return newTodolist
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export type DomainTodolist = Todolist & { filter: FilterValues }

export type FilterValues = "all" | "active" | "completed"
