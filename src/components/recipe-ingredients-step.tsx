import { TrashIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'
import type { RecipeForm } from '@/hooks/use-recipe-form'
import type { UnitKey } from '@/lib/constants/unit'
import { FieldTextInput } from '@/components/text-field'
import { Button } from '@/components/ui/button'
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useSectionStore } from '@/store/sections'

type RecipeIngredientsStepProps = {
  form: RecipeForm
  ingredients: Array<{
    id: string
    value: string
    lang: string
  }>
}

function RecipeIngredientsStep({
  form,
  ingredients,
}: RecipeIngredientsStepProps) {
  const { sections, addSection, setSections, reset } = useSectionStore()
  const sectionRef = useRef<HTMLInputElement>(null)
  const [pendingIngredient, setPendingIngredient] = useState<{
    dataId?: string
    value: string
  } | null>(null)

  useEffect(() => {
    setSections(
      form
        .getFieldValue('ingredients')
        .map((e) => e.section ?? undefined)
        .filter((e) => e !== undefined),
    )

    return () => {
      reset() // important when navigating between recipes
    }
  }, [form, setSections, reset])

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="mb-4">Create Section (Optional)</Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add a section to your recipe</AlertDialogTitle>
            <AlertDialogDescription>
              This is optional, it could be "sauce", "dough", "side" or anything
              else.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input ref={sectionRef} />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (sectionRef.current?.value)
                  addSection(sectionRef.current.value)
              }}
            >
              Add
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
                            <Select
                              value={subField.state.value ?? ''}
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
                          type="button"
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
    </>
  )
}

export default RecipeIngredientsStep
