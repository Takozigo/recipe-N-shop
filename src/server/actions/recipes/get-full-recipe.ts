import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { formatIngredientsBySection } from '@/lib/types/ingredient'
import { formatSteps } from '@/lib/types/step'
import {
  getFullRecipesById,
  getFullRecipesBySlug,
} from '@/server/repositories/recipes.repo'
import { mapRawRecipeToForm } from '@/lib/types/recipe-form-values'

export const getFullRecipesByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const recipe = await getFullRecipesById(data.id)
    if (recipe == null) throw notFound()

    return mapRawRecipeToForm(recipe)
  })

export const getFullRecipesBySlugFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const recipe = await getFullRecipesBySlug(data.slug)
    if (recipe == null) throw notFound()

    return {
      ...recipe,
      steps: formatSteps(recipe.recipeSteps),
      ingredients: formatIngredientsBySection(recipe.recipeIngredients),
    }
  })
