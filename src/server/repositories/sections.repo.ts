import { recipeSections } from '../db/schema'
import type { DbClient } from '../db'

export async function inserSection(
  tx: DbClient,
  recipeId: string,
  sectionTitles: Array<string>,
) {
  const sections = sectionTitles.map((sTitle, index) => ({
    recipeId: recipeId,
    title: sTitle,
    position: index,
  }))
  if (sectionTitles.length > 0) {
    await tx.insert(recipeSections).values(sections)
  }
}
