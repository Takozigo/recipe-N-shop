export type Step = {
  id: string
  title: string | null
  description: string
  position: number
  imageUrl: string | null
  sectionId: string | null
  recipeId: string
  section: {
    id: string
    title: string | null
    position: number
    recipeId: string
  } | null
}

export type StepItem = {
  id: string
  title: string | null
  description: string
  position: number
  imageUrl: string | null
}

export type StepBlock =
  | {
      type: 'section'
      id: string
      title: string | null
      steps: Array<StepItem>
    }
  | {
      type: 'steps'
      steps: Array<StepItem>
    }

export function formatSteps(steps: Array<Step>): Array<StepBlock> {
  const unsectioned: Array<StepItem> = []
  const sections = new Map<string, StepBlock & { type: 'section' }>()

  for (const step of steps) {
    const item: StepItem = {
      id: step.id,
      title: step.title,
      description: step.description,
      position: step.position,
      imageUrl: step.imageUrl,
    }

    if (!step.sectionId) {
      unsectioned.push(item)
      continue
    }

    if (!sections.has(step.sectionId)) {
      sections.set(step.sectionId, {
        type: 'section',
        id: step.sectionId,
        title: step.section?.title ?? null,
        steps: [],
      })
    }

    sections.get(step.sectionId)!.steps.push(item)
  }

  // Sort steps inside sections
  for (const section of sections.values()) {
    section.steps.sort((a, b) => a.position - b.position)
  }

  // Sort unsectioned steps
  unsectioned.sort((a, b) => a.position - b.position)

  return [
    ...(unsectioned.length
      ? [{ type: 'steps', steps: unsectioned } as const]
      : []),
    ...Array.from(sections.values()),
  ]
}
