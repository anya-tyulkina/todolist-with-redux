import { changeStatusAC, setAppErrorAC } from "@/app/app-slice.ts"
import type { Dispatch } from "@reduxjs/toolkit"
import { isAxiosError } from "axios"

export const handleCatchError = (error: unknown, dispatch: Dispatch) => {

  if(isAxiosError(error)){
    dispatch(setAppErrorAC({ error: error.response?.data?.message || error.message  }))
  } else if(error instanceof Error){
    dispatch(setAppErrorAC({ error: error.message  }))
  } else {
    dispatch(setAppErrorAC({ error: 'something error'  }))
  }

  dispatch(changeStatusAC({ status: "failed" }))
}