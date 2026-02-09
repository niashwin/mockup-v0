import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-foreground/[0.04]",
        secondary:
          "bg-neutral-100 text-foreground hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700",
        ghost:
          "text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 text-sm rounded-[7px] gap-2 has-[>svg]:px-3",
        xs: "h-7 px-2.5 text-xs rounded-[7px] gap-1",
        sm: "h-8 px-3 text-xs rounded-[7px] gap-1.5 has-[>svg]:px-2.5",
        lg: "h-10 px-5 text-sm rounded-[7px] gap-2 has-[>svg]:px-4",
        icon: "size-8 rounded-[7px]",
        "icon-sm": "size-7 rounded-[5px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
