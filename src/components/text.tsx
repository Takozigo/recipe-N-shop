import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'blockquote'
  | 'list'
  | 'inlineCode'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted'

export type TextProps = PropsWithChildren<
  {
    variant?: TextVariant
    className?: string
  } & React.HTMLAttributes<HTMLElement>
>

export const Text: React.FC<TextProps> = ({
  variant = 'p',
  className,
  children,
  ...props
}) => {
  switch (variant) {
    case 'h1':
      return (
        <h1
          className={cn(
            'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
            className,
          )}
          {...props}
        >
          {children}
        </h1>
      )

    case 'h2':
      return (
        <h2
          className={cn(
            'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
            className,
          )}
          {...props}
        >
          {children}
        </h2>
      )
    case 'h3':
      return (
        <h3
          className={cn(
            'scroll-m-20 text-2xl font-semibold tracking-tight',
            className,
          )}
          {...props}
        >
          {children}
        </h3>
      )

    case 'h4':
      return (
        <h4
          className={cn(
            'scroll-m-20 text-xl font-semibold tracking-tight',
            className,
          )}
          {...props}
        >
          {children}
        </h4>
      )
    case 'small':
      return (
        <small
          className={cn('text-sm leading-none font-medium', className)}
          {...props}
        >
          {children}
        </small>
      )

    case 'blockquote':
      return (
        <blockquote
          className={cn('mt-6 border-l-2 pl-6 italic', className)}
          {...props}
        >
          {children}
        </blockquote>
      )

    case 'list':
      return (
        <ul
          className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
          {...props}
        >
          {children}
        </ul>
      )
    case 'large':
      return (
        <div className={cn('text-lg font-semibold', className)} {...props}>
          {children}
        </div>
      )
    case 'inlineCode':
      return (
        <code
          className={cn(
            'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
            className,
          )}
          {...props}
        >
          {children}
        </code>
      )

    default:
      return (
        <p
          className={cn(
            variant === 'p' && 'leading-7 not-first:mt-6',
            variant === 'lead' && 'text-muted-foreground text-lg md:text-xl',
            variant === 'muted' && 'text-muted-foreground text-xs md:text-sm',
            className,
          )}
          {...props}
        >
          {children}
        </p>
      )
  }
}
