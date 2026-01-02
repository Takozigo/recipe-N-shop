import { getRouteApi } from '@tanstack/react-router'
import { AnnoyedIcon, Link } from 'lucide-react'
import { Button } from './ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'

export function CategoriesMenu() {
  const categories = getRouteApi('/').useLoaderData({
    select: (data) => data.categories,
  })

  if (categories.length === 0)
    return (
      <Empty className="border rounded-sm p-2 space-y-0 md:p-2 w-40 h-40">
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

  return <p>{JSON.stringify(categories)}</p>
}
