import { cache } from 'react'
import { createServerFn } from '@tanstack/react-start'
import { getUserFromSession } from './session'
import { getUserFromDbById } from '@/server/repositories/users.repo'

export type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDbById>>,
  undefined | null
>

export type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>

export const _getCurrentUser = createServerFn({ method: 'GET' })
  .inputValidator((data?: { withFullUser?: boolean }) => data)
  .handler(async ({ data }) => {
    const { withFullUser = false } = data ?? {}
    const user = await getUserFromSession()

    if (!user) return null

    if (!withFullUser) return user

    const fullUser = await getUserFromDbById(user.id)

    if (!fullUser) {
      // removeUserFromSession()
      throw new Error('User not found in database')
    }
    return fullUser
  })

export const getCurrentUser = cache(_getCurrentUser)
