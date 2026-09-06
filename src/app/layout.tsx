import '@fontsource-variable/noto-sans-jp'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AppShell } from '@/components/layouts/app-shell'
import { DevTools } from '@/components/layouts/dev-tools'
import { APP_DESCRIPTION, APP_NAME, SITE_URL } from '@/config/app'
import { notoSansMono } from '@/styles/fonts'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '512x512' }],
  },
}

export interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={notoSansMono.variable}>
      <body>
        <AppShell>{children}</AppShell>
        <DevTools />
      </body>
    </html>
  )
}
