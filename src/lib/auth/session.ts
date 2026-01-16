import { sessionSchema } from '../schemas/auth'
import type z from 'zod'
import {
  createSession,
  getUserSessionById,
  updateSession,
} from '@/server/repositories/sessions.repo'
import { useAppSession } from '@/utils/session'

type UserSession = z.infer<typeof sessionSchema>
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7

export const createUserSession = async (
  sessionId: string,
  user: UserSession,
) => {
  const expires = Date.now() + SESSION_EXPIRATION_SECONDS * 1000
  await createSession(sessionId, expires, user.id)
}

export const getUserFromSession = async () => {
  const session = await useAppSession()
  const sessionId = session.id

  if (!sessionId) return null

  const rawUser = await getUserSessionById(sessionId)

  const { success, data: user } = await sessionSchema.safeParse({
    id: rawUser?.id,
  })

  return success ? user : null
}

export const updateUserSessionExpiration = async () => {
  const session = await useAppSession()
  const sessionId = session.id

  if (!sessionId) return null

  const user = await getUserSessionById(sessionId)
  if (!user) return null

  const expires = Date.now() + SESSION_EXPIRATION_SECONDS * 1000
  await updateSession(sessionId, new Date(expires))
  session.update({ ...session.data })
}

// export const removeUserFromSession = async () => {
//   const session = await useAppSession()
//   const sessionId = session.id
//   if (!sessionId) return null

//   await deleteSession(sessionId)
//   session.clear()
// }
