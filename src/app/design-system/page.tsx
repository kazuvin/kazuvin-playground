import type { Metadata } from 'next'
import { PageShell } from '@/components/layouts/page-shell'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Screen } from '@/components/ui/screen'
import { Text } from '@/components/ui/text'
import {
  Timeline,
  TimelineBody,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline'
import { CATALOG_HEADINGS, TOKEN_GROUPS } from '@/features/design-system/catalog'
import { CommandDemo } from '@/features/design-system/command-demo'
import { DialogDemo } from '@/features/design-system/dialog-demo'
import { SectionHeading } from '@/features/design-system/section-heading'
import { TokenTable } from '@/features/design-system/token-table'
import { cn } from '@/lib/cn'
import styles from './page.module.css'

const TITLE = 'Design System'
const DESCRIPTION = 'Kotoba Design System — tokens, primitives and the rules behind them'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/design-system' },
}

const PRINCIPLES = [
  {
    heading: 'プライマリの面は黒',
    body: '塗るのは --color-gray-900 で、アクセントではない。1 画面に塗り面は 1 つ。',
  },
  {
    heading: 'アクセントはフォーカスと選択だけ',
    body: 'rgb(242 49 130) を塗り・ステータス・装飾に使わない。ステータスは色ではなく言葉と位置で示す。',
  },
  {
    heading: '文字は 0.875rem (14px) が上限',
    body: '見出しも本文も同じ 14px。階層はサイズではなく太さ・色・余白で作る。上の段は存在しない。',
  },
] as const

const TEXT_ROLES = [
  'title',
  'heading',
  'subheading',
  'body',
  'lead',
  'caption',
  'label',
  'overline',
] as const

const MOTION_LABELS = ['公開した', '下書きにした', '書きはじめた'] as const

const UTILITY_DELAYS = [
  { label: '遅延なし', className: '' },
  { label: 'animation-delay-200', className: 'animation-delay-200' },
  { label: 'animation-delay-400', className: 'animation-delay-400' },
  { label: 'animation-delay-600', className: 'animation-delay-600' },
] as const

