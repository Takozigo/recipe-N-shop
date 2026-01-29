import z from 'zod'
import { unitSchema } from '../constants/unit'

import type { JSONContent } from '@tiptap/react'

export const tiptapContentSchema = z.object({
  type: z.literal('doc'), // KEEP THIS
  content: z.array(z.any()),
}) satisfies z.ZodType<JSONContent>

export type TiptapDoc = z.infer<typeof tiptapContentSchema>

export const recipeBaseSchema = z.object({
  id: z.string().optional(),

  title: z.string().min(5).max(50),
  shortDescription: z.string().max(150).optional(),
  description: z.string().optional(),

  servings: z.number().min(1).optional(),
  prepTimeMinutes: z.number().min(0).optional(),
  cookTimeMinutes: z.number().min(0).optional(),

  content: tiptapContentSchema,

  ingredients: z.array(
    z.object({
      ingredientId: z.string().optional(),
      ingredient: z.string(),
      amount: z.number().min(0.1),
      unit: unitSchema,
      note: z.string().optional(),
      section: z.string().optional().nullable(),
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
  categories: recipeBaseSchema.shape.categories.nonempty(),
})

export const updateRecipeSchema = recipeBaseSchema.extend({
  id: z.string(),
})

export type RecipeInput = z.infer<typeof recipeBaseSchema>
export type RecipeUpdateInput = z.infer<typeof updateRecipeSchema>
