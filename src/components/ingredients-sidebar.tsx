import { useState } from 'react'
import { Text } from './text'
import { Button } from './ui/button'

import { ButtonGroup } from './ui/button-group'
import { Separator } from './ui/separator'
import { ScrollArea } from './ui/scroll-area'
import { IngredientItem } from './ingredient-item'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from './ui/sidebar'
import type { IngredientBlock } from '@/lib/types/ingredient'

type IngredientsSidebarProps = {
  ingredients: Array<IngredientBlock>
  portion: number | null
}

function IngredientsSidebar({ ingredients, portion }: IngredientsSidebarProps) {
  const [serving, setServing] = useState(portion ?? 1)

  return (
    <Sidebar className="mb-4 pt-10 md:pt-20" variant="sidebar">
      <SidebarHeader>
        <Text variant="lead">Ingredients list</Text>
      </SidebarHeader>
      <SidebarContent>
        <Separator />
        <SidebarGroup className="flex-row items-center justify-between">
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
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <ScrollArea className="flex-1 overflow-scroll">
            <div>
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
                  <div key={block.title}>
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
            </div>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default IngredientsSidebar
