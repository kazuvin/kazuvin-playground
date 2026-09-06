import Link from 'next/link'
import { PageShell } from '@/components/layouts/page-shell'

export default function NotFound() {
  return (
    <PageShell>
      {/* max-w-xl は必須。text-center の箱は shrink-to-fit で、外すと行が parse される
           たびに箱が広がってテキストが横に動く (最大 184.8px)。 */}
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-xl text-center">
          <h1 className="mb-block font-bold text-mark">404</h1>
          <h2 className="mb-gap font-semibold">Page Not Found</h2>
          <p className="mb-block text-subtle-foreground">
            The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-control bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary-pressed"
          >
            Go back home
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
