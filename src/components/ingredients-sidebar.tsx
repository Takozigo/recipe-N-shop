import { useState } from 'react'
import { Text } from './text'
import { Button } from './ui/button'

import { ButtonGroup } from './ui/button-group'
import { Separator } from './ui/separator'
import { IngredientItem } from './ingredient-item'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from './ui/sidebar'

import type { IngredientBlock } from '@/lib/types/ingredient'

type IngredientsSidebarProps = {
  ingredients: Array<IngredientBlock>
  portion: number | null
}

function IngredientsSidebar({ ingredients, portion }: IngredientsSidebarProps) {
  const { setOpen } = useSidebar()

  const [serving, setServing] = useState(portion ?? 1)

  return (
    <Sidebar className="mb-4 pt-10 md:pt-20" variant="sidebar">
      <SidebarHeader>
        <Text variant="lead" className="text-center">
          Ingredients list
        </Text>
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
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export default IngredientsSidebar
