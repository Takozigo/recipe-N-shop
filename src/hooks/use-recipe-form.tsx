import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import type { RecipeInput } from '@/lib/schemas/recipe'
import { recipeSchema } from '@/lib/schemas/recipe'
import { addRecipe } from '@/server/actions/recipes/add-recipe'

const defaultRecipe: RecipeInput = {
  title: '',
  ingredients: [],
  steps: [],
  categories: [],
}

export function useRecipeForm() {
  const addRecipeFn = useServerFn(addRecipe)

  return useForm({
    defaultValues: defaultRecipe,
    validators: { onSubmit: recipeSchema },
    onSubmit: ({ value }) => {
      toast.promise<
        | { error: true; message: string }
        | { error: false; id: string }
        | undefined
      >(
        addRecipeFn({ data: value }),

        {
          loading: 'Loading...',
          success: () => `Recipe has been created`,
          error: (data) => `Error: ${data.message}`,
        },
      )
    },
  })
}

export type RecipeForm = ReturnType<typeof useRecipeForm>
