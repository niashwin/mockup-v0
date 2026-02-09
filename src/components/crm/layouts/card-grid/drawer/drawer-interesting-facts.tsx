import { SparklesIcon } from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { SectionHeader } from "@components/crm/shared/section-header";
import type { Contact } from "@types/contact";

/**
 * Drawer Interesting Facts
 *
 * Shows top 3 auto-extracted personal tidbits about the contact
 * (hobbies, family, travel, etc.) with simple bullet points.
 */

export function DrawerInterestingFacts({ contact }: { contact: Contact }) {
  const facts = contact.interestingFacts.slice(0, 3);

  return (
    <section>
      <SectionHeader
        icon={SparklesIcon}
        title="Interesting Facts"
        variant="label"
      />

      {facts.length === 0 ? (
        <div
          className={cn(
            "rounded-[var(--radius-lg)] p-4 text-center",
            "border border-dashed border-border/60 bg-muted/5",
          )}
        >
          <p className="text-caption text-muted-foreground/50">
            Facts will appear as your relationship grows
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {facts.map((fact) => (
            <li key={fact.id} className="flex items-start gap-2">
              <span className="text-muted-foreground/60 mt-0.5 shrink-0 text-sm leading-none select-none">
                &bull;
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{fact.content}</p>
                <span className="text-xs text-muted-foreground/60">
                  {fact.source}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
