import z from 'zod'

export const recipeSchema = z.object({
  title: z
    .string()
    .min(5, 'Recipe title must be at least 5 characters.')
    .max(32, 'Recipe title must be at most 32 characters.'),
  description: z.string().max(100).optional(),
  servings: z.number().min(1),
  prepTimeMinutes: z.number().min(1),
  cookTimeMinutes: z.number().min(1),
  ingredients: z
    .array(
      z.object({
        ingredientId: z.string().optional(),
        ingredient: z.string(),
        amount: z.number().min(0.1),
        unit: z.string().optional(),
        note: z.string().optional(),
        section: z.string().optional(),
      }),
    )
    .nonempty(),
  steps: z
    .array(
      z.object({
        section: z.string().optional(),
        position: z.number().min(1),
        title: z.string().optional(),
        description: z.string(),
        imageUrl: z.string().optional(),
      }),
    )
    .nonempty(),
})

export type RecipeInput = z.infer<typeof recipeSchema>
