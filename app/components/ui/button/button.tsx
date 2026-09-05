import * as React from "react";
import { cn } from "@/lib/cn";
import {
  getButtonBoxClasses,
  getButtonTouchClasses,
  type ButtonSize,
  type ButtonVariant,
} from "./variants";

export interface ButtonProps
  extends Omit<React.ComponentProps<"button">, "children"> {
  children?: React.ReactNode;
  /** primary = the one filled surface on screen. Default "primary". */
  variant?: ButtonVariant;
  /** Visual box height: default 40px, large 52px. Default "default". */
  size?: ButtonSize;
  /** Secondary-only toggle state: accent border + tint + check glyph. */
  selected?: boolean;
  fullWidth?: boolean;
}

function Button({
  ref,
  className,
  children,
  variant = "primary",
  size = "default",
  disabled = false,
  selected = false,
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-pressed={variant === "secondary" && selected ? true : undefined}
      className={cn(getButtonTouchClasses({ size, fullWidth }), className)}
      {...props}
    >
      <span
        data-selected={selected ? "true" : undefined}
        className={cn(
          getButtonBoxClasses({ variant, size, disabled, selected, fullWidth })
        )}
      >
        {selected ? (
          <span aria-hidden="true" className="mr-gap font-bold">
            ✓
          </span>
        ) : null}
        {children}
      </span>
    </button>
  );
}

export { Button };
