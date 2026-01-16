import { eq } from 'drizzle-orm'
import { db } from '../db'
import { session } from '../db/schema'

export const createSession = (
  sessionId: string,
  expires: number,
  userId: string,
) => {
  return db.insert(session).values({
    id: sessionId,
    expires: new Date(expires),
    userId: userId,
  })
}

export const getUserSessionById = (id: string) => {
  return db.query.session.findFirst({ where: eq(session.id, id) })
}

export const updateSession = (id: string, expires: Date) => {
  return db
    .update(session)
    .set({
      expires: expires,
    })
    .where(eq(session.id, id))
}

export const deleteSession = (id: string) => {
  return db.delete(session).where(eq(session.id, id))
}
