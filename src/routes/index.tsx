import { createFileRoute } from '@tanstack/react-router'
import { CategoriesMenu } from '@/components/categorie-menu'
import { LastRecipes } from '@/components/last-recipes'
import { Text } from '@/components/text'
import { getLatestRecipesFn } from '@/server/actions/recipes/get-latest'
import { getCategoriesFn } from '@/server/actions/categories/get-categories'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => ({
    categories: await getCategoriesFn(),
    recipes: await getLatestRecipesFn(),
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
