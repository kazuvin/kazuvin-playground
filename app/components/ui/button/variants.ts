export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "default" | "large";

interface ButtonVariants {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  selected: boolean;
  fullWidth: boolean;
}

/* Visual height and tap height are separate concerns. The visual box renders
   at 40 (default) or 52 (large); the default size pads its touchable out to
   the 44px minimum with a transparent slop ring, which is the web analogue of
   React Native's hitSlop. Changing the label size never moves the box. */

export const touchBaseClasses =
  "group m-0 cursor-pointer border-0 bg-transparent p-0 [-webkit-tap-highlight-color:transparent] disabled:cursor-default";

export const touchSlopClasses = {
  default: "py-hitslop",
  large: "",
};

export const boxBaseClasses =
  "box-border inline-flex items-center justify-center rounded-control border border-solid px-inset-x text-label transition-[background-color,border-color,opacity] duration-[120ms] ease-standard";

export const boxSizeClasses = {
  default: "h-control",
  large: "h-control-lg",
};

/* Primary is black, not chromatic. Press swaps to a darker fill — never a
   scale-down, never an opacity fade. Selected is secondary-only and pairs the
   accent border with a tint and a check glyph, so the state survives greyscale
   and colour-blind rendering. */
export const boxStateClasses = {
  disabled: "border-disabled bg-disabled text-disabled-foreground",
  primary:
    "border-primary bg-primary text-primary-foreground group-active:border-primary-pressed group-active:bg-primary-pressed",
  selected: "border-2 border-selected-border bg-selected text-foreground",
  secondary:
    "border-border-strong bg-background text-foreground group-active:bg-muted",
};

export function getButtonTouchClasses({
  size,
  fullWidth,
}: Pick<ButtonVariants, "size" | "fullWidth">): string {
  return [
    touchBaseClasses,
    touchSlopClasses[size],
    fullWidth ? "block w-full" : "inline-block w-auto",
  ].join(" ");
}

export function getButtonBoxClasses({
  variant,
  size,
  disabled,
  selected,
  fullWidth,
}: ButtonVariants): string {
  const state = disabled
    ? boxStateClasses.disabled
    : variant === "primary"
      ? boxStateClasses.primary
      : selected
        ? boxStateClasses.selected
        : boxStateClasses.secondary;

  return [
    boxBaseClasses,
    boxSizeClasses[size],
    fullWidth ? "w-full" : "w-auto",
    state,
  ].join(" ");
}
