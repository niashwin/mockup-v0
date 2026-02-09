import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert01Icon,
  Clock01Icon,
  Folder01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "motion/react";
import { springs, fadeVariants } from "@lib/motion";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { SourcesButton } from "@components/sources/sources-button";
import type { RadarItem, RadarSeverity, RadarSource } from "@types/radar";
import type { SourceItem, SourceCategory } from "@types/sources";

interface RadarReadingPaneProps {
  item: RadarItem | null;
}

const severityBadgeVariant: Record<
  RadarSeverity,
  "urgent" | "high" | "medium" | "low"
> = {
  critical: "urgent",
  high: "high",
  medium: "medium",
  low: "low",
};

const severityLabels: Record<RadarSeverity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const statusLabels: Record<string, string> = {
  new: "New",
  acknowledged: "Acknowledged",
  resolved: "Resolved",
};

const radarSourceTypeToCategory: Record<RadarSource["type"], SourceCategory> = {
  system: "system",
  report: "reports",
  external: "external",
  meeting: "meetings",
};

function radarSourcesToSourceItems(
  sources: RadarSource[],
  radarId: string,
): SourceItem[] {
  return sources.map((source, idx) => ({
    id: `${radarId}-source-${idx}`,
    category: radarSourceTypeToCategory[source.type],
    title: source.name,
    timestamp: new Date(),
    href: source.url,
  }));
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RadarReadingPane({ item }: RadarReadingPaneProps) {
  if (!item) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <span className="block mx-auto mb-4 opacity-20">
            <HugeiconsIcon icon={Alert01Icon} size={48} strokeWidth={1} />
          </span>
          <p className="text-ui">Select an alert to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Scrollable content area */}
      <div className="h-full overflow-y-auto">
        <motion.div
          key={item.id}
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          transition={springs.gentle}
          className="min-h-full"
        >
          {/* Match exact positioning of reports reading pane */}
          <div
            className="max-w-2xl py-12 pb-24 px-8 lg:px-12 lg:pt-16"
            style={{
              // Center content on viewport, accounting for nav (52px) + sidebar (220px) = 272px
              marginLeft: "calc((100vw - 672px) / 2 - 272px)",
            }}
          >
            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant={severityBadgeVariant[item.severity]}>
                  {severityLabels[item.severity]}
                </Badge>
                <Badge variant="outline">
                  {statusLabels[item.status] ?? item.status}
                </Badge>
              </div>

              <h1 className="text-display font-semibold text-foreground mb-4">
                {item.title}
              </h1>

              <div className="flex items-center gap-4 text-caption text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Folder01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                  <span>{item.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    size={14}
                    strokeWidth={1.5}
                  />
                  <span>{formatDate(item.detectedAt)}</span>
                </div>
              </div>
            </header>

            {/* Description */}
            <section className="mb-10">
              <h2 className="text-caption font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Overview
              </h2>
              <p className="text-body text-foreground leading-relaxed">
                {item.description}
              </p>
            </section>

            {/* Impact */}
            {item.impact && (
              <section className="mb-10">
                <h2 className="text-caption font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Business Impact
                </h2>
                <div className="pl-4 border-l-2 border-accent/30">
                  <p className="text-body text-foreground leading-relaxed">
                    {item.impact}
                  </p>
                </div>
              </section>
            )}

            {/* Stakeholders */}
            {item.stakeholders && item.stakeholders.length > 0 && (
              <section className="mb-10">
                <h2 className="text-caption font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={UserGroupIcon}
                      size={14}
                      strokeWidth={1.5}
                    />
                    People Involved
                  </span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  {item.stakeholders.map((stakeholder, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-3 py-2 rounded-[var(--radius-lg)] bg-muted/30 border border-border/50"
                    >
                      <div className="size-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-accent">
                          {stakeholder.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-ui font-medium text-foreground">
                          {stakeholder.name}
                        </p>
                        <p className="text-caption text-muted-foreground">
                          {stakeholder.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Sources button -- opens sidebar */}
            {item.sources && item.sources.length > 0 && (
              <div className="mb-10">
                <SourcesButton
                  sectionId={item.id}
                  sectionTitle={item.title}
                  sources={radarSourcesToSourceItems(item.sources, item.id)}
                />
              </div>
            )}

            {/* Next Steps / Actions */}
            <section className="pt-8 border-t border-border">
              <h2 className="text-caption font-medium text-muted-foreground uppercase tracking-wider mb-4">
                Suggested Next Steps
              </h2>
              <div className="flex flex-wrap gap-3">
                {item.nextSteps && item.nextSteps.length > 0 ? (
                  item.nextSteps.map((step, idx) => (
                    <Button
                      key={idx}
                      variant={
                        step.action === "primary" ? "default" : "outline"
                      }
                    >
                      {step.label}
                    </Button>
                  ))
                ) : (
                  <>
                    {item.status === "new" && (
                      <Button variant="default">Acknowledge</Button>
                    )}
                    {item.status === "acknowledged" && (
                      <Button variant="default">Mark Resolved</Button>
                    )}
                    <Button variant="outline">View Full Report</Button>
                  </>
                )}
              </div>
            </section>

            {/* Footer flourish - matching reports */}
            <div className="mt-20 pt-10 border-t border-border-subtle flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-accent/30" />
              <span className="text-micro text-muted-foreground/50 uppercase tracking-widest">
                End of Alert
              </span>
              <div className="w-8 h-px bg-accent/30" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
