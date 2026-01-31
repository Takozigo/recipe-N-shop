// import { eq } from 'drizzle-orm'

// import type { DbClient } from '../db'

// export async function inserSteps(
//   tx: DbClient,
//   recipeId: string,
//   steps: Array<{
//     position: number
//     description: string
//     section?: string | undefined
//     title?: string | undefined
//     imageUrl?: string | undefined
//   }>,
// ) {
//   await tx.insert(recipeSteps).values(steps.map((e) => ({ ...e, recipeId })))
// }

// export async function updateRecipeSteps(
//   tx: DbClient,
//   recipeId: string,
//   steps: Array<{
//     position: number
//     description: string
//     section?: string | undefined
//     title?: string | undefined
//     imageUrl?: string | undefined
//   }>,
// ) {
//   await tx.delete(recipeSteps).where(eq(recipeSteps.recipeId, recipeId))
//   await tx.insert(recipeSteps).values(steps.map((e) => ({ ...e, recipeId })))
// }
