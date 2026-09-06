import type { Metadata } from 'next'
import { PageShell } from '@/components/layouts/page-shell'
import { PageHeader } from '@/components/ui/page-header'

const TITLE = 'Products'
const DESCRIPTION = 'A collection of personal apps and products'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/products' },
}

export default function ProductsPage() {
  return (
    <PageShell>
      <div>
        <PageHeader title={TITLE} description="Coming soon" />
      </div>
    </PageShell>
  )
}
