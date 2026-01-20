import { createServerFn } from '@tanstack/react-start'
import type { Options } from '@/lib/types/options'
import { getCategories } from '@/server/repositories/categories.repo'

export const getCategoriesFn = createServerFn({ method: 'GET' })
  .inputValidator((data: Options | undefined) => data)
  .handler(({ data }) => getCategories(data))
