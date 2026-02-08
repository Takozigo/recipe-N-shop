import { Link, createFileRoute } from '@tanstack/react-router'

import { useServerFn } from '@tanstack/react-start'
import type { FormEvent } from 'react'
import type { UnitKey } from '@/lib/constants/unit'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  deleteIngredientFn,
  getAllIngredientsFn,
  updateIngredientFn,
} from '@/server/actions/ingredients/get-all-ingredients'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
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
import { Field } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/admin/ingredients/')({
  component: RouteComponent,
  loader: async () => await getAllIngredientsFn(),
})

function RouteComponent() {
  const ingredients = Route.useLoaderData()

  const frIngredients = ingredients.filter((e) => e.lang === 'fr')

  const mid = Math.ceil(frIngredients.length / 2)
  const left = frIngredients.slice(0, mid)
  const right = frIngredients.slice(mid)

  const TableBlock = ({
    data,
  }: {
    data: Array<{
      id: string
      value: string
      lang: string
      price: string | null
      quantity: string | null
      unit: string | null
    }>
  }) => (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-200 hover:bg-slate-200">
          <TableHead className="flex-2">Ingredient</TableHead>
          <TableHead className="flex-1 text-right">Price</TableHead>
          <TableHead className="flex-1 text-right">Quantité</TableHead>
          <TableHead className="flex-1 text-right">Unité</TableHead>
          <TableHead className="flex-1 text-right">price/qte</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((e) => (
          <AlertDialog key={e.id}>
            <AlertDialogTrigger asChild>
              <TableRow>
                <TableCell className="flex-2 font-medium">{e.value}</TableCell>
                <TableCell className="flex-1 text-right">{e.price}</TableCell>
                <TableCell className="flex-1 text-right">
                  {e.quantity}
                </TableCell>
                <TableCell className="flex-1 text-right">{e.unit}</TableCell>
                <TableCell className="flex-1 text-right">TODO</TableCell>
              </TableRow>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <IngredientFormModifier ingredient={e} />
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="container">
      Hello "/_authenticated/admin/ingredients/"!
      <Link to={'/admin'} className={buttonVariants({ variant: 'link' })}>
        Recipe
      </Link>
      <div className="overflow-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <TableBlock data={left} />
          <TableBlock data={right} />
        </div>
      </div>
    </div>
  )
}

const IngredientFormModifier = ({
  ingredient,
}: {
  ingredient: {
    id: string
    value: string
    lang: string
    price: string | null
    quantity: string | null
    unit: string | null
  }
}) => {
  const updateIngredient = useServerFn(updateIngredientFn)
  const deleteIngredient = useServerFn(deleteIngredientFn)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const value = formData.get('ingredient') as string
    const price = Number(formData.get('price'))
    const quantity = Number(formData.get('quantity'))
    const unit = formData.get('unit') as unknown as UnitKey

    const res = await updateIngredient({
      data: {
        id: ingredient.id,
        value,
        price,
        quantity,
        unit,
        lang: ingredient.lang,
      },
    })
    console.log({ res })
    // if (res.success) navigate({ to: '/admin' })
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <AlertDialogDescription className="flex gap-2">
        <Field>
          <Label>Ingredient</Label>
          <Input
            id="value"
            placeholder="Ingredient"
            name="ingredient"
            required
            defaultValue={ingredient.value}
          />
        </Field>
        <Field>
          <Label>Prix</Label>
          <Input
            id="price"
            type="number"
            placeholder="price"
            name="price"
            required
            autoComplete="off"
            defaultValue={Number(ingredient.price)}
          />
        </Field>
        <Field>
          <Label>Quantité</Label>
          <Input
            id="quantity"
            type="number"
            placeholder="quantity"
            name="quantity"
            required
            autoComplete="off"
            defaultValue={Number(ingredient.quantity)}
          />
        </Field>
        <Field>
          <Label>Unit</Label>
          <Select name="unit">
            <SelectTrigger defaultValue={ingredient.unit ?? undefined}>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_GROUPS.map((group) => (
                <SelectGroup key={group.type}>
                  <SelectLabel>{UNIT_TYPE_LABELS[group.type].en}</SelectLabel>
                  {group.units.map((unit) => (
                    <SelectItem key={unit.key} value={unit.key}>
                      {unit.label.fr}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </AlertDialogDescription>
      <AlertDialogFooter>
        <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
        <AlertDialogAction type="submit">Save</AlertDialogAction>
      </AlertDialogFooter>
    </form>
  )
}
