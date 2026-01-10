import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { recipeSchema } from '@/lib/schemas/recipe'
import { createRecipe } from '@/server/services/recipes/create-recipe'

export const addRecipe = createServerFn({ method: 'POST' })
  .inputValidator(recipeSchema)
  .handler(async ({ data }) => {
    const res = await createRecipe(data)

    if (res?.error) {
      return res
    }
    if (res?.id) {
      throw redirect({ to: '/recipes/$id', params: { id: res.id } })
    }
    return res
  })
