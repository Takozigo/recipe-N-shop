import { useState } from 'react'
import { Text } from './text'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader } from './ui/card'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { ButtonGroup } from './ui/button-group'
import { Separator } from './ui/separator'
import { Item, ItemActions, ItemContent, ItemTitle } from './ui/item'
import type { IngredientBlock, ingredient } from '@/lib/types/ingredient'

type IngredientsSidebarProps = {
  ingredients: Array<IngredientBlock>
  portion: number | null
}

function IngredientsSidebar({ ingredients, portion }: IngredientsSidebarProps) {
  const [serving, setServing] = useState(portion ?? 1)

  return (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          See the ingredients list
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="mt-14 border-none bg-transparent shadow-none md:mt-24"
      >
        <Card>
          <CardHeader>
            <SheetTitle>Ingredients list</SheetTitle>
            <Separator />
            <CardDescription className="flex items-center justify-between">
              <Text>{serving} Portion(s)</Text>
              <ButtonGroup>
                <Button
                  disabled={serving === 1}
                  onClick={() => {
                    if (serving === 1) return
                    setServing((s) => s - 1)
                  }}
                >
                  -
                </Button>
                <Button
                  onClick={() => {
                    setServing((s) => s + 1)
                  }}
                >
                  +
                </Button>
              </ButtonGroup>
            </CardDescription>
            <Separator />
          </CardHeader>
          <CardContent>
            {ingredients.map((block) => {
              if (block.type === 'ingredients') {
                return (
                  <div key="unsectioned">
                    {block.items.map((i) => (
                      <IngredientItem
                        key={i.ingredientId}
                        ingredient={i}
                        serving={serving}
                        portion={portion}
                      />
                    ))}
                  </div>
                )
              }

              return (
                <div key={block.id}>
                  {block.title && (
                    <Text className="mb-2 font-semibold">{block.title}</Text>
                  )}

                  {block.items.map((i) => (
                    <IngredientItem
                      key={i.ingredientId}
                      ingredient={i}
                      serving={serving}
                      portion={portion}
                    />
                  ))}
                </div>
              )
            })}
          </CardContent>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </Card>
      </SheetContent>
    </Sheet>
  )
}

export default IngredientsSidebar

function IngredientItem({
  ingredient,
  serving,
  portion,
}: {
  ingredient: ingredient
  serving: number
  portion: number | null
}) {
  const getAmountByServing = (amount: number) => {
    return amount * (serving / (portion ?? 1))
  }
  const amount =
    ingredient.amount && ingredient.unit
      ? getAmountByServing(Number(ingredient.amount))
      : null

  return (
    <Item>
      <ItemContent>
        <ItemTitle>{ingredient.ingredient.value}</ItemTitle>
      </ItemContent>
      <ItemActions>
        {amount ? (
          <Text variant="muted">
            {amount} {ingredient.unit}
          </Text>
        ) : (
          <Text variant="muted">au goût</Text>
        )}
      </ItemActions>
    </Item>
  )
}
