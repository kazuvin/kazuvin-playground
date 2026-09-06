import type { ReactNode } from 'react'
import { AppSidebar } from './app-sidebar'

/* 3 カラムの grid。トラックの値と段の切り替えの根拠は docs/directory-structure.md。 */
export interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="grid w-full grid-cols-1 justify-center lg:grid-cols-[auto_minmax(0,39rem)] lg:gap-x-block xl:grid-cols-[auto_minmax(0,39rem)_15rem]">
      <AppSidebar />
      {children}
    </div>
  )
}
