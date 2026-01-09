import { getRouteApi } from '@tanstack/react-router'
import type { RecipeForm } from '@/hooks/use-recipe-form'
import { TextAreaField, TextField } from '@/components/text-field'
import { CarouselItem } from '@/components/ui/carousel'
import { FieldGroup, FieldSeparator } from '@/components/ui/field'

type RecipeInfoStepProps = {
  form: RecipeForm
}

function RecipeInfoStep({ form }: RecipeInfoStepProps) {
  const { categories } = getRouteApi('/recipes/new/').useLoaderData()

  return (
    <CarouselItem>
      <FieldGroup>
        <TextField name="title" form={form} label="Recipe Title" />
        <TextAreaField
          name="shortDescription"
          form={form}
          label="Short description"
          maxLength={150}
        />
        <TextAreaField name="description" form={form} label="Description" />
        <FieldSeparator />
        <div className="flex items-center gap-4">
          <TextField
            name="servings"
            form={form}
            label="Servings"
            type="number"
            min={1}
          />
          <TextField
            type="number"
            name="prepTimeMinutes"
            form={form}
            label="Prep time (in minutes)"
            min={1}
          />
          <TextField
            type="number"
            name="cookTimeMinutes"
            form={form}
            label="Cook time (in minutes)"
            min={1}
          />
        </div>
      </FieldGroup>
    </CarouselItem>
  )
}

export default RecipeInfoStep
