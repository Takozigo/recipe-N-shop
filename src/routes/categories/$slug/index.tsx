import { createFileRoute } from '@tanstack/react-router'
import { RecipeCard } from '@/components/recipe-card'
import { getRecipeByCategoryFn } from '@/server/actions/recipes/get-recipes'

export const Route = createFileRoute('/categories/$slug/')({
  component: RouteComponent,
  loader: async ({ params }) =>
    await getRecipeByCategoryFn({
      data: { category: params.slug, options: undefined },
    }),
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
