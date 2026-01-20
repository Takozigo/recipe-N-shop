import { drizzle } from 'drizzle-orm/node-postgres'
import { relations } from './relations'

export const db = drizzle(process.env.DATABASE_URL!, { relations })

export type DbClient = Omit<typeof db, '$client'>
