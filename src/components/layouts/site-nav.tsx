'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/config/app'
import { cn } from '@/lib/cn'
import { isActiveNavItem } from '@/lib/nav'

type SiteNavVariant = 'rail' | 'menu'

/* rail が出るのは lg 以上だけ。lg 未満は mobile-nav が menu として同じ行き先を出す。 */
const navClasses = {
  rail: 'hidden lg:mt-block lg:flex lg:flex-col lg:gap-gap-tight',
  menu: 'flex flex-col',
}

/* menu は指で押す段なので、面の高さではなくタップ領域 (44) を下限にする。 */
const itemClasses = {
  rail: 'py-gap-tight',
  menu: 'flex min-h-tap-min items-center',
}

export interface SiteNavProps {
  /** rail = 左レールの縦並び、menu = ハンバーガーの中身。既定は rail */
  variant?: SiteNavVariant
  /** menu で行き先を押したときに閉じるためのフック */
  onNavigate?: () => void
}

export function SiteNav({ variant = 'rail', onNavigate }: SiteNavProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Site" className={navClasses[variant]}>
      {NAV_ITEMS.map((item) => {
        const isActive = isActiveNavItem(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            onClick={onNavigate}
            className={cn(
              'whitespace-nowrap transition-colors duration-120 ease-standard',
              itemClasses[variant],
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
