import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Fragment, type ReactNode } from "react";
import { cn } from "@lib/utils";

export interface BreadcrumbItem {
  label: string;
}

interface PageBreadcrumbHeaderProps {
  items: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

/**
 * Unified Page Header
 *
 * Consistent across all pages:
 * - Height: 56px (h-14)
 * - Padding: px-6
 * - Title: text-lg font-semibold (DM Sans via heading rule)
 * - No icons - clean typography only
 */
export function PageBreadcrumbHeader({
  items,
  actions,
  className,
}: PageBreadcrumbHeaderProps) {
  return (
    <header
      className={cn(
        "h-14 px-6 flex items-center justify-between",
        "border-b border-border-subtle bg-background shrink-0",
        className,
      )}
    >
      <nav className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={index}>
              {index > 0 && (
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={14}
                  strokeWidth={1.5}
                  className="text-muted-foreground/40"
                />
              )}
              <span
                className={cn(
                  isLast
                    ? "text-lg text-foreground font-semibold"
                    : "text-sm text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </Fragment>
          );
        })}
      </nav>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
