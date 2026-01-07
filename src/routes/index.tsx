import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { CategoriesMenu } from '@/components/categorie-menu'
import { LastRecipes } from '@/components/last-recipes'
import { Text } from '@/components/text'
import { getLatestRecipes } from '@/server/actions/recipes/get-latest'
import { db } from '@/server/db'

const getCategories = createServerFn({ method: 'GET' }).handler(async () => {
  const res = await db.query.categories.findMany()
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
