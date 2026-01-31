import type { TiptapDoc } from '../schemas/recipe'
import type { JSONContent } from '@tiptap/react'
import type { UnitKey } from '../constants/unit'

type RawFullRecipe = {
  id: string
  slug: string
  title: string
  description: string | null
  servings: number | null
  prepTimeMinutes: number | null
  cookTimeMinutes: number | null
  createdAt: Date
  updatedAt: Date
  shortDescription: string | null
  recipeIngredients: Array<{
    recipeId: string
    ingredientId: string
    section: string
    amount: string
    unit: string | null
    note: string | null
    ingredient: {
      id: string
      value: string
      lang: string
    } | null
  }>
  content: JSONContent
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
}

export type RecipeFormValues = {
  id?: string
  title: string
  shortDescription?: string
  description?: string
  servings?: number
  prepTimeMinutes?: number
  cookTimeMinutes?: number

  ingredients: Array<{
    ingredientId?: string
    ingredient: string
    amount: number
    unit: UnitKey
    note?: string
    section?: string
  }>

  content: TiptapDoc

  categories: Array<{
    id?: string
    name: string
    slug?: string
  }>
}

export function mapRawRecipeToForm(recipe: RawFullRecipe): RecipeFormValues {
  return {
    id: recipe.id,
    title: recipe.title,
    shortDescription: recipe.shortDescription ?? undefined,
    description: recipe.description ?? undefined,
    servings: recipe.servings ?? undefined,
    prepTimeMinutes: recipe.prepTimeMinutes ?? undefined,
    cookTimeMinutes: recipe.cookTimeMinutes ?? undefined,
    content: recipe.content as TiptapDoc,

    ingredients: recipe.recipeIngredients.map((i) => ({
      ingredientId: i.ingredientId,
      ingredient: i.ingredient?.value ?? '',
      amount: Number(i.amount),
      unit: i.unit as UnitKey,
      note: i.note ?? undefined,
      section: i.section,
    })),

    categories: recipe.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })),
  }
}
