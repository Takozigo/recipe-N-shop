import { recipeSteps } from '../db/schema'
import type { DbClient } from '../db'

export async function inserSteps(
  tx: DbClient,
  recipeId: string,
  steps: Array<{
    position: number
    description: string
    section?: string | undefined
    title?: string | undefined
    imageUrl?: string | undefined
  }>,
) {
  await tx.insert(recipeSteps).values(steps.map((e) => ({ ...e, recipeId })))
}
