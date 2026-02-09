import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Clock,
  Paperclip,
  Link2,
  Bold,
  List,
} from "lucide-react";
import { AttentionItem } from "../types";

interface EmailComposeProps {
  isOpen: boolean;
  onClose: () => void;
  item?: AttentionItem | null;
  prefillTo?: string;
  prefillSubject?: string;
  prefillBody?: string;
}

// Get suggested recipients based on item context
function getSuggestedRecipients(
  item: AttentionItem | null | undefined,
): string[] {
  if (!item) return [];

  const recipients: string[] = [];

  // For relationship items, add the contact first
  if (item.itemType === "relationship") {
    const contactEmail =
      item.contactName?.toLowerCase().replace(/\s+/g, ".") +
      "@" +
      (item.contactCompany?.toLowerCase().replace(/\s+/g, "") || "company") +
      ".com";
    recipients.push(`${item.contactName} <${contactEmail}>`);
  }

  // Add collaborators as potential recipients
  if (item.collaborators) {
    item.collaborators.forEach((collab) => {
      const name = collab.replace(/\s*\(.*\)/, "").trim();
      const emailName = name.toLowerCase().replace(/\s+/g, ".");
      recipients.push(`${name} <${emailName}@company.com>`);
    });
  }

  return recipients;
}

// Get natural subject line - written as if from the user
function getSuggestedSubject(item: AttentionItem | null | undefined): string {
  if (!item) return "";

  switch (item.itemType) {
    case "relationship":
      if (
        item.title.includes("follow-up") ||
        item.title.includes("asked for")
      ) {
        return "Following up on our conversation";
      }
      if (item.title.includes("check-in") || item.title.includes("overdue")) {
        return "Quick check-in";
      }
      if (
        item.title.includes("announced") ||
        item.title.includes("initiative")
      ) {
        return "Congrats on the news!";
      }
      return "Wanted to connect";

    case "commitment":
      if (item.title.includes("review") || item.title.includes("approval")) {
        return "Update on the review";
      }
      if (item.title.includes("hiring") || item.title.includes("plan")) {
        return "Hiring plan update";
      }
      return "Quick update";

    case "alert":
      if (item.title.includes("latency") || item.title.includes("incident")) {
        return "Status update on the incident";
      }
      if (
        item.title.includes("misaligned") ||
        item.title.includes("alignment")
      ) {
        return "Syncing on next steps";
      }
      return "Following up on this";

    case "meeting":
      return "Re: " + item.title;

    default:
      return "Quick note";
  }
}

