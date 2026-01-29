import type { RecipeForm } from '@/hooks/use-recipe-form'
import type { Content, JSONContent } from '@tiptap/react'
import { Field, FieldGroup } from '@/components/ui/field'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'

type RecipeStepsStepProps = {
  form: RecipeForm
}

const RecipeStepsStep = ({ form }: RecipeStepsStepProps) => {
  // const { sections } = useSectionStore()

  return (
    <FieldGroup>
      <form.Field name="content">
        {(field) => {
          const invalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={invalid}>
              <SimpleEditor
                content={field.state.value as Content}
                onChange={field.handleChange as (j: JSONContent) => void}
              />
            </Field>
          )
        }}
      </form.Field>
    </FieldGroup>
  )
}

export default RecipeStepsStep
