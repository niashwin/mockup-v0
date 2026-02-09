/**
 * Icon Component — HugeIcons Wrapper
 *
 * Unified icon component wrapping @hugeicons/react for consistent
 * sizing and stroke width across the entire app.
 *
 * Usage:
 *   import { Icon } from "@components/ui/icon";
 *   import { Home01Icon } from "@hugeicons/core-free-icons";
 *   <Icon icon={Home01Icon} />
 *   <Icon icon={Home01Icon} size={20} strokeWidth={1.2} />
 */

import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@lib/utils";

interface IconProps {
  icon: IconSvgElement;
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function Icon({
  icon,
  className,
  size = 16,
  strokeWidth = 1.5,
  color = "currentColor",
}: IconProps) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={cn("shrink-0", className)}
    />
  );
}

export type { IconSvgElement };
