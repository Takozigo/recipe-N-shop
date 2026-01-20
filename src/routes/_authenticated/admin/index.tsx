import { Link, createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Button } from '@/components/ui/button'
import { logoutFn } from '@/server/actions/users/create-user'
import { Text } from '@/components/text'
import { Separator } from '@/components/ui/separator'
import { Item, ItemActions, ItemContent } from '@/components/ui/item'
import { getRecipesFn } from '@/server/actions/recipes/get-recipes'

export const Route = createFileRoute('/_authenticated/admin/')({
  component: RouteComponent,
  loader: async () => await getRecipesFn(),
})

function RouteComponent() {
  const logout = useServerFn(logoutFn)
  const recipes = Route.useLoaderData()

  return (
    <div className="container space-y-4">
      <Text variant="h2">Hello "/admin/"!</Text>
      {recipes.map((e) => (
        <Item key={e.id} variant="muted">
          <ItemContent>{e.title}</ItemContent>
          <ItemActions>
            <Link to={`/admin/recipes/$id/edit`} params={{ id: e.id }}>
              Edit
            </Link>
          </ItemActions>
        </Item>
      ))}
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
