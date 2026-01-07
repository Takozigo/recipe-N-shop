import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { db } from '@/server/db'
import { recipes } from '@/server/db/schema'

export const getLatestRecipes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const res = await db.query.recipes.findMany({
      orderBy: desc(recipes.createdAt),
    })
    return res
  },
)
