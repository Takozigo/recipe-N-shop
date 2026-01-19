import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { logoutFn } from '@/server/actions/users/create-user'
import { Text } from '@/components/text'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
  const logout = useServerFn(logoutFn)

  return (
    <div className="container space-y-4">
      <Text variant="h2">Hello "/admin/"!</Text>
      <Button asChild>
        <Link to={'/admin/recipes/new'}> Create new recipe</Link>
      </Button>
      <Separator />
      <Button variant="destructive" onClick={() => logout()}>
        Log Out
      </Button>
    </div>
  )
}
