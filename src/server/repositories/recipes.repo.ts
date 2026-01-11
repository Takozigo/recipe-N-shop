import { desc, eq } from 'drizzle-orm'
import { recipes } from '../db/schema'
import { db } from '../db'
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

export async function getLatestRecipes() {
  const res = await db.query.recipes.findMany({
    orderBy: desc(recipes.createdAt),
  })
  return res
}

export async function getFullRecipes(id: string) {
  return await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: {
      steps: {
        orderBy: (steps, { asc }) => [asc(steps.position)],
      },
      ingredients: {
        with: {
          ingredient: true,
        },
      },
    },
  })
}
