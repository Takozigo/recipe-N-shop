import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  deleteIngredient,
  getAllIngredients,
  updateIngredients,
} from '@/server/repositories/ingredients.repo'
import { ingredientSchema } from '@/lib/schemas/ingredient'

export const getAllIngredientsFn = createServerFn({ method: 'GET' }).handler(
  () => getAllIngredients(),
)

export const updateIngredientFn = createServerFn({ method: 'POST' })
  .inputValidator(ingredientSchema)
  .handler(({ data }) => updateIngredients(data))

const schema = z.object({
  id: z.string(),
})
export const deleteIngredientFn = createServerFn({ method: 'POST' })
  .inputValidator(schema)
  .handler(({ data }) => deleteIngredient(data.id))
