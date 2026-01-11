import { createServerFn } from '@tanstack/react-start'
import { getLatestRecipes } from '@/server/repositories/recipes.repo'

export const getLatestRecipesFn = createServerFn({ method: 'GET' }).handler(
  getLatestRecipes,
)
