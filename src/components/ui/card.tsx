import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type CardProps = ComponentProps<'div'>

function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-xl border border-border bg-card text-card-foreground', className)}
      {...props}
    />
  )
}

type CardHeaderProps = ComponentProps<'div'>

function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

type CardTitleProps = ComponentProps<'h3'>

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn('font-semibold text-base leading-snug tracking-tight', className)}
      {...props}
    />
  )
}

type CardDescriptionProps = ComponentProps<'p'>

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn('text-muted-foreground text-sm', className)} {...props} />
}

type CardContentProps = ComponentProps<'div'>

function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

type CardFooterProps = ComponentProps<'div'>

function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
