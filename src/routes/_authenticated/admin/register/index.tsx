import { createFileRoute } from '@tanstack/react-router'
import { RegisterForm } from '@/components/register-form'

export const Route = createFileRoute('/_authenticated/admin/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container">
      <RegisterForm />
    </div>
  )
}
