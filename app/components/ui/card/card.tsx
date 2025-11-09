import * as React from "react";
import { cn } from "@/lib/cn";

export type CardProps = React.ComponentProps<"div">;

function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-border rounded-xl border",
        className
      )}
      {...props}
    />
  );
}

export type CardHeaderProps = React.ComponentProps<"div">;

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export type CardTitleProps = React.ComponentProps<"h3">;

function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn("leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

export type CardDescriptionProps = React.ComponentProps<"p">;

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  );
}

export type CardContentProps = React.ComponentProps<"div">;

function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export type CardFooterProps = React.ComponentProps<"div">;

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
