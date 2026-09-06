import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'default' | 'large'

interface ButtonVariants {
  variant: ButtonVariant
  size: ButtonSize
  disabled: boolean
  selected: boolean
  fullWidth: boolean
}

/* 面の高さ (40 / 52) とタップ領域 (最低 44) は別。default は透明な slop で
   44 まで広げる。ラベルのサイズを変えても面は動かない。 */
const touchBaseClasses =
  'group m-0 cursor-pointer border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent] disabled:cursor-default'

const touchSlopClasses = {
  default: 'py-hitslop',
  large: '',
}

const boxBaseClasses =
  'box-border inline-flex items-center justify-center rounded-control border border-solid px-inset-x text-sm font-medium transition-[background-color,border-color,opacity] duration-[120ms] ease-standard'

const boxSizeClasses = {
  default: 'h-control',
  large: 'h-control-lg',
}

/* 押下は塗りの差し替えだけ。縮小も不透明度も使わない。 */
const boxStateClasses = {
  disabled: 'border-disabled bg-disabled text-disabled-foreground',
  primary:
    'border-primary bg-primary text-primary-foreground group-active:border-primary-pressed group-active:bg-primary-pressed',
  selected: 'border-2 border-selected-border bg-selected text-foreground',
  secondary: 'border-border-strong bg-background text-foreground group-active:bg-muted',
}

/* 横に縮まないほうは inline-flex で書く。inline-block は使えない —
   Tailwind の inline-* (inline-size) が --spacing-block を拾ってしまい、
   display と一緒に inline-size: 32px まで付く (globals.css の tier 2 を参照)。 */
function getButtonTouchClasses({
  size,
  fullWidth,
}: Pick<ButtonVariants, 'size' | 'fullWidth'>): string {
  return [
    touchBaseClasses,
    touchSlopClasses[size],
    fullWidth ? 'block w-full' : 'inline-flex w-auto',
  ].join(' ')
}

/* disabled が最優先。primary は選択状態を持たないので、selected を見るのは
   secondary のときだけになる。 */
function getBoxStateClasses({
  variant,
  disabled,
  selected,
}: Pick<ButtonVariants, 'variant' | 'disabled' | 'selected'>): string {
  if (disabled) {
    return boxStateClasses.disabled
  }
  if (variant === 'primary') {
    return boxStateClasses.primary
  }
  if (selected) {
    return boxStateClasses.selected
  }
  return boxStateClasses.secondary
}

function getButtonBoxClasses({
  variant,
  size,
  disabled,
  selected,
  fullWidth,
}: ButtonVariants): string {
  const state = getBoxStateClasses({ variant, disabled, selected })

  return [boxBaseClasses, boxSizeClasses[size], fullWidth ? 'w-full' : 'w-auto', state].join(' ')
}

interface ButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  children?: ReactNode
  /** primary = the one filled surface on screen. Default "primary". */
  variant?: ButtonVariant
  /** Visual box height: default 40px, large 52px. Default "default". */
  size?: ButtonSize
  /** Secondary-only toggle state: accent border + tint + check glyph. */
  selected?: boolean
  fullWidth?: boolean
}

function Button({
  ref,
  className,
  children,
  variant = 'primary',
  size = 'default',
  disabled = false,
  selected = false,
  fullWidth = false,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-pressed={variant === 'secondary' && selected ? true : undefined}
      className={cn(getButtonTouchClasses({ size, fullWidth }), className)}
      {...props}
    >
      <span
        data-selected={selected ? 'true' : undefined}
        className={cn(getButtonBoxClasses({ variant, size, disabled, selected, fullWidth }))}
      >
        {selected ? (
          <span aria-hidden="true" className="mr-gap font-bold">
            ✓
          </span>
        ) : null}
        {children}
      </span>
    </button>
  )
}

export { Button }
