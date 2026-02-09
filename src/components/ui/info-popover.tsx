import * as PopoverPrimitive from "@radix-ui/react-popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@lib/utils";

interface InfoPopoverProps {
  children: ReactNode;
  className?: string;
}

export function InfoPopover({ children, className }: InfoPopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="More information"
          className={cn(
            "inline-flex items-center justify-center",
            "text-muted-foreground/50 hover:text-muted-foreground",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-full",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <HugeiconsIcon
            icon={InformationCircleIcon}
            size={16}
            strokeWidth={1.5}
          />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="right"
          sideOffset={12}
          align="start"
          className={cn(
            "z-50 w-72 rounded-[var(--radius-lg)] p-4",
            "bg-surface-elevated border border-border shadow-lg",
            "text-ui text-foreground leading-relaxed",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",
          )}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

// Export primitives for more customization if needed
export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof PopoverPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-[var(--radius-lg)] p-4",
        "bg-surface-elevated border border-border shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";
