import { createFileRoute } from '@tanstack/react-router'
import type { StepItem } from '@/lib/types/step'
import { Text } from '@/components/text'
import { RecipeHeroCard } from '@/components/recipe-hero-card'
import IngredientsSidebar from '@/components/ingredients-sidebar'
import { getFullRecipesFn } from '@/server/actions/recipes/get-full-recipe'

export const Route = createFileRoute('/recipes/$id/')({
  component: RouteComponent,
  loader: async ({ params }) => getFullRecipesFn({ data: params }),
})

function RouteComponent() {
  const recipe = Route.useLoaderData()

  return (
    <div className="container space-y-2">
      <RecipeHeroCard
        title={recipe.title}
        shortDescription={recipe.shortDescription}
        prepTimeMinutes={recipe.prepTimeMinutes}
        cookTimeMinutes={recipe.cookTimeMinutes}
      />
      <IngredientsSidebar
        ingredients={recipe.ingredients}
        portion={recipe.servings}
      />
      <Text>{recipe.description}</Text>
      {recipe.steps.map((block) => {
        if (block.type === 'steps') {
          return (
            <Text variant="list" key="unsectioned">
              {block.steps.map(renderStep)}
            </Text>
          )
        }

        return (
          <section key={block.title}>
            {block.title && <h3>{block.title}</h3>}
            <Text variant="list">{block.steps.map(renderStep)}</Text>
          </section>
        )
      })}
    </div>
  )
}

function renderStep(step: StepItem) {
  return (
    <li key={step.id}>
      {step.title && <h4>{step.title}</h4>}
      <p>{step.description}</p>
      {step.imageUrl && <img src={step.imageUrl} />}
    </li>
  )
}
