import { ResultCode } from "@/common/enums"
import z from "zod/v4"

export const fieldErrorSchema = z.object({
  error: z.string(),
  field: z.string(),
})

type FieldError = z.infer<typeof fieldErrorSchema>

export type BaseResponse<T = {}> = {
  data: T
  resultCode: number
  messages: string[]
  fieldsErrors: FieldError[]
}

export const baseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    data: dataSchema,
    resultCode: z.enum(ResultCode),
    messages: z.array(z.string()),
    fieldsErrors: z.array(fieldErrorSchema),
  })
}

export const defaultResponseSchema = baseResponseSchema(z.object({}))
export type DefaultResponseSchema = z.infer<typeof defaultResponseSchema>


export type RequestStatus = 'idle' | 'pending' | 'failed' | 'succeeded'