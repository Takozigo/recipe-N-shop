import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import type { RecipeInput } from '@/lib/schemas/recipe'
import { recipeBaseSchema } from '@/lib/schemas/recipe'
import { addRecipeFn, editRecipeFn } from '@/server/actions/recipes/add-recipe'

const defaultRecipe: RecipeInput = {
  title: '',
  ingredients: [],
  steps: [],
  categories: [],
}

export function useRecipeForm(recipe?: RecipeInput) {
  const handleRecipeForm = useServerFn(recipe ? editRecipeFn : addRecipeFn)

  return useForm({
    defaultValues: { ...defaultRecipe, ...recipe } as RecipeInput,
    validators: { onSubmit: recipeBaseSchema },
    onSubmit: ({ value }) => {
      toast.promise<
        | { error: true; message: string }
        | { error: false; id: string }
        | undefined
      >(handleRecipeForm({ data: value }), {
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
