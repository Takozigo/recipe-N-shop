import { MoonStarIcon, SunIcon } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from '@/lib/providers/theme-provider'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      data-style="ghost"
    >
      {theme === 'dark' ? (
        <MoonStarIcon className="tiptap-button-icon" />
      ) : (
        <SunIcon className="tiptap-button-icon" />
      )}
    </Button>
  )
}
