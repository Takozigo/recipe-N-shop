import {
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import type { JSONContent } from '@tiptap/react'

export const categories = pgTable(
  'categories',
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    slug: text().notNull(),
  },
  (table) => [
    unique('categories_name_unique').on(table.name),
    unique('categories_slug_unique').on(table.slug),
  ],
)

export const ingredients = pgTable(
  'ingredients',
  {
    id: uuid().defaultRandom().primaryKey(),
    value: text().notNull(),
    lang: text().notNull(),
  },
  (table) => [
    unique('ingredients_value_lang_unique').on(table.value, table.lang),
  ],
)

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
  (table) => [
    primaryKey({
      columns: [table.recipeId, table.categoryId],
      name: 'recipe_categories_recipe_id_category_id_pk',
    }),
  ],
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
    section: text().default('main').notNull(),
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    unit: text().notNull(),
    note: text(),
  },
  (table) => [
    primaryKey({
      columns: [table.recipeId, table.ingredientId, table.section],
      name: 'recipe_ingredients_recipe_id_ingredient_id_section_pk',
    }),
    index('recipe_ingredients_recipe_idx').using(
      'btree',
      table.recipeId.asc().nullsLast(),
    ),
  ],
)

export const recipes = pgTable('recipes', {
  id: uuid().defaultRandom().primaryKey(),
  title: text().notNull(),
  description: text(),
  servings: integer(),
  prepTimeMinutes: integer('prep_time_minutes'),
  cookTimeMinutes: integer('cook_time_minutes'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  shortDescription: text('short_description'),
  slug: text().notNull(),
  content: jsonb('content').$type<JSONContent>().notNull(),
})

export const sessions = pgTable('sessions', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid('user_id'),
  expires: timestamp('created_at', { withTimezone: true }),
})

export const users = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  username: text().notNull(),
  password: text().notNull(),
  salt: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .default(sql`now()`)
    .notNull(),
  email: text().notNull(),
})
