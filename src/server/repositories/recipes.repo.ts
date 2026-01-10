import { recipes } from '../db/schema'
import type { DbClient } from '../db'
import { slugify } from '@/lib/utils'

export async function insertRecipe(
  tx: DbClient,
  {
    title,
    description,
    servings,
    prepTimeMinutes,
    cookTimeMinutes,
    shortDescription,
  }: {
    title: string
    servings?: number
    prepTimeMinutes?: number
    cookTimeMinutes?: number
    description?: string
    shortDescription?: string
  },
) {
  const [row] = await tx
    .insert(recipes)
    .values({
      title,
      slug: slugify(title),
      description,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
      shortDescription,
    })
    .returning({ id: recipes.id })

  return row.id
}
