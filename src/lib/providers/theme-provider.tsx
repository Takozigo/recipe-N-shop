import { useRouter } from '@tanstack/react-router'
import { createContext, use, useEffect } from 'react'
import type { PropsWithChildren } from 'react'
import type { T as Theme } from '@/lib/theme'
import { setThemeServerFn } from '@/lib/theme'

type ThemeContextVal = {
  theme: Theme | undefined
  setTheme: (val: Theme) => void
}
type Props = PropsWithChildren<{ theme: Theme | undefined }>

const ThemeContext = createContext<ThemeContextVal | null>(null)

export function ThemeProvider({ children, theme }: Props) {
  const router = useRouter()

  function setTheme(val: Theme) {
    setThemeServerFn({ data: val }).then(() => router.invalidate())
  }

  useEffect(() => {
    if (!theme) {
      const initialDarkMode =
        !!document.querySelector('meta[name="color-scheme"][content="dark"]') ||
        (typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      setTheme(initialDarkMode ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => setTheme(mediaQuery.matches ? 'dark' : 'light')
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

export function useTheme() {
  const val = use(ThemeContext)
  if (!val) throw new Error('useTheme called outside of ThemeProvider!')
  return val
}
