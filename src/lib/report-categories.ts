import type { IconSvgElement } from "@hugeicons/react";
import {
  CrownIcon,
  Target01Icon,
  PackageIcon,
  SourceCodeIcon,
  Dollar01Icon,
} from "@hugeicons/core-free-icons";
import type { ReportCategory } from "@data/mock-reports";

export interface CategoryConfig {
  label: string;
  icon: IconSvgElement;
  color: string;
}

export const CATEGORY_CONFIG: Record<ReportCategory, CategoryConfig> = {
  leadership: {
    label: "Leadership",
    icon: CrownIcon,
    color: "text-purple-500",
  },
  gtm: { label: "GTM", icon: Target01Icon, color: "text-blue-500" },
  product: { label: "Product", icon: PackageIcon, color: "text-green-500" },
  engineering: {
    label: "Engineering",
    icon: SourceCodeIcon,
    color: "text-orange-500",
  },
  finance: { label: "Finance", icon: Dollar01Icon, color: "text-amber-500" },
};

export const CATEGORY_ORDER: ReportCategory[] = [
  "leadership",
  "gtm",
  "product",
  "engineering",
  "finance",
];
