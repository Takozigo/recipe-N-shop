import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { logoutFn } from '@/server/actions/users/create-user'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const logout = useServerFn(logoutFn)

  return (
    <div>
      Hello "/admin/"!
      <Button variant="destructive" onClick={() => logout()}>
        Log Out
      </Button>
    </div>
  )
}
