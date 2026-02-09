import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

/**
 * Section Header
 *
 * Consistent section header component with icon and title.
 * Used across expanded content, detail panes, and drawers.
 *
 * Variants:
 * - default — bold UI text for content sections
 * - accent — micro uppercase accent for highlighted sections
 * - label — Manrope-styled muted label for drawer sections
 */

interface SectionHeaderProps {
  icon: IconSvgElement;
  title: string;
  variant?: "default" | "accent" | "label";
}

const variantStyles = {
  default: {
    icon: "text-accent",
    heading: "font-semibold text-ui text-foreground",
  },
  accent: {
    icon: "text-accent",
    heading:
      "font-label font-medium text-micro text-accent uppercase tracking-wider",
  },
  label: {
    icon: "text-muted-foreground/50",
    heading:
      "font-medium text-[10px] text-muted-foreground/50 uppercase tracking-wider",
  },
};

export function SectionHeader({
  icon,
  title,
  variant = "default",
}: SectionHeaderProps) {
  const styles = variantStyles[variant];

  return (
    <div className="flex items-center gap-2 mb-2.5">
      <HugeiconsIcon
        icon={icon}
        size={variant === "label" ? 14 : 16}
        strokeWidth={2}
        className={styles.icon}
      />
      <h4 className={styles.heading}>{title}</h4>
    </div>
  );
}
