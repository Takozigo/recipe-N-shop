import type { RecipeUpdateInput } from '@/lib/schemas/recipe'
import { db } from '@/server/db'
import { updateRecipeCategories } from '@/server/repositories/categories.repo'
import { updateRecipeIngredients } from '@/server/repositories/ingredients.repo'
import { updateRecipeDb } from '@/server/repositories/recipes.repo'

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
    categories,
    shortDescription,
    content,
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
        shortDescription,
        content,
      })

      await updateRecipeCategories(tx, id, categories)

      await updateRecipeIngredients(tx, id, ingredients)

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
