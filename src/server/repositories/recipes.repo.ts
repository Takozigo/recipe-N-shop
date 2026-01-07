import { recipes } from '../db/schema'
import type { DbClient } from '../db'

export async function insertRecipe(
  tx: DbClient,
  {
    title,
    description,
    servings,
    prepTimeMinutes,
    cookTimeMinutes,
  }: {
    title: string
    servings: number
    prepTimeMinutes: number
    cookTimeMinutes: number
    description?: string
  },
) {
  const [row] = await tx
    .insert(recipes)
    .values({
      title,
      description,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
    })
    .returning({ id: recipes.id })

  return row.id
}
