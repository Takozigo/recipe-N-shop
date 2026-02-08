import { createFileRoute } from '@tanstack/react-router'

import { generateHTML } from '@tiptap/react'
import { useMemo } from 'react'
import { getFullRecipesBySlugFn } from '@/server/actions/recipes/get-full-recipe'
import { RecipeHeroCard } from '@/components/recipe-hero-card'
import { RecipeNotFound } from '@/components/not-found'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import IngredientsSidebar from '@/components/ingredients-sidebar'
import SeeMore from '@/components/see-more'
import { EDITOR_OPTIONS } from '@/components/tiptap/tiptap-editor/editor'

export const Route = createFileRoute('/recipes/$slug/')({
  component: RouteComponent,
  loader: async ({ params }) => await getFullRecipesBySlugFn({ data: params }),
  notFoundComponent: () => <RecipeNotFound />,
})

function RouteComponent() {
  const recipe = Route.useLoaderData()

  // ! TODO TO SANITIZE
  // ! import DOMPurify from 'dompurify'
  // ! const safeHTML = DOMPurify.sanitize(html)

  const html = useMemo(
    () => generateHTML(recipe.content, EDITOR_OPTIONS),
    [recipe.content],
  )

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

          <div
            className="prose prose-neutral dark:prose-invert max-w-non whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </SidebarProvider>
  )
}
