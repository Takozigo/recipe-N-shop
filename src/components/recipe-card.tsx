import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'

type RecipeCardProps = {
  title: string
  imageUrl?: string | null
  id: string
}

export function RecipeCard({ title, imageUrl, id }: RecipeCardProps) {
  return (
    <Link to={'/recipes/$id'} params={{ id }} className="h-64 w-64">
      <div className="group relative overflow-hidden shadow-sm">
        {/* Image */}
        <Image
          src={
            imageUrl ??
            'https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?w=1155&h=1528'
          }
          alt={title}
          layout="fullWidth"
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay */}
        <div className="glass-card pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="overlay-card">
            <h3 className="text-center text-lg font-semibold">{title}</h3>
          </div>
        </div>
      </div>
    </Link>
  )
}
