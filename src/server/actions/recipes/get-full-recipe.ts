import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { formatIngredientsBySection } from '@/lib/types/ingredient'
import { formatSteps } from '@/lib/types/step'
import { getFullRecipes } from '@/server/repositories/recipes.repo'

export const getFullRecipesFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const recipe = await getFullRecipes(data.id)
    if (recipe == null) throw notFound()

    return {
      ...recipe,
      steps: formatSteps(recipe.steps),
      ingredients: formatIngredientsBySection(recipe.ingredients),
    }
  })
