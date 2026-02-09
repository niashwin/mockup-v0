import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Calendar01Icon,
  PlusSignIcon,
  Cancel01Icon,
  Tick01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons";
import type { LayoutProps } from "./types";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { springs } from "@lib/motion";
import type { Participant } from "@types/action";

export function SplitPanelLayout({
  action,
  onUpdateDraft,
  onAddParticipant,
  onRemoveParticipant,
  onCycleRecipientType,
}: LayoutProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const isEmail = action.type === "email";
  const participants = isEmail ? action.recipients : action.participants;
  const iconType = isEmail ? Mail01Icon : Calendar01Icon;
  const typeLabel = isEmail ? "Send Email" : "Schedule Meeting";
  const participantLabel = isEmail ? "Recipients" : "Participants";

  const handleAddParticipant = () => {
    if (!newName.trim()) return;
    const participant: Participant = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      email: newEmail.trim(),
      matchStatus: "manual",
    };
    onAddParticipant(participant);
    setNewName("");
    setNewEmail("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddParticipant();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewName("");
      setNewEmail("");
    }
  };

  return (
    <div className="grid grid-cols-[200px_1fr] gap-8 h-full">
      {/* Left Column - Meta & Participants */}
      <div className="flex flex-col gap-6">
        {/* Action header */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-modal-label text-muted-foreground">
            <HugeiconsIcon icon={iconType} size={14} strokeWidth={1.5} />
            <span>{typeLabel}</span>
          </div>
          <h3 className="font-semibold text-modal-title text-foreground leading-tight">
            {action.title}
          </h3>
        </div>

        {/* Calendar warning for meetings */}
        {!isEmail && !action.calendarConnected && (
          <p className="text-modal-micro text-muted-foreground flex items-center gap-1.5">
            <HugeiconsIcon icon={Alert01Icon} size={12} strokeWidth={1.5} />
            <span>
              Calendar not connected —{" "}
              <button className="underline hover:text-foreground transition-colors">
                connect
              </button>
            </span>
          </p>
        )}

        {/* Participants section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2">
            <label className="text-modal-label font-medium text-muted-foreground uppercase tracking-wider">
              {participantLabel}
            </label>
            <button
              onClick={() => setIsAdding(true)}
              className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label={`Add ${participantLabel.toLowerCase()}`}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto border border-border-subtle rounded-[var(--radius-lg)] bg-muted/20">
            <div className="p-2">
              <AnimatePresence mode="popLayout">
                {participants.map((participant) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={springs.quick}
                    className="group flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-modal-ui text-foreground truncate">
                        {participant.name}
                      </div>
                      {participant.email && (
                        <div className="text-modal-micro text-muted-foreground truncate">
                          {participant.email}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      {/* CC/BCC badge for emails */}
                      {isEmail && (
                        <button
                          onClick={() => onCycleRecipientType(participant.id)}
                          className={`text-modal-micro uppercase tracking-wide transition-colors ${
                            participant.recipientType === "to" ||
                            !participant.recipientType
                              ? "text-muted-foreground/40 hover:text-muted-foreground"
                              : "px-1 py-0.5 rounded bg-muted text-white hover:bg-muted/80"
                          }`}
                        >
                          {participant.recipientType ?? "to"}
                        </button>
                      )}

                      <button
                        onClick={() => onRemoveParticipant(participant.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-muted hover:text-foreground transition-all"
                        aria-label={`Remove ${participant.name}`}
                      >
                        <HugeiconsIcon
                          icon={Cancel01Icon}
                          size={12}
                          strokeWidth={1.5}
                          className="text-muted-foreground"
                        />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Inline add form */}
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-2 px-2 space-y-2"
                >
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Name"
                    className="w-full bg-transparent border-0 border-b border-border-subtle focus:border-foreground text-modal-ui px-0 py-1 outline-none transition-colors"
                    autoFocus
                  />
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="email@example.com"
                    className="w-full bg-transparent border-0 border-b border-border-subtle focus:border-foreground text-modal-micro text-muted-foreground px-0 py-1 outline-none transition-colors"
                  />
                  <div className="flex justify-end gap-1 pt-1">
                    <button
                      onClick={handleAddParticipant}
                      disabled={!newName.trim()}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                    >
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={16}
                        strokeWidth={1.5}
                      />
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setNewName("");
                        setNewEmail("");
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={16}
                        strokeWidth={1.5}
                      />
                    </button>
                  </div>
                </motion.div>
              )}

              {participants.length === 0 && !isAdding && (
                <div className="py-4 text-center text-modal-micro text-muted-foreground">
                  No {participantLabel.toLowerCase()} yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Content */}
      <div className="flex flex-col gap-5">
        {/* Subject / Meeting Name */}
        <div className="space-y-1.5">
          <label className="block text-modal-label font-medium text-muted-foreground uppercase tracking-wider">
            {isEmail ? "Subject" : "Meeting Name"}
          </label>
          <Input
            value={isEmail ? action.subject : action.meetingName}
            onChange={(e) =>
              onUpdateDraft(
                isEmail
                  ? { subject: e.target.value }
                  : { meetingName: e.target.value },
              )
            }
            placeholder={isEmail ? "Enter subject" : "Enter meeting name"}
            className="h-9 text-modal-ui bg-muted/30 border-0 focus:bg-muted/50 px-3"
          />
        </div>

        {/* Message / Description */}
        <div className="flex-1 flex flex-col min-h-0 space-y-1.5">
          <label className="block text-modal-label font-medium text-muted-foreground uppercase tracking-wider">
            {isEmail ? "Message" : "Description"}
          </label>
          <Textarea
            value={isEmail ? action.message : action.description}
            onChange={(e) =>
              onUpdateDraft(
                isEmail
                  ? { message: e.target.value }
                  : { description: e.target.value },
              )
            }
            placeholder={
              isEmail ? "Enter email message" : "Enter meeting description"
            }
            className="flex-1 min-h-[200px] text-modal-ui bg-muted/30 border-0 focus:bg-muted/50 resize-none px-3 py-2.5"
          />
        </div>
      </div>
    </div>
  );
}
