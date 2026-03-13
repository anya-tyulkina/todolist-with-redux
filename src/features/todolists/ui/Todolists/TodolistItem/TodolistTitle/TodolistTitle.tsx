import { useAppDispatch } from "@/common/hooks"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import { EditableSpan } from "@/common/components"
import { changeTodolistTitleTC, deleteTodolistTC, DomainTodolist } from "@/features/todolists/model"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist

  const dispatch = useAppDispatch()

  const deleteTodolist = () => {
    dispatch(deleteTodolistTC({ id }))
  }

  const changeTodolistTitle = (title: string) => {
    dispatch(changeTodolistTitleTC({ id, title }))
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitle} disabled={entityStatus === 'pending'} />
      </h3>
      <IconButton onClick={deleteTodolist} disabled={entityStatus === "pending"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
