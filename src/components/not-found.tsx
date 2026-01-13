import { Image } from '@unpic/react'
import { Text } from './text'

export function RecipeNotFound() {
  return (
    <Image
      src="/recipe-not-found.jpg"
      width={500}
      height={500}
      className="glass-card corner-squircle m-auto my-5 rounded-3xl"
    />
  )
}

export function NotFound() {
  return (
    <div>
      <Text variant="lead" className="mt-3 text-center">
        Oups ! Page not found !
      </Text>
      <Image
        src="/not-found.jpg"
        width={500}
        height={500}
        className="glass-card corner-squircle m-auto my-5 rounded-3xl"
      />
    </div>
  )
}
