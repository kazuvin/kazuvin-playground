import type { Metadata } from 'next'
import { PageShell } from '@/components/layouts/page-shell'
import { PageHeader } from '@/components/ui/page-header'

const TITLE = 'Playgrounds'
const DESCRIPTION = 'A collection of playgrounds'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/playgrounds' },
}

export default function PlaygroundsPage() {
  return (
    <PageShell>
      <div>
        <PageHeader title={TITLE} description="Coming soon" />
      </div>
    </PageShell>
  )
}
