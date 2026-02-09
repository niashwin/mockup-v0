import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-transparent px-2 py-0.5 text-[11px] font-medium leading-none w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
        active: "bg-primary text-primary-foreground",
        accent: "bg-accent/10 text-accent",
        secondary:
          "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
        destructive: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
        outline: "border border-border text-muted-foreground bg-transparent",
        urgent: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
        high: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
        medium:
          "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
        low: "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
        todo: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        "in-progress":
          "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
        "in-review":
          "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
        completed:
          "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
        teal: "bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
        green:
          "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300",
        amber:
          "bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
        purple:
          "bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
