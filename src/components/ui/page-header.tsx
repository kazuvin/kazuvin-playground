import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Text } from './text'

interface PageHeaderProps extends HTMLAttributes<HTMLElement> {
  title: string
  description?: string
}

function PageHeader({ title, description, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn('mb-block', className)} {...props}>
      <Text role="expression">{title}</Text>
      {description && (
        <Text role="body" className="mt-gap">
          {description}
        </Text>
      )}
    </header>
  )
}

export { PageHeader }
