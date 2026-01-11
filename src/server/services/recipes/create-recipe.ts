import type { RecipeInput } from '@/lib/schemas/recipe'
import { db } from '@/server/db'
import { insertCategories } from '@/server/repositories/categories.repo'
import { insertIngredients } from '@/server/repositories/ingredients.repo'
import { insertRecipe } from '@/server/repositories/recipes.repo'
import { inserSteps } from '@/server/repositories/steps.repo'

export async function createRecipe(
  data: RecipeInput,
): Promise<
  { error: true; message: string } | { error: false; id: string } | undefined
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
    const id = await db.transaction(async (tx) => {
      const insertedId = await insertRecipe(tx, {
        title,
        description,
        servings,
        prepTimeMinutes,
        cookTimeMinutes,
      })

      await insertCategories(tx, insertedId, categories)

      await insertIngredients(tx, insertedId, ingredients)
      await inserSteps(tx, insertedId, steps)

      return insertedId
    })
    return {
      error: false,
      id,
    }
  } catch (err) {
    return {
      error: true,
      message: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
