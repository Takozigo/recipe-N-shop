import z from 'zod'
import { unitSchema } from '../constants/unit'

export const recipeBaseSchema = z.object({
  id: z.string().optional(),

  title: z.string().min(5).max(50),
  shortDescription: z.string().max(150).optional(),
  description: z.string().optional(),

  servings: z.number().min(1).optional(),
  prepTimeMinutes: z.number().min(1).optional(),
  cookTimeMinutes: z.number().min(1).optional(),

  ingredients: z.array(
    z.object({
      ingredientId: z.string().optional(),
      ingredient: z.string(),
      amount: z.number().min(0.1),
      unit: unitSchema.optional(),
      note: z.string().optional(),
      section: z.string().optional(),
    }),
  ),

  steps: z.array(
    z.object({
      section: z.string().optional(),
      position: z.number().min(1),
      title: z.string().optional(),
      description: z.string(),
      imageUrl: z.string().optional(),
    }),
  ),

  categories: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string(),
      slug: z.string().optional(),
    }),
  ),
})

export const createRecipeSchema = recipeBaseSchema.extend({
  ingredients: recipeBaseSchema.shape.ingredients.nonempty(),
  steps: recipeBaseSchema.shape.steps.nonempty(),
  categories: recipeBaseSchema.shape.categories.nonempty(),
})

export const updateRecipeSchema = recipeBaseSchema.extend({
  id: z.string(),
})

export type RecipeInput = z.infer<typeof recipeBaseSchema>
export type RecipeUpdateInput = z.infer<typeof updateRecipeSchema>
