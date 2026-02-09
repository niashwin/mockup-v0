import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  Briefcase,
} from "lucide-react";

interface PersonDetailPanelProps {
  personName: string | null;
  onClose: () => void;
}

// Mock person data - you can expand this later
const getPersonDetails = (name: string) => {
  const people: Record<string, any> = {
    "Sarah Chen": {
      name: "Sarah Chen",
      role: "Product Lead",
      email: "sarah.chen@sentra.io",
      avatar: "SC",
      color: "from-blue-500 to-purple-500",
      recentActivity: [
        { type: "meeting", title: "Product Sync", date: "Today at 9:00 AM" },
        { type: "document", title: "Updated Q3 Roadmap", date: "Yesterday" },
        {
          type: "commitment",
          title: "Review mobile app designs",
          date: "2 days ago",
        },
      ],
      upcomingCommitments: [
        { title: "Complete user research analysis", dueDate: "Feb 5" },
        { title: "Present to leadership team", dueDate: "Feb 8" },
      ],
      stats: {
        meetingsThisWeek: 12,
        activeCommitments: 5,
        reportsContributed: 8,
      },
    },
    "Mike Johnson": {
      name: "Mike Johnson",
      role: "Engineering Lead",
      email: "mike.johnson@sentra.io",
      avatar: "MJ",
      color: "from-emerald-500 to-teal-500",
      recentActivity: [
        {
          type: "meeting",
          title: "Engineering Standup",
          date: "Today at 10:00 AM",
        },
        {
          type: "document",
          title: "API Documentation Update",
          date: "Yesterday",
        },
      ],
      upcomingCommitments: [
        { title: "Code review for mobile sync", dueDate: "Feb 6" },
        { title: "Infrastructure planning", dueDate: "Feb 9" },
      ],
      stats: {
        meetingsThisWeek: 8,
        activeCommitments: 7,
        reportsContributed: 5,
      },
    },
    "Emma Davis": {
      name: "Emma Davis",
      role: "Design Lead",
      email: "emma.davis@sentra.io",
      avatar: "ED",
      color: "from-fuchsia-500 to-pink-500",
      recentActivity: [
        { type: "meeting", title: "Design Review", date: "Today at 11:00 AM" },
        {
          type: "document",
          title: "Mobile Design System v2",
          date: "Yesterday",
        },
      ],
      upcomingCommitments: [
        { title: "Finalize component library", dueDate: "Feb 7" },
      ],
      stats: {
        meetingsThisWeek: 10,
        activeCommitments: 4,
        reportsContributed: 6,
      },
    },
    "Alex Rivera": {
      name: "Alex Rivera",
      role: "Backend Engineer",
      email: "alex.rivera@sentra.io",
      avatar: "AR",
      color: "from-amber-500 to-orange-500",
      recentActivity: [
        { type: "meeting", title: "API Planning", date: "Today at 2:00 PM" },
        {
          type: "document",
          title: "Database Schema Updates",
          date: "2 days ago",
        },
      ],
      upcomingCommitments: [
        { title: "Deploy API v2 to staging", dueDate: "Feb 4" },
        { title: "Performance optimization", dueDate: "Feb 10" },
      ],
      stats: {
        meetingsThisWeek: 6,
        activeCommitments: 6,
        reportsContributed: 4,
      },
    },
  };

  // Return person or default
  return (
    people[name] || {
      name: name,
      role: "Team Member",
      email: `${name.toLowerCase().replace(" ", ".")}@sentra.io`,
      avatar: name
        .split(" ")
        .map((n) => n[0])
        .join(""),
      color: "from-neutral-500 to-neutral-600",
      recentActivity: [
        { type: "meeting", title: "Team Meeting", date: "This week" },
      ],
      upcomingCommitments: [],
      stats: {
        meetingsThisWeek: 5,
        activeCommitments: 3,
        reportsContributed: 2,
      },
    }
  );
};

export const PersonDetailPanel: React.FC<PersonDetailPanelProps> = ({
  personName,
  onClose,
}) => {
  if (!personName) return null;

  const person = getPersonDetails(personName);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return Calendar;
      case "document":
        return FileText;
      case "commitment":
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  return (
    <AnimatePresence>
      {personName && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-card/95 dark:bg-neutral-900/95 backdrop-blur-3xl border-l border-white/60 dark:border-white/10 shadow-2xl z-50 flex flex-col"
        >
          {/* Header */}
          <div className="shrink-0 p-6 border-b border-border relative">
            {/* Decorative gradient */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${person.color} opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none`}
            />

            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-0 right-0 w-9 h-9 rounded-[7px] bg-secondary hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shadow-sm hover:shadow"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${person.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                >
                  {person.avatar}
                </div>
                <div className="flex-1 pt-1">
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    {person.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">{person.role}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-primary hover:bg-neutral-800 text-primary-foreground rounded-[7px] text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Mail size={14} />
                  Email
                </button>
                <button className="flex-1 px-3 py-2 bg-secondary hover:bg-neutral-200 dark:hover:bg-neutral-700 text-foreground rounded-[7px] text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={14} />
                  Message
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-6">
              {/* Stats */}
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Activity Overview
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-background dark:bg-neutral-800/50 rounded-[7px] border border-border text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {person.stats.meetingsThisWeek}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Meetings
                    </div>
                  </div>
                  <div className="p-3 bg-background dark:bg-neutral-800/50 rounded-[7px] border border-border text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {person.stats.activeCommitments}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Active Tasks
                    </div>
                  </div>
                  <div className="p-3 bg-background dark:bg-neutral-800/50 rounded-[7px] border border-border text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {person.stats.reportsContributed}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Reports
                    </div>
                  </div>
                </div>
              </section>

              {/* Upcoming Commitments */}
              {person.upcomingCommitments.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Upcoming Commitments
                  </h3>
                  <div className="space-y-2">
                    {person.upcomingCommitments.map(
                      (commitment: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3 bg-background dark:bg-neutral-800/50 rounded-[7px] border border-border"
                        >
                          <p className="text-sm font-medium text-foreground mb-1">
                            {commitment.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock size={10} />
                            <span>Due {commitment.dueDate}</span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </section>
              )}

              {/* Recent Activity */}
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {person.recentActivity.map((activity: any, idx: number) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[7px] bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Contact Info */}
              <section>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  Contact Information
                </h3>
                <div className="p-4 bg-background dark:bg-neutral-800/50 rounded-[7px] border border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-muted-foreground" />
                    <a
                      href={`mailto:${person.email}`}
                      className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {person.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase size={14} className="text-muted-foreground" />
                    <span className="text-foreground">{person.role}</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
