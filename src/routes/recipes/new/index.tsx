import { error } from 'node:console'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, getRouteApi, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
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
  FieldSeparator,
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
import { Combobox } from '@/components/ui/combobox'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from '@/db'
import { Textarea } from '@/components/ui/textarea'
import {
  ingredients as ingredientsSchema,
  recipeIngredients,
  recipeSections,
  recipeSteps,
  recipes,
} from '@/db/schema'

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

interface Recipe {
  title: string
  description?: string
  servings: number
  prepTimeMinutes: number
  cookTimeMinutes: number
  ingredients: Array<{
    ingredientId?: string
    ingredient: string
    amount: number
    unit?: string
    note?: string
    section?: string
  }>
  steps: Array<{
    section?: string
    position: number
    title?: string
    description: string
    imageUrl?: string
  }>
}

const defaultRecipe: Recipe = {
  title: '',
  servings: 0,
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  ingredients: [],
  steps: [],
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

const addRecipe = createServerFn({ method: 'POST' })
  .inputValidator(recipeSchema)
  .handler(async ({ data }) => {
    const {
      title,
      description,
      servings,
      prepTimeMinutes,
      cookTimeMinutes,
      ingredients,
      steps,
    } = data
    const rawData = await db
      .insert(recipes)
      .values({
        title,
        description,
        servings,
        prepTimeMinutes,
        cookTimeMinutes,
      })
      .returning({ insertedId: recipes.id })

    const createdRecipe = rawData[0]

    const sectionsTitle = [
      ...new Set(
        ingredients
          .map((i) => i.section)
          .concat(steps.map((s) => s.section))
          .filter((e) => e !== undefined),
      ),
    ]

    if (sectionsTitle.length > 0) {
      const sections = sectionsTitle.map((e) => ({
        recipeId: createdRecipe.insertedId,
        title: e,
        position: steps.find((s) => s.section === e)?.position ?? 0,
      }))
      await db.insert(recipeSections).values(sections)
    }

    await db.insert(recipeSteps).values(steps)

    const newIngredientsToInsert = ingredients
      .filter((i) => i.ingredientId === undefined)
      .map((e) => ({
        value: e.ingredient,
        lang: 'fr',
      }))

    const newIngredients = await db
      .insert(ingredientsSchema)
      .values(newIngredientsToInsert)
      .returning({
        insertedId: ingredientsSchema.id,
        value: ingredientsSchema.value,
      })

    await db.insert(recipeSteps).values(steps)

    const recipeIngredientsToInsert: Array<{
      recipeId: string
      ingredient: string
      amount: string
      ingredientId: string
      unit?: string
      note?: string
      section?: string
    }> = ingredients.map((e) => {
      if (e.ingredientId)
        return {
          ...e,
          recipeId: createdRecipe.insertedId,
          ingredientId: e.ingredientId,
          amount: e.amount.toString(),
        }
      else {
        const ingredientId = newIngredients.find(
          (i) => i.value === e.ingredient,
        )?.insertedId
        if (!ingredientId)
          throw { error: true, message: 'ingredientId is missing' }
        return {
          ...e,
          recipeId: createdRecipe.insertedId,
          ingredientId: ingredientId,
          amount: e.amount.toString(),
        }
      }
    })

    await db.insert(recipeIngredients).values(recipeIngredientsToInsert)

    throw redirect({
      to: '/recipes/$id',
      params: { id: createdRecipe.insertedId },
    })
  })

type RecipeFormStepperStep = 'recipe' | 'ingredients' | 'steps'

const STEPS: Array<RecipeFormStepperStep> = ['recipe', 'ingredients', 'steps']

function RouteComponent() {
  const [api, setApi] = useState<CarouselApi>()
  const [count, setCount] = useState(0)
  const addRecipeFn = useServerFn(addRecipe)

  const [pendingIngredient, setPendingIngredient] = useState<{
    dataId?: string
    value: string
  } | null>(null)

  const { categories, ingredients } =
    getRouteApi('/recipes/new/').useLoaderData()

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
    onSubmit: ({ value }) => {
      addRecipeFn({ data: { ...value } })
    },
  })

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
                <CarouselItem>
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
                    <FieldSeparator />
                    <div className="flex items-center gap-4">
                      <form.Field
                        name="servings"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Servings
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                type="number"
                                onChange={(e) =>
                                  field.handleChange(+e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="Servings"
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
                        name="prepTimeMinutes"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Prep time (in minutes)
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                type="number"
                                onChange={(e) =>
                                  field.handleChange(+e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="Prep time (in minutes)"
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
                        name="cookTimeMinutes"
                        children={(field) => {
                          const isInvalid =
                            field.state.meta.isTouched &&
                            !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Cook time (in minutes)
                              </FieldLabel>
                              <Input
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                type="number"
                                onChange={(e) =>
                                  field.handleChange(+e.target.value)
                                }
                                aria-invalid={isInvalid}
                                placeholder="Cook time (in minutes)"
                                autoComplete="off"
                              />
                              {isInvalid && (
                                <FieldError errors={field.state.meta.errors} />
                              )}
                            </Field>
                          )
                        }}
                      />
                    </div>
                  </FieldGroup>
                </CarouselItem>
                <CarouselItem>
                  <FieldGroup>
                    <form.Field name="ingredients" mode="array">
                      {(field) => (
                        <Table>
                          <TableCaption>
                            <div className="flex p-2 justify-center gap-2 m-auto">
                              <Combobox
                                data={ingredients}
                                onSelect={setPendingIngredient}
                              />
                              <Button
                                disabled={!pendingIngredient}
                                onClick={() => {
                                  if (pendingIngredient)
                                    field.pushValue({
                                      ingredientId: pendingIngredient.dataId,
                                      ingredient: pendingIngredient.value,
                                      amount: 0,
                                    })
                                  setPendingIngredient(null)
                                }}
                                type="button"
                              >
                                Add an ingredient
                              </Button>
                            </div>
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Ingredient</TableHead>
                              <TableHead className="text-right">
                                Amount
                              </TableHead>
                              <TableHead>Unit</TableHead>
                              <TableHead>Note</TableHead>
                              <TableHead>Section</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {field.state.value.map((_, i) => {
                              return (
                                <TableRow key={i}>
                                  <form.Field
                                    name={`ingredients[${i}].ingredient`}
                                  >
                                    {(subField) => (
                                      <TableCell>
                                        <Field>
                                          <Input
                                            id={field.name}
                                            name={field.name}
                                            value={subField.state.value}
                                            onChange={(e) =>
                                              subField.handleChange(
                                                e.target.value,
                                              )
                                            }
                                            onBlur={field.handleBlur}
                                            placeholder="The best food is the world"
                                            autoComplete="off"
                                          />
                                        </Field>
                                      </TableCell>
                                    )}
                                  </form.Field>
                                  <form.Field
                                    key={i}
                                    name={`ingredients[${i}].amount`}
                                  >
                                    {(subField) => (
                                      <TableCell>
                                        <Field>
                                          <Input
                                            id={field.name}
                                            name={field.name}
                                            value={subField.state.value}
                                            type="number"
                                            onChange={(e) =>
                                              subField.handleChange(
                                                +e.target.value,
                                              )
                                            }
                                            onBlur={field.handleBlur}
                                            placeholder="amount"
                                            autoComplete="off"
                                          />
                                        </Field>
                                      </TableCell>
                                    )}
                                  </form.Field>
                                  <form.Field
                                    key={i}
                                    name={`ingredients[${i}].unit`}
                                  >
                                    {(subField) => (
                                      <TableCell>
                                        <Field>
                                          <Input
                                            id={field.name}
                                            name={field.name}
                                            value={subField.state.value}
                                            onChange={(e) =>
                                              subField.handleChange(
                                                e.target.value,
                                              )
                                            }
                                            onBlur={field.handleBlur}
                                            placeholder="Unit (optional)"
                                            autoComplete="off"
                                          />
                                        </Field>
                                      </TableCell>
                                    )}
                                  </form.Field>
                                  <form.Field
                                    key={i}
                                    name={`ingredients[${i}].note`}
                                  >
                                    {(subField) => (
                                      <TableCell>
                                        <Field>
                                          <Input
                                            id={field.name}
                                            name={field.name}
                                            value={subField.state.value}
                                            onChange={(e) =>
                                              subField.handleChange(
                                                e.target.value,
                                              )
                                            }
                                            onBlur={field.handleBlur}
                                            placeholder="note (optional)"
                                            autoComplete="off"
                                          />
                                        </Field>
                                      </TableCell>
                                    )}
                                  </form.Field>
                                  <form.Field
                                    key={i}
                                    name={`ingredients[${i}].section`}
                                  >
                                    {(subField) => (
                                      <TableCell>
                                        <Field>
                                          <Input
                                            id={field.name}
                                            name={field.name}
                                            value={subField.state.value}
                                            onChange={(e) =>
                                              subField.handleChange(
                                                e.target.value,
                                              )
                                            }
                                            onBlur={field.handleBlur}
                                            placeholder="ex: Sauce (optional)"
                                            autoComplete="off"
                                          />
                                        </Field>
                                      </TableCell>
                                    )}
                                  </form.Field>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                          {/* <TableFooter>
                              <TableRow>
                                <TableCell colSpan={4}>Total</TableCell>
                                <TableCell className="text-right">
                                  $2,500.00
                                </TableCell>
                              </TableRow>
                            </TableFooter> */}
                        </Table>
                      )}
                    </form.Field>
                  </FieldGroup>
                </CarouselItem>
                <CarouselItem>
                  <FieldGroup>
                    <form.Field name="steps" mode="array">
                      {(field) => (
                        <div className="space-y-2">
                          {field.state.value.map((_, i) => {
                            return (
                              <div className="space-y-2" key={i}>
                                <div className="flex gap-2">
                                  <form.Field
                                    key={i}
                                    name={`steps[${i}].section`}
                                  >
                                    {(subField) => (
                                      <Field>
                                        <Input
                                          id={field.name}
                                          name={field.name}
                                          value={subField.state.value}
                                          onChange={(e) =>
                                            subField.handleChange(
                                              e.target.value,
                                            )
                                          }
                                          onBlur={field.handleBlur}
                                          placeholder="section (optional)"
                                          autoComplete="off"
                                        />
                                      </Field>
                                    )}
                                  </form.Field>
                                  <form.Field
                                    key={i}
                                    name={`steps[${i}].position`}
                                  >
                                    {(subField) => (
                                      <Field>
                                        <Input
                                          id={field.name}
                                          name={field.name}
                                          value={subField.state.value}
                                          type="number"
                                          onChange={(e) =>
                                            subField.handleChange(
                                              +e.target.value,
                                            )
                                          }
                                          onBlur={field.handleBlur}
                                          placeholder="position (optional)"
                                          autoComplete="off"
                                        />
                                      </Field>
                                    )}
                                  </form.Field>
                                  <form.Field
                                    key={i}
                                    name={`steps[${i}].title`}
                                  >
                                    {(subField) => (
                                      <Field>
                                        <Input
                                          id={field.name}
                                          name={field.name}
                                          value={subField.state.value}
                                          onChange={(e) =>
                                            subField.handleChange(
                                              e.target.value,
                                            )
                                          }
                                          onBlur={field.handleBlur}
                                          placeholder="title (optional)"
                                          autoComplete="off"
                                        />
                                      </Field>
                                    )}
                                  </form.Field>
                                </div>
                                <form.Field
                                  key={i}
                                  name={`steps[${i}].description`}
                                >
                                  {(subField) => (
                                    <Field>
                                      <Textarea
                                        id={field.name}
                                        name={field.name}
                                        value={subField.state.value}
                                        onChange={(e) =>
                                          subField.handleChange(e.target.value)
                                        }
                                        onBlur={field.handleBlur}
                                        placeholder="Step"
                                        autoComplete="off"
                                      />
                                    </Field>
                                  )}
                                </form.Field>
                              </div>
                            )
                          })}
                          <Button
                            onClick={() =>
                              field.pushValue({
                                description: '',
                                position: field.state.value.length,
                              })
                            }
                          >
                            Add steps
                          </Button>
                        </div>
                      )}
                    </form.Field>
                  </FieldGroup>
                </CarouselItem>
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
