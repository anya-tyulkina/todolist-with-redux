import { changeStatusAC, setAppErrorAC } from "@/app/app-slice"
import type { Dispatch } from "@reduxjs/toolkit"
import type { BaseResponse } from "@/common/types"

export function handleStatusCodeError<T>(dispatch: Dispatch, data: BaseResponse<T>) {
  dispatch(changeStatusAC({ status: "failed" }))
  const error = data.messages.length ? data.messages[0] : "something error"
  dispatch(setAppErrorAC({ error }))
}