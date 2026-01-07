import {
  ChevronRightIcon,
  CookingPotIcon,
  ShoppingBasket,
  Utensils,
} from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { cn } from '@/lib/utils'

type RecipeFormStepperStep = 'recipe' | 'ingredients' | 'steps'

export function RecipeFormStepper({ step }: { step: RecipeFormStepperStep }) {
  return (
    <div className="flex items-center">
      <Item>
        <ItemMedia
          className={cn(
            'self-center! rounded-full p-3 transition-colors duration-600',
            step === 'recipe' && 'bg-primary',
          )}
        >
          <Utensils
            className={cn(
              'size-8 transition-colors',
              step === 'recipe' && 'text-secondary',
            )}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Recipe</ItemTitle>
          <ItemDescription>Just some basic information.</ItemDescription>
        </ItemContent>
      </Item>
      <ChevronRightIcon />
      <Item className="items-center">
        <ItemMedia
          className={cn(
            'self-center! rounded-full p-3 transition-colors duration-600',
            step === 'ingredients' && 'bg-primary',
          )}
        >
          <ShoppingBasket
            className={cn(
              'size-8 transition-colors',
              step === 'ingredients' && 'text-secondary',
            )}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Ingredients</ItemTitle>
          <ItemDescription>
            No recipe without ingredient, right ?
          </ItemDescription>
        </ItemContent>
      </Item>
      <ChevronRightIcon />
      <Item>
        <ItemMedia
          className={cn(
            'self-center! rounded-full p-3 transition-colors duration-600',
            step === 'steps' && 'bg-primary',
          )}
        >
          <CookingPotIcon
            className={cn(
              'size-8 transition-colors',
              step === 'steps' && 'text-secondary',
            )}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Steps</ItemTitle>
          <ItemDescription>All the step to make the recipe !</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  )
}
