import * as React from "react";
import { cn } from "@/lib/cn";

function Timeline({ ref, className, ...props }: React.ComponentProps<"ol">) {
  return <ol ref={ref} className={cn("relative", className)} {...props} />;
}

function TimelineItem({
  ref,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li ref={ref} className={cn("relative", className)} {...props} />;
}

function TimelineConnector({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-border absolute top-0 left-[15px] h-full w-[2px]",
        className
      )}
      {...props}
    />
  );
}

interface TimelineDotProps extends React.ComponentProps<"div"> {
  isActive?: boolean;
  isCompleted?: boolean;
}

function TimelineDot({
  className,
  isActive = false,
  isCompleted = false,
  ...props
}: TimelineDotProps) {
  return (
    <div
      className={cn(
        "bg-background size-3 rounded-full border-2",
        isActive && "border-primary bg-primary",
        isCompleted && !isActive && "border-primary bg-primary",
        !isActive && !isCompleted && "border-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

interface TimelineIconProps extends React.ComponentProps<"div"> {
  isActive?: boolean;
  isCompleted?: boolean;
}

function TimelineIcon({
  className,
  isActive = false,
  isCompleted = false,
  children,
  ...props
}: TimelineIconProps) {
  return (
    <div
      className={cn(
        "bg-background flex size-8 items-center justify-center rounded-full border-2",
        isActive && "border-primary bg-primary text-primary-foreground",
        isCompleted && !isActive && "border-primary bg-background text-primary",
        !isActive && !isCompleted && "border-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TimelineIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center",
        className
      )}
      {...props}
    />
  );
}

function TimelineHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-4 pb-2", className)} {...props} />
  );
}

function TimelineContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative flex gap-4 pb-2", className)} {...props} />
  );
}

function TimelineSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative flex w-8 shrink-0", className)} {...props} />
  );
}

function TimelineBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex-1", className)} {...props} />;
}

interface TimelineTitleProps extends React.ComponentProps<"div"> {
  isActive?: boolean;
}

function TimelineTitle({
  className,
  isActive = false,
  ...props
}: TimelineTitleProps) {
  return (
    <div
      className={cn(
        "text-sm leading-none font-semibold",
        isActive && "text-primary",
        className
      )}
      {...props}
    />
  );
}

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineIcon,
  TimelineIndicator,
  TimelineHeader,
  TimelineTitle,
  TimelineContent,
  TimelineSeparator,
  TimelineBody,
};
