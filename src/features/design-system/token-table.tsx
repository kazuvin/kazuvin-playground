import type { CSSProperties } from 'react'
import { Text } from '@/components/ui/text'
import { MotionButton } from './motion-button'
import type { ThemeToken } from './parse-theme'
import type { TokenGroup, TokenPreview } from './token-groups'

/*
 * プレビューは inline style で描く。`text-${key}` のように組み立てたクラス名は
 * Tailwind が生成せず、未使用トークンは出力からも落ちているため。
 */

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
