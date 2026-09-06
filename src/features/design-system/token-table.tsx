import type { CSSProperties } from 'react'
import { Text } from '@/components/ui/text'
import type { ThemeToken } from './parse-theme'
import type { TokenGroup, TokenPreview } from './token-groups'

/*
 * トークン 1 節ぶんの表。
 *
 * プレビューは Tailwind のクラスではなく inline style で描く。クラス名を
 * `text-${key}` のように組み立てても Tailwind は生成しないし、`var(--color-gray-25)`
 * のような未使用トークンは出力から落ちているため。parse-theme が解決した実値を
 * そのまま流すのが、globals.css と一致し続ける唯一の方法になる。
 *
 * 島にはしない。動きが要るのは motion 節の再生ボタンだけで、それはページ側の
 * <script> が data 属性を拾って賄う。
 */

/** ease のドットが走る距離。プレビュー列 (w-28 = 112px) からドットの 8px を引いた分。
    ページ側の <script> は data 属性でこれを受け取るので、値はここだけにある。 */
const EASE_TRAVEL_PX = 104

interface TokenTableProps {
  group: TokenGroup
}

function modifierStyle(token: ThemeToken): CSSProperties {
  const style: CSSProperties = {}
  for (const modifier of token.modifiers) {
    if (modifier.property === 'line-height') {
      style.lineHeight = modifier.resolved
    }
    if (modifier.property === 'letter-spacing') {
      style.letterSpacing = modifier.resolved
    }
  }
  return style
}

function MotionButton({ token, kind }: { token: ThemeToken; kind: 'ease' | 'animation' }) {
  return (
    <button
      type="button"
      data-motion-play
      data-motion-kind={kind}
      data-motion-value={token.resolved}
      data-motion-travel={EASE_TRAVEL_PX}
      aria-label={`${token.name} を再生`}
      className="relative block h-8 w-full cursor-pointer rounded-control border border-border-hairline bg-transparent p-0 transition-colors duration-120 ease-standard hover:bg-muted"
    >
      {/* ease は端から端まで走らせて曲線を見せ、animation は面そのものを動かす */}
      {kind === 'ease' ? (
        <span
          data-motion-target
          className="absolute top-1/2 left-1 block size-2 -translate-y-1/2 rounded-chip bg-foreground"
        />
      ) : (
        <span
          data-motion-target
          className="absolute top-1/2 left-1/2 block size-5 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-foreground"
        />
      )}
    </button>
  )
}

function TokenPreviewCell({ preview, token }: { preview: TokenPreview; token: ThemeToken }) {
  // 名前空間の打ち消し (--text-*: initial) には見せる値が無い
  if (token.value === 'initial') {
    return null
  }

  switch (preview) {
    case 'color':
      return (
        <span
          className="block h-10 w-full rounded-md border border-border-hairline"
          style={{ background: token.resolved }}
        />
      )
    case 'font':
      return (
        <span className="block truncate" style={{ fontFamily: token.value }}>
          Aa あア 012
        </span>
      )
    case 'weight':
      return (
        <span className="block" style={{ fontWeight: token.resolved }}>
          Aa あア 012
        </span>
      )
    case 'text':
      return (
        <span
          className="block truncate"
          style={{ fontSize: token.resolved, ...modifierStyle(token) }}
        >
          Aa あア
        </span>
      )
    case 'leading':
      return (
        <span className="block text-2xs" style={{ lineHeight: token.resolved }}>
          あいうえお かきくけこ さしすせそ
        </span>
      )
    case 'tracking':
      return (
        <span className="block overflow-hidden text-2xs" style={{ letterSpacing: token.resolved }}>
          Aa あア 012
        </span>
      )
    case 'spacing':
      return (
        <span className="flex h-10 items-center">
          <span
            className="block h-2 rounded-chip bg-foreground"
            style={{ width: token.resolved }}
          />
        </span>
      )
    case 'radius':
      return (
        <span className="flex h-10 items-center">
          <span
            className="block size-10 border border-border-strong bg-muted"
            style={{ borderRadius: token.resolved }}
          />
        </span>
      )
    case 'ease':
      return <MotionButton token={token} kind="ease" />
    case 'animation':
      return <MotionButton token={token} kind="animation" />
    case 'value':
      return null
    default:
      return null
  }
}

function TokenTable({ group }: TokenTableProps) {
  const hasPreview = group.preview !== 'value'

  return (
    <div className="mt-block-tight">
      <Text role="label" className="text-muted-foreground">
        {group.utility}
      </Text>

      <ul className="mt-gap divide-y divide-border-hairline border-border-hairline border-y">
        {group.rows.map(({ key, token }) => (
          <li key={token.name} className="py-inset-y">
            {(token.label !== '' || token.note.length > 0) && (
              <div className="pb-block-tight">
                {token.label !== '' && <Text role="overline">{token.label}</Text>}
                {token.note.map((paragraph) => (
                  <Text role="caption" key={paragraph} className="mt-gap-tight">
                    {paragraph}
                  </Text>
                ))}
              </div>
            )}

            <div className="flex items-start gap-block-tight">
              {hasPreview && (
                <div className="w-28 shrink-0">
                  <TokenPreviewCell preview={group.preview} token={token} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <Text role="label" as="span" className="block">
                  {key}
                </Text>
                <p className="mt-gap-tight break-all text-sm text-subtle-foreground">
                  {token.value}
                </p>
                {token.resolved !== token.value && (
                  <p className="break-all text-muted-foreground text-xs">= {token.resolved}</p>
                )}
                {token.value === 'initial' && (
                  <p className="text-muted-foreground text-xs">
                    Tailwind 既定のスケールを消している。この名前空間はここで定義した段しか持たない
                  </p>
                )}
                {token.modifiers.map((modifier) => (
                  <p key={modifier.property} className="break-all text-muted-foreground text-xs">
                    {modifier.property}: {modifier.value}
                    {modifier.resolved !== modifier.value && ` = ${modifier.resolved}`}
                  </p>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { TokenTable }
