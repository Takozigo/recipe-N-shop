import z from 'zod'
import { unitSchema } from '../constants/unit'

export const ingredientSchema = z.object({
  id: z.string(),
  value: z.string(),
  lang: z.string(),
  price: z.number().min(0).nullable(),
  quantity: z.number().min(0).nullable(),
  unit: unitSchema.nullable(),
})
