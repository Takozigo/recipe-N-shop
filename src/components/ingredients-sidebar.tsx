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
import { ScrollArea } from './ui/scroll-area'
import { IngredientItem } from './ingredient-item'
import type { IngredientBlock } from '@/lib/types/ingredient'

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
        className="mt-14 mb-4 h-[calc(100vh-3.5rem-1rem)] border-none bg-transparent shadow-none md:mt-24 md:h-[calc(100vh-6rem-1rem)]"
      >
        <Card className="flex h-full flex-col gap-0">
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
          <ScrollArea className="flex-1 overflow-scroll">
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
          </ScrollArea>
          <SheetFooter className="pt-0">
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
