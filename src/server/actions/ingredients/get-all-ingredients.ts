import { createServerFn } from '@tanstack/react-start'
import { getAllIngredients } from '@/server/repositories/ingredients.repo'

export const getAllIngredientsFn = createServerFn({ method: 'GET' }).handler(
  () => getAllIngredients(),
)
