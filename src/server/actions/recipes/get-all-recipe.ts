import { createServerFn } from '@tanstack/react-start'
import { getAllRecipes } from '@/server/repositories/recipes.repo'

export const getAllRecipesId = createServerFn({ method: 'GET' }).handler(() =>
  getAllRecipes(),
)
