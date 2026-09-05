import * as React from "react";
import { cn } from "@/lib/cn";
import {
  getTextClasses,
  textDefaultElement,
  type TextAlign,
  type TextElement,
  type TextRole,
} from "./variants";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Picks the typography token set. Default "body". */
  role?: TextRole;
  /** Override the default element for the role. */
  as?: TextElement;
  align?: TextAlign;
}

function Text({
  className,
  role = "body",
  as,
  align = "left",
  ...props
}: TextProps) {
  const Component = as ?? textDefaultElement[role];

  return React.createElement(Component, {
    className: cn(getTextClasses(role, align), className),
    ...props,
  });
}

export { Text };
