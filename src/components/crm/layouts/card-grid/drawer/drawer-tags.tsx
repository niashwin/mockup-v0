import { TagEditor } from "@components/crm/shared/tag-editor";
import { useCrmStore } from "@stores/crm-store";
import { ALL_KNOWN_TAGS } from "@lib/crm-tag-utils";
import type { Contact } from "@types/contact";

/**
 * Drawer Tags
 *
 * Tag editor section using a single combobox with autocomplete.
 * Uses the predefined ALL_KNOWN_TAGS as the source of suggestions.
 */

interface DrawerTagsProps {
  contact: Contact;
}

export function DrawerTags({ contact }: DrawerTagsProps) {
  const { updateContactTags, customGlobalTags } = useCrmStore();
  const allTagLabels = [...ALL_KNOWN_TAGS, ...customGlobalTags];

  return (
    <section className="px-2">
      <TagEditor
        tags={contact.tags}
        allTags={allTagLabels}
        onTagsChange={(tags) => updateContactTags(contact.id, tags)}
        compact
      />
    </section>
  );
}
