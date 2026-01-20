import { createFileRoute } from '@tanstack/react-router'
import { getRecipesByCategory } from '@/server/repositories/recipes.repo'
import { RecipeCard } from '@/components/recipe-card'

export const Route = createFileRoute('/categories/$slug/')({
  component: RouteComponent,
  loader: async ({ params }) => await getRecipesByCategory(params.slug),
})

function RouteComponent() {
  const recipes = Route.useLoaderData()

  return (
    <div className="container">
      {recipes.map((recipe) => (
        <RecipeCard {...recipe} key={recipe.id} />
      ))}
    </div>
  )
}
