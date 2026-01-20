import { AnnoyedIcon } from 'lucide-react'
import { Link, getRouteApi } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'
import { Text } from './text'

const AVAILABLE_CATEGORIES = new Set([
  'apero',
  'chicago',
  'coreen',
  'philippine',
  'pizza',
])

export function CategoriesMenu() {
  const categories = getRouteApi('/').useLoaderData({
    select: (data) => data.categories,
  })

  if (categories.length === 0)
    return (
      <Empty className="corner-notch h-22 w-22 space-y-0 rounded-sm border p-2 md:h-32 md:w-32 md:p-2">
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
    <div className="flex w-full justify-evenly gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          to={'/categories/$slug'}
          params={{ slug: cat.slug }}
          className="hover:bg-accent corner-scoop hover:text-primary-foreground group flex h-22 w-22 flex-col justify-end rounded-2xl text-center md:h-32 md:w-32"
        >
          <Image
            src={
              AVAILABLE_CATEGORIES.has(cat.slug)
                ? `/category/${cat.slug}.png`
                : '/category/placeholder.png'
            }
            className="m-auto p-4"
            layout="fullWidth"
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
