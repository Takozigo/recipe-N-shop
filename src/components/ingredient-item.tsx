import { Text } from './text'

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from './ui/item'
import type { ingredient } from '@/lib/types/ingredient'

export function IngredientItem({
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
    <Item className="py-2">
      <ItemContent>
        <ItemTitle>{ingredient.ingredient.value}</ItemTitle>
        <ItemDescription>{ingredient.note}</ItemDescription>
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
