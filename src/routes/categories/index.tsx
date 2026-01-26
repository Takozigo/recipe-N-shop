import { Link, createFileRoute } from '@tanstack/react-router'
import { BookIcon } from 'lucide-react'
import { Image } from '@unpic/react'
import { getCategoriesFn } from '@/server/actions/categories/get-categories'
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AVAILABLE_CATEGORIES } from '@/components/categorie-menu'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export const Route = createFileRoute('/categories/')({
  component: RouteComponent,
  loader: async () => await getCategoriesFn(),
})
export const title = 'Image Card'

function RouteComponent() {
  const categories = Route.useLoaderData()
  return (
    <div className="container grid grid-cols-4 gap-3">
      {categories.map((cat) => (
        <Card className="w-64 overflow-hidden">
          <CardHeader>
            <CardTitle>{cat.name}</CardTitle>
          </CardHeader>
          <CardContent className="m-auto p-0">
            <Image
              src={
                AVAILABLE_CATEGORIES.has(cat.slug)
                  ? `/category/${cat.slug}.png`
                  : '/category/placeholder.png'
              }
              layout="fixed"
              width={100}
              height={100}
            />
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border px-4 py-2">
                <BookIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{cat.recipeCount}</span>
              </div>
            </div>
            <CardAction>
              <Link
                to={'/categories/$slug'}
                params={{ slug: cat.slug }}
                className={cn(buttonVariants({ variant: 'secondary' }))}
              >
                See more !
              </Link>
            </CardAction>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
