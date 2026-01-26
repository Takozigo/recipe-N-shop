import React, { useEffect, useRef, useState } from 'react'
import { Text } from './text'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Props = {
  content: string | null
  openByDefault?: boolean
}

const SeeMore = ({ content, openByDefault = true }: Props) => {
  const [isOpen, setIsOpen] = useState(openByDefault)
  const [showMoreButton, setShowMoreButton] = useState(true)

  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const checkClamping = () => {
      const element = ref.current

      if (element) {
        const currentStyle = window.getComputedStyle(element)

        const lineClamp = parseInt(
          currentStyle.getPropertyValue('-webkit-line-clamp'),
          10,
        )

        if (
          lineClamp > 0 &&
          currentStyle.getPropertyValue('overflow') === 'hidden'
        ) {
          setShowMoreButton(element.scrollHeight > element.clientHeight)
        } else {
          setShowMoreButton(false)
        }
      }
    }

    checkClamping()
  }, [isOpen])

  if (!content) return null

  return (
    <div className="relative mb-2">
      {!isOpen && showMoreButton && (
        <div className="from-background pointer-events-none absolute bottom-0 mb-8 h-12 w-full bg-linear-to-t to-transparent" />
      )}
      <Text
        variant="muted"
        className={cn(
          'whitespace-pre-wrap italic',
          !isOpen && 'line-clamp-3 overflow-hidden text-ellipsis',
        )}
        ref={ref}
      >
        {content}
      </Text>
      {(showMoreButton || isOpen) && (
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="link"
          className="hover:no-underline"
          size="sm"
        >
          {isOpen ? 'See less' : 'See more'}
        </Button>
      )}
    </div>
  )
}

export default SeeMore
