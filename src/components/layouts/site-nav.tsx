'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/config/app'
import { cn } from '@/lib/cn'
import { isActiveNavItem } from '@/lib/nav'

export function SiteNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Site"
      className="mt-gap flex gap-block-tight overflow-x-auto lg:mt-block lg:flex-col lg:gap-gap-tight lg:overflow-x-visible"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = isActiveNavItem(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'whitespace-nowrap py-gap-tight transition-colors duration-120 ease-standard',
              isActive
                ? 'font-medium text-foreground'
                : 'text-subtle-foreground hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
