import { eq } from 'drizzle-orm'

import { db } from '../db'
import type { DbClient } from '../db'
import {
  ingredients,
  ingredients as ingredientsSchema,
  recipeIngredients,
} from '@/server/db/schema'

export async function getAllIngredients() {
  return await db.query.ingredients.findMany({
    orderBy: { value: 'desc' },
  })
}

export async function insertIngredients(
  tx: DbClient,
  recipeId: string,
  ingredients: Array<{
    ingredient: string
    amount: number
    ingredientId?: string
    unit: string
    note?: string
    section?: string
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
  ingredientList: Array<{
    ingredient: string
    amount: number
    ingredientId?: string | undefined
    unit: string
    note?: string | undefined
    section?: string | undefined
  }>,
) {
  const newIngredientsToInsert = ingredientList
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
  > = ingredientList.map((e) => {
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

export async function updateIngredients(ingredient: {
  id: string
  value: string
  lang: string
  price: number | null
  quantity: number | null
  unit: string | null
}) {
  const { value, id, price, lang, quantity, unit } = ingredient
  console.log({ value, id, price, lang, quantity, unit })
  const result = await db
    .update(ingredients)
    .set({
      value,
      lang,
      price: String(price),
      quantity: String(quantity),
      unit,
    })
    .where(eq(ingredients.id, id))
  console.log({ result })
}

export async function deleteIngredient(id: string) {
  const rest = await db
    .select()
    .from(recipeIngredients)
    .where(eq(ingredients.id, id))
  if (rest.length > 0) return { error: 'cannot delete' }
  await db.delete(ingredients).where(eq(ingredients.id, id))
}
