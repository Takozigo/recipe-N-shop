import { getRouteApi } from '@tanstack/react-router'
import { AnnoyedIcon } from 'lucide-react'

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'
import { RecipeCard } from './recipe-card'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

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
      </Empty>
    )

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselPrevious
        className="top-0 right-15 left-auto translate-x-full -translate-y-10"
        variant="ghost"
      />
      <CarouselNext
        className="top-0 right-6 translate-x-full -translate-y-10"
        variant="ghost"
      />
      <CarouselContent>
        {recipes.map((r, index) => (
          <CarouselItem
            key={index}
            className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
          >
            <RecipeCard title={r.title} key={r.id} slug={r.slug} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
