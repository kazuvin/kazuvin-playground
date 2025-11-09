import * as React from "react";
import { cn } from "@/lib/cn";
import {
  getButtonClasses,
  type ButtonVariant,
  type ButtonSize,
} from "./variants";

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

function Button({
  ref,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(getButtonClasses({ variant, size }), className)}
      ref={ref}
      {...props}
    />
  );
}

export { Button };
