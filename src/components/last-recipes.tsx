import { Link, getRouteApi } from '@tanstack/react-router'
import { AnnoyedIcon } from 'lucide-react'
import { Button } from './ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'

export function LastRecipes() {
  const recipes = getRouteApi('/').useLoaderData({
    select: (data) => data.recipes,
  })

  if (recipes.length === 0)
    return (
      <Empty className="border rounded-sm p-2 space-y-0 md:p-2 w-fit">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AnnoyedIcon />
          </EmptyMedia>
          <EmptyTitle>No Recipe yet</EmptyTitle>
          <EmptyDescription>
            No recipes seemed to have been found
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link to="/">Create new recipe</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )

  return <p>{JSON.stringify(recipes)}</p>
}
