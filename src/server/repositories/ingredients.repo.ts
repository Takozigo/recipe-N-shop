import { asc, eq } from 'drizzle-orm'

import { db } from '../db'
import type { DbClient } from '../db'
import {
  ingredients as ingredientsSchema,
  recipeIngredients,
} from '@/server/db/schema'

export async function getAllIngredients() {
  return await db.query.ingredients.findMany({
    orderBy: asc(ingredientsSchema.value),
  })
}

export async function insertIngredients(
  tx: DbClient,
  recipeId: string,
  ingredients: Array<{
    ingredient: string
    amount: number
    ingredientId?: string | undefined
    unit?: string | undefined
    note?: string | undefined
    section?: string | undefined
  }>,
) {
  const newIngredientsToInsert = ingredients
    .filter((i) => i.ingredientId === undefined)
    .map((e) => ({
      value: e.ingredient,
      lang: 'fr',
    }))

  let newIngredients: Array<{ insertedId: string; value: string }> = []

  if (newIngredientsToInsert.length > 0) {
    newIngredients = await tx
      .insert(ingredientsSchema)
      .values(newIngredientsToInsert)
      .returning({
        insertedId: ingredientsSchema.id,
        value: ingredientsSchema.value,
      })
  }

  const recipeIngredientsToInsert: Array<
    typeof recipeIngredients.$inferInsert
  > = ingredients.map((e) => {
    const amount = String(e.amount)
    if (e.ingredientId)
      return {
        ...e,
        recipeId,
        ingredientId: e.ingredientId,
        amount,
      }
    else {
      const ingredientMap = new Map(
        newIngredients.map((i) => [i.value, i.insertedId]),
      )
      const ingredientId = e.ingredientId ?? ingredientMap.get(e.ingredient)

      if (!ingredientId) throw new Error('ingredientId is missing')
      return {
        ...e,
        recipeId,
        ingredientId: ingredientId,
        amount,
      }
    }
  })

  await tx.insert(recipeIngredients).values(recipeIngredientsToInsert)
}

export async function updateRecipeIngredients(
  tx: DbClient,
  recipeId: string,
  ingredients: Array<{
    ingredient: string
    amount: number
    ingredientId?: string | undefined
    unit?: string | undefined
    note?: string | undefined
    section?: string | undefined
  }>,
) {
  const newIngredientsToInsert = ingredients
    .filter((i) => i.ingredientId === undefined)
    .map((e) => ({
      value: e.ingredient,
      lang: 'fr',
    }))

  let newIngredients: Array<{ insertedId: string; value: string }> = []

  if (newIngredientsToInsert.length > 0) {
    newIngredients = await tx
      .insert(ingredientsSchema)
      .values(newIngredientsToInsert)
      .returning({
        insertedId: ingredientsSchema.id,
        value: ingredientsSchema.value,
      })
  }

  const recipeIngredientsToInsert: Array<
    typeof recipeIngredients.$inferInsert
  > = ingredients.map((e) => {
    const amount = String(e.amount)
    if (e.ingredientId)
      return {
        ...e,
        recipeId,
        ingredientId: e.ingredientId,
        amount,
      }
    else {
      const ingredientMap = new Map(
        newIngredients.map((i) => [i.value, i.insertedId]),
      )
      const ingredientId = e.ingredientId ?? ingredientMap.get(e.ingredient)

      if (!ingredientId) throw new Error('ingredientId is missing')
      return {
        ...e,
        recipeId,
        ingredientId: ingredientId,
        amount,
      }
    }
  })
  await tx
    .delete(recipeIngredients)
    .where(eq(recipeIngredients.recipeId, recipeId))
  await tx.insert(recipeIngredients).values(recipeIngredientsToInsert)
}
