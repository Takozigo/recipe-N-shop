import type { UnitKey } from '../constants/unit'

type RawFullRecipe = {
  id: string
  title: string
  shortDescription: string | null
  description: string | null
  servings: number | null
  prepTimeMinutes: number | null
  cookTimeMinutes: number | null
  slug: string
  createdAt: Date
  updatedAt: Date
  ingredients: Array<{
    unit: string | null
    ingredientId: string
    amount: string
    note: string | null
    section: string | null
    recipeId: string
    ingredient: {
      id: string
      value: string
      lang: string
    }
  }>
  steps: Array<{
    id: string
    title: string | null
    description: string
    section: string | null
    position: number
    imageUrl: string | null
    recipeId: string
  }>
  categories: Array<{
    recipeId: string
    categoryId: string
    category: {
      id: string
      name: string
      slug: string
    }
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
    unit?: UnitKey
    note?: string
    section?: string
  }>

  steps: Array<{
    position: number
    section?: string
    title?: string
    description: string
    imageUrl?: string
  }>

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

    ingredients: recipe.ingredients.map((i) => ({
      ingredientId: i.ingredientId,
      ingredient: i.ingredient.value,
      amount: Number(i.amount),
      unit: (i.unit as UnitKey | null) ?? undefined,
      note: i.note ?? undefined,
      section: i.section ?? undefined,
    })),

    steps: recipe.steps.map((s) => ({
      position: s.position,
      section: s.section ?? undefined,
      title: s.title ?? undefined,
      description: s.description,
      imageUrl: s.imageUrl ?? undefined,
    })),

    categories: recipe.categories.map((c) => ({
      id: c.category.id,
      name: c.category.name,
      slug: c.category.slug,
    })),
  }
}
