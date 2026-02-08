import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

import { RecipeFormStepper } from '@/components/recipe-form-stepper'
import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'

import { Separator } from '@/components/ui/separator'
import { useRecipeForm } from '@/hooks/use-recipe-form'
import { getAllIngredientsFn } from '@/server/actions/ingredients/get-all-ingredients'
import { getCategoriesFn } from '@/server/actions/categories/get-categories'
import RecipeInfoStep from '@/components/recipe-info-step'
import RecipeIngredientsStep from '@/components/recipe-ingredients-step'
import RecipeStepsStep from '@/components/recipe-steps-step'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/_authenticated/admin/recipes/new/')({
  component: RouteComponent,
  loader: async () => ({
    categories: await getCategoriesFn(),
    ingredients: await getAllIngredientsFn(),
  }),
})

type RecipeFormStepperStep = 'recipe' | 'ingredients' | 'steps'

const STEPS: Array<RecipeFormStepperStep> = ['recipe', 'ingredients', 'steps']

function RouteComponent() {
  const [count, setCount] = useState(0)
  const form = useRecipeForm()
  const { categories, ingredients } = Route.useLoaderData()

  return (
    <div className="container h-screen space-y-2 pb-20">
      <Text variant="h1">Create a new recipe</Text>
      <Separator />
      <RecipeFormStepper step={STEPS[count]} />
      <ScrollArea className="h-full">
        <form
          id="recipe-creation-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <Card>
            <CardContent className="space-y-5">
              <RecipeInfoStep
                data-step="0"
                form={form}
                categories={categories}
              />
              <RecipeIngredientsStep
                form={form}
                ingredients={ingredients}
                data-step="1"
              />
              <RecipeStepsStep data-step="2" form={form} />
            </CardContent>
            <CardDescription className="flex justify-center">
              <Button type="submit">Create</Button>
            </CardDescription>
          </Card>
        </form>
      </ScrollArea>
    </div>
  )
}
