import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import type { RecipeInput } from '@/lib/schemas/recipe'
import { recipeBaseSchema } from '@/lib/schemas/recipe'
import { addRecipe, editRecipe } from '@/server/actions/recipes/add-recipe'

const defaultRecipe: RecipeInput = {
  title: '',
  ingredients: [],
  steps: [],
  categories: [],
}

export function useRecipeForm(recipe?: RecipeInput) {
  const addRecipeFn = useServerFn(recipe ? editRecipe : addRecipe)
  // const editRecipeFn = useServerFn(editRecipe)

  return useForm({
    defaultValues: { ...defaultRecipe, ...recipe } as RecipeInput,
    validators: { onSubmit: recipeBaseSchema },
    onSubmit: ({ value }) => {
      console.log(JSON.stringify(value))
      toast.promise<
        | { error: true; message: string }
        | { error: false; id: string }
        | undefined
      >(addRecipeFn({ data: value }), {
        loading: 'Loading...',
        success: (e) => {
          return e?.error ? e.message : `Recipe has been created`
        },
        error: (data) => `Error: ${data.message}`,
      })
    },
  })
}

export type RecipeForm = ReturnType<typeof useRecipeForm>
