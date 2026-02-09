import { motion } from "motion/react";
import { staggerContainer, staggerItem } from "@lib/motion";
import { SourcesButton } from "@components/sources";
import { ActionItems } from "./action-items";
import type { WeeklyReport } from "@data/mock-reports";

interface LeadershipDigestProps {
  report: WeeklyReport;
}

function parseMarkdownParagraphs(content: string): string[] {
  return content
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
}

function formatParagraph(text: string): React.ReactNode {
  // Handle **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function LeadershipDigest({ report }: LeadershipDigestProps) {
  if (!report.sections || report.sections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ui text-muted-foreground">
          No sections available for this digest
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="prose-editorial"
    >
      {report.sections.map((section, sectionIndex) => {
        const paragraphs = parseMarkdownParagraphs(section.content);

        return (
          <motion.section
            key={section.id}
            variants={staggerItem}
            className={sectionIndex > 0 ? "mt-16" : ""}
          >
            {/* Section Header */}
            <div className="mb-6">
              <h2 className="!mt-0 !mb-0 !pb-0 !border-b-0">{section.title}</h2>
            </div>

            {/* Section Content */}
            <div className="space-y-6">
              {paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex} className="!mb-0">
                  {formatParagraph(paragraph)}
                </p>
              ))}
            </div>

            {/* Sources button - positioned after content */}
            <div className="mt-5">
              <SourcesButton
                sectionId={section.id}
                sectionTitle={section.title}
                sources={section.sources}
              />
            </div>
          </motion.section>
        );
      })}

      {/* Action Items */}
      {report.actions && report.actions.length > 0 && (
        <motion.div
          variants={staggerItem}
          className="mt-20 pt-10 border-t border-border-subtle"
        >
          <ActionItems actions={report.actions} />
        </motion.div>
      )}
    </motion.div>
  );
}
