import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import {
  createUser,
  getUserFromDbByEmail,
} from '@/server/repositories/users.repo'
import {
  comparePasswords,
  generatedSalt,
  hashPassword,
} from '@/lib/auth/password-hasher'
import { useAppSession } from '@/utils/session'
import { createUserSession } from '@/lib/auth/session'
import { loginSchema, registerSchema } from '@/lib/schemas/auth'
import { deleteSession } from '@/server/repositories/sessions.repo'

// User registration
export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(registerSchema)
  .handler(async ({ data }) => {
    // Check if user exists
    const existingUser = await getUserFromDbByEmail(data.email)
    if (existingUser) {
      return { error: 'User already exists' }
    }

    // Hash password
    const salt = generatedSalt()
    const hashedPassword = await hashPassword(data.password, salt)

    // Create user
    const [user] = await createUser({
      email: data.email,
      password: hashedPassword,
      username: data.username,
      salt,
    })

    // Create session
    const session = await useAppSession()
    await session.update({ userId: user.id, email: user.email })
    if (session.id) {
      await createUserSession(session.id, user)
    }
    return { success: true, user: { id: user.id, email: user.email } }
  })

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(loginSchema)
  .handler(async ({ data }) => {
    // Check if user exists
    const existingUser = await getUserFromDbByEmail(data.email)
    if (!existingUser) return { error: 'Something went wrong' }

    const isSamePassword = await comparePasswords({
      hashedPassword: existingUser.password,
      password: data.password,
      salt: existingUser.salt,
    })

    if (!isSamePassword) return { error: 'Something went wrong' }

    // Create session
    const session = await useAppSession()
    await session.update({ userId: existingUser.id, email: existingUser.email })
    if (session.id) {
      await createUserSession(session.id, existingUser)
    }
    return {
      success: true,
      user: { id: existingUser.id, email: existingUser.email },
    }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await useAppSession()
  const sessionId = session.id
  if (!sessionId) return null
  await deleteSession(sessionId)
  await session.clear()
  throw redirect({ to: '/' })
})
