import { createFileRoute } from '@tanstack/react-router'
import { getFullRecipesByIdFn } from '@/server/actions/recipes/get-full-recipe'
import { getCategoriesFn } from '@/server/actions/categories/get-categories'
import { getAllIngredientsFn } from '@/server/actions/ingredients/get-all-ingredients'
import { useRecipeForm } from '@/hooks/use-recipe-form'
import RecipeInfoStep from '@/components/recipe-info-step'
import RecipeIngredientsStep from '@/components/recipe-ingredients-step'
import RecipeStepsStep from '@/components/recipe-steps-step'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/admin/recipes/$id/edit/')(
  {
    component: RouteComponent,
    loader: async ({ params }) => ({
      recipe: await getFullRecipesByIdFn({ data: params }),
      categories: await getCategoriesFn(),
      ingredients: await getAllIngredientsFn(),
    }),
  },
)

function RouteComponent() {
  const { recipe, categories, ingredients } = Route.useLoaderData()
  const form = useRecipeForm(recipe)

  return (
    <div className="container">
      <form
        id="recipe-creation-form"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-2 pb-20"
      >
        <RecipeInfoStep form={form} categories={categories} />
        <RecipeIngredientsStep form={form} ingredients={ingredients} />
        <RecipeStepsStep form={form} />
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}
