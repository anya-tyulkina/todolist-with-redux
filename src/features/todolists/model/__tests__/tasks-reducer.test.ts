import { beforeEach, expect, test } from "vitest"
import {
  tasksSlice,
  type TasksState
} from "../tasks-slice.ts"
import { createTodolistTC, deleteTodolistTC } from "../todolists-slice.ts"
import { TaskPriority, TaskStatus } from "@/common/enums/enums.ts"

let startState: TasksState = {}

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatus.Completed,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
    ],
  }
})

test("correct task should be deleted", () => {
  const action = {
    type: tasksSlice.actions.deleteTaskTC.fulfilled.type,
    payload: { todolistId: "todolistId2", taskId: "2" },
  }
  const endState = tasksSlice.reducer(startState, action)

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatus.Completed,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatus.New,
        description: "",
        priority: TaskPriority.Low,
        startDate: "",
        deadline: "",
        todoListId: "",
        order: 0,
        addedDate: "",
      },
    ],
  })
})

test("correct task should be created at correct array", () => {

  const newTask = {
    id: "4",
    title: 'juice',
    status: TaskStatus.New,
    todoListId: 'todolistId2'
  }
  const action = {
    type: tasksSlice.actions.createTasksTC.fulfilled.type,
    payload: newTask
  }

  const endState = tasksSlice.reducer(startState, action)

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its status", () => {

  const newTask = {
    id: "2",
    title: 'juice',
    status: TaskStatus.New,
    todoListId: 'todolistId2'
  }

  const action = {
    type: tasksSlice.actions.updateTaskTC.fulfilled.type,
    payload: { task: newTask },
  }
  const endState = tasksSlice.reducer(startState, action)

  expect(endState.todolistId2[1].status).toBe(TaskStatus.New)
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed)
})

test("correct task should change its title", () => {
  const newTask = {
    id: "2",
    title: 'coffee',
    status: TaskStatus.New,
    todoListId: 'todolistId2'
  }
  const action = {
    type: tasksSlice.actions.updateTaskTC.fulfilled.type,
    payload: {task: newTask },
  }
  const endState = tasksSlice.reducer(
    startState,
    action
  )

  expect(endState.todolistId2[1].title).toBe("coffee")
  expect(endState.todolistId1[1].title).toBe("JS")
})

test("array should be created for new todolist", () => {
  const action = {
    type: createTodolistTC.fulfilled.type,
    payload: {title: "New todolist"}
  }
  const endState = tasksSlice.reducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const action = {
    type: deleteTodolistTC.fulfilled.type,
    payload: {id: "todolistId2"}
  }
  const endState = tasksSlice.reducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
