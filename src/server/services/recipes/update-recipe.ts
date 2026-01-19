import type { RecipeUpdateInput } from '@/lib/schemas/recipe'
import { db } from '@/server/db'
import { updateRecipeCategories } from '@/server/repositories/categories.repo'
import { updateRecipeIngredients } from '@/server/repositories/ingredients.repo'
import { updateRecipeDb } from '@/server/repositories/recipes.repo'
import { updateRecipeSteps } from '@/server/repositories/steps.repo'

export async function updateRecipe(
  data: RecipeUpdateInput,
): Promise<
  | { error: true; message: string }
  | { error: false; id: string; slug: string }
  | undefined
> {
  const {
    id,
    title,
    description,
    servings,
    prepTimeMinutes,
    cookTimeMinutes,
    ingredients,
    steps,
    categories,
  } = data

  try {
    const updatedRecipe = await db.transaction(async (tx) => {
      const { slug } = await updateRecipeDb(tx, {
        id,
        title,
        description,
        servings,
        prepTimeMinutes,
        cookTimeMinutes,
      })
      await updateRecipeCategories(tx, id, categories)

      await updateRecipeIngredients(tx, id, ingredients)

      await updateRecipeSteps(tx, id, steps)

      return { id, slug }
    })

    return {
      error: false,
      id: updatedRecipe.id,
      slug: updatedRecipe.slug,
    }
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
