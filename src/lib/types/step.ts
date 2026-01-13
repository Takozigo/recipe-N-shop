export type Step = {
  id: string
  title: string | null
  description: string
  recipeId: string
  section: string | null
  position: number
  imageUrl: string | null
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

    if (!step.section) {
      unsectioned.push(item)
      continue
    }

    if (!sections.has(step.section)) {
      sections.set(step.section, {
        type: 'section',
        title: step.section,
        steps: [],
      })
    }

    sections.get(step.section)!.steps.push(item)
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
