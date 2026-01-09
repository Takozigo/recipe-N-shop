export type ingredient = {
  note: string | null
  recipeId: string
  sectionId: string | null
  ingredientId: string
  unit: string | null
  amount: string
  section: {
    title: string | null
    id: string
    recipeId: string
    position: number
  } | null
  ingredient: {
    value: string
    id: string
    lang: string
  }
}

export type IngredientBlock =
  | {
      type: 'ingredients'
      items: Array<ingredient>
    }
  | {
      type: 'section'
      id: string
      title: string | null
      position: number
      items: Array<ingredient>
    }

export function formatIngredientsBySection(
  ingredients: Array<ingredient>,
): Array<IngredientBlock> {
  const unsectioned: Array<ingredient> = []
  const sections = new Map<string, IngredientBlock & { type: 'section' }>()

  for (const ing of ingredients) {
    if (!ing.sectionId || !ing.section) {
      unsectioned.push(ing)
      continue
    }

    if (!sections.has(ing.sectionId)) {
      sections.set(ing.sectionId, {
        type: 'section',
        id: ing.sectionId,
        title: ing.section.title,
        position: ing.section.position,
        items: [],
      })
    }

    sections.get(ing.sectionId)!.items.push(ing)
  }

  // Sort ingredients inside each section if needed
  for (const section of sections.values()) {
    section.items.sort((a, b) =>
      a.ingredient.value.localeCompare(b.ingredient.value),
    )
  }

  // Sort sections by position
  const orderedSections = Array.from(sections.values()).sort(
    (a, b) => a.position - b.position,
  )

  return [
    ...(unsectioned.length
      ? [{ type: 'ingredients', items: unsectioned } as const]
      : []),
    ...orderedSections,
  ]
}
