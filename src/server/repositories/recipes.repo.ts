import { asc, desc, eq } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
import { categories, recipeCategories, recipes } from '../db/schema'
import { db } from '../db'
import type { DbClient } from '../db'
import type { Options } from '@/lib/types/options'
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

export async function getRecipes(options: Options = {}) {
  const { limit, orderBy, where } = options
  const query = db.query.recipes.findMany({
    columns: { title: true, id: true, slug: true },
    orderBy:
      orderBy === 'asc' ? asc(recipes.createdAt) : desc(recipes.createdAt),
    ...(limit !== undefined ? { limit } : {}),
    ...(where !== undefined ? { where } : {}),
  })

  return await query
}

export async function getRecipesByCategory(
  category: string,
  options: Options = {},
) {
  const { limit, orderBy } = options
  const cat = await db.query.categories.findFirst({
    where: eq(categories.slug, category),
  })

  if (!cat) throw notFound()

  const query = db.query.recipes.findMany({
    columns: { title: true, id: true, slug: true },
    // with: { categories: { where: eq(recipeCategories.categoryId, cat.id) } },
    orderBy:
      orderBy === 'asc' ? asc(recipes.createdAt) : desc(recipes.createdAt),
    ...(limit !== undefined ? { limit } : {}),

    where: {
      categories: eq(recipeCategories.categoryId, cat.id),
    },
  })

  return await query
}

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
