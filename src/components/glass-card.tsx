import type { PropsWithChildren } from 'react'

export function GlassCard({ children }: PropsWithChildren) {
  return (
    <div className="glass-card rounded-xl px-4 py-2 text-sm font-medium">
      {children}
    </div>
  )
}
