import type { RecipeForm } from '@/hooks/use-recipe-form'
import { FieldTextInput } from '@/components/text-field'
import { Button } from '@/components/ui/button'
import { CarouselItem } from '@/components/ui/carousel'
import { FieldGroup } from '@/components/ui/field'

type RecipeStepsStepProps = {
  form: RecipeForm
}

const RecipeStepsStep = ({ form }: RecipeStepsStepProps) => {
  return (
    <CarouselItem>
      <FieldGroup>
        <form.Field name="steps" mode="array">
          {(field) => (
            <div className="space-y-2">
              {field.state.value.map((_, i) => {
                return (
                  <div className="space-y-2" key={i}>
                    <div className="flex gap-2">
                      <form.Field key={i} name={`steps[${i}].section`}>
                        {(subField) => (
                          <FieldTextInput
                            field={subField}
                            placeholder="section (optional)"
                            autoComplete="off"
                          />
                        )}
                      </form.Field>
                      <form.Field key={i} name={`steps[${i}].position`}>
                        {(subField) => (
                          <FieldTextInput
                            field={subField}
                            placeholder="position (optional)"
                            type="number"
                            min={0}
                            autoComplete="off"
                          />
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
                    </div>
                    <form.Field key={i} name={`steps[${i}].description`}>
                      {(subField) => (
                        <FieldTextInput
                          field={subField}
                          placeholder="Step"
                          autoComplete="off"
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
    </CarouselItem>
  )
}

export default RecipeStepsStep
