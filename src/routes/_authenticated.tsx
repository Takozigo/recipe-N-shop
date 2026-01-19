// routes/_authed.tsx - Layout route for protected pages
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/lib/auth/get-current-user'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser()

    const isAuthPage =
      location.href === '/admin/login' || location.href === '/admin/register'

    // Logged-in user should not see auth pages
    if (isAuthPage && user) {
      throw redirect({ to: '/admin' })
    }
    // Non-auth pages require login
    if (!isAuthPage && !user) {
      throw redirect({ to: '/' })
    }

    return { user }
  },
})
