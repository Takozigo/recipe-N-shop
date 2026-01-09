import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import type { StepItem } from '@/lib/types/step'
import { db } from '@/server/db'
import { recipes } from '@/server/db/schema'
import { Text } from '@/components/text'
import { RecipeHeroCard } from '@/components/recipe-hero-card'
import IngredientsSidebar from '@/components/ingredients-sidebar'
import { formatSteps } from '@/lib/types/step'
import { formatIngredientsBySection } from '@/lib/types/ingredient'

const getFullRecipes = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, data.id),
      with: {
        steps: {
          orderBy: (steps, { asc }) => [asc(steps.position)],
          with: {
            section: true,
          },
        },
        ingredients: {
          with: {
            ingredient: true,
            section: true,
          },
        },
      },
    })
    if (recipe == null) throw notFound()

    return {
      ...recipe,
      steps: formatSteps(recipe.steps),
      ingredients: formatIngredientsBySection(recipe.ingredients),
    }
  })

export const Route = createFileRoute('/recipes/$id/')({
  component: RouteComponent,
  loader: async ({ params }) => getFullRecipes({ data: params }),
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
          <section key={block.id}>
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
