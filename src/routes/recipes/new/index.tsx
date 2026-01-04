import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import z from 'zod'
import type { CarouselApi } from '@/components/ui/carousel'
import { RecipeFormStepper } from '@/components/recipe-form-stepper'
import { Text } from '@/components/text'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/recipes/new/')({
  component: RouteComponent,
})

interface Recipe {
  title: string
  description?: string
  servings: number
  prepTimeMinutes: number
  cookTimeMinutes: number
}

const defaultRecipe: Recipe = {
  title: '',
  servings: 0,
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
}

const recipeSchema = z.object({
  title: z
    .string()
    .min(5, 'Recipe title must be at least 5 characters.')
    .max(32, 'Recipe title must be at most 32 characters.'),
  description: z.string().max(100).optional(),
  servings: z.number().min(1),
  prepTimeMinutes: z.number().min(1),
  cookTimeMinutes: z.number().min(1),
})

type RecipeFormStepperStep = 'recipe' | 'ingredients' | 'steps'

const STEPS: Array<RecipeFormStepperStep> = ['recipe', 'ingredients', 'steps']

function RouteComponent() {
  const [api, setApi] = useState<CarouselApi>()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
    console.log(api.scrollSnapList().length)
  }, [api])

  const form = useForm({
    defaultValues: defaultRecipe,
    validators: {
      onSubmit: recipeSchema,
    },
    onSubmit: (e) => {
      console.log(JSON.stringify(e))
    },
  })
  return (
    <div className="container space-y-2">
      <Text variant="h1">Create a new recipe</Text>
      <Separator />
      <RecipeFormStepper step={STEPS[count]} />
      <Card>
        <CardContent>
          <Carousel setApi={setApi}>
            <CarouselContent className="w-full">
              <CarouselItem>
                <form
                  id="recipe-creation-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    form.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <form.Field
                      name="title"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Recipe Title
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="The best food is the world"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                    <form.Field
                      name="description"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Description
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupTextarea
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                placeholder="I love this recipe so much, good, easy and so good. Did i said it is a good recipe ? (optional)"
                                rows={6}
                                className="min-h-24 resize-none"
                                aria-invalid={isInvalid}
                              />
                              <InputGroupAddon align="block-end">
                                <InputGroupText className="tabular-nums">
                                  {field.state.value?.length}/100 characters
                                </InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                              Description, origin, anything you would like to
                              share about the recipe ! (optional)
                            </FieldDescription>
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                  </FieldGroup>
                </form>
              </CarouselItem>
              <CarouselItem>TODO 2</CarouselItem>
              <CarouselItem>TODO 3</CarouselItem>
            </CarouselContent>
          </Carousel>
        </CardContent>
        <CardDescription className="m-auto space-x-4">
          {count > 0 && (
            <Button
              onClick={() => {
                setCount((c) => c - 1)
                if (api?.canScrollPrev) api.scrollPrev()
              }}
            >
              Prev
            </Button>
          )}
          {count < 2 && (
            <Button
              onClick={() => {
                setCount((c) => c + 1)
                if (api?.canScrollNext) api.scrollNext()
              }}
            >
              Next
            </Button>
          )}
        </CardDescription>
      </Card>
    </div>
  )
}
