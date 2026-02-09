import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useReviewActionsStore } from "@stores/review-actions-store";
import { springs } from "@lib/motion";
import { Button } from "@components/ui/button";

export function ReviewActionsHeader() {
  const { closeModal, goToNext, goToPrevious, actions, currentIndex } =
    useReviewActionsStore();

  const total = actions.length;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < total - 1;

  return (
    <div className="flex flex-col">
      {/* Main header row - back button near corner */}
      <div className="flex items-center pl-4 pr-7 py-4">
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={closeModal}
          className="size-8 text-muted-foreground hover:text-foreground"
          aria-label="Close modal"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.5} />
        </Button>

        {/* Title */}
        <h2
          id="review-actions-title"
          className="ml-2 font-semibold text-modal-ui text-foreground"
        >
          Review
        </h2>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Navigation with integrated counter */}
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            disabled={!canGoBack}
            className="size-8"
            aria-label="Previous action"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={1.5} />
          </Button>

          <span className="text-modal-label text-muted-foreground tabular-nums min-w-[5ch] text-center">
            {currentIndex + 1} of {total}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            disabled={!canGoForward}
            className="size-8"
            aria-label="Next action"
          >
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={20}
              strokeWidth={1.5}
            />
          </Button>
        </div>
      </div>

      {/* Full-width progress bar */}
      <div className="h-0.5 bg-border-subtle">
        <motion.div
          className="h-full bg-foreground/20"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={springs.gentle}
        />
      </div>
    </div>
  );
}
