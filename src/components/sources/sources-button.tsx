import { useSourcesStore } from "@stores/sources-store";
import { Button } from "@components/ui/button";
import type { SourceItem } from "@types/sources";

interface SourcesButtonProps {
  sectionId: string;
  sectionTitle: string;
  sources: SourceItem[];
}

export function SourcesButton({
  sectionId,
  sectionTitle,
  sources,
}: SourcesButtonProps) {
  const { openForSection } = useSourcesStore();

  if (sources.length === 0) {
    return null;
  }

  const handleClick = () => {
    openForSection(sectionId, sectionTitle, sources);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className="text-xs"
    >
      Sources
    </Button>
  );
}
