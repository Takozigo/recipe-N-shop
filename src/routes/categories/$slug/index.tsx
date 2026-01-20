import { createFileRoute } from '@tanstack/react-router'
import { getCategoriesFn } from '@/server/actions/categories/get-categories'

export const Route = createFileRoute('/categories/$slug/')({
  component: RouteComponent,
  loader: async () => await getCategoriesFn(),
})

function RouteComponent() {
  return <div>Hello "/categories/$slug/"!</div>
}
