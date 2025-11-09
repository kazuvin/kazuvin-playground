import * as React from "react";
import { cn } from "@/lib/cn";
import { Typography } from "@/app/components/ui";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
}

function PageHeader({
  title,
  description,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header className={cn("mb-12", className)} {...props}>
      <Typography variant="h1">{title}</Typography>
      {description && <Typography variant="p">{description}</Typography>}
    </header>
  );
}

export { PageHeader };
