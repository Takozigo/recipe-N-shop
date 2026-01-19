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
    .returning({ id: recipes.id, slug: recipes.slug })

  return { id: row.id, slug: row.slug }
}

export async function updateRecipeDb(
  tx: DbClient,
  {
    id,
    title,
    description,
    servings,
    prepTimeMinutes,
    cookTimeMinutes,
    shortDescription,
  }: {
    id: string
    title: string
    servings?: number
    prepTimeMinutes?: number
    cookTimeMinutes?: number
    description?: string
    shortDescription?: string
  },
) {
  const [res] = await tx
    .update(recipes)
    .set({
      title,
      slug: slugify(title),
      description,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
      shortDescription,
    })
    .where(eq(recipes.id, id))
    .returning({ slug: recipes.slug })
  return res
}

export async function getLatestRecipes() {
  return await db.query.recipes.findMany({
    orderBy: desc(recipes.createdAt),
    limit: 10,
  })
}

export async function getAllRecipes() {
  return await db.query.recipes.findMany({
    columns: { title: true, id: true },
    orderBy: desc(recipes.createdAt),
  })
}

getAllRecipes

export async function getFullRecipesById(id: string) {
  return await db.query.recipes.findFirst({
    where: eq(recipes.id, id),
    with: {
      steps: {
        orderBy: (steps, { asc }) => [asc(steps.position)],
      },
      categories: {
        with: {
          category: true,
        },
      },
      ingredients: {
        with: {
          ingredient: true,
        },
      },
    },
  })
}

export async function getFullRecipesBySlug(slug: string) {
  return await db.query.recipes.findFirst({
    where: eq(recipes.slug, slug),
    with: {
      steps: {
        orderBy: (steps, { asc }) => [asc(steps.position)],
      },
      categories: {
        with: {
          category: true,
        },
      },
      ingredients: {
        with: {
          ingredient: true,
        },
      },
    },
  })
}
