import { createServerFn } from '@tanstack/react-start'
import type { Options } from '@/lib/types/options'
import { getRecipes } from '@/server/repositories/recipes.repo'

export const getRecipesFn = createServerFn({ method: 'GET' })
  .inputValidator((data: Options | undefined) => data)
  .handler(({ data }) => getRecipes(data))
