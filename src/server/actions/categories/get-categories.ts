import { createServerFn } from '@tanstack/react-start'
import { getCategories } from '@/server/repositories/categories.repo'

export const getCategoriesFn = createServerFn({ method: 'GET' }).handler(
  getCategories,
)
