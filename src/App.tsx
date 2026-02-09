import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import {
  Settings,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Bell,
  Command,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  GitCommit,
  Hash,
  ArrowUpRight,
  Calendar,
  CalendarDays,
  Inbox,
  BarChart2,
  Users,
  Sparkles,
  ArrowLeft,
  Mic,
  Square,
  Trash2,
  Lock,
  Unlock,
  Brain,
  X,
  Plus,
  List,
  Grid,
  Filter,
  MoreHorizontal,
  CheckSquare,
  ArrowUp,
  MapPin,
  Video,
  ExternalLink,
  Share2,
  Sun,
  Moon,
  Monitor,
  UsersRound,
  Mail,
  Archive,
  Layout,
} from "lucide-react";
// PillState removed — app is always full-screen now
import { NowScreen } from "./components/NowScreen";
import { SwimlaneDetailScreen } from "./components/SwimlaneDetailScreen";
import { SwimlanesScreen as NewSwimlanesScreen } from "./components/SwimlanesScreen";
import { PersistentChatBar } from "./components/PersistentChatBar";
import { ChatInterface } from "./components/ChatInterface";
import {
  alerts,
  commitments,
  meetingBriefs,
  memoryMap,
  extendedReports,
  ExtendedReport,
  swimlanesList,
  SwimlaneMeta,
  timelineData,
  TimelineItem,
  relationshipAlerts,
  asyncCommitments,
  contacts,
  companies,
} from "./data";
import { Alert, Commitment, MeetingBrief } from "./types";
import {
  HighlightedContent,
  CommentLayer,
  CommentPanel,
  CommentHighlight,
} from "./components/ReportComments";
import { CrmPage as LegacyCrmPage } from "./components/CrmPage";
import { SchedulingProvider } from "./components/SchedulingProvider";
import { SchedulingSettingsSection } from "./components/SchedulingSettingsSection";
import { MeetingCaptureProvider } from "./components/MeetingCaptureProvider";
// SentraPill removed — no longer needed in full-screen mode
import { MeetingCaptureSummary } from "./components/MeetingCaptureSummary";

// --- Migrated Pages from Reports Project ---
import { MeetingsPage } from "./components/MeetingsPage";
import { CrmPage as NewCrmPage } from "./components/crm";
import { ArchivePage } from "./components/archive";
import { MemoryPage } from "./components/memory";
import { ReadingPane } from "./components/report/reading-pane";
import { RadarReadingPane } from "./components/radar";
import { ReportsSidebar } from "./components/layout/reports-sidebar";
import { CommentPanel as NewCommentPanel } from "./components/comments";
import { SourcesSidebar } from "./components/sources";
import { ReviewActionsModal } from "./components/review-actions";
import { useReportsStore } from "./stores/reports-store";
import { useSettingsStore } from "./stores/settings-store";
import { SettingsPane } from "./components/settings";
import { useMemoryStore } from "./stores/memory-store";
import { useArchiveStore } from "./stores/archive-store";
import { mockReports } from "./data/mock-reports";
import { mockRadarItems } from "./data/mock-radar";

// --- Types ---
type NavTab =
  | "Now"
  | "Reports"
  | "Swimlanes"
  | "Meetings"
  | "CRM"
  | "Archive"
  | "ToDo"
  | "Settings";
type ReportCategory = "Ad Hoc" | "Weekly" | "Radar" | "Team";

interface AppUser {
  id: string;
  name: string;
  title: string;
  email: string;
  avatar: string;
}

interface AppTeam {
  id: string;
  name: string;
  memberIds: string[];
  note?: string;
  membersText?: string;
}

// --- Settings Screen ---