export const EmailCompose: React.FC<EmailComposeProps> = ({
  isOpen,
  onClose,
  item,
  prefillTo,
  prefillSubject,
  prefillBody,
}) => {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  // Pre-fill fields when item changes
  useEffect(() => {
    if (isOpen) {
      const recipients = getSuggestedRecipients(item);
      setTo(prefillTo || (recipients.length > 0 ? recipients[0] : ""));
      setSubject(prefillSubject || getSuggestedSubject(item));
      setBody(prefillBody || "");
      setShowCcBcc(false);
      setIsMinimized(false);
      setIsDrafting(false);
      setShowSchedule(false);
    }
  }, [isOpen, item, prefillTo, prefillSubject, prefillBody]);

  // Handle Sentra draft
  const handleSentraDraft = () => {
    setIsDrafting(true);

    // Simulate typing effect
    const draftText = generateDraftEmail(item);
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex <= draftText.length) {
        setBody(draftText.substring(0, currentIndex));
        currentIndex += 3;
      } else {
        clearInterval(typeInterval);
        setIsDrafting(false);
      }
    }, 20);
  };

  // Get the primary recipient's first name from the "to" field or item context
  function getRecipientFirstName(): string | null {
    // Try to extract from the "to" field
    if (to) {
      const match = to.match(/^([A-Za-z]+)/);
      if (match) return match[1];
    }

    // Fall back to item context
    if (!item) return null;

    if (item.itemType === "relationship" && item.contactName) {
      return item.contactName.split(" ")[0];
    }

    // Check collaborators for a name
    if (item.collaborators && item.collaborators.length > 0) {
      const firstCollab = item.collaborators[0];
      const name = firstCollab.replace(/\s*\(.*\)/, "").trim();
      return name.split(" ")[0];
    }

    return null;
  }

  // Generate draft based on context - written as a real email to the recipient
  function generateDraftEmail(item: AttentionItem | null | undefined): string {
    if (!item) return "";

    const recipientName = getRecipientFirstName();
    const greeting = recipientName ? `Hi ${recipientName},` : "Hi,";

    switch (item.itemType) {
      case "relationship":
        if (
          item.title.includes("follow-up") ||
          item.title.includes("asked for")
        ) {
          return `${greeting}

Apologies for the delay—wanted to make sure I had everything together before getting back to you.

${item.suggestedAction ? `Here's what I have for you: ` : ""}

Let me know if you have any questions, or if it would be easier to hop on a quick call.

Best,`;
        }
        if (
          item.title.includes("announced") ||
          item.title.includes("initiative")
        ) {
          return `${greeting}

Just saw the news about ${item.contactCompany}'s announcement—congratulations! That sounds like a big initiative.

${item.recentContext ? `I remember we talked about ${item.recentContext.toLowerCase()}—this seems like it could be related. ` : ""}Would love to hear more about what you're working on if you have time for a quick catch-up.

Best,`;
        }
        return `${greeting}

Hope you're doing well! It's been a little while since we connected, and I wanted to check in.

${item.recentContext ? `Last time we spoke, we were discussing ${item.recentContext.toLowerCase()}. How has that been going?` : "How have things been on your end?"}

Would be great to catch up if you have time this week or next.

Best,`;

      case "commitment":
        // Check for specific contexts to make it more personal
        if (
          item.title.toLowerCase().includes("hiring plan") ||
          item.title.toLowerCase().includes("cto")
        ) {
          return `${greeting}

Just finished reviewing the hiring plan—wanted to get this to you before end of day as promised.

Here's where we landed:

[Key highlights to add]

Let me know if you need anything else before the board meeting.

Best,`;
        }
        if (
          item.title.toLowerCase().includes("waiting") ||
          item.title.toLowerCase().includes("approval")
        ) {
          return `${greeting}

Apologies for the delay on this—I've reviewed everything and we're good to go.

[Your approval/feedback here]

Let me know if you have any questions.

Best,`;
        }
        if (
          item.title.toLowerCase().includes("retrospective") ||
          item.title.toLowerCase().includes("retro")
        ) {
          return `${greeting}

Here's the Q1 retrospective for the team. Tried to keep it actionable.

[Key takeaways to add]

Let me know if there's anything you'd like me to expand on before the planning meeting.

Best,`;
        }
        return `${greeting}

Quick update on this—${item.context ? item.context.toLowerCase() : "wanted to keep you in the loop"}.

Let me know if you need anything else from my end.

Best,`;

      case "alert":
        if (
          item.title.toLowerCase().includes("misalign") ||
          item.title.toLowerCase().includes("alignment")
        ) {
          return `${greeting}

Wanted to get ahead of this before our next sync. I think we're close to alignment—here's my take on where we should land:

[Your proposed resolution]

Happy to discuss if you see it differently. Would be good to get this resolved this week.

Best,`;
        }
        if (
          item.title.toLowerCase().includes("latency") ||
          item.title.toLowerCase().includes("incident")
        ) {
          return `${greeting}

Quick update on the situation—here's where we are:

• What happened: ${item.description || "[Brief summary]"}
• Current status: [Update]
• Next steps: [What we're doing]

I'll keep you posted as we make progress. Let me know if you have questions.

Best,`;
        }
        if (
          item.title.toLowerCase().includes("budget") ||
          item.title.toLowerCase().includes("spend")
        ) {
          return `${greeting}

Flagging this for visibility—we're running over on cloud spend and I wanted to loop you in before we hit the approval threshold.

Here's what I'm thinking for next steps:

[Your proposed action]

Let me know if you want to sync on this.

Best,`;
        }
        return `${greeting}

Wanted to share a quick update on this and get your thoughts.

${item.description || "[Details]"}

What do you think makes sense for next steps?

Best,`;

      default:
        return `${greeting}

Wanted to follow up on this—let me know your thoughts.

Best,`;
    }
  }

  const handleSend = () => {
    console.log("Sending email:", { to, cc, bcc, subject, body });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Email Compose Window - Centered and larger */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-3xl bg-card dark:bg-neutral-900 rounded-2xl shadow-2xl border border-border overflow-hidden ${isMinimized ? "h-14" : ""}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-medium text-foreground">New Message</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              >
                {isMinimized ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Email Fields */}
              <div className="px-6 py-2 border-b border-border/50">
                {/* To Field */}
                <div className="flex items-center gap-4 py-3 border-b border-border/30">
                  <span className="text-sm text-muted-foreground w-14">To</span>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipients"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                  />
                  <button
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${showCcBcc ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {/* CC/BCC Fields (expandable) */}
                <AnimatePresence>
                  {showCcBcc && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-4 py-3 border-b border-border/30">
                        <span className="text-sm text-muted-foreground w-14">
                          Cc
                        </span>
                        <input
                          type="text"
                          value={cc}
                          onChange={(e) => setCc(e.target.value)}
                          placeholder="Carbon copy"
                          className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-4 py-3 border-b border-border/30">
                        <span className="text-sm text-muted-foreground w-14">
                          Bcc
                        </span>
                        <input
                          type="text"
                          value={bcc}
                          onChange={(e) => setBcc(e.target.value)}
                          placeholder="Blind carbon copy"
                          className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subject Field */}
                <div className="flex items-center gap-4 py-3">
                  <span className="text-sm text-muted-foreground w-14">
                    Subject
                  </span>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none"
                  />
                </div>
              </div>

              {/* Email Body */}
              <div className="px-6 py-5 min-h-[320px]">
                {/* Tips - show when body is empty */}
                {!body && !isDrafting && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">
                      Tip: Click{" "}
                      <span className="text-accent font-semibold">
                        Draft with Sentra
                      </span>{" "}
                      to have it written for you contextually
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your draft will be saved here until you send it
                    </p>
                  </div>
                )}

                {/* Drafting indicator */}
                {isDrafting && (
                  <div className="flex items-center gap-2 text-sm text-accent mb-4">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Sentra is drafting...</span>
                  </div>
                )}

                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="..."
                  className="w-full h-64 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Footer Toolbar */}
              <div className="px-6 py-4 border-t border-border">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  {/* Left Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleSend}
                      className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-[7px] transition-colors"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => setShowSchedule(!showSchedule)}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-[7px] transition-colors"
                    >
                      Send later
                    </button>
                  </div>

                  {/* Center - Draft with Sentra (prominent) */}
                  <button
                    onClick={handleSentraDraft}
                    disabled={isDrafting}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[7px] shadow-md transition-all disabled:opacity-50 bg-accent hover:bg-accent/90 text-white"
                  >
                    <Sparkles size={16} className="text-white/80" />
                    Draft with Sentra
                  </button>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-[7px] transition-colors"
                      title="Bold"
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-[7px] transition-colors"
                      title="List"
                    >
                      <List size={16} />
                    </button>
                    <button
                      className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-[7px] transition-colors"
                      title="Link"
                    >
                      <Link2 size={16} />
                    </button>
                    <button
                      className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-[7px] transition-colors"
                      title="Attach"
                    >
                      <Paperclip size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Schedule Picker (hidden by default) */}
              <AnimatePresence>
                {showSchedule && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border px-6 py-4 bg-muted/50"
                  >
                    <p className="text-xs text-muted-foreground mb-3">
                      Schedule send
                    </p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-foreground rounded-[7px] transition-colors">
                        Tomorrow 8 AM
                      </button>
                      <button className="px-4 py-2 text-sm bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-foreground rounded-[7px] transition-colors">
                        Monday 9 AM
                      </button>
                      <button className="px-4 py-2 text-sm bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-foreground rounded-[7px] transition-colors flex items-center gap-2">
                        <Clock size={14} />
                        Pick date & time
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmailCompose;
