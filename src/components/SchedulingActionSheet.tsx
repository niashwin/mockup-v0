import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CalendarDays,
  Users,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Mail,
  Link2,
  Copy,
  Send,
  Building2,
  User,
  Laptop,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { useScheduling } from "./SchedulingProvider";
import {
  AttentionItem,
  TimeSlot,
  MeetingType,
  MeetingFormat,
  MeetingMode,
  SchedulingContext,
} from "../types";
import {
  generateTimeSlots,
  detectMeetingType,
  generateSchedulingEmail,
  formatTimeSlot,
  getDurationOptions,
} from "../utils/SchedulingUtils";
import { toast } from "sonner";

interface SchedulingActionSheetProps {
  open: boolean;
  onClose: () => void;
  item: AttentionItem | null;
}

type SchedulingStep =
  | "type"
  | "availability"
  | "communication"
  | "confirmation";

export const SchedulingActionSheet: React.FC<SchedulingActionSheetProps> = ({
  open,
  onClose,
  item,
}) => {
  const { isOnboarded, preferences } = useScheduling();
  const [step, setStep] = useState<SchedulingStep>("type");
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [meetingType, setMeetingType] = useState<MeetingType>("one-on-one");
  const [meetingFormat, setMeetingFormat] = useState<MeetingFormat>("virtual");
  const [meetingMode, setMeetingMode] = useState<MeetingMode>("internal");
  const [duration, setDuration] = useState(30);
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [useSchedulingLink, setUseSchedulingLink] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");

  // Reset state when sheet opens/closes or item changes
  useEffect(() => {
    if (open && item) {
      // Auto-detect meeting type from item
      const detected = detectMeetingType(item);
      setMeetingType(detected.type);
      setMeetingFormat(detected.format);
      setMeetingMode(detected.mode);

      // Pre-fill recipient info from item
      if (item.itemType === "relationship") {
        setRecipientName(item.contactName || "");
        if ("contactCompany" in item) {
          setSubject(
            `Meeting with ${item.contactName} from ${item.contactCompany}`,
          );
        } else {
          setSubject(`Meeting with ${item.contactName}`);
        }
      } else {
        setRecipientName("");
        setSubject(item.title || "Meeting Request");
      }

      setStep("type");
      setSelectedSlots([]);
      setUseSchedulingLink(
        preferences.communicationStyle.preferSchedulingLinks,
      );
      setDuration(30);
      setRecipientEmail("");
      setLocation("");
    }
  }, [open, item, preferences.communicationStyle.preferSchedulingLinks]);

  // Generate available slots based on preferences
  const availableSlots = useMemo(() => {
    if (!isOnboarded) return [];
    return generateTimeSlots(preferences, duration, 14); // 2 weeks ahead
  }, [isOnboarded, preferences, duration]);

  // Top slots for quick selection
  const topSlots = useMemo(() => {
    return availableSlots.slice(0, 6);
  }, [availableSlots]);

  // Generate email draft when entering communication step
  useEffect(() => {
    if (step === "communication" && item) {
      const context: SchedulingContext = {
        item,
        recipient: {
          name: recipientName,
          email: recipientEmail,
          company:
            item.itemType === "relationship" ? item.contactCompany : undefined,
        },
        subject,
        meetingType,
        format: meetingFormat,
        mode: meetingMode,
        duration,
        location,
      };

      const draft = generateSchedulingEmail(
        context,
        preferences,
        selectedSlots,
      );
      setEmailDraft(draft);
    }
  }, [
    step,
    item,
    recipientName,
    recipientEmail,
    subject,
    meetingType,
    meetingFormat,
    meetingMode,
    duration,
    location,
    preferences,
    selectedSlots,
  ]);

  const toggleSlot = (slot: TimeSlot) => {
    setSelectedSlots((prev) => {
      const exists = prev.find((s) => s.id === slot.id);
      if (exists) {
        return prev.filter((s) => s.id !== slot.id);
      }
      // Max 3 slots
      if (prev.length >= 3) {
        return [...prev.slice(1), slot];
      }
      return [...prev, slot];
    });
  };

  const handleNext = () => {
    switch (step) {
      case "type":
        setStep("availability");
        break;
      case "availability":
        setStep("communication");
        break;
      case "communication":
        setStep("confirmation");
        break;
      case "confirmation":
        handleSend();
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case "availability":
        setStep("type");
        break;
      case "communication":
        setStep("availability");
        break;
      case "confirmation":
        setStep("communication");
        break;
    }
  };

  const handleSend = async () => {
    setIsLoading(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast.success("Meeting request sent!", {
      description: `Scheduling email sent to ${recipientName || "recipient"}.`,
    });
    onClose();
  };

  const copySchedulingLink = () => {
    if (preferences.communicationStyle.schedulingLinkUrl) {
      navigator.clipboard.writeText(
        preferences.communicationStyle.schedulingLinkUrl,
      );
      toast.success("Scheduling link copied to clipboard");
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "type":
        return "Meeting Type";
      case "availability":
        return "Select Time Slots";
      case "communication":
        return "Communication Method";
      case "confirmation":
        return "Review & Send";
    }
  };

  const getStepNumber = () => {
    switch (step) {
      case "type":
        return 1;
      case "availability":
        return 2;
      case "communication":
        return 3;
      case "confirmation":
        return 4;
    }
  };

  const canProceed = () => {
    switch (step) {
      case "type":
        return true;
      case "availability":
        return selectedSlots.length > 0 || useSchedulingLink;
      case "communication":
        return emailDraft.length > 0 || useSchedulingLink;
      case "confirmation":
        return true;
    }
  };

  if (!item) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col bg-card dark:bg-neutral-950"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-[7px] bg-accent/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Schedule Meeting
              </h2>
              <p className="text-xs text-muted-foreground">
                Step {getStepNumber()} of 4 · {getStepTitle()}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-muted dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${(getStepNumber() / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Context Banner */}
          <div className="mb-6 p-3 rounded-[7px] bg-background dark:bg-neutral-900 border border-border">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              For
            </p>
            <p className="text-sm font-medium text-foreground line-clamp-2">
              {item.title}
            </p>
            {item.itemType === "relationship" && (
              <p className="text-xs text-muted-foreground mt-1">
                {item.contactName}
                {"contactCompany" in item &&
                  item.contactCompany &&
                  ` · ${item.contactCompany}`}
              </p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Meeting Type */}
            {step === "type" && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Meeting Mode */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase mb-3">
                    Meeting Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        value: "internal",
                        label: "Internal",
                        icon: Building2,
                        desc: "Team members",
                      },
                      {
                        value: "external",
                        label: "External",
                        icon: Users,
                        desc: "Outside contacts",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setMeetingMode(option.value as MeetingMode)
                        }
                        className={`flex flex-col items-center p-4 rounded-[7px] border-2 transition-all ${
                          meetingMode === option.value
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-border"
                        }`}
                      >
                        <option.icon
                          className={`w-5 h-5 mb-2 ${
                            meetingMode === option.value
                              ? "text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            meetingMode === option.value
                              ? "text-accent"
                              : "text-muted-foreground"
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {option.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase mb-3">
                    Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "virtual", label: "Virtual", icon: Video },
                      { value: "in-person", label: "In-Person", icon: MapPin },
                      { value: "hybrid", label: "Hybrid", icon: Laptop },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          setMeetingFormat(option.value as MeetingFormat)
                        }
                        className={`flex flex-col items-center p-3 rounded-[7px] border-2 transition-all ${
                          meetingFormat === option.value
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-border"
                        }`}
                      >
                        <option.icon
                          className={`w-4 h-4 mb-1.5 ${
                            meetingFormat === option.value
                              ? "text-accent"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            meetingFormat === option.value
                              ? "text-accent"
                              : "text-muted-foreground"
                          }`}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase mb-3">
                    Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {getDurationOptions()
                      .slice(0, 6)
                      .map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDuration(option.value)}
                          className={`p-2.5 rounded-[7px] border-2 text-sm font-medium transition-all ${
                            duration === option.value
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border text-muted-foreground hover:border-border"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Recipient */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase mb-2">
                    Recipient
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Name"
                    className="w-full p-2.5 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm mb-2"
                  />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="w-full p-2.5 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Availability */}
            {step === "availability" && (
              <motion.div
                key="availability"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Select up to 3 time slots to offer. Sentra suggests your
                    best options.
                  </p>
                </div>

                {/* Suggested Slots */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-muted-foreground uppercase">
                    Suggested Times
                  </label>
                  {topSlots.map((slot) => {
                    const isSelected = selectedSlots.some(
                      (s) => s.id === slot.id,
                    );
                    return (
                      <button
                        key={slot.id}
                        onClick={() => toggleSlot(slot)}
                        className={`w-full flex items-center gap-3 p-3 rounded-[7px] border-2 transition-all text-left ${
                          isSelected
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-border"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-accent bg-accent"
                              : "border-border"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${isSelected ? "text-accent" : "text-foreground"}`}
                          >
                            {formatTimeSlot(slot)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {duration} min · Score: {slot.score}/100
                          </p>
                        </div>
                        {slot.score >= 70 && (
                          <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                            Best
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedSlots.length > 0 && (
                  <div className="p-3 rounded-[7px] bg-accent/5 border border-accent/20">
                    <p className="text-xs text-accent">
                      {selectedSlots.length} time
                      {selectedSlots.length !== 1 ? "s" : ""} selected
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Communication */}
            {step === "communication" && (
              <motion.div
                key="communication"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Method Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setUseSchedulingLink(false)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[7px] border-2 transition-all ${
                      !useSchedulingLink
                        ? "border-accent bg-accent/10"
                        : "border-border"
                    }`}
                  >
                    <Mail
                      className={`w-4 h-4 ${!useSchedulingLink ? "text-accent" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-sm font-medium ${!useSchedulingLink ? "text-accent" : "text-muted-foreground"}`}
                    >
                      Email
                    </span>
                  </button>
                  <button
                    onClick={() => setUseSchedulingLink(true)}
                    disabled={!preferences.communicationStyle.schedulingLinkUrl}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[7px] border-2 transition-all ${
                      useSchedulingLink
                        ? "border-accent bg-accent/10"
                        : "border-border"
                    } ${!preferences.communicationStyle.schedulingLinkUrl ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <Link2
                      className={`w-4 h-4 ${useSchedulingLink ? "text-accent" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-sm font-medium ${useSchedulingLink ? "text-accent" : "text-muted-foreground"}`}
                    >
                      Scheduling Link
                    </span>
                  </button>
                </div>

                {useSchedulingLink ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-[7px] bg-background dark:bg-neutral-900 border border-border">
                      <p className="text-sm text-muted-foreground mb-3">
                        Share your scheduling link with{" "}
                        {recipientName || "the recipient"}:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={
                            preferences.communicationStyle.schedulingLinkUrl ||
                            ""
                          }
                          readOnly
                          className="flex-1 p-2 bg-card dark:bg-neutral-800 border border-border rounded-[7px] text-sm"
                        />
                        <button
                          onClick={copySchedulingLink}
                          className="p-2 bg-accent hover:bg-accent/90 text-white rounded-[7px] transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Meeting subject"
                        className="w-full p-2.5 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground uppercase mb-2">
                        Message
                      </label>
                      <textarea
                        value={emailDraft}
                        onChange={(e) => setEmailDraft(e.target.value)}
                        rows={10}
                        className="w-full p-3 bg-card dark:bg-neutral-900 border border-border rounded-[7px] text-sm resize-none"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Confirmation */}
            {step === "confirmation" && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Ready to Send
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Review your meeting request before sending.
                  </p>
                </div>

                {/* Summary */}
                <div className="space-y-3">
                  <div className="p-4 rounded-[7px] border border-border bg-card dark:bg-neutral-900">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Recipient
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {recipientName || "Not specified"}
                      {recipientEmail && ` (${recipientEmail})`}
                    </p>
                  </div>

                  <div className="p-4 rounded-[7px] border border-border bg-card dark:bg-neutral-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Time Options
                      </span>
                    </div>
                    {useSchedulingLink ? (
                      <p className="text-sm text-muted-foreground">
                        Using scheduling link
                      </p>
                    ) : (
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedSlots.map((slot) => (
                          <li key={slot.id}>• {formatTimeSlot(slot)}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="p-4 rounded-[7px] border border-border bg-card dark:bg-neutral-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Video className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        Format
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meetingFormat.charAt(0).toUpperCase() +
                        meetingFormat.slice(1)}{" "}
                      · {duration} min · {meetingMode}
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {!useSchedulingLink && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-2">
                      Message Preview
                    </label>
                    <div className="p-4 rounded-[7px] bg-background dark:bg-neutral-900 border border-border max-h-40 overflow-y-auto">
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                        {emailDraft}
                      </pre>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-background dark:bg-neutral-900">
          {step !== "type" ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent/90 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-[7px] text-sm font-medium transition-colors"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Sending...</span>
              </>
            ) : step === "confirmation" ? (
              <>
                <Send className="w-4 h-4" />
                <span>Send Request</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SchedulingActionSheet;
