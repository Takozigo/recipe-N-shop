import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import RecipeInfoStep from './_components/recipe-info-step'
import RecipeIngredientsStep from './_components/recipe-ingredients-step'
import RecipeStepsStep from './_components/recipe-steps-step'
import type { CarouselApi } from '@/components/ui/carousel'
import { RecipeFormStepper } from '@/components/recipe-form-stepper'
import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import { Carousel, CarouselContent } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { useRecipeForm } from '@/hooks/use-recipe-form'
import { db } from '@/server/db'

const getIngredients = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await db.query.ingredients.findMany()
  return res
})

const getCategories = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await db.query.categories.findMany()
  return res
})

export const Route = createFileRoute('/recipes/new/')({
  component: RouteComponent,
  loader: async () => ({
    categories: await getCategories(),
    ingredients: await getIngredients(),
  }),
})

type RecipeFormStepperStep = 'recipe' | 'ingredients' | 'steps'

const STEPS: Array<RecipeFormStepperStep> = ['recipe', 'ingredients', 'steps']

function RouteComponent() {
  const [api, setApi] = useState<CarouselApi>()
  const [count, setCount] = useState(0)
  const form = useRecipeForm()

  useEffect(() => {
    if (!api) {
      return
    }
  }, [api])

  return (
    <div className="container space-y-2">
      <Text variant="h1">Create a new recipe</Text>
      <Separator />
      <RecipeFormStepper step={STEPS[count]} />
      <form
        id="recipe-creation-form"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <Card>
          <CardContent>
            <Carousel setApi={setApi}>
              <CarouselContent>
                <RecipeInfoStep form={form} />
                <RecipeIngredientsStep form={form} />
                <RecipeStepsStep form={form} />
              </CarouselContent>
            </Carousel>
          </CardContent>
          <CardDescription className="m-auto space-x-4">
            <Button
              type="button"
              disabled={!api?.canScrollPrev()}
              onClick={() => {
                setCount((c) => c - 1)
                if (api?.canScrollPrev()) api.scrollPrev()
              }}
            >
              Prev
            </Button>

            <Button
              disabled={!api?.canScrollNext()}
              type="button"
              onClick={() => {
                setCount((c) => c + 1)
                if (api?.canScrollNext()) api.scrollNext()
              }}
            >
              Next
            </Button>
            <Button type="submit">Create</Button>
          </CardDescription>
        </Card>
      </form>
    </div>
  )
}
