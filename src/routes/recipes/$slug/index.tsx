import { createFileRoute } from '@tanstack/react-router'
import type { StepItem } from '@/lib/types/step'
import { getFullRecipesBySlugFn } from '@/server/actions/recipes/get-full-recipe'
import { Text } from '@/components/text'
import { RecipeHeroCard } from '@/components/recipe-hero-card'
import { RecipeNotFound } from '@/components/not-found'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import IngredientsSidebar from '@/components/ingredients-sidebar'

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
          <Text variant="p" className="mb-4 whitespace-pre-wrap italic">
            {recipe.description}
          </Text>
          {recipe.steps.map((block) => {
            if (block.type === 'steps') {
              return (
                <Text
                  variant="list"
                  key="unsectioned"
                  className="whitespace-pre-wrap"
                >
                  {block.steps.map(renderStep)}
                </Text>
              )
            }

            return (
              <section key={block.title}>
                {block.title && <Text variant="h3">{block.title}</Text>}
                <Text variant="list" className="whitespace-pre-wrap">
                  {block.steps.map(renderStep)}
                </Text>
              </section>
            )
          })}
        </div>
      </div>
    </SidebarProvider>
  )
}

function renderStep(step: StepItem) {
  return (
    <div key={step.id}>
      {step.title && <Text variant="h4">{step.title}</Text>}
      <Text variant="p" className="whitespace-pre-wrap">
        {step.description}
      </Text>
      {step.imageUrl && <img src={step.imageUrl} />}
    </div>
  )
}