export default function DesignSystemPage() {
  return (
    <PageShell headings={CATALOG_HEADINGS}>
      <div>
        <PageHeader title={TITLE} description={DESCRIPTION} />
        <Text role="caption">
          トークンの節は <code className={styles.dsCode}>src/styles/globals.css</code> の{' '}
          <code className={styles.dsCode}>@theme</code>{' '}
          をビルド時に読んで組み立てている。値をここに書き写して いないので、CSS
          を触ればこのページも同じだけ動く。
        </Text>
      </div>

      <section>
        <SectionHeading id="principles" />
        <ol className="mt-block-tight divide-y divide-border-hairline border-border-hairline border-y">
          {PRINCIPLES.map((principle, index) => (
            <li key={principle.heading} className="flex items-baseline gap-block-tight py-inset-y">
              <span className="w-6 shrink-0 text-muted-foreground text-sm tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Text role="label" as="span" className="block">
                  {principle.heading}
                </Text>
                <Text role="caption" className="mt-gap-tight">
                  {principle.body}
                </Text>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-block">
        <div>
          <SectionHeading id="tokens" />
          <Text role="lead" className="mt-gap">
            {TOKEN_GROUPS.length} 節 /{' '}
            {TOKEN_GROUPS.reduce((total, group) => total + group.rows.length, 0)} トークン。並びは
            globals.css の宣言順のままで、節の前置きも CSS 側のコメントを そのまま持ち上げている。
          </Text>
        </div>

        {TOKEN_GROUPS.map((group) => (
          <div key={group.id}>
            <SectionHeading id={`token-${group.id}`} />
            <TokenTable group={group} />
          </div>
        ))}
      </section>

      <section className="space-y-block">
        <div>
          <SectionHeading id="components" />
          <Text role="lead" className="mt-gap">
            <code className={styles.dsCode}>src/components/ui/</code>{' '}
            のプリミティブ。すべて上のトークンだけで 組まれていて、固有の色やサイズを持たない。
          </Text>
        </div>

        <div>
          <SectionHeading id="component-text" />
          <Text role="caption" className="mt-gap">
            8 つの role。上の 5 つは同じ 14px で、違うのは太さと色だけ。
          </Text>
          <ul className="mt-block-tight divide-y divide-border-hairline border-border-hairline border-y">
            {TEXT_ROLES.map((role) => (
              <li key={role} className="flex items-baseline gap-block-tight py-inset-y">
                <code className={cn(styles.dsCode, 'w-28 shrink-0 text-muted-foreground')}>
                  {role}
                </code>
                <div className="min-w-0 flex-1">
                  <Text role={role}>見出しも本文も 14px — Aa あア 012</Text>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeading id="component-page-header" />
          <div className="mt-block-tight rounded-card border border-border-hairline p-inset-x">
            <PageHeader title="Notes" description="書いたものの置き場" className="mb-0" />
          </div>
        </div>

        <div>
          <SectionHeading id="component-button" />
          <Text role="caption" className="mt-gap">
            面の高さ (40 / 52) とタップ領域 (最低 44) は別のトークン。押下は塗りの差し替えで、
            縮小も不透明度も使わない。
          </Text>
          <div className="mt-block-tight flex flex-wrap items-center gap-gap">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button size="large">Primary / large</Button>
            <Button variant="secondary" size="large">
              Secondary / large
            </Button>
            <Button disabled>Disabled</Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
            <Button variant="secondary" selected>
              Selected
            </Button>
          </div>
          <div className="mt-block-tight flex flex-col gap-gap">
            <Button fullWidth>fullWidth</Button>
            <Button variant="secondary" fullWidth>
              fullWidth / secondary
            </Button>
          </div>
        </div>

        <div>
          <SectionHeading id="component-card" />
          <Card className="mt-block-tight">
            <CardHeader>
              <CardTitle>カードのタイトル</CardTitle>
              <CardDescription>
                説明は 13 / 400。面と地の差は 1px の境界だけで、影は無い。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text role="body">
                本文。カードの角は --radius-card (16px) で、コントロールの 12px とは別のトークン。
              </Text>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">アクション</Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <SectionHeading id="component-dialog" />
          <div className="mt-block-tight">
            <DialogDemo />
          </div>
        </div>

        <div>
          <SectionHeading id="component-command" />
          <div className="mt-block-tight">
            <CommandDemo />
          </div>
        </div>

        <div>
          <SectionHeading id="component-timeline" />
          <Timeline className="mt-block-tight">
            {MOTION_LABELS.map((label, index) => (
              <TimelineItem key={label}>
                <TimelineContent>
                  <TimelineSeparator>
                    <TimelineIndicator>
                      <TimelineDot isActive={index === 0} isCompleted={index > 0} />
                    </TimelineIndicator>
                    {index < 2 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineBody className="pb-block-tight">
                    <TimelineTitle isActive={index === 0}>{label}</TimelineTitle>
                    <Text role="caption" className="mt-gap-tight">
                      2025-11-0{index + 1}
                    </Text>
                  </TimelineBody>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>

        <div>
          <SectionHeading id="component-screen" />
          <Text role="caption" className="mt-gap">
            端末幅 390px を模した器。画面端の余白 (24 / 32 / 24) を宣言してよい唯一の場所。
          </Text>
          <div className="mt-block-tight">
            <Screen className="min-h-64 rounded-card border border-border-hairline">
              <Text role="overline">Unit 4 · Requests</Text>
              <div className="h-block" />
              <Text role="title" lang="ja">
                お願いできますか
              </Text>
              <div className="h-gap" />
              <Text role="caption">onegai dekimasu ka</Text>
              <div className="min-h-block-loose flex-1" />
              <Button size="large" fullWidth>
                Got it
              </Button>
            </Screen>
          </div>
        </div>
      </section>

      <section className="space-y-block">
        <div>
          <SectionHeading id="patterns" />
          <Text role="lead" className="mt-gap">
            プリミティブではなく、globals.css が直接持っているふるまい。
          </Text>
        </div>

        <div>
          <SectionHeading id="pattern-focus" />
          <Text role="caption" className="mt-gap">
            アクセントが許されている 2 箇所のうちの 1 つ。2px を 2px 外側に置くので、角丸は
            コントロールの 12px + 2 = --radius-focus (14px)。下の 2 つを Tab で辿ると出る。
          </Text>
          <div className="mt-block-tight flex flex-wrap items-center gap-gap">
            <Button variant="secondary">ボタン</Button>
            <a href="#pattern-focus" className="underline underline-offset-4">
              リンク
            </a>
          </div>
        </div>

        <div>
          <SectionHeading id="pattern-prose" />
          <Text role="caption" className="mt-gap">
            MDX の本文に当たるスタイル。見出しの 4 段はサイズを動かさず、太さ・色・直上の余白
            だけで段を作る。
          </Text>
          <article className="note-content mt-block-tight rounded-card border border-border-hairline p-inset-x">
            <h1>h1 — 14 / 700</h1>
            <p>
              本文は 14px の行間 1.75。<a href="#pattern-prose">リンク</a>は色を変えず下線の太さで
              示し、<code>インラインコード</code>は面で区別する。
            </p>
            <h2>h2 — 14 / 600</h2>
            <p>段落の間隔は --spacing-block-tight (20px)。</p>
            <h3>h3 — 14 / 600 + 弱い色</h3>
            <ul>
              <li>順不同リスト</li>
              <li>マーカーは muted-foreground</li>
            </ul>
            <h4>h4 — 14 / 500 + 弱い色</h4>
            <ol>
              <li>順序付きリスト</li>
              <li>字下げは --spacing-inset-x (20px)</li>
            </ol>
            <blockquote>引用は左の 2px 罫と字下げで示す。色は subtle-foreground。</blockquote>
            <pre>
              <code>{'const spacing = 4 // px'}</code>
            </pre>
            <table>
              <thead>
                <tr>
                  <th>役割</th>
                  <th>値</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>境界</td>
                  <td>1px hairline</td>
                </tr>
                <tr>
                  <td>影</td>
                  <td>無し</td>
                </tr>
              </tbody>
            </table>
            <hr />
            <p>区切りは 1px のヘアライン。</p>
          </article>
        </div>

        <div>
          <SectionHeading id="pattern-utilities" />
          <Text role="caption" className="mt-gap">
            @layer utilities の 4 つ。animate-* トークンと組み合わせて、登場を少しずらす。
          </Text>
          <div className="mt-block-tight flex flex-wrap gap-gap">
            {UTILITY_DELAYS.map((delay) => (
              <div
                key={delay.label}
                className={cn(
                  'animation-forwards animate-fade-slide-up rounded-card bg-muted p-inset-x text-sm opacity-0',
                  delay.className,
                )}
              >
                {delay.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  )
}
