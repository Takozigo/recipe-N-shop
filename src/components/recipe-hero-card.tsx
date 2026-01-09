import { Image } from '@unpic/react'
import { ChartColumn, Clock10, ClockFadingIcon } from 'lucide-react'
import { GlassCard } from './glass-card'
import { Text } from '@/components/text'

export function RecipeHeroCard({
  title,
  prepTimeMinutes,
  cookTimeMinutes,
  shortDescription,
}: {
  title: string
  prepTimeMinutes: number | null
  cookTimeMinutes: number | null
  shortDescription: string | null
}) {
  return (
    <section className="corner-squircle relative overflow-hidden rounded-2xl">
      <div className="relative aspect-video">
        <Image
          src="https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/healthy-eating-ingredients-1296x728-header.jpg?w=1155&h=1528"
          alt="Recipe image"
          layout="fullWidth"
          priority
          className="h-full w-full object-cover"
        />

        <div className="glass-card absolute bottom-6 left-6 max-w-md wrap-break-word">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm opacity-80">{shortDescription}</p>
        </div>

        <div className="absolute right-6 bottom-6 flex items-center gap-3">
          <GlassCard>
            <div className="flex flex-col items-center justify-center">
              <ChartColumn />
              <Text className="mt-0!">Level (todo)</Text>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex gap-2">
              <div className="flex flex-col items-center justify-center">
                <ClockFadingIcon />
                <Text className="mt-0!">{prepTimeMinutes ?? 'N/A'} Min</Text>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Clock10 />
                <Text className="mt-0!">{cookTimeMinutes ?? 'N/A'} Min</Text>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
