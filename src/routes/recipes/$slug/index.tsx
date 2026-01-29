import { createFileRoute } from '@tanstack/react-router'
import { getFullRecipesBySlugFn } from '@/server/actions/recipes/get-full-recipe'
import { RecipeHeroCard } from '@/components/recipe-hero-card'
import { RecipeNotFound } from '@/components/not-found'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import IngredientsSidebar from '@/components/ingredients-sidebar'

import SeeMore from '@/components/see-more'

export const Route = createFileRoute('/recipes/$slug/')({
  component: RouteComponent,
  loader: async ({ params }) => await getFullRecipesBySlugFn({ data: params }),
  notFoundComponent: () => <RecipeNotFound />,
})

function RouteComponent() {
  const recipe = Route.useLoaderData()

  return (
    <SidebarProvider>
      <IngredientsSidebar
        ingredients={recipe.ingredients}
        portion={recipe.servings}
      />
      <div className="container space-y-2">
        <RecipeHeroCard
          title={recipe.title}
          shortDescription={recipe.shortDescription}
          prepTimeMinutes={recipe.prepTimeMinutes}
          cookTimeMinutes={recipe.cookTimeMinutes}
        />

        <SidebarTrigger />

        <div className="p-4">
          <SeeMore content={recipe.description} />

          <div className="whitespace-pre-wrap">{recipe.steps}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
