import { TrashIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import type { RecipeForm } from '@/hooks/use-recipe-form'
import { FieldTextAreaInput, FieldTextInput } from '@/components/text-field'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { useSectionStore } from '@/store/sections'

type RecipeStepsStepProps = {
  form: RecipeForm
}

const RecipeStepsStep = ({ form }: RecipeStepsStepProps) => {
  const { sections } = useSectionStore()

  return (
    <FieldGroup>
      <form.Field name="steps" mode="array">
        {(field) => (
          <div className="space-y-2">
            {field.state.value.map((_, i) => {
              return (
                <div className="space-y-2" key={i}>
                  <div className="flex gap-2">
                    <form.Field name={`ingredients[${i}].section`}>
                      {(subField) => (
                        <Select
                          disabled={sections.length === 0}
                          value={subField.state.value}
                          onValueChange={(value) =>
                            subField.handleChange(value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Section (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {sections.map((section) => (
                              <SelectItem key={section} value={section}>
                                {section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </form.Field>
                    <form.Field key={i} name={`steps[${i}].title`}>
                      {(subField) => (
                        <FieldTextInput
                          field={subField}
                          placeholder="title (optional)"
                          autoComplete="off"
                        />
                      )}
                    </form.Field>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => field.removeValue(i)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                  <form.Field key={i} name={`steps[${i}].description`}>
                    {(subField) => (
                      <FieldTextAreaInput
                        field={subField}
                        className="min-h-40"
                      />
                    )}
                  </form.Field>
                </div>
              )
            })}
            <Button
              type="button"
              onClick={() =>
                field.pushValue({
                  description: '',
                  position: field.state.value.length + 1,
                })
              }
            >
              Add steps
            </Button>
          </div>
        )}
      </form.Field>
    </FieldGroup>
  )
}

export default RecipeStepsStep
