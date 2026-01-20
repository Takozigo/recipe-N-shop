import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (r) => ({
  categories: {
    recipes: r.many.recipes({
      from: r.categories.id.through(r.recipeCategories.categoryId),
      to: r.recipes.id.through(r.recipeCategories.recipeId),
    }),
  },
  recipes: {
    categories: r.many.categories(),
    recipeIngredients: r.many.recipeIngredients(),
    recipeSteps: r.many.recipeSteps(),
  },

  recipeIngredients: {
    recipe: r.one.recipes({
      from: r.recipeIngredients.recipeId,
      to: r.recipes.id,
    }),
    ingredient: r.one.ingredients({
      from: r.recipeIngredients.ingredientId,
      to: r.ingredients.id,
    }),
  },
  ingredients: {
    recipeIngredients: r.many.recipeIngredients(),
  },
  recipeSteps: {
    recipe: r.one.recipes({
      from: r.recipeSteps.recipeId,
      to: r.recipes.id,
    }),
  },
}))
