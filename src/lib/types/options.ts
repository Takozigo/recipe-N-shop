import type { SQL } from 'drizzle-orm'

export type Options = {
  limit?: number
  orderBy?: 'desc' | 'asc'
  offset?: number
  where?: SQL | undefined
}
