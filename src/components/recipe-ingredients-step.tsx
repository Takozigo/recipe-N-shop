import { getRouteApi } from '@tanstack/react-router'
import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import type { RecipeForm } from '@/hooks/use-recipe-form'
import type { UnitKey } from '@/lib/constants/unit'
import { FieldTextInput } from '@/components/text-field'
import { Button } from '@/components/ui/button'
import { CarouselItem } from '@/components/ui/carousel'
import { Combobox } from '@/components/ui/combobox'
import { FieldGroup } from '@/components/ui/field'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UNIT_GROUPS, UNIT_TYPE_LABELS } from '@/lib/constants/unit'

type RecipeIngredientsStepProps = {
  form: RecipeForm
}

function RecipeIngredientsStep({ form }: RecipeIngredientsStepProps) {
  const [pendingIngredient, setPendingIngredient] = useState<{
    dataId?: string
    value: string
  } | null>(null)

  const { ingredients } = getRouteApi('/recipes/new/').useLoaderData()

  return (
    <CarouselItem>
      <FieldGroup>
        <form.Field name="ingredients" mode="array">
          {(field) => (
            <Table>
              <TableCaption>
                <div className="m-auto flex justify-center gap-2 p-2">
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
                          unit: 'pcs',
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
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {field.state.value.map((_, i) => {
                  return (
                    <TableRow key={i}>
                      <form.Field name={`ingredients[${i}].ingredient`}>
                        {(subField) => (
                          <TableCell>
                            <FieldTextInput
                              field={subField}
                              placeholder="The best food is the world"
                              autoComplete="off"
                            />
                          </TableCell>
                        )}
                      </form.Field>
                      <form.Field name={`ingredients[${i}].amount`}>
                        {(subField) => (
                          <TableCell>
                            <FieldTextInput
                              field={subField}
                              placeholder="amount"
                              autoComplete="off"
                              type="number"
                            />
                          </TableCell>
                        )}
                      </form.Field>
                      <form.Field name={`ingredients[${i}].unit`}>
                        {(subField) => (
                          <TableCell>
                            <Select
                              value={subField.state.value}
                              onValueChange={(value) =>
                                subField.handleChange(value as UnitKey)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                {UNIT_GROUPS.map((group) => (
                                  <SelectGroup key={group.type}>
                                    <SelectLabel>
                                      {UNIT_TYPE_LABELS[group.type].en}
                                    </SelectLabel>
                                    {group.units.map((unit) => (
                                      <SelectItem
                                        key={unit.key}
                                        value={unit.key}
                                      >
                                        {unit.label.fr}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        )}
                      </form.Field>

                      <form.Field name={`ingredients[${i}].section`}>
                        {(subField) => (
                          <TableCell>
                            <FieldTextInput
                              field={subField}
                              placeholder="ex: Sauce (optional)"
                              autoComplete="off"
                            />
                          </TableCell>
                        )}
                      </form.Field>
                      <form.Field name={`ingredients[${i}].note`}>
                        {(subField) => (
                          <TableCell>
                            <FieldTextInput
                              field={subField}
                              placeholder="note (optional)"
                              autoComplete="off"
                            />
                          </TableCell>
                        )}
                      </form.Field>

                      <TableCell>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => field.removeValue(i)}
                        >
                          <TrashIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </form.Field>
      </FieldGroup>
    </CarouselItem>
  )
}

export default RecipeIngredientsStep
