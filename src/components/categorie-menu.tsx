import { Link, getRouteApi } from '@tanstack/react-router'
import { AnnoyedIcon } from 'lucide-react'
import { Image } from '@unpic/react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'
import { Text } from './text'

export function CategoriesMenu() {
  const categories = getRouteApi('/').useLoaderData({
    select: (data) => data.categories,
  })

  if (categories.length === 0)
    return (
      <Empty className="corner-notch h-40 w-40 space-y-0 rounded-sm border p-2 md:p-2">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AnnoyedIcon />
          </EmptyMedia>
          <EmptyTitle>No Category yet</EmptyTitle>
          <EmptyDescription>
            No category seemed to have been found
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={'/categories/$slug'}
          params={{ slug: cat.slug }}
          className="hover:bg-accent corner-scoop hover:text-primary-foreground group flex h-32 w-32 flex-col justify-end rounded-2xl p-2 text-center"
        >
          <Image
            src={`/category/${cat.slug}.png`}
            className="m-auto"
            layout="constrained"
            width={75}
            height={75}
          />
          <Text
            variant="muted"
            className="group-hover:text-accent-foreground font-bold uppercase"
          >
            {cat.name}
          </Text>
        </Link>
      ))}
    </div>
  )
}
