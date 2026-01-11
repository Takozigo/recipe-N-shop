export type ingredient = {
  note: string | null
  recipeId: string
  section: string | null
  ingredientId: string
  unit: string | null
  amount: string
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
      title: string | null
      items: Array<ingredient>
    }

export function formatIngredientsBySection(
  ingredients: Array<ingredient>,
): Array<IngredientBlock> {
  const unsectioned: Array<ingredient> = []
  const sections = new Map<string, IngredientBlock & { type: 'section' }>()

  for (const ing of ingredients) {
    if (!ing.section || !ing.section) {
      unsectioned.push(ing)
      continue
    }

    if (!sections.has(ing.section)) {
      sections.set(ing.section, {
        type: 'section',
        title: ing.section,
        items: [],
      })
    }

    sections.get(ing.section)!.items.push(ing)
  }

  // Sort ingredients inside each section if needed
  for (const section of sections.values()) {
    section.items.sort((a, b) =>
      a.ingredient.value.localeCompare(b.ingredient.value),
    )
  }

  return [
    ...(unsectioned.length
      ? [{ type: 'ingredients', items: unsectioned } as const]
      : []),
    ...Array.from(sections.values()),
  ]
}
