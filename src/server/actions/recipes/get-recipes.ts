import { createServerFn } from '@tanstack/react-start'
import type { Options } from '@/lib/types/options'
import {
  getRecipes,
  getRecipesByCategory,
} from '@/server/repositories/recipes.repo'

export const getRecipesFn = createServerFn({ method: 'GET' })
  .inputValidator((data: Options | undefined) => data)
  .handler(({ data }) => getRecipes(data))

export const getRecipeByCategoryFn = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: { category: string; options: Options | undefined }) => data,
  )
  .handler(({ data }) => getRecipesByCategory(data.category, data.options))
