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
import { RecipeCard } from './recipe-card'

export function LastRecipes() {
  const recipes = getRouteApi('/').useLoaderData({
    select: (data) => data.recipes,
  })

  if (recipes.length === 0)
    return (
      <Empty className="corner-squircle w-fit space-y-0 rounded-xl border p-2 md:p-2">
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
            <Link to="/recipes/new">Create new recipe</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )

  return (
    <div className="flex gap-2">
      {recipes.map((r) => (
        <RecipeCard title={r.title} key={r.id} slug={r.slug} />
      ))}
    </div>
  )
}
