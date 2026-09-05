import * as React from "react";
import { cn } from "@/lib/cn";
import { getScreenClasses, type ScreenAlign } from "./variants";

export interface ScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Device width in px. Default 390, mirroring the design viewport. */
  width?: number;
  align?: ScreenAlign;
}

function Screen({
  className,
  style,
  width = 390,
  align = "stretch",
  ...props
}: ScreenProps) {
  return (
    <div
      className={cn(getScreenClasses(align), className)}
      style={{ maxWidth: width, ...style }}
      {...props}
    />
  );
}

export { Screen };
