// utils/session.ts
import { useSession } from '@tanstack/react-start/server'

type SessionData = {
  userId?: string
  email?: string
}
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = 'cookie-session-key'

export function useAppSession() {
  return useSession<SessionData>({
    // Session configuration
    name: COOKIE_SESSION_KEY,
    password: process.env.SESSION_SECRET!, // At least 32 characters
    // Optional: customize cookie settings
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: SESSION_EXPIRATION_SECONDS,
    },
  })
}
