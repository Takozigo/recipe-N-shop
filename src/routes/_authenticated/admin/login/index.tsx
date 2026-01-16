import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/components/login-form'

export const Route = createFileRoute('/_authenticated/admin/login/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container">
      <LoginForm />
    </div>
  )
}
