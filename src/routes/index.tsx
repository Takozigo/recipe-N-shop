import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { desc } from 'drizzle-orm'
import { CategoriesMenu } from '@/components/categorie-menu'
import { LastRecipes } from '@/components/last-recipes'
import { db } from '@/db'
import { recipes } from '@/db/schema'
import { Text } from '@/components/text'

const getCategories = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await db.query.categories.findMany()
  return res
})

const getLatestRecipes = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await db.query.recipes.findMany({
    orderBy: desc(recipes.createdAt),
  })
  return res
})

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => ({
    categories: await getCategories(),
    recipes: await getLatestRecipes(),
  }),
})

function HomePage() {
  return (
    <div className="container space-y-2">
      <CategoriesMenu />
      <Text variant="large" className="mt-10">
        Lastest Recipes
      </Text>
      <LastRecipes />
    </div>
  )
}
