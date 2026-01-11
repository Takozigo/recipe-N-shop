import { categories, recipeCategories } from '../db/schema'
import { db } from '../db'
import type { DbClient } from '../db'
import { slugify } from '@/lib/utils'

export async function getCategories() {
  return await db.query.categories.findMany()
}

export async function insertCategories(
  tx: DbClient,
  recipeId: string,
  categoriesList: Array<{
    name: string
    id?: string | undefined
    slug?: string | undefined
  }>,
) {
  const missing = categoriesList.filter((c) => !c.id)

  await Promise.all(
    missing.map(async (cat) => {
      const [row] = await tx
        .insert(categories)
        .values({
          name: cat.name,
          slug: slugify(cat.name),
        })
        .returning({ id: categories.id })

      cat.id = row.id
    }),
  )

  await tx
    .insert(recipeCategories)
    .values(categoriesList.map((e) => ({ recipeId, categoryId: e.id! })))
}
