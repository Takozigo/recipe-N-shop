import { eq } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
import { recipes } from '../db/schema'
import { db } from '../db'
import type { JSONContent } from '@tiptap/react'
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
    content,
  }: {
    title: string
    servings?: number
    prepTimeMinutes?: number
    cookTimeMinutes?: number
    description?: string
    shortDescription?: string
    content: JSONContent
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
      content,
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
    content,
  }: {
    id: string
    title: string
    servings?: number
    prepTimeMinutes?: number
    cookTimeMinutes?: number
    description?: string
    shortDescription?: string
    content: JSONContent
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
      content,
    })
    .where(eq(recipes.id, id))
    .returning({ slug: recipes.slug })
  return res
}

export async function getRecipes(options: Options = {}) {
  const { limit, orderBy } = options
  const query = db.query.recipes.findMany({
    columns: { title: true, id: true, slug: true },
    orderBy: { createdAt: orderBy },
    limit,
    // ...(limit !== undefined ? { limit } : {}),
    // ...(where !== undefined ? { where } : {}),
  })

  return await query
}

export async function getRecipesByCategory(
  category: string,
  options: Options = {},
) {
  const { limit, orderBy } = options
  const cat = await db.query.categories.findFirst({
    where: { slug: category },
  })

  if (!cat) throw notFound()

  const query = db.query.recipes.findMany({
    columns: { title: true, id: true, slug: true },
    // with: { categories: { where: eq(recipeCategories.categoryId, cat.id) } },
    orderBy: { createdAt: orderBy },
    ...(limit !== undefined ? { limit } : {}),
    where: {
      categories: { id: cat.id },
    },
  })

  return await query
}

export async function getFullRecipesById(id: string) {
  return await db.query.recipes.findFirst({
    where: { id },
    with: {
      categories: true,
      recipeIngredients: { with: { ingredient: true } },
    },
  })
}

export async function getFullRecipesBySlug(slug: string) {
  return await db.query.recipes.findFirst({
    where: { slug },
    with: {
      categories: true,
      recipeIngredients: { with: { ingredient: true } },
    },
  })
}
