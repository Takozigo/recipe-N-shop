import { getRouteApi } from '@tanstack/react-router'
import { AnnoyedIcon } from 'lucide-react'
import {
  Empty,
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
      <Empty className="h-40 w-40 space-y-0 rounded-sm border p-2 md:p-2">
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
