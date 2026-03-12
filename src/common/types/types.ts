import { ResultCode } from "@/common/enums"

export type FieldError = {
  error: string
  field: string
}

export type BaseResponse<T = {}> = {
  data: T
  resultCode: ResultCode
  messages: string[]
  fieldsErrors: FieldError[]
}

export type RequestStatus = 'idle' | 'pending' | 'failed' | 'succeeded'