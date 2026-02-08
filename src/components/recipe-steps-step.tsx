import { Editor } from './tiptap/tiptap-editor/editor'
import { Text } from './text'
import type { Content, JSONContent } from '@tiptap/react'
import type { RecipeForm } from '@/hooks/use-recipe-form'

import { Field, FieldGroup, FieldSeparator } from '@/components/ui/field'

type RecipeStepsStepProps = {
  form: RecipeForm
}

const RecipeStepsStep = ({ form }: RecipeStepsStepProps) => {
  // const { sections } = useSectionStore()

  return (
    <FieldGroup>
      <FieldSeparator />
      <Text variant="lead" className="text-center">
        Instructions
      </Text>
      <form.Field name="content">
        {(field) => {
          const invalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={invalid}>
              <Editor
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
