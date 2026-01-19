import { XIcon } from 'lucide-react'
import type { RecipeForm } from '@/hooks/use-recipe-form'
import { TextAreaField, TextField } from '@/components/text-field'
import { FieldGroup, FieldSeparator } from '@/components/ui/field'
import { Combobox } from '@/components/ui/combobox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/text'

type RecipeInfoStepProps = {
  form: RecipeForm
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
}

function RecipeInfoStep({ form, categories }: RecipeInfoStepProps) {
  return (
    <FieldGroup>
      <form.Field name="categories" mode="array">
        {(field) => (
          <>
            <Combobox
              data={categories.map((e) => ({ ...e, value: e.name }))}
              onSelect={(cat) =>
                field.pushValue({ id: cat.dataId, name: cat.value })
              }
            />
            <div className="flex gap-2">
              {field.state.value.map((cat, i) => {
                return (
                  <Badge key={cat.id ?? cat.name} className="corner-squircle">
                    <Text variant="large" className="ml-2">
                      {cat.name}
                    </Text>
                    <Button
                      type="button"
                      onClick={() => field.removeValue(i)}
                      className="has-[>svg]:p-2"
                    >
                      <XIcon color="red" />
                    </Button>
                  </Badge>
                )
              })}
            </div>
          </>
        )}
      </form.Field>
      <TextField name="title" form={form} label="Recipe Title" maxLength={50} />
      <TextAreaField
        name="shortDescription"
        form={form}
        label="Short description"
        maxLength={150}
      />
      <TextAreaField
        name="description"
        form={form}
        label="Description"
        className="min-h-40"
      />
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
          min={0}
        />
        <TextField
          type="number"
          name="cookTimeMinutes"
          form={form}
          label="Cook time (in minutes)"
          min={0}
        />
      </div>
    </FieldGroup>
  )
}

export default RecipeInfoStep
