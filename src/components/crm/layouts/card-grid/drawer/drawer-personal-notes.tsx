import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PencilEdit01Icon,
  Tick01Icon,
  NoteIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import { SectionHeader } from "@components/crm/shared/section-header";
import { useCrmStore } from "@stores/crm-store";
import type { Contact } from "@types/contact";

/**
 * Drawer Personal Notes
 *
 * Editable notes section with inline editing.
 * Persists notes to the CRM store on save.
 */

export function DrawerPersonalNotes({ contact }: { contact: Contact }) {
  const { updateContactNotes } = useCrmStore();
  const [notes, setNotes] = useState(contact.notes.customSummary || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => {
    setNotes(contact.notes.customSummary || "");
    setIsEditingNotes(false);
  }, [contact.id, contact.notes.customSummary]);

  const handleSave = () => {
    updateContactNotes(contact.id, notes);
    setIsEditingNotes(false);
  };

  const handleCancel = () => {
    setNotes(contact.notes.customSummary || "");
    setIsEditingNotes(false);
  };

  return (
    <section>
      <SectionHeader icon={NoteIcon} title="Personal Notes" variant="label" />

      {isEditingNotes ? (
        <div className="space-y-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your personal notes..."
            className={cn(
              "w-full min-h-[100px] p-3 rounded-[var(--radius-lg)] resize-none",
              "bg-background border border-border/60",
              "text-ui placeholder:text-muted-foreground/40",
              "focus:outline-none focus:border-border",
              "transition-colors duration-200",
            )}
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <Button size="xs" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              size="xs"
              onClick={handleSave}
              className="bg-accent text-white hover:bg-accent/90"
            >
              <HugeiconsIcon
                icon={Tick01Icon}
                size={12}
                strokeWidth={2}
                className="mr-1"
              />
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditingNotes(true)}
          className={cn(
            "group relative cursor-pointer rounded-[var(--radius-lg)] p-3 min-h-[60px]",
            "border border-dashed border-border/60",
            "hover:border-border hover:bg-muted/10",
            "transition-colors duration-200",
          )}
        >
          {/* Pencil icon — inside the box, top-right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingNotes(true);
            }}
            className="absolute top-2.5 right-2.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
          >
            <HugeiconsIcon icon={PencilEdit01Icon} size={13} strokeWidth={2} />
          </button>

          {notes ? (
            <ul className="space-y-1.5 pr-6">
              {notes
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i} className="text-ui text-muted-foreground">
                    {line}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-ui text-muted-foreground/50">
              Click to add notes...
            </p>
          )}
        </div>
      )}
    </section>
  );
}
