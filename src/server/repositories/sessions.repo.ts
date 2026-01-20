import { eq } from 'drizzle-orm'
import { db } from '../db'
import { sessions } from '../db/schema'

export const createSession = (
  sessionId: string,
  expires: number,
  userId: string,
) => {
  return db.insert(sessions).values({
    id: sessionId,
    expires: new Date(expires),
    userId: userId,
  })
}

export const getUserSessionById = (id: string) => {
  return db.query.sessions.findFirst({ where: { id } })
}

export const updateSession = (id: string, expires: Date) => {
  return db
    .update(sessions)
    .set({
      expires: expires,
    })
    .where(eq(sessions.id, id))
}

export const deleteSession = (id: string) => {
  db.delete(sessions).where(eq(sessions.id, id))
}
