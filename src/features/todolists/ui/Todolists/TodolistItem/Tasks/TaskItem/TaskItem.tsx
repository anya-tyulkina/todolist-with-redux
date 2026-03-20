import { useAppDispatch } from "@/common/hooks"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { TaskStatus } from "@/common/enums"
import { DomainTask } from "@/features/todolists/api"
import { deleteTaskTC, updateTaskTC } from "@/features/todolists/model"
import { EditableSpan } from "@/common/components"
import type { RequestStatus } from "@/common/types"

type Props = {
  task: DomainTask
  todolistId: string
  todolistEntityStatus: RequestStatus
}

export const TaskItem = ({ task, todolistId, todolistEntityStatus }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    dispatch(updateTaskTC({ todolistId, taskId: task.id, domainModel: { status } }))
  }

  const changeTaskTitle = (title: string) => {
    dispatch(updateTaskTC({ todolistId, taskId: task.id, domainModel: { title } }))
  }

  const checked = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(checked)}>
      <div>
        <Checkbox checked={checked} onChange={changeTaskStatus} disabled={todolistEntityStatus === 'pending'} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={todolistEntityStatus === 'pending'} />
        <span style={{color: 'blue', marginLeft: '10px'}}>{new Date(task.addedDate).toLocaleDateString()}</span>
      </div>
      <IconButton onClick={deleteTask} disabled={todolistEntityStatus === 'pending'}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
