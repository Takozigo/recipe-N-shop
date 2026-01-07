import { relations } from 'drizzle-orm'
import {
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const recipes = pgTable('recipes', {
  id: uuid('id').defaultRandom().primaryKey(),

  title: text('title').notNull(),
  description: text('description'),

  servings: integer('servings'),
  prepTimeMinutes: integer('prep_time_minutes'),
  cookTimeMinutes: integer('cook_time_minutes'),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const recipeSections = pgTable(
  'recipe_sections',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),

    title: text('title'),
    position: integer('position').notNull(),
  },
  (table) => [index('recipe_sections_recipe_idx').on(table.recipeId)],
)

export const recipeSteps = pgTable(
  'recipe_steps',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),

    sectionId: uuid('section_id').references(() => recipeSections.id, {
      onDelete: 'set null',
    }),

    position: integer('position').notNull(),
    title: text('title'),
    description: text('description').notNull(),
    imageUrl: text('image_url'),
  },
  (table) => [
    index('recipe_steps_recipe_idx').on(table.recipeId),
    index('recipe_steps_section_idx').on(table.sectionId),
  ],
)

export const ingredients = pgTable(
  'ingredients',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    value: text('value').notNull(),
    lang: text('lang').notNull(),
  },
  (table) => [unique().on(table.value, table.lang)],
)

export const recipeIngredients = pgTable(
  'recipe_ingredients',
  {
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),

    ingredientId: uuid('ingredient_id')
      .notNull()
      .references(() => ingredients.id, { onDelete: 'restrict' }),

    sectionId: uuid('section_id').references(() => recipeSections.id, {
      onDelete: 'set null',
    }),

    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    unit: text('unit'),
    note: text('note'),
  },
  (table) => [
    primaryKey({ columns: [table.recipeId, table.ingredientId] }),
    index('recipe_ingredients_recipe_idx').on(table.recipeId),
  ],
)

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
})

export const recipeCategories = pgTable(
  'recipe_categories',
  {
    recipeId: uuid('recipe_id')
      .notNull()
      .references(() => recipes.id, { onDelete: 'cascade' }),

    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.categoryId] })],
)

// export const recipeStepPhotos = pgTable('recipe_step_photos', {
//   id: uuid('id').defaultRandom().primaryKey(),

//   stepId: uuid('step_id')
//     .notNull()
//     .references(() => recipeSteps.id, { onDelete: 'cascade' }),

//   imageUrl: text('image_url').notNull(),
//   position: integer('position').notNull(),
// })

export const recipesRelations = relations(recipes, ({ many }) => ({
  sections: many(recipeSections),
  ingredients: many(recipeIngredients),
  categories: many(recipeCategories),
}))

export const recipeSectionsRelations = relations(
  recipeSections,
  ({ many }) => ({
    steps: many(recipeSteps),
  }),
)
