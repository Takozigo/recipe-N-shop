import type { RecipeInput } from '@/lib/schemas/recipe'
import { db } from '@/server/db'
import { insertCategories } from '@/server/repositories/categories.repo'
import { insertIngredients } from '@/server/repositories/ingredients.repo'
import { insertRecipe } from '@/server/repositories/recipes.repo'
import { inserSteps } from '@/server/repositories/steps.repo'

export async function createRecipe(
  data: RecipeInput,
): Promise<
  | { error: true; message: string }
  | { error: false; id: string; slug: string }
  | undefined
> {
  const {
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
    const newRecipes = await db.transaction(async (tx) => {
      const { id, slug } = await insertRecipe(tx, {
        title,
        description,
        servings,
        prepTimeMinutes,
        cookTimeMinutes,
      })

      await insertCategories(tx, id, categories)

      await insertIngredients(tx, id, ingredients)
      await inserSteps(tx, id, steps)

      return { id, slug }
    })
    return {
      error: false,
      id: newRecipes.id,
      slug: newRecipes.slug,
    }
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
