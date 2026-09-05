import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

// 公開 API ではないので export しない（型は props の形からしか使わない）
type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'default' | 'large'

interface ButtonVariants {
  variant: ButtonVariant
  size: ButtonSize
  disabled: boolean
  selected: boolean
  fullWidth: boolean
}

/* Visual height and tap height are separate concerns. The visual box renders
   at 40 (default) or 52 (large); the default size pads its touchable out to
   the 44px minimum with a transparent slop ring, which is the web analogue of
   React Native's hitSlop. Changing the label size never moves the box. */
const touchBaseClasses =
  'group m-0 cursor-pointer border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent] disabled:cursor-default'

const touchSlopClasses = {
  default: 'py-hitslop',
  large: '',
}

const boxBaseClasses =
  'box-border inline-flex items-center justify-center rounded-control border border-solid px-inset-x text-label transition-[background-color,border-color,opacity] duration-[120ms] ease-standard'

const boxSizeClasses = {
  default: 'h-control',
  large: 'h-control-lg',
}

/* Primary is black, not chromatic. Press swaps to a darker fill — never a
   scale-down, never an opacity fade. Selected is secondary-only and pairs the
   accent border with a tint and a check glyph, so the state survives greyscale
   and colour-blind rendering. */
const boxStateClasses = {
  disabled: 'border-disabled bg-disabled text-disabled-foreground',
  primary:
    'border-primary bg-primary text-primary-foreground group-active:border-primary-pressed group-active:bg-primary-pressed',
  selected: 'border-2 border-selected-border bg-selected text-foreground',
  secondary: 'border-border-strong bg-background text-foreground group-active:bg-muted',
}

function getButtonTouchClasses({
  size,
  fullWidth,
}: Pick<ButtonVariants, 'size' | 'fullWidth'>): string {
  return [
    touchBaseClasses,
    touchSlopClasses[size],
    fullWidth ? 'block w-full' : 'inline-block w-auto',
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
