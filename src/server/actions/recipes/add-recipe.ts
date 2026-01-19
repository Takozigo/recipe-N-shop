import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createRecipeSchema, updateRecipeSchema } from '@/lib/schemas/recipe'
import { createRecipe } from '@/server/services/recipes/create-recipe'
import { updateRecipe } from '@/server/services/recipes/update-recipe'

export const addRecipe = createServerFn({ method: 'POST' })
  .inputValidator(createRecipeSchema)
  .handler(async ({ data }) => {
    const res = await createRecipe(data)

    if (res?.error) {
      return res
    }
    if (res?.slug) {
      throw redirect({ to: '/recipes/$slug', params: { slug: res.slug } })
    }
    return {
      error: true,
      message: 'unknown error',
    }
  })

export const editRecipe = createServerFn({ method: 'POST' })
  .inputValidator(updateRecipeSchema)
  .handler(async ({ data }) => {
    console.log(JSON.stringify(data))
    const res = await updateRecipe(data)

    if (res?.error) {
      return res
    }
    if (res?.slug) {
      throw redirect({ to: '/recipes/$slug', params: { slug: res.slug } })
    }
    return {
      error: true,
      message: 'unknown error',
    }
  })
