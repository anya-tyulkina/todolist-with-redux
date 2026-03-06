import { nanoid } from "@reduxjs/toolkit"
import { beforeEach, expect, test } from "vitest"
import {
  changeTodolistFilterAC,
  type DomainTodolist,
  todolistsSlice,
} from "../todolists-slice.ts"

let todolistId1: string
let todolistId2: string
let startState: DomainTodolist[] = []

beforeEach(() => {
  todolistId1 = nanoid()
  todolistId2 = nanoid()

  startState = [
    { id: todolistId1, title: "What to learn", filter: "all", order: 0, addedDate: "" },
    { id: todolistId2, title: "What to buy", filter: "all", order: 0, addedDate: "" },
  ]
})

test("correct todolist should be deleted", () => {
  const action = {
    type: todolistsSlice.actions.deleteTodolistTC.fulfilled.type,
    payload: { id: todolistId1 },
  }
  const endState = todolistsSlice.reducer(startState, action)

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be created", () => {
  const newTodolist: DomainTodolist = {
    addedDate: "",
    order: 0,
    filter: "all",
    title: "New todolist",
    id: nanoid(),
  }

  const action = {
    type: todolistsSlice.actions.createTodolistTC.fulfilled.type,
    payload: newTodolist,
  }
  const endState = todolistsSlice.reducer(startState, action)

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe("New todolist")
})

test("correct todolist should change its title", () => {
  const title = "New title"

  const action = {
    type: todolistsSlice.actions.changeTodolistTitleTC.fulfilled.type,
    payload: {id: todolistId2, title},
  }
  const endState = todolistsSlice.reducer(startState, action)

  expect(endState[0].title).toBe("What to learn")
  expect(endState[1].title).toBe(title)
})

test("correct todolist should change its filter", () => {
  const filter = "completed"

  const endState = todolistsSlice.reducer(startState, changeTodolistFilterAC({ id: todolistId2, filter }))

  expect(endState[0].filter).toBe("all")
  expect(endState[1].filter).toBe(filter)
})
