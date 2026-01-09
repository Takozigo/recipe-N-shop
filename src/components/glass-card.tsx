import type { PropsWithChildren } from 'react'

export function GlassCard({ children }: PropsWithChildren) {
  return (
    <div className="glass-card px-4 py-2 text-sm font-medium">{children}</div>
  )
}
