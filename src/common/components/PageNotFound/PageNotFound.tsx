import styles from "./PageNotFound.module.css"
import { NavButton } from "@/common/components"

export const PageNotFound = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>404</h1>
    <h2 className={styles.subtitle}>page not found</h2>
    <NavButton href={'/'}>Вернуться на главную</NavButton>
  </div>
)