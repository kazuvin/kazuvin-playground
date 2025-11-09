import * as React from "react";
import { cn } from "@/lib/cn";
import {
  getTypographyClasses,
  type TypographyVariant,
  type TypographyElement,
} from "./variants";

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: TypographyElement;
}

function Typography({
  className,
  variant = "p",
  as,
  ...props
}: TypographyProps) {
  const Component = (as || (variant.startsWith("h") ? variant : "p")) as TypographyElement;

  return React.createElement(
    Component,
    {
      className: cn(getTypographyClasses(variant), className),
      ...props,
    }
  );
}

export { Typography };