const SettingsScreen = ({
  onSimulateOnboarding,
  users,
  setUsers,
  teams,
  setTeams,
}: {
  onSimulateOnboarding?: () => void;
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  teams: AppTeam[];
  setTeams: React.Dispatch<React.SetStateAction<AppTeam[]>>;
}) => {
  const [activeSection, setActiveSection] = useState("Account");
  const { theme, setTheme } = useTheme();
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamNote, setNewTeamNote] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [teamMemberQuery, setTeamMemberQuery] = useState("");
  const [newTeamMembersText, setNewTeamMembersText] = useState("");
  const integrationIcons: Record<string, React.ReactNode> = {
    Slack: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <rect x="2" y="9" width="6" height="6" rx="2" fill="#36C5F0" />
        <rect x="8" y="2" width="6" height="6" rx="2" fill="#2EB67D" />
        <rect x="16" y="8" width="6" height="6" rx="2" fill="#E01E5A" />
        <rect x="10" y="16" width="6" height="6" rx="2" fill="#ECB22E" />
      </svg>
    ),
    "Google Workspace": (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#E9F1FF" />
        <path
          d="M12 5.5a6.5 6.5 0 1 0 4.6 11.1l-2.4-2.1H12V11h6.2A6.5 6.5 0 0 0 12 5.5z"
          fill="#4285F4"
        />
        <path
          d="M5.7 9.5 8.4 11a4.5 4.5 0 0 1 3.6-2.1c1 0 2 .3 2.7.9l2-2A6.5 6.5 0 0 0 12 5.5c-2.5 0-4.7 1.4-6 3.5z"
          fill="#34A853"
        />
        <path
          d="M6.7 16.2 9 14.5a4.5 4.5 0 0 1-1-2.5H5.2c.1 1.6.7 3 1.5 4.2z"
          fill="#FBBC05"
        />
        <path
          d="M12 18.5c1.6 0 3.1-.6 4.2-1.5l-2.4-2.1c-.5.3-1.1.4-1.8.4-1.7 0-3.1-1.1-3.6-2.6l-2.3 1.7c1 2.3 3.3 4.1 5.9 4.1z"
          fill="#EA4335"
        />
      </svg>
    ),
    Jira: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <path d="M12 2c2.8 0 5 2.2 5 5v2H9V7c0-2.8 2.2-5 3-5z" fill="#2684FF" />
        <path d="M7 9h8v3c0 2.8-2.2 5-5 5s-5-2.2-5-5V9z" fill="#0052CC" />
        <path d="M9 17h6v2a3 3 0 0 1-3 3c-1.7 0-3-1.3-3-3v-2z" fill="#4C9AFF" />
      </svg>
    ),
    Linear: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#151515" />
        <path
          d="M7 12a5 5 0 1 1 5 5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 7a5 5 0 0 1 5 5"
          fill="none"
          stroke="#7A7A7A"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    Zoom: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <rect x="3" y="6" width="13" height="12" rx="3" fill="#2D8CFF" />
        <path d="M16 9.5 21 7v10l-5-2.5v-5z" fill="#6FB1FF" />
      </svg>
    ),
    Asana: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <circle cx="8" cy="12" r="4.2" fill="#F06A6A" />
        <circle cx="16" cy="12" r="4.2" fill="#F06A6A" />
        <circle cx="12" cy="7.2" r="4.2" fill="#F06A6A" />
      </svg>
    ),
    GitHub: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#111827" />
        <path
          d="M9 18c0-1.2.9-2.1 2.1-2.1h1.8c1.2 0 2.1.9 2.1 2.1"
          fill="none"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M8 10c.6-1.1 2-2 4-2s3.4.9 4 2"
          fill="none"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="12" r="1" fill="#fff" />
        <circle cx="14.5" cy="12" r="1" fill="#fff" />
      </svg>
    ),
  };

  const sections = [
    { id: "Account", label: "Account", icon: Users },
    { id: "Integrations", label: "Integrations", icon: GitCommit },
    { id: "Privacy", label: "Privacy & Permissions", icon: AlertTriangle }, // reusing icon for now
    { id: "Notifications", label: "Notifications", icon: Bell },
    { id: "Personalization", label: "Personalization", icon: Layout },
    { id: "Scheduling", label: "Scheduling", icon: CalendarDays },
    { id: "Users", label: "Users & Teams", icon: Users },
  ];

  return (
    <div className="flex h-full bg-background relative">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-border p-6 flex flex-col gap-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-3">
          Settings
        </h2>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`text-left px-3 py-2 rounded-[7px] text-sm font-medium transition-colors ${activeSection === section.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-neutral-800/50"}`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-2xl">
          <header className="mb-8 border-b border-border pb-4">
            <h1 className="text-xl font-semibold text-foreground">
              {activeSection}
            </h1>
          </header>

          {activeSection === "Personalization" && (
            <div className="space-y-8">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase mb-4">
                  Appearance
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-[7px] border-2 transition-all ${theme === "light" ? "border-accent bg-accent/10/50 dark:bg-accent/10" : "border-border hover:border-accent"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                      <Sun size={20} />
                    </div>
                    <span
                      className={`text-sm font-medium ${theme === "light" ? "text-accent" : "text-muted-foreground"}`}
                    >
                      Light
                    </span>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-[7px] border-2 transition-all ${theme === "dark" ? "border-accent bg-accent/10/50 dark:bg-accent/10" : "border-border hover:border-accent"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      <Moon size={20} />
                    </div>
                    <span
                      className={`text-sm font-medium ${theme === "dark" ? "text-accent" : "text-muted-foreground"}`}
                    >
                      Dark
                    </span>
                  </button>

                  <button
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center gap-3 p-4 rounded-[7px] border-2 transition-all ${theme === "system" ? "border-accent bg-accent/10/50 dark:bg-accent/10" : "border-border hover:border-accent"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-foreground">
                      <Monitor size={20} />
                    </div>
                    <span
                      className={`text-sm font-medium ${theme === "system" ? "text-accent" : "text-muted-foreground"}`}
                    >
                      System
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "Users" && (
            <div className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Users
                  </h3>
                </div>
                <div className="border border-border rounded-[7px] overflow-hidden bg-card">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-background dark:bg-neutral-800/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Photo</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-2">
                            <input
                              value={user.name}
                              onChange={(e) =>
                                setUsers((prev) =>
                                  prev.map((u) =>
                                    u.id === user.id
                                      ? { ...u, name: e.target.value }
                                      : u,
                                  ),
                                )
                              }
                              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-border"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={user.title}
                              onChange={(e) =>
                                setUsers((prev) =>
                                  prev.map((u) =>
                                    u.id === user.id
                                      ? { ...u, title: e.target.value }
                                      : u,
                                  ),
                                )
                              }
                              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={user.email}
                              onChange={(e) =>
                                setUsers((prev) =>
                                  prev.map((u) =>
                                    u.id === user.id
                                      ? { ...u, email: e.target.value }
                                      : u,
                                  ),
                                )
                              }
                              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() =>
                                setUsers((prev) =>
                                  prev.filter((u) => u.id !== user.id),
                                )
                              }
                              className="text-xs font-semibold text-muted-foreground hover:text-red-600"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-4 py-2 text-xs text-muted-foreground">
                          {users.length} employees
                        </td>
                        <td />
                        <td />
                        <td />
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() =>
                              setUsers((prev) => [
                                ...prev,
                                {
                                  id: `u-${Date.now()}`,
                                  name: "New User",
                                  title: "Team Member",
                                  email: "new.user@sentra.ai",
                                  avatar: `https://i.pravatar.cc/64?u=${Date.now()}`,
                                },
                              ])
                            }
                            className="text-xs font-bold text-accent hover:text-accent/80"
                          >
                            Add User +
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Teams
                  </h3>
                </div>
                <div className="border border-border rounded-[7px] overflow-hidden bg-card">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-background dark:bg-neutral-800/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Members</th>
                        <th className="px-4 py-2">Note</th>
                        <th className="px-4 py-2 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teams.map((team) => (
                        <tr key={team.id}>
                          <td className="px-4 py-2">
                            <input
                              value={team.name}
                              onChange={(e) =>
                                setTeams((prev) =>
                                  prev.map((t) =>
                                    t.id === team.id
                                      ? { ...t, name: e.target.value }
                                      : t,
                                  ),
                                )
                              }
                              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={
                                team.membersText ??
                                team.memberIds
                                  .map(
                                    (id) =>
                                      users.find((u) => u.id === id)?.name,
                                  )
                                  .filter(Boolean)
                                  .join(", ")
                              }
                              onChange={(e) =>
                                setTeams((prev) =>
                                  prev.map((t) =>
                                    t.id === team.id
                                      ? { ...t, membersText: e.target.value }
                                      : t,
                                  ),
                                )
                              }
                              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                              placeholder="Type names, comma separated"
                              list="team-members"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={team.note || ""}
                              onChange={(e) =>
                                setTeams((prev) =>
                                  prev.map((t) =>
                                    t.id === team.id
                                      ? { ...t, note: e.target.value }
                                      : t,
                                  ),
                                )
                              }
                              className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() =>
                                setTeams((prev) =>
                                  prev.filter((t) => t.id !== team.id),
                                )
                              }
                              className="text-xs font-semibold text-muted-foreground hover:text-red-600"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-4 py-2">
                          <input
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                            placeholder="Team name"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={newTeamMembersText}
                            onChange={(e) =>
                              setNewTeamMembersText(e.target.value)
                            }
                            className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                            placeholder="Type names, comma separated"
                            list="team-members"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={newTeamNote}
                            onChange={(e) => setNewTeamNote(e.target.value)}
                            className="w-full rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
                            placeholder="Team note"
                          />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => {
                              if (!newTeamName.trim()) return;
                              const names = newTeamMembersText
                                .split(",")
                                .map((n) => n.trim())
                                .filter(Boolean);
                              const memberIds = names
                                .map(
                                  (name) =>
                                    users.find(
                                      (u) =>
                                        u.name.toLowerCase() ===
                                        name.toLowerCase(),
                                    )?.id,
                                )
                                .filter(Boolean) as string[];
                              setTeams((prev) => [
                                ...prev,
                                {
                                  id: `t-${Date.now()}`,
                                  name: newTeamName.trim(),
                                  memberIds,
                                  membersText: newTeamMembersText,
                                  note: newTeamNote.trim() || undefined,
                                },
                              ]);
                              setNewTeamName("");
                              setNewTeamMembersText("");
                              setNewTeamNote("");
                            }}
                            className="text-xs font-bold text-accent hover:text-accent/80"
                          >
                            Add team +
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <datalist id="team-members">
                    {users.map((user) => (
                      <option key={user.id} value={user.name} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {activeSection === "Account" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase mb-2">
                    Profile
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xl font-bold text-muted-foreground">
                      AL
                    </div>
                    <div>
                      <button className="text-sm font-medium text-accent hover:text-accent/80 border border-accent/30 dark:border-accent/30 bg-accent/10 dark:bg-accent/10 px-3 py-1.5 rounded-md transition-colors">
                        Upload New Photo
                      </button>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        JPG or PNG. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Alex"
                      className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Lewis"
                      className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="alex.lewis@sentra.ai"
                    className="w-full bg-card border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-border"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "Integrations" && (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground mb-6">
                Manage connections to your organization's data sources. Sentra
                uses these to generate intelligence.
              </p>

              {[
                {
                  name: "Slack",
                  status: "connected",
                  description:
                    "Reading public channels and authorized private channels.",
                },
                {
                  name: "Google Workspace",
                  status: "connected",
                  description: "Indexing Calendar and Drive documents.",
                },
                {
                  name: "Jira",
                  status: "connected",
                  description: "Tracking issue status and velocity.",
                },
                {
                  name: "Linear",
                  status: "disconnected",
                  description: "Sync issues and project updates.",
                },
                {
                  name: "Zoom",
                  status: "disconnected",
                  description: "Import transcripts for meeting intelligence.",
                },
                {
                  name: "Asana",
                  status: "disconnected",
                  description: "Task tracking and project updates.",
                },
                {
                  name: "GitHub",
                  status: "disconnected",
                  description: "Link pull requests and engineering activity.",
                },
              ].map((app) => (
                <div
                  key={app.name}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-[7px] shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[7px] bg-card border border-border flex items-center justify-center">
                      {integrationIcons[app.name] ?? app.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">
                        {app.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {app.description}
                      </p>
                    </div>
                  </div>
                  <button
                    className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                      app.status === "connected"
                        ? "bg-secondary text-muted-foreground border border-border"
                        : "bg-accent/10 dark:bg-accent/20 text-accent border border-accent/30 dark:border-accent/30"
                    }`}
                  >
                    {app.status === "connected" ? "Configure" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === "Privacy" && (
            <div className="space-y-8">
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 p-4 rounded-lg flex gap-3">
                <AlertTriangle
                  size={16}
                  className="text-yellow-600 shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Enterprise Policy Active
                  </h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Some settings are managed by your organization
                    administrator.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      PII Redaction
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Automatically redact emails and phone numbers from memory
                      snapshots.
                    </p>
                  </div>
                  <div className="w-10 h-5 bg-accent rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Data Retention
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      How long Sentra stores processed intelligence.
                    </p>
                  </div>
                  <select className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
                    <option>90 Days</option>
                    <option>1 Year</option>
                    <option>Indefinite</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === "Notifications" && (
            <div className="space-y-6">
              {[
                {
                  title: "Critical Alerts",
                  desc: "Immediate notification for high-risk anomalies.",
                  state: true,
                },
                {
                  title: "Meeting Briefs",
                  desc: "Receive a briefing 15 mins before meetings.",
                  state: true,
                },
                {
                  title: "Daily Digest",
                  desc: "Morning summary of yesterday’s memory.",
                  state: true,
                },
                {
                  title: "New Swimlane Activity",
                  desc: "Updates on followed swimlanes.",
                  state: false,
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <div
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors border ${item.state ? "bg-accent border-accent" : "bg-neutral-200 dark:bg-neutral-700 border-border"}`}
                  >
                    <div
                      className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${item.state ? "right-1" : "left-1"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "Personalization" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase mb-3">
                  Theme
                </label>
                <div className="flex gap-4">
                  {["System", "Light", "Dark"].map((theme) => (
                    <button
                      key={theme}
                      className={`px-4 py-2 rounded-md text-sm border transition-all ${theme === "System" ? "border-primary bg-primary text-primary-foreground font-medium" : "border-border text-muted-foreground hover:border-accent"}`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase mb-3">
                  Density
                </label>
                <div className="flex gap-4">
                  <button className="px-4 py-2 rounded-md text-sm border border-primary bg-primary text-primary-foreground font-medium">
                    Compact
                  </button>
                  <button className="px-4 py-2 rounded-md text-sm border border-border text-muted-foreground hover:border-accent">
                    Relaxed
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "Scheduling" && <SchedulingSettingsSection />}
        </div>
      </div>

      <button
        className="absolute bottom-8 right-8 px-4 py-2 bg-primary text-primary-foreground rounded-[7px] shadow-xl ring-1 ring-primary/10 dark:ring-white/20 text-sm font-semibold hover:scale-105 transition-transform"
        onClick={onSimulateOnboarding}
      >
        Simulate Onboarding
      </button>
    </div>
  );
};

// --- Home Screen Components (from previous step) ---

// ViewControls removed — app is always full-screen, no mode switching

const SectionHeader = ({
  title,
  count,
  icon: Icon,
}: {
  title: string;
  count?: number;
  icon?: any;
}) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon size={14} className="text-muted-foreground" />}
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
    {count !== undefined && (
      <span className="text-[10px] font-bold bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </div>
);

// --- Home Screen Components (from previous step) ---
const AlertItem = ({ alert }: { alert: Alert }) => (
  <div className="group p-3 rounded-[7px] border border-border bg-card hover:border-accent transition-colors shadow-sm cursor-pointer">
    <div className="flex items-start gap-3">
      <div
        className={`mt-1 w-2 h-2 rounded-full shrink-0 ${alert.severity === "critical" ? "bg-red-500" : alert.severity === "warning" ? "bg-yellow-500" : "bg-accent/100"}`}
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-foreground truncate pr-2">
            {alert.title}
          </h4>
          <span className="text-[10px] text-muted-foreground font-mono whitespace-nowrap">
            {new Date(alert.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {alert.description}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 bg-background dark:bg-neutral-800 rounded border border-border text-muted-foreground flex items-center gap-1">
            <Hash size={8} /> {alert.source}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CommitmentItem = ({
  commitment,
  onClick,
}: {
  commitment: Commitment;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="group flex items-center gap-3 p-3 rounded-[7px] hover:bg-muted dark:hover:bg-neutral-800/50 transition-colors border border-transparent hover:border-border cursor-pointer"
  >
    <div
      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${commitment.status === "completed" ? "bg-primary border-primary" : "border-border hover:border-accent"}`}
    >
      {commitment.status === "completed" && (
        <CheckCircle2 size={10} className="text-primary-foreground" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p
        className={`text-sm font-medium truncate transition-colors ${commitment.status === "completed" ? "text-muted-foreground line-through" : "text-foreground"}`}
      >
        {commitment.title}
      </p>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
        To: <span className="font-medium">{commitment.assignee}</span> •{" "}
        {commitment.dueDate}
      </p>
    </div>
    {commitment.status === "overdue" && commitment.status !== "completed" && (
      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
        OD
      </span>
    )}
  </div>
);

const MeetingCard = ({ brief }: { brief: MeetingBrief }) => (
  <div className="bg-card border border-border rounded-[7px] p-5 shadow-sm cursor-pointer hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-[7px] bg-accent/10 dark:bg-accent/20 text-accent flex items-center justify-center">
          <Calendar size={16} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Next Meeting
          </h4>
          <p className="text-xs text-muted-foreground font-mono">
            {brief.time}
          </p>
        </div>
      </div>
      <button className="text-muted-foreground hover:text-foreground">
        <ArrowUpRight size={16} />
      </button>
    </div>

    <h3 className="text-lg font-medium text-foreground mb-2">{brief.title}</h3>

    <div className="space-y-3">
      <div className="p-3 bg-background dark:bg-neutral-800/50 rounded-[7px] border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed font-medium mb-1">
          Context
        </p>
        <p className="text-sm text-foreground">{brief.summary}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {brief.attendees.slice(0, 3).map((p) => (
          <span
            key={p}
            className="text-xs px-2 py-1 bg-card dark:bg-neutral-800 border border-border rounded-md text-muted-foreground"
          >
            {p}
          </span>
        ))}
        {brief.attendees.length > 3 && (
          <span className="text-xs px-2 py-1 text-muted-foreground">
            + {brief.attendees.length - 3}
          </span>
        )}
      </div>
    </div>
  </div>
);

const MemoryMap = () => {
  const [activeTab, setActiveTab] = useState<
    "topics" | "decisions" | "changes"
  >("topics");

  const items = memoryMap[activeTab] || [];

  return (
    <div className="bg-card border border-border rounded-[7px] shadow-sm flex flex-col h-full min-h-[300px]">
      <div className="px-5 pt-5 pb-3 border-b border-border flex justify-between items-center">
        <h3 className="text-sm font-semibold text-foreground">Memory Map</h3>
        <div className="flex gap-1 bg-secondary p-1 rounded-[7px]">
          {(["topics", "decisions", "changes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${activeTab === tab ? "bg-card dark:bg-neutral-700 text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-2 overflow-y-auto flex-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3 hover:bg-muted dark:hover:bg-neutral-800/50 rounded-[7px] transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-mono text-muted-foreground">
                {item.timestamp}
              </span>
              <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                {item.source}
              </span>
            </div>
            <p className="text-sm text-foreground font-medium mb-1">
              {item.text}
            </p>
            {item.context && (
              <p className="text-xs text-muted-foreground">{item.context}</p>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No items in this view.
          </div>
        )}
      </div>
    </div>
  );
};

// --- Reports Section Components ---

// Comprehensive report type definitions
const REPORT_TYPES = [
  {
    id: "personal-commitment",
    name: "Personal Commitment Report",
    question: "What did I commit to, and what is pending or overdue?",
    timing: "Daily / Weekly / Monthly",
    category: "Personal",
    notes: "Foundational trust-building report",
  },
  {
    id: "weekly-activity",
    name: "Weekly Personal Activity Summary",
    question: "What happened this week across meetings and work?",
    timing: "Weekly (auto-generated)",
    category: "Personal",
    notes: "Low-risk, high adoption",
  },
  {
    id: "meeting-load",
    name: "Meeting Load Report",
    question: "How many meetings, with whom, and on what topics?",
    timing: "Weekly / Monthly",
    category: "Personal",
    notes: "Useful for burnout / optimization",
  },
  {
    id: "followup-debt",
    name: "Follow-up Debt Report",
    question: "What conversations require follow-up?",
    timing: "Continuous, daily refresh",
    category: "Personal",
    notes: "Strong differentiator to note-takers",
  },
  {
    id: "topic-engagement",
    name: "Topic Engagement Report",
    question: "What topics am I spending time on?",
    timing: "Weekly / Monthly",
    category: "Personal",
    notes: "Evolves into focus analysis",
  },
  {
    id: "relationship-touchpoint",
    name: "Relationship Touchpoint Report",
    question: "Who have I interacted with recently vs not?",
    timing: "Weekly",
    category: "Personal",
    notes: "CRM-light but personal",
  },
  {
    id: "performance-reflection",
    name: "Personal Performance Reflection",
    question: "What patterns are emerging in my work?",
    timing: "Weekly / Monthly",
    category: "Personal",
    notes: "Should be phrased reflectively, not evaluative",
  },
  {
    id: "deep-research",
    name: "Deep Research / Topic Brief",
    question: "What do we know about X from my memory?",
    timing: "On-demand",
    category: "Research",
    notes: "Memory-grounded synthesis",
  },
  {
    id: "meeting-series",
    name: "Meeting Series Report",
    question: "What has happened across recurring meetings?",
    timing: "Weekly / On-demand",
    category: "Team",
    notes: "Extremely high value",
  },
  {
    id: "decision-log",
    name: "Decision Log (Meeting-Derived)",
    question: "What decisions were made, when, and by whom?",
    timing: "Continuous, append-only",
    category: "Team",
    notes: "Be careful with accuracy guarantees",
  },
  {
    id: "action-items",
    name: "Action Item Report",
    question: "What actions emerged across meetings?",
    timing: "Continuous, daily refresh",
    category: "Team",
    notes: "Closely tied to commitment tracker",
  },
  {
    id: "unresolved-topics",
    name: "Unresolved Topics Report",
    question: "What keeps coming up but never gets resolved?",
    timing: "Weekly",
    category: "Team",
    notes: "Early misalignment signal",
  },
  {
    id: "attendance-participation",
    name: "Attendance & Participation Report",
    question: "Who is showing up and contributing?",
    timing: "Weekly / Monthly",
    category: "Team",
    notes: "Sensitive; needs careful framing",
  },
  {
    id: "team-weekly-memory",
    name: "Team Weekly Memory Report",
    question: "What happened across the team this week?",
    timing: "Weekly",
    category: "Team",
    notes: "Admin-initially",
  },
  {
    id: "shared-commitments",
    name: "Shared Commitments Report",
    question: "What has the team committed to collectively?",
    timing: "Continuous, weekly roll-up",
    category: "Team",
    notes: "Forces clarity",
  },
  {
    id: "ownership-responsibility",
    name: "Ownership & Responsibility Report",
    question: "Who owns what, implicitly or explicitly?",
    timing: "Weekly / Monthly",
    category: "Team",
    notes: "Evolves into ownership drift",
  },
  {
    id: "team-focus",
    name: "Team Focus Report",
    question: "What topics dominate team attention?",
    timing: "Weekly / Monthly",
    category: "Team",
    notes: "Useful for founders",
  },
  {
    id: "cross-meeting-consistency",
    name: "Cross-Meeting Consistency Report",
    question: "Are we saying the same thing across meetings?",
    timing: "Weekly / On-demand",
    category: "Team",
    notes: "Very strong differentiator",
  },
  {
    id: "team-checkin-synthesis",
    name: "Team Check-in Synthesis",
    question: "What did team members report this week?",
    timing: "Weekly",
    category: "Team",
    notes: "Derived from check-ins",
  },
  {
    id: "collaboration-graph",
    name: "Collaboration Graph",
    question: "How does information flow in the team?",
    timing: "Monthly / On-demand",
    category: "Team",
    notes: "Often visual, not just text",
  },
  {
    id: "misalignment-radar",
    name: "Misalignment Radar",
    question: "Where do narratives or goals diverge?",
    timing: "Weekly",
    category: "Radar",
    notes: "One of Sentra's signature reports",
  },
  {
    id: "topic-drift",
    name: "Topic Drift Report",
    question: "How has focus shifted over time?",
    timing: "Monthly",
    category: "Radar",
    notes: "Time-aware memory required",
  },
  {
    id: "ownership-drift",
    name: "Ownership Drift Report",
    question: "Where ownership has silently shifted or disappeared",
    timing: "Monthly / Quarterly",
    category: "Radar",
    notes: "Requires longitudinal memory",
  },
  {
    id: "decision-reversal",
    name: "Decision Reversal Report",
    question: "Where decisions were implicitly undone",
    timing: "On-demand",
    category: "Radar",
    notes: "Powerful but sensitive",
  },
  {
    id: "responsibility-overload",
    name: "Responsibility Overload Report",
    question: "Who is overloaded with commitments?",
    timing: "Weekly",
    category: "Radar",
    notes: "Needs careful UX",
  },
  {
    id: "escalation-signal",
    name: "Escalation Signal Report",
    question: "Where issues are bubbling but not addressed",
    timing: "Continuous monitoring",
    category: "Radar",
    notes: "Early warning system",
  },
  {
    id: "organizational-decision-history",
    name: "Organizational Decision History",
    question: "How and why major decisions were made",
    timing: "Continuous, append-only",
    category: "Institutional",
    notes: "Institutional memory",
  },
  {
    id: "project-memory",
    name: "Project Memory Report",
    question: "What actually happened in a project lifecycle?",
    timing: "On-demand / Post-project",
    category: "Institutional",
    notes: "Postmortem-ready",
  },
  {
    id: "root-cause-analysis",
    name: "Root Cause Analysis",
    question: "Why did something fail or succeed?",
    timing: "On-demand",
    category: "Institutional",
    notes: "Derived across many memories",
  },
  {
    id: "cross-team-alignment",
    name: "Cross-Team Alignment Report",
    question: "Are teams aligned on priorities and language?",
    timing: "Monthly / Quarterly",
    category: "Institutional",
    notes: "Exec-facing",
  },
  {
    id: "institutional-knowledge",
    name: "Institutional Knowledge Report",
    question: 'What does the organization "know" about X?',
    timing: "On-demand",
    category: "Institutional",
    notes: "Replaces tribal knowledge",
  },
  {
    id: "onboarding-memory-pack",
    name: "Onboarding Memory Pack",
    question: "What should a new hire know?",
    timing: "On-demand (per hire)",
    category: "Institutional",
    notes: "Extremely compelling use case",
  },
  {
    id: "sales-conversation-synthesis",
    name: "Sales Conversation Synthesis",
    question: "What are customers saying consistently?",
    timing: "Weekly / Monthly",
    category: "Customer",
    notes: "Requires sales meeting ingestion",
  },
  {
    id: "objection-theme",
    name: "Objection & Theme Report",
    question: "What objections recur across calls?",
    timing: "Weekly / Monthly",
    category: "Customer",
    notes: "High ROI",
  },
  {
    id: "deal-decision-history",
    name: "Deal Decision History",
    question: "How deals progressed or stalled",
    timing: "Continuous",
    category: "Customer",
    notes: "CRM-adjacent but memory-based",
  },
  {
    id: "account-relationship-map",
    name: "Account Relationship Map",
    question: "Who talks to whom at accounts?",
    timing: "Continuous",
    category: "Customer",
    notes: "Strong differentiation",
  },
  {
    id: "memory-coverage",
    name: "Memory Coverage Report",
    question: "What does Sentra know vs not know?",
    timing: "On-demand / Monthly",
    category: "Meta",
    notes: "Transparency feature",
  },
  {
    id: "data-source-utilization",
    name: "Data Source Utilization Report",
    question: "Which sources contribute most?",
    timing: "Monthly",
    category: "Meta",
    notes: "Admin-facing",
  },
  {
    id: "confidence-uncertainty",
    name: "Confidence / Uncertainty Report",
    question: "Where memory is weak or inferred",
    timing: "On-demand",
    category: "Meta",
    notes: "Very important for trust",
  },
  {
    id: "pre-mortem-risk",
    name: "Pre-Mortem Risk Analysis",
    question: "If this initiative fails, what are the most likely causes?",
    timing: "On-demand",
    category: "Risk",
    notes: "Core pre-mortem artifact",
  },
  {
    id: "assumption-risk",
    name: "Assumption Risk Report",
    question: "What assumptions are we making that may be wrong?",
    timing: "On-demand",
    category: "Risk",
    notes: "Derived from language & commitments",
  },
  {
    id: "historical-failure-analogy",
    name: "Historical Failure Analogy Report",
    question: "Where have we seen similar patterns fail before?",
    timing: "On-demand",
    category: "Risk",
    notes: "Uses organizational memory",
  },
  {
    id: "unowned-risk",
    name: "Unowned Risk Report",
    question: "What risks exist without clear ownership?",
    timing: "Weekly / On-demand",
    category: "Risk",
    notes: "Tied to ownership drift",
  },
  {
    id: "dependency-fragility",
    name: "Dependency Fragility Report",
    question: "Which dependencies create single points of failure?",
    timing: "On-demand",
    category: "Risk",
    notes: "Requires project + people memory",
  },
  {
    id: "silent-disagreement",
    name: "Silent Disagreement Report",
    question: "Where are people implicitly disagreeing?",
    timing: "Weekly",
    category: "Risk",
    notes: "Strong differentiator",
  },
  {
    id: "decision-confidence-gradient",
    name: "Decision Confidence Gradient",
    question: "How confident vs uncertain were key decisions?",
    timing: "On-demand",
    category: "Meta",
    notes: "Uses uncertainty signals",
  },
  {
    id: "risk-accumulation",
    name: "Risk Accumulation Timeline",
    question: "How has risk increased over time?",
    timing: "Monthly",
    category: "Risk",
    notes: "Time-aware memory required",
  },
  {
    id: "missed-signal",
    name: "Missed Signal Report",
    question: "What warning signs are already present?",
    timing: "Weekly",
    category: "Risk",
    notes: "Early detection system",
  },
  {
    id: "execution-readiness",
    name: "Execution Readiness Report",
    question: "Are we actually ready to execute this?",
    timing: "On-demand",
    category: "Risk",
    notes: "Combines commitments + capacity",
  },
];

// Helper types for report grouping
type ReportGroupMode = "date" | "category";

interface ReportGroup {
  key: string;
  label: string;
  reports: ExtendedReport[];
}

// Helper to parse date from dateRange string
function parseDateFromRange(dateRange: string): Date {
  // Handle formats like "Jan 26 - Feb 01", "Q1 2026", "January 2026", "Feb 2026", etc.
  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const lowerRange = dateRange.toLowerCase();

  // Try to extract month and year
  let month = monthNames.findIndex((m) => lowerRange.includes(m));
  let year = 2026; // Default year
  const yearMatch = dateRange.match(/20\d{2}/);
  if (yearMatch) year = parseInt(yearMatch[0]);

  // Try to get day
  let day = 1;
  const dayMatch = dateRange.match(/\b(\d{1,2})\b/);
  if (dayMatch) day = parseInt(dayMatch[1]);

  if (month >= 0) {
    return new Date(year, month, day);
  }

  // Default to current date if can't parse
  return new Date();
}

// Format date for sidebar display (e.g., "Feb 3")
function formatReportDate(dateRange: string): string {
  const date = parseDateFromRange(dateRange);
  const monthShort = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${monthShort} ${day}`;
}

// Get week number from date
function getWeekNumber(dateRange: string): number {
  const date = parseDateFromRange(dateRange);
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}

// Format date range for header (e.g., "February 2 - February 8, 2026")
function formatFullDateRange(dateRange: string): string {
  const date = parseDateFromRange(dateRange);
  const monthFull = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  const endDay = day + 6; // Assume weekly
  return `${monthFull} ${day} – ${monthFull} ${endDay}, ${year}`;
}

// Group reports by month
function groupReportsByDate(reports: ExtendedReport[]): ReportGroup[] {
  const groups = new Map<string, ReportGroup>();

  for (const report of reports) {
    const date = parseDateFromRange(report.dateRange);
    const monthName = date
      .toLocaleDateString("en-US", { month: "long" })
      .toUpperCase();
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, "0")}`;

    if (!groups.has(key)) {
      groups.set(key, { key, label: monthName, reports: [] });
    }
    groups.get(key)!.reports.push(report);
  }

  // Sort groups by date (most recent first)
  return Array.from(groups.values()).sort((a, b) => b.key.localeCompare(a.key));
}

// Group reports by category
function groupReportsByCategory(reports: ExtendedReport[]): ReportGroup[] {
  const categoryOrder = ["Weekly", "Radar", "Team", "Ad Hoc"];
  const groups = new Map<string, ReportGroup>();

  for (const report of reports) {
    const category = report.category;
    if (!groups.has(category)) {
      groups.set(category, {
        key: category,
        label: category.toUpperCase(),
        reports: [],
      });
    }
    groups.get(category)!.reports.push(report);
  }

  // Sort groups by category order
  return Array.from(groups.values()).sort(
    (a, b) => categoryOrder.indexOf(a.key) - categoryOrder.indexOf(b.key),
  );
}

const ReportsScreen = ({
  teams,
  users,
}: {
  teams: AppTeam[];
  users: AppUser[];
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    extendedReports[0]?.id || null,
  );
  const [showNewReport, setShowNewReport] = useState(false);
  const [reportsState, setReportsState] =
    useState<ExtendedReport[]>(extendedReports);
  const [reportType, setReportType] = useState<ReportCategory>("Ad Hoc");
  const [reportDescription, setReportDescription] = useState("");
  const [selectedReportType, setSelectedReportType] = useState<
    (typeof REPORT_TYPES)[0] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [groupMode, setGroupMode] = useState<ReportGroupMode>("date");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );
  const [contentTab, setContentTab] = useState<"reports" | "radar">("reports");
  const [sidebarWidth, setSidebarWidth] = useState(180);
  const [isResizing, setIsResizing] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const positioningRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle sidebar resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.min(Math.max(140, e.clientX - 56), 300); // 56px for nav, min 140, max 300
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Comment state
  const [highlights, setHighlights] = useState<CommentHighlight[]>([]);
  const [activeHighlightId, setActiveHighlight] = useState<string | null>(null);
  const [pendingSelection, setPendingSelection] = useState<{
    text: string;
    startOffset: number;
    endOffset: number;
  } | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) {
        next.delete(groupKey);
      } else {
        next.add(groupKey);
      }
      return next;
    });
  };

  const addComment = (text: string) => {
    if (!pendingSelection || !selectedReportId) return;
    const newHighlight: CommentHighlight = {
      id: crypto.randomUUID(),
      reportId: selectedReportId,
      selectedText: pendingSelection.text,
      startOffset: pendingSelection.startOffset,
      endOffset: pendingSelection.endOffset,
      comment: {
        id: crypto.randomUUID(),
        userName: users[0]?.name || "You",
        text,
        createdAt: new Date(),
      },
    };
    setHighlights((prev) => [...prev, newHighlight]);
    setPendingSelection(null);
    setIsComposerOpen(false);
    setActiveHighlight(newHighlight.id);
  };

  const updateComment = (highlightId: string, newText: string) => {
    setHighlights((prev) =>
      prev.map((h) =>
        h.id === highlightId && h.comment
          ? { ...h, comment: { ...h.comment, text: newText } }
          : h,
      ),
    );
  };

  const deleteComment = (highlightId: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== highlightId));
    if (activeHighlightId === highlightId) setActiveHighlight(null);
  };

  // Filter reports based on search and category
  const filteredReports = React.useMemo(() => {
    return reportsState.filter((report) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = report.title.toLowerCase().includes(query);
        const matchesSummary = report.summary.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSummary) return false;
      }
      // Category filter
      if (selectedCategory && report.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [reportsState, searchQuery, selectedCategory]);

  // Group reports based on mode
  const groupedReports = React.useMemo(() => {
    return groupMode === "date"
      ? groupReportsByDate(filteredReports)
      : groupReportsByCategory(filteredReports);
  }, [filteredReports, groupMode]);

  const activeReport = reportsState.find((r) => r.id === selectedReportId);
  const hasActiveFilters = selectedCategory !== null;

  // Track scroll progress
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const progress =
        scrollHeight > clientHeight
          ? scrollTop / (scrollHeight - clientHeight)
          : 0;
      setScrollProgress(progress);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [selectedReportId]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setIsFilterOpen(false);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Sidebar - Report List */}
      <div
        className="flex-none border-r border-border flex flex-col bg-background/50 dark:bg-neutral-950/50 relative"
        style={{ width: sidebarWidth }}
      >
        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-accent/50 transition-colors z-10 ${isResizing ? "bg-accent/50" : ""}`}
        />
        {/* Header */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">
              Reports
            </span>
            <button
              onClick={() => setShowNewReport(true)}
              className="p-1 rounded hover:bg-muted dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground transition-colors"
              title="Settings"
            >
              <Settings size={12} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-7 pl-7 pr-2 text-[11px] rounded bg-card border border-border placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {/* Type Selection - always visible */}
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-2 py-1.5 text-[11px] rounded transition-colors ${
                !selectedCategory
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted dark:hover:bg-neutral-800/50"
              }`}
            >
              All Reports
            </button>
            {["Weekly", "Radar", "Team", "Ad Hoc"].map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                className={`w-full text-left px-2 py-1.5 text-[11px] rounded transition-colors ${
                  selectedCategory === cat
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted dark:hover:bg-neutral-800/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Report List - grouped with collapsible sections */}
        <div className="flex-1 overflow-y-auto py-2">
          {groupedReports.map((group) => {
            const isCollapsed = collapsedGroups.has(group.key);
            return (
              <div key={group.key} className="mb-1">
                {/* Group header - collapsible */}
                <button
                  onClick={() => toggleGroupCollapse(group.key)}
                  className="w-full flex items-center gap-1 px-3 py-1.5 text-left hover:bg-muted dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <ChevronRight
                    size={10}
                    className={`text-muted-foreground transition-transform ${isCollapsed ? "" : "rotate-90"}`}
                  />
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </span>
                </button>

                {/* Reports in this group */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-2">
                        {group.reports.map((report) => {
                          const isSelected = selectedReportId === report.id;
                          return (
                            <button
                              key={report.id}
                              onClick={() => {
                                setSelectedReportId(report.id);
                                setScrollProgress(0);
                                setActiveHighlight(null);
                              }}
                              className={`w-full text-left px-2 py-2 rounded-md transition-colors ${
                                isSelected
                                  ? "bg-neutral-200/70 dark:bg-neutral-800"
                                  : "hover:bg-muted dark:hover:bg-neutral-800/50"
                              }`}
                            >
                              <div className="text-[10px] text-muted-foreground mb-0.5">
                                {formatReportDate(report.dateRange)}
                              </div>
                              <h3
                                className={`font-medium text-[12px] leading-tight line-clamp-2 ${
                                  isSelected
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {report.title}
                              </h3>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Empty state */}
          {groupedReports.length === 0 && (
            <div className="px-3 py-6 text-center">
              <p className="text-[11px] text-muted-foreground">No reports</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-1 text-[10px] text-accent hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] text-muted-foreground">
              Auto-generated
            </span>
          </div>
        </div>
      </div>

      {/* Right Reading Pane */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* Top header with tabs */}
        <div className="shrink-0 px-8 py-3 border-b border-border flex items-center justify-end gap-4">
          <button
            onClick={() => setContentTab("reports")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              contentTab === "reports"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText size={12} />
            Reports
          </button>
          <button
            onClick={() => setContentTab("radar")}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              contentTab === "radar"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart2 size={12} />
            Radar
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {/* Reading progress indicator */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px] bg-accent origin-left z-10"
            style={{ scaleX: scrollProgress }}
          />

          {selectedReportId && activeReport ? (
            <div ref={scrollContainerRef} className="h-full overflow-y-auto">
              <div ref={positioningRef} className="relative min-h-full">
                <div className="max-w-2xl mx-auto px-8 py-8 lg:px-12 lg:py-10">
                  {/* Report Header - redesigned to match screenshot */}
                  <div className="mb-8">
                    {/* Week badge and date */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-accent dark:text-accent uppercase tracking-wider">
                        Week {getWeekNumber(activeReport.dateRange)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFullDateRange(activeReport.dateRange)}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-foreground mb-4 leading-tight">
                      {activeReport.title}
                    </h1>

                    {/* Action buttons row */}
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-1.5 rounded hover:bg-muted dark:hover:bg-neutral-800 text-muted-foreground transition-colors">
                        <ExternalLink size={14} />
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                        <Sparkles size={12} />
                        Review
                        <div className="w-2 h-2 rounded-full bg-accent" />
                      </button>
                    </div>
                  </div>

                  {/* Content Sections with highlighting */}
                  <HighlightedContent
                    reportId={activeReport.id}
                    highlights={highlights}
                    activeHighlightId={activeHighlightId}
                    setActiveHighlight={setActiveHighlight}
                    contentRef={contentRef}
                    pendingSelection={pendingSelection}
                    setPendingSelection={setPendingSelection}
                    isComposerOpen={isComposerOpen}
                    setIsComposerOpen={setIsComposerOpen}
                  >
                    <div className="space-y-8">
                      {activeReport.content.map((section, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <h2 className="text-lg font-bold text-foreground mb-4">
                            {section.heading}
                          </h2>
                          <p className="text-sm leading-7 text-foreground mb-4">
                            {section.body}
                          </p>

                          {section.evidence.length > 0 && (
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted dark:hover:bg-neutral-800 transition-colors">
                              Sources
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </HighlightedContent>
                </div>

                {/* Comment Layer - positioned alongside content */}
                <CommentLayer
                  contentRef={contentRef}
                  positioningRef={positioningRef}
                  reportId={activeReport.id}
                  highlights={highlights}
                  activeHighlightId={activeHighlightId}
                  setActiveHighlight={setActiveHighlight}
                  onEdit={updateComment}
                  onDelete={deleteComment}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-xs text-muted-foreground">Select a report</p>
              </div>
            </div>
          )}
        </div>

        {/* Comment Panel - slides in from right */}
        <CommentPanel
          isOpen={isComposerOpen}
          pendingSelection={pendingSelection}
          onSubmit={addComment}
          onClose={() => {
            setIsComposerOpen(false);
            setPendingSelection(null);
          }}
        />
      </div>

      {/* New Report Modal */}
      {showNewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNewReport(false)}
          />
          <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-2xl border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  New Report
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose report category and type
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNewReport(false);
                  setSelectedReportType(null);
                  setReportType("Ad Hoc");
                }}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Step 1: Category Selection */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Report Category
                </label>
                <select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value as ReportCategory);
                    setSelectedReportType(null);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                >
                  <option value="Ad Hoc">Ad Hoc (On-Demand)</option>
                  <option value="Weekly">Weekly / Recurring</option>
                  <option value="Radar">Radar / Monitoring</option>
                  <option value="Team">Team Reports</option>
                </select>
              </div>

              {/* Step 2: Specific Report Type Dropdown */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Report Type
                </label>
                <select
                  value={selectedReportType?.id || ""}
                  onChange={(e) => {
                    const report = REPORT_TYPES.find(
                      (rt) => rt.id === e.target.value,
                    );
                    setSelectedReportType(report || null);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                >
                  <option value="">Select a report type...</option>
                  {(() => {
                    let filteredReportTypes: typeof REPORT_TYPES = [];

                    if (reportType === "Ad Hoc") {
                      filteredReportTypes = REPORT_TYPES.filter(
                        (rt) =>
                          rt.timing.toLowerCase().includes("on-demand") ||
                          rt.timing.toLowerCase().includes("post-project"),
                      );
                    } else if (reportType === "Weekly") {
                      filteredReportTypes = REPORT_TYPES.filter(
                        (rt) =>
                          rt.timing.toLowerCase().includes("weekly") ||
                          rt.timing.toLowerCase().includes("daily") ||
                          rt.timing.toLowerCase().includes("continuous"),
                      );
                    } else if (reportType === "Radar") {
                      filteredReportTypes = REPORT_TYPES.filter(
                        (rt) =>
                          rt.category === "Radar" ||
                          rt.category === "Risk" ||
                          rt.category === "Meta",
                      );
                    } else if (reportType === "Team") {
                      filteredReportTypes = REPORT_TYPES.filter(
                        (rt) =>
                          rt.category === "Team" ||
                          rt.category === "Institutional",
                      );
                    }

                    return filteredReportTypes.map((rt) => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              {/* Show details when report type selected */}
              {selectedReportType && (
                <div className="bg-background dark:bg-neutral-950 rounded-lg p-4 border border-border space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      What it answers
                    </span>
                    <p className="text-sm text-foreground mt-1">
                      {selectedReportType.question}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Timing
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedReportType.timing}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Notes
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      {selectedReportType.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Additional context */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Additional Context (Optional)
                </label>
                <div className="relative mt-1">
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm min-h-[100px] pr-12"
                    placeholder="Add any specific requirements or context..."
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-border bg-background dark:bg-neutral-900 flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm"
                    title="Dictate"
                  >
                    <Mic size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewReport(false);
                  setSelectedReportType(null);
                  setReportType("Ad Hoc");
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                disabled={!selectedReportType}
                onClick={() => {
                  if (!selectedReportType) return;

                  setReportsState((prev) => [
                    {
                      id: `rep-new-${Date.now()}`,
                      title: selectedReportType.name,
                      category: reportType,
                      dateRange: selectedReportType.timing.split(" / ")[0],
                      summary: reportDescription || selectedReportType.question,
                      status: "ready",
                      author: users[0]?.name || "You",
                      readTime: "3 min read",
                      content: [
                        {
                          heading: "Summary",
                          body:
                            reportDescription || selectedReportType.question,
                          evidence: [],
                        },
                      ],
                    },
                    ...prev,
                  ]);
                  setShowNewReport(false);
                  setReportDescription("");
                  setSelectedReportType(null);
                  setReportType("Ad Hoc");
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  selectedReportType
                    ? "bg-primary text-primary-foreground"
                    : "bg-neutral-200 dark:bg-neutral-800 text-muted-foreground cursor-not-allowed"
                }`}
              >
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Screens (Now, etc) ---

// --- Swimlanes Screen ---

const SwimlanesScreen = ({ users }: { users: AppUser[] }) => {
  const [selectedLaneId, setSelectedLaneId] = useState<string | null>(
    swimlanesList[0]?.id || null,
  );
  const [lanes, setLanes] = useState(swimlanesList);
  const [showNewSwimlane, setShowNewSwimlane] = useState(false);
  const [newLaneName, setNewLaneName] = useState("");
  const [newLaneDescription, setNewLaneDescription] = useState("");
  const [selectedLaneMemberIds, setSelectedLaneMemberIds] = useState<string[]>(
    [],
  );
  const [laneMemberQuery, setLaneMemberQuery] = useState("");

  const activeLane = lanes.find((l) => l.id === selectedLaneId);
  const filteredTimeline = activeLane
    ? timelineData.filter((t) => t.swimlaneId === activeLane.id)
    : [];

  // Copy the Reports screen pattern exactly

  const getStatusColor = (status: string) => {
    switch (status) {
      case "blocked":
        return "bg-red-500 text-red-500 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30";
      case "on-track":
        return "bg-accent text-accent bg-accent/10 dark:bg-accent/10 border-accent/30 dark:border-accent/30";
      case "delayed":
        return "bg-destructive/10 text-destructive border-destructive/20 dark:border-destructive/20";
      case "finished":
        return "bg-neutral-400 text-muted-foreground bg-secondary border-border";
      default:
        return "bg-neutral-300 text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "blocked":
        return "Blocked";
      case "on-track":
        return "On Track";
      case "delayed":
        return "Late/Delayed";
      case "finished":
        return "Finished";
      default:
        return status;
    }
  };

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* Swimlanes List - copying Reports pattern */}
      <div
        className={`${selectedLaneId ? "hidden md:flex md:w-80" : "flex-1"} flex-col border-r border-border bg-background/30 dark:bg-neutral-950/30`}
      >
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Swimlanes
            </h2>
            <span className="text-xs text-muted-foreground">
              {lanes.length} active
            </span>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            Program timelines
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Active swimlanes
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Click a swimlane to review decisions
            </p>
          </div>

          <div className="space-y-3">
            {lanes.map((lane) => {
              const isSelected = selectedLaneId === lane.id;
              const statusStyles = getStatusColor(lane.status);

              return (
                <button
                  key={lane.id}
                  onClick={() => setSelectedLaneId(lane.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-card border-border shadow-sm"
                      : "bg-white/50 dark:bg-neutral-900/50 border-border hover:bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-foreground">
                      {lane.name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${statusStyles.replace(statusStyles.split(" ")[0], "")}`}
                    >
                      {getStatusLabel(lane.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {lane.description}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Updated {lane.lastUpdated}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={() => setShowNewSwimlane(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors"
          >
            <span>+ New Swimlane</span>
          </button>
        </div>
      </div>

      {/* Detail View - copying Reports pattern */}
      {selectedLaneId ? (
        <div className="flex-1 overflow-hidden h-full">
          {activeLane && (
            <SwimlaneDetailScreen
              lane={activeLane}
              timelineData={filteredTimeline}
              onBack={() => setSelectedLaneId(null)}
            />
          )}
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground/40 flex-col gap-4">
          <GitCommit size={48} className="opacity-20" />
          <p className="text-sm">Select a swimlane to view timeline</p>
        </div>
      )}

      {/* New Swimlane Modal */}
      {showNewSwimlane && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowNewSwimlane(false)}
          />
          <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-2xl border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  New Swimlane
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Define the lane and what it should track.
                </p>
              </div>
              <button
                onClick={() => setShowNewSwimlane(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Name
                </label>
                <input
                  value={newLaneName}
                  onChange={(e) => setNewLaneName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  placeholder="Q3 Product Strategy"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Members
                </label>
                <div className="mt-1 border border-border rounded-lg p-2 bg-background dark:bg-neutral-950 relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedLaneMemberIds.map((id) => {
                      const member = users.find((u) => u.id === id);
                      if (!member) return null;
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-card border border-border text-xs text-muted-foreground"
                        >
                          {member.name}
                          <button
                            onClick={() =>
                              setSelectedLaneMemberIds((prev) =>
                                prev.filter((mid) => mid !== id),
                              )
                            }
                            className="text-muted-foreground hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                  <input
                    value={laneMemberQuery}
                    onChange={(e) => setLaneMemberQuery(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                    placeholder="Type a name to add..."
                  />
                  {laneMemberQuery && (
                    <div className="absolute left-0 right-0 mt-2 max-h-40 overflow-y-auto rounded-lg border border-border bg-card shadow-lg z-10">
                      {users
                        .filter((u) =>
                          u.name
                            .toLowerCase()
                            .includes(laneMemberQuery.toLowerCase()),
                        )
                        .filter((u) => !selectedLaneMemberIds.includes(u.id))
                        .map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              setSelectedLaneMemberIds((prev) => [
                                ...prev,
                                u.id,
                              ]);
                              setLaneMemberQuery("");
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-muted dark:hover:bg-neutral-800"
                          >
                            {u.name}
                          </button>
                        ))}
                      {users.filter(
                        (u) =>
                          u.name
                            .toLowerCase()
                            .includes(laneMemberQuery.toLowerCase()) &&
                          !selectedLaneMemberIds.includes(u.id),
                      ).length === 0 && (
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                          No matches
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={newLaneDescription}
                  onChange={(e) => setNewLaneDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm min-h-[120px]"
                  placeholder="Describe what this swimlane should track and how it should filter relevant signals."
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNewSwimlane(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newLaneName.trim()) return;
                  const owner =
                    users.find((u) => u.id === selectedLaneMemberIds[0])
                      ?.name || "Unassigned";
                  setLanes((prev) => [
                    ...prev,
                    {
                      id: `lane-${Date.now()}`,
                      name: newLaneName.trim(),
                      description: newLaneDescription.trim() || "New swimlane.",
                      owner,
                      lastUpdated: "Just now",
                      status: "on-track",
                      summary:
                        newLaneDescription.trim() || "New swimlane created.",
                    },
                  ]);
                  setNewLaneName("");
                  setSelectedLaneMemberIds([]);
                  setLaneMemberQuery("");
                  setNewLaneDescription("");
                  setShowNewSwimlane(false);
                }}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg"
              >
                Create Swimlane
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

import { CommitmentRow } from "./components/CommitmentRow";

const CommitmentsScreen = ({
  commitments,
  onToggle,
  onAddCommitment,
}: {
  commitments: Commitment[];
  onToggle: (id: string) => void;
  onAddCommitment: (commitment: Commitment) => void;
}) => {
  const [viewMode, setViewMode] = useState<"temporal" | "grouped">("temporal");
  const [groupBy, setGroupBy] = useState<"okr" | "priority">("okr");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showOkrs, setShowOkrs] = useState(false);
  const [okrPeriod, setOkrPeriod] = useState("Q1 2026");
  const [okrs, setOkrs] = useState<Array<{ title: string; detail: string }>>([
    {
      title: "Ship v2 insights dashboard",
      detail: "Launch by end of quarter with KPI coverage.",
    },
    {
      title: "Reduce MTTR by 30%",
      detail: "Operationalize new on-call workflows.",
    },
    {
      title: "Expand enterprise adoption",
      detail: "Convert 3 pilots into paid accounts.",
    },
  ]);
  const [newItem, setNewItem] = useState({
    title: "",
    assignee: "Me",
    dueDate: "",
    priority: "Medium" as Commitment["priority"],
    okr: "",
    context: "",
  });
  const teamMembers = [
    "Me",
    "Alex Lewis",
    "Sarah Chen",
    "Mike Johnson",
    "Emma Davis",
  ];

  const completed = commitments
    .filter((c) => c.status === "completed")
    .sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const upcoming = commitments
    .filter((c) => c.status !== "completed")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const grouped = commitments.reduce(
    (acc, curr) => {
      const key =
        groupBy === "okr"
          ? curr.okr || "Unassigned"
          : curr.priority || "No Priority";
      if (!acc[key]) acc[key] = [];
      acc[key].push(curr);
      return acc;
    },
    {} as Record<string, Commitment[]>,
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <header className="px-8 py-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Commitments & Asks
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your promises and requests.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted dark:bg-neutral-900 p-1 rounded-lg border border-border">
            <button
              onClick={() => setViewMode("temporal")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "temporal" ? "bg-card dark:bg-neutral-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Timeline
            </button>
            <button
              onClick={() => setViewMode("grouped")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === "grouped" ? "bg-card dark:bg-neutral-800 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Grouped
            </button>
          </div>

          <button
            onClick={() => setShowAddItem(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 pb-20 relative">
        {viewMode === "temporal" ? (
          <div className="space-y-8 min-h-[101%]">
            <div className="relative group pt-4">
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-neutral-200/50 dark:from-neutral-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-center pt-1 pointer-events-none">
                <ArrowUp
                  size={12}
                  className="text-muted-foreground animate-bounce"
                />
              </div>

              <div className="opacity-60 hover:opacity-100 transition-opacity mb-8 space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 size={12} />
                  Completed (History)
                </h3>
                {completed.map((c) => (
                  <CommitmentRow
                    key={c.id}
                    commitment={c}
                    onToggle={onToggle}
                    isHistory={true}
                  />
                ))}
                {completed.length === 0 && (
                  <div className="text-xs text-muted-foreground italic">
                    No completed items yet.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock size={12} />
                Upcoming
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                {upcoming.map((c) => (
                  <div key={c.id} className="h-full">
                    <CommitmentRow
                      commitment={c}
                      onToggle={onToggle}
                      isCard={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={() =>
                  setGroupBy(groupBy === "okr" ? "priority" : "okr")
                }
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Filter size={12} /> Group by:{" "}
                <span className="font-semibold uppercase">{groupBy}</span>
              </button>
            </div>
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <h3 className="sticky top-2 z-10 w-fit ml-2 mb-4 px-4 py-1.5 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md border border-border/50 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
                  {group}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                  {items.map((c) => (
                    <div key={c.id} className="h-full">
                      <CommitmentRow
                        commitment={c}
                        onToggle={onToggle}
                        isCard={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="absolute bottom-8 right-8">
        <button
          onClick={() => setShowOkrs(true)}
          className="h-14 px-6 bg-primary text-primary-foreground rounded-full shadow-2xl ring-1 ring-primary/10 dark:ring-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 font-semibold"
        >
          <Plus size={20} />
          Change Personal OKR
        </button>
      </div>

      {showAddItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddItem(false)}
          />
          <div className="relative w-full max-w-xl bg-card rounded-lg shadow-2xl border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Add Commitment
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Default assignee is you. Change if it belongs to someone else.
                </p>
              </div>
              <button
                onClick={() => setShowAddItem(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Title
                </label>
                <input
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  placeholder="Write incident summary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Assignee
                  </label>
                  <select
                    value={newItem.assignee}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        assignee: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  >
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newItem.dueDate}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Priority
                  </label>
                  <select
                    value={newItem.priority}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        priority: e.target.value as Commitment["priority"],
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    OKR
                  </label>
                  <input
                    value={newItem.okr}
                    onChange={(e) =>
                      setNewItem((prev) => ({ ...prev, okr: e.target.value }))
                    }
                    className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                    placeholder="Growth, Reliability, ..."
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Context
                </label>
                <textarea
                  value={newItem.context}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, context: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Notes, rationale, or related links."
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddItem(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newItem.title.trim()) return;
                  onAddCommitment({
                    id: `c-new-${Date.now()}`,
                    title: newItem.title.trim(),
                    assignee: newItem.assignee,
                    dueDate: newItem.dueDate || "TBD",
                    status: "pending",
                    priority: newItem.priority,
                    okr: newItem.okr || undefined,
                    context: newItem.context || "Added via quick capture.",
                  });
                  setNewItem({
                    title: "",
                    assignee: "Me",
                    dueDate: "",
                    priority: "Medium",
                    okr: "",
                    context: "",
                  });
                  setShowAddItem(false);
                }}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showOkrs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowOkrs(false)}
          />
          <div className="relative w-full max-w-2xl bg-card rounded-lg shadow-2xl border border-border p-6 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Personal OKRs
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Define a small set of goals for the quarter.
                </p>
              </div>
              <button
                onClick={() => setShowOkrs(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Time Period
                </label>
                <input
                  value={okrPeriod}
                  onChange={(e) => setOkrPeriod(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                  placeholder="Q1 2026"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Goals
                </label>
                <button
                  onClick={() => {
                    const derived = commitments.slice(0, 3).map((c) => ({
                      title: c.title,
                      detail: c.context || "Derived from current commitments.",
                    }));
                    if (derived.length > 0) setOkrs(derived);
                  }}
                  className="text-xs font-bold text-accent hover:text-accent/80"
                >
                  Get from Create OKRs
                </button>
              </div>
              <div className="space-y-3">
                {okrs.map((okr, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        value={okr.title}
                        onChange={(e) => {
                          const next = [...okrs];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setOkrs(next);
                        }}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
                        placeholder="Objective"
                      />
                      <button
                        onClick={() =>
                          setOkrs((prev) => prev.filter((_, i) => i !== idx))
                        }
                        className="shrink-0 px-3 py-2 text-xs font-bold text-muted-foreground hover:text-red-600 border border-border rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      value={okr.detail}
                      onChange={(e) => {
                        const next = [...okrs];
                        next[idx] = { ...next[idx], detail: e.target.value };
                        setOkrs(next);
                      }}
                      className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm min-h-[70px]"
                      placeholder="Key results or sub-goals"
                    />
                  </div>
                ))}
              </div>
              {okrs.length > 5 && (
                <div className="text-xs font-medium text-destructive bg-destructive/10 dark:bg-destructive/15 border border-destructive/20 dark:border-destructive/20 px-3 py-2 rounded-lg">
                  Keep it focused. 5 OKRs or fewer is recommended.
                </div>
              )}
              <button
                onClick={() =>
                  setOkrs((prev) => [...prev, { title: "", detail: "" }])
                }
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                + Add another OKR
              </button>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowOkrs(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
              <button
                onClick={() => setShowOkrs(false)}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg"
              >
                Save OKRs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { OnboardingSimulator } from "./components/OnboardingSimulator";
import { TranscriptModal } from "./components/TranscriptModal";

// --- Reports Reading Pane (wraps sidebar + reading pane + comment panel) ---
const ReportsReadingPane = ({
  onViewHistory,
}: {
  onViewHistory?: (reportTitle?: string) => void;
}) => {
  const [selectedReportId, setSelectedReportId] = React.useState<string | null>(
    mockReports[0]?.id ?? null,
  );
  const [selectedRadarId, setSelectedRadarId] = React.useState<string | null>(
    mockRadarItems[0]?.id ?? null,
  );
  const viewMode = useReportsStore((state) => state.viewMode);
  const setViewMode = useReportsStore((state) => state.setViewMode);
  const isSettingsOpen = useSettingsStore((state) => state.isOpen);

  const selectedReport =
    mockReports.find((r) => r.id === selectedReportId) ?? null;
  const selectedRadarItem =
    mockRadarItems.find((r) => r.id === selectedRadarId) ?? null;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <aside className="w-[220px] shrink-0 border-r border-border bg-sidebar overflow-y-auto">
        <ReportsSidebar
          reports={mockReports}
          selectedReportId={selectedReportId}
          onSelectReport={setSelectedReportId}
          selectedRadarId={selectedRadarId}
          onSelectRadarItem={setSelectedRadarId}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </aside>
      <div className="flex-1 min-w-0 overflow-hidden">
        {isSettingsOpen ? (
          <SettingsPane />
        ) : viewMode === "radar" ? (
          <RadarReadingPane item={selectedRadarItem} />
        ) : (
          <ReadingPane
            report={selectedReport}
            onViewHistory={
              selectedReport && onViewHistory
                ? () => onViewHistory(selectedReport.title)
                : onViewHistory
            }
          />
        )}
      </div>
    </div>
  );
};

const ExpandedState = ({
  commitments,
  onToggleCommitment,
  onAddCommitment,
  onTogglePrivacy,
  meetings,
  users,
  setUsers,
  teams,
  setTeams,
}: {
  commitments: Commitment[];
  onToggleCommitment: (id: string) => void;
  onAddCommitment: (commitment: Commitment) => void;
  onTogglePrivacy: (id: string) => void;
  meetings: MeetingBrief[];
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  teams: AppTeam[];
  setTeams: React.Dispatch<React.SetStateAction<AppTeam[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>("Now");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const privateCount = meetings.filter((m) => m.isPrivate).length;
  const totalCount = meetings.length;
  const privatePercent =
    totalCount === 0 ? 0 : Math.round((privateCount / totalCount) * 100);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Icon Navigation — 52px rail (matches reports reference) */}
      <nav className="w-[52px] shrink-0 flex flex-col items-center bg-sidebar border-r border-border">
        {/* Nav Items */}
        <div className="flex-1 flex flex-col items-center gap-2 pt-3">
          {[
            { id: "Now", label: "Home", icon: Inbox },
            { id: "Meetings", label: "Meetings", icon: Calendar },
            { id: "CRM", label: "CRM", icon: Users },
            { id: "Reports", label: "Reports", icon: BarChart2 },
            { id: "Swimlanes", label: "Memory", icon: GitCommit },
            { id: "Archive", label: "Archive", icon: Archive },
            { id: "ToDo", label: "Commitments", icon: CheckCircle2 },
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              title={item.label}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", duration: 0.15, bounce: 0 }}
              className={`relative size-8 rounded-[5px] flex items-center justify-center transition-colors duration-200 ${activeTab === item.id ? "bg-accent/10 text-accent" : "text-foreground/50 hover:bg-muted hover:text-foreground"}`}
            >
              <item.icon size={16} strokeWidth={1.5} />
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute left-0 w-0.5 h-4 bg-accent rounded-r"
                  transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Bottom: Settings + Theme + User */}
        <div className="flex flex-col items-center gap-2 py-3 border-t border-border">
          <motion.button
            onClick={() => setActiveTab("Settings" as any)}
            title="Settings"
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", duration: 0.15, bounce: 0 }}
            className={`relative size-8 rounded-[5px] flex items-center justify-center transition-colors duration-200 ${activeTab === "Settings" ? "bg-accent/10 text-accent" : "text-foreground/50 hover:bg-muted hover:text-foreground"}`}
          >
            <Settings size={16} strokeWidth={1.5} />
            {activeTab === "Settings" && (
              <motion.div
                layoutId="activeNavIndicator"
                className="absolute left-0 w-0.5 h-4 bg-accent rounded-r"
                transition={{ type: "spring", duration: 0.4, bounce: 0 }}
              />
            )}
          </motion.button>
          <button
            onClick={toggleTheme}
            className="size-7 rounded-[5px] flex items-center justify-center text-foreground/50 hover:bg-muted hover:text-foreground transition-colors duration-200"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            className="size-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-[10px] font-semibold cursor-pointer hover:ring-2 ring-accent/30 transition-all"
            title="Alex Lewis"
            onClick={() => setActiveTab("Settings")}
          >
            AL
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Breadcrumb Header — 36px compact bar */}
        <header className="h-9 px-4 border-b border-border flex items-center justify-between sticky top-0 z-20 shrink-0 bg-background">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground font-label">
              {activeTab === "Now"
                ? "Home"
                : activeTab === "ToDo"
                  ? "Commitments"
                  : activeTab}
            </span>
            {activeTab !== "Now" && (
              <>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-xs text-muted-foreground">Overview</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "Meetings" &&
              (() => {
                const getPrivateColor = () => {
                  if (privatePercent <= 25) return "text-muted-foreground";
                  if (privatePercent <= 50)
                    return "text-yellow-600 dark:text-yellow-400";
                  if (privatePercent <= 75)
                    return "text-orange-600 dark:text-orange-400";
                  return "text-red-600 dark:text-red-400";
                };
                const getBgColor = () => {
                  if (privatePercent <= 25) return "bg-muted";
                  if (privatePercent <= 50)
                    return "bg-yellow-50 dark:bg-yellow-900/20";
                  if (privatePercent <= 75)
                    return "bg-orange-50 dark:bg-orange-900/20";
                  return "bg-red-50 dark:bg-red-950";
                };

                return (
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${getBgColor()} transition-all`}
                  >
                    <Lock size={11} className={getPrivateColor()} />
                    <span className={getPrivateColor()}>
                      {privatePercent}% Private
                    </span>
                    <span className="text-muted-foreground/50">
                      {privateCount}/{totalCount}
                    </span>
                  </div>
                );
              })()}
            {/* Mode controls removed — full-screen only */}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence>
            {showOnboarding && (
              <OnboardingSimulator
                open={showOnboarding}
                onClose={() => setShowOnboarding(false)}
                onNavigateHome={() => {
                  setShowOnboarding(false);
                  setActiveTab("Now");
                  setShowToast(true);
                }}
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
              >
                <CheckCircle2 size={20} className="text-accent" />
                <span className="font-medium">
                  You're all set! Sentra is now active.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {activeTab === "Now" && (
              <motion.div
                key="now"
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="h-full bg-white dark:bg-neutral-950">
                  <NowScreen
                    commitments={[...commitments, ...asyncCommitments]}
                    onToggle={onToggleCommitment}
                    alerts={alerts}
                    meetingBriefs={meetingBriefs}
                    relationshipAlerts={relationshipAlerts}
                    onNavigate={setActiveTab}
                  />
                </div>
              </motion.div>
            )}
            {activeTab === "Meetings" && (
              <motion.div
                key="meetings"
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MeetingsPage
                  meetings={meetings}
                  onTogglePrivacy={onTogglePrivacy}
                />
              </motion.div>
            )}
            {activeTab === "Reports" && (
              <motion.div
                key="reports"
                className="h-full flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ReportsReadingPane
                  onViewHistory={(reportTitle?: string) => {
                    if (reportTitle) {
                      const archiveState = useArchiveStore.getState();
                      archiveState.setActiveTab("reports");
                      archiveState.setSearchQuery(reportTitle);
                      archiveState.selectArchivedReport(null);
                    }
                    setActiveTab("Archive");
                  }}
                />
              </motion.div>
            )}
            {activeTab === "CRM" && (
              <motion.div
                key="crm"
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NewCrmPage
                  onViewAllMeetings={(contact) => {
                    const archiveState = useArchiveStore.getState();
                    archiveState.setActiveTab("meetings");
                    archiveState.setContactFilter({
                      contactId: contact.id,
                      contactName: `${contact.firstName} ${contact.lastName}`,
                    });
                    setActiveTab("Archive");
                  }}
                />
              </motion.div>
            )}
            {activeTab === "Swimlanes" && (
              <motion.div
                key="swimlanes"
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MemoryPage />
              </motion.div>
            )}
            {activeTab === "Archive" && (
              <motion.div
                key="archive"
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ArchivePage />
              </motion.div>
            )}
            {activeTab === "Settings" && (
              <motion.div
                key="settings"
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SettingsScreen
                  onSimulateOnboarding={() => setShowOnboarding(true)}
                  users={users}
                  setUsers={setUsers}
                  teams={teams}
                  setTeams={setTeams}
                />
              </motion.div>
            )}
            {activeTab === "ToDo" && (
              <motion.div
                key="todo"
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CommitmentsScreen
                  commitments={commitments}
                  onToggle={onToggleCommitment}
                  onAddCommitment={onAddCommitment}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Chat Interface Modal */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default function App() {
  const [commitmentsData, setCommitmentsData] =
    useState<Commitment[]>(commitments);
  const [meetingsData, setMeetingsData] =
    useState<MeetingBrief[]>(meetingBriefs);
  const [usersData, setUsersData] = useState<AppUser[]>([
    {
      id: "u-1",
      name: "Alex Lewis",
      title: "Head of Product",
      email: "alex.lewis@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=alex",
    },
    {
      id: "u-2",
      name: "Sarah Chen",
      title: "Engineering Manager",
      email: "sarah.chen@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=sarah",
    },
    {
      id: "u-3",
      name: "Mike Johnson",
      title: "Staff Engineer",
      email: "mike.johnson@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=mike",
    },
    {
      id: "u-4",
      name: "Emma Davis",
      title: "Program Manager",
      email: "emma.davis@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=emma",
    },
    {
      id: "u-5",
      name: "Priya Desai",
      title: "Product Manager",
      email: "priya.desai@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=priya",
    },
    {
      id: "u-6",
      name: "Jordan Lee",
      title: "Design Lead",
      email: "jordan.lee@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=jordan",
    },
    {
      id: "u-7",
      name: "Samir Patel",
      title: "Solutions Engineer",
      email: "samir.patel@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=samir",
    },
    {
      id: "u-8",
      name: "Nina Park",
      title: "Customer Success",
      email: "nina.park@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=nina",
    },
    {
      id: "u-9",
      name: "Omar Haddad",
      title: "Security Lead",
      email: "omar.haddad@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=omar",
    },
    {
      id: "u-10",
      name: "Grace Kim",
      title: "Marketing Manager",
      email: "grace.kim@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=grace",
    },
    {
      id: "u-11",
      name: "Liam Torres",
      title: "Data Engineer",
      email: "liam.torres@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=liam",
    },
    {
      id: "u-12",
      name: "Maya Singh",
      title: "UX Researcher",
      email: "maya.singh@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=maya",
    },
    {
      id: "u-13",
      name: "Eva Chen",
      title: "People Ops",
      email: "eva.chen@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=eva",
    },
    {
      id: "u-14",
      name: "Noah Brooks",
      title: "RevOps Lead",
      email: "noah.brooks@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=noah",
    },
    {
      id: "u-15",
      name: "Riya Rao",
      title: "QA Engineer",
      email: "riya.rao@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=riya",
    },
    {
      id: "u-16",
      name: "Daniel Wu",
      title: "Platform Engineer",
      email: "daniel.wu@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=daniel",
    },
    {
      id: "u-17",
      name: "Sofia Alvarez",
      title: "Sales Lead",
      email: "sofia.alvarez@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=sofia",
    },
    {
      id: "u-18",
      name: "Miguel Santos",
      title: "Account Executive",
      email: "miguel.santos@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=miguel",
    },
    {
      id: "u-19",
      name: "Tara Collins",
      title: "Finance Manager",
      email: "tara.collins@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=tara",
    },
    {
      id: "u-20",
      name: "Ben Foster",
      title: "GTM Ops",
      email: "ben.foster@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=ben",
    },
    {
      id: "u-21",
      name: "Ava Nguyen",
      title: "Customer Support",
      email: "ava.nguyen@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=ava",
    },
    {
      id: "u-22",
      name: "Caleb Reed",
      title: "Fullstack Engineer",
      email: "caleb.reed@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=caleb",
    },
    {
      id: "u-23",
      name: "Hannah Price",
      title: "Legal Counsel",
      email: "hannah.price@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=hannah",
    },
    {
      id: "u-24",
      name: "Victor Chen",
      title: "IT Admin",
      email: "victor.chen@sentra.ai",
      avatar: "https://i.pravatar.cc/64?u=victor",
    },
  ]);
  const [teamsData, setTeamsData] = useState<AppTeam[]>([
    {
      id: "t-1",
      name: "Product Strategy",
      memberIds: ["u-1", "u-2", "u-3"],
      note: "Q1 roadmap, positioning, and launch readiness.",
      membersText: "Alex Lewis, Sarah Chen, Mike Johnson",
    },
    {
      id: "t-2",
      name: "Platform Ops",
      memberIds: ["u-1", "u-4"],
      note: "Incident response, reliability, and SLA reporting.",
      membersText: "Alex Lewis, Emma Davis",
    },
    {
      id: "t-3",
      name: "Customer Expansion",
      memberIds: ["u-8", "u-17", "u-18"],
      note: "Renewals, upsells, and health scoring.",
      membersText: "Nina Park, Sofia Alvarez, Miguel Santos",
    },
    {
      id: "t-4",
      name: "Security & Compliance",
      memberIds: ["u-9", "u-23", "u-16"],
      note: "Audit readiness, access reviews, and risk mitigation.",
      membersText: "Omar Haddad, Hannah Price, Daniel Wu",
    },
    {
      id: "t-5",
      name: "Design & Research",
      memberIds: ["u-6", "u-12"],
      note: "Experience, research, and design system.",
      membersText: "Jordan Lee, Maya Singh",
    },
  ]);

  const handleToggleCommitment = (id: string) => {
    setCommitmentsData((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "completed" ? "pending" : "completed" }
          : c,
      ),
    );
  };

  const handleCompleteCommitment = (id: string) => {
    setCommitmentsData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "completed" } : c)),
    );
  };

  const handleCommitMeeting = (
    type: "private" | "public",
    title: string,
    references: string,
  ) => {
    const cleanTitle = title?.trim() || "New Meeting Note";
    const cleanRefs = references?.trim();
    const newMeeting: MeetingBrief = {
      id: `m-new-${Date.now()}`,
      title: cleanTitle,
      time: "Just now",
      timestamp: new Date().toISOString(),
      attendees: ["Me"],
      summary: cleanRefs
        ? `Voice note recorded via Sentra. Transcript is ready. References: ${cleanRefs}`
        : "Voice note recorded via Sentra. Transcript is ready.",
      keyTopics: [],
      status: "completed",
      reportStatus: "published",
      location: "Phone",
      isPrivate: type === "private",
    };
    setMeetingsData((prev) => [newMeeting, ...prev]);
    toast.success(
      type === "private"
        ? "Private memory saved"
        : "Meeting committed to memory",
    );
  };

  const handleToggleMeetingPrivacy = (id: string) => {
    setMeetingsData((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isPrivate: !m.isPrivate } : m)),
    );
  };

  const handleAddCommitment = (commitment: Commitment) => {
    setCommitmentsData((prev) => [commitment, ...prev]);
  };

  return (
    <SchedulingProvider>
      <MeetingCaptureProvider>
        <ThemeProvider defaultTheme="dark">
          <Toaster />
          <ExpandedState
            commitments={commitmentsData}
            onToggleCommitment={handleToggleCommitment}
            onAddCommitment={handleAddCommitment}
            onTogglePrivacy={handleToggleMeetingPrivacy}
            meetings={meetingsData}
            users={usersData}
            setUsers={setUsersData}
            teams={teamsData}
            setTeams={setTeamsData}
          />
          <PersistentChatBar />
          <MeetingCaptureSummary />
          <SourcesSidebar />
          <ReviewActionsModal />
        </ThemeProvider>
      </MeetingCaptureProvider>
    </SchedulingProvider>
  );
}
