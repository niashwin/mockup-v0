import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Shield,
  GitCommit,
  Users,
  User,
  Layout,
  Database,
  Sparkles,
  Search,
  Bell,
  FileText,
  Lock,
  Globe,
  MessageSquare,
  Calendar,
  Mail,
  Zap,
} from "lucide-react";

type Persona = "admin" | "ic" | "self-service" | null;

interface OnboardingSimulatorProps {
  open: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
}

export const OnboardingSimulator: React.FC<OnboardingSimulatorProps> = ({
  open,
  onClose,
  onNavigateHome,
}) => {
  const [persona, setPersona] = useState<Persona>(null);
  const [step, setStep] = useState(0);
  const [connecting, setConnecting] = useState<Record<string, boolean>>({});
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setPersona(null);
      setStep(0);
      setConnecting({});
      setConnected({});
    }
  }, [open]);

  const handleConnect = (id: string) => {
    setConnecting((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setConnecting((prev) => ({ ...prev, [id]: false }));
      setConnected((prev) => ({ ...prev, [id]: true }));
    }, 1500);
  };

  const handleFinish = () => {
    onNavigateHome();
  };

  const personas = [
    {
      id: "admin",
      title: "Workspace Admin",
      icon: Shield,
      desc: "Setup organization, permissions, and connect main data sources.",
      features: [
        "Connect Slack, Jira, Drive",
        "Configure Privacy & Retention",
        "Provision Team Access",
      ],
    },
    {
      id: "ic",
      title: "Individual Contributor",
      icon: User,
      desc: "Focus on personal productivity and daily workflows.",
      features: ["Personal Commitments", "Meeting Briefs", "Memory Search"],
    },
    {
      id: "self-service",
      title: "Self-Service User",
      icon: Users,
      desc: "Connect your own tools and start using Sentra independently.",
      features: [
        "Connect Personal Calendar",
        "Setup Daily Digest",
        "Project Clarity",
      ],
    },
  ];

  // Steps configuration
  const getSteps = () => {
    if (!persona) return [];

    const commonFinish = {
      title: "You're all set",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-accent/15 dark:bg-accent/20 rounded-full flex items-center justify-center text-accent mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            Sentra is Ready
          </h3>
          <p className="text-muted-foreground max-w-md">
            Your organizational memory is now active. We've started indexing
            your data and your first insights are waiting on the Home screen.
          </p>
          <div className="pt-8">
            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-primary dark:bg-muted text-white dark:text-foreground rounded-[7px] font-medium hover:scale-105 transition-transform"
            >
              Go to Home
            </button>
          </div>
        </div>
      ),
    };

    if (persona === "admin") {
      return [
        {
          title: "Welcome to Sentra",
          render: () => (
            <div className="space-y-6">
              <div className="p-6 bg-background dark:bg-primary rounded-2xl border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Build Your Organizational Memory
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Sentra connects to your team's tools to automatically track
                  commitments, decisions, and context. As an admin, you'll
                  establish the foundation of trust and data flow.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: GitCommit,
                    label: "Commitments",
                    desc: "Auto-detected asks",
                  },
                  {
                    icon: Database,
                    label: "Decisions",
                    desc: "Key outcomes logged",
                  },
                  {
                    icon: Search,
                    label: "Context",
                    desc: "Deep semantic search",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-[7px] border border-border flex flex-col items-center text-center gap-2"
                  >
                    <f.icon className="text-muted-foreground" size={24} />
                    <span className="font-medium text-foreground">
                      {f.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {f.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Connect Sources",
          render: () => (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Select the platforms Sentra should learn from. We support OAuth
                2.0 for secure access.
              </p>
              <div className="space-y-3">
                {[
                  {
                    id: "slack",
                    name: "Slack",
                    icon: MessageSquare,
                    scope: "Public channels & authorized private",
                  },
                  {
                    id: "gsuite",
                    name: "Google Workspace",
                    icon: Globe,
                    scope: "Calendar, Drive, Gmail",
                  },
                  {
                    id: "jira",
                    name: "Jira",
                    icon: Layout,
                    scope: "Issues, Epics, Comments",
                  },
                  {
                    id: "zoom",
                    name: "Zoom",
                    icon: Zap,
                    scope: "Meeting transcripts",
                  },
                ].map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 bg-card dark:bg-primary border border-border rounded-[7px]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[7px] bg-muted dark:bg-neutral-800 flex items-center justify-center text-muted-foreground">
                        <app.icon size={20} />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {app.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {app.scope}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnect(app.id)}
                      disabled={connected[app.id]}
                      className={`px-4 py-2 rounded-[7px] text-sm font-medium transition-all ${
                        connected[app.id]
                          ? "bg-accent/15 dark:bg-accent/20 text-accent border border-accent/30 dark:border-accent/30"
                          : "bg-primary dark:bg-muted text-white dark:text-foreground hover:opacity-90"
                      }`}
                    >
                      {connecting[app.id]
                        ? "Connecting..."
                        : connected[app.id]
                          ? "Connected"
                          : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Privacy & Governance",
          render: () => (
            <div className="space-y-6">
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 p-4 rounded-[7px] flex gap-3">
                <Lock className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-yellow-900 dark:text-yellow-100">
                  <span className="font-semibold">Privacy First:</span> Sentra
                  automatically redacts PII and sensitive financial data by
                  default.
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Meeting Privacy Scope
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["All Meetings", "Internal Only", "Manual Only"].map(
                      (opt, i) => (
                        <label
                          key={i}
                          className="flex items-center justify-center p-3 border border-border rounded-[7px] cursor-pointer hover:bg-background dark:hover:bg-neutral-800 transition-colors"
                        >
                          <input
                            type="radio"
                            name="meeting_scope"
                            defaultChecked={i === 1}
                            className="mr-2 accent-primary dark:accent-muted"
                          />
                          <span className="text-sm text-muted-foreground">
                            {opt}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Data Retention
                  </label>
                  <select className="w-full p-2.5 bg-card dark:bg-primary border border-border rounded-[7px] text-sm text-foreground">
                    <option>90 Days (Recommended)</option>
                    <option>1 Year</option>
                    <option>Indefinite</option>
                  </select>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Sentra Comes Alive",
          render: () => (
            <div className="py-8 text-center space-y-8">
              <div className="relative max-w-md mx-auto">
                <div className="h-2 bg-muted dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground font-medium font-mono">
                  <span>INDEXING</span>
                  <span>100%</span>
                </div>
              </div>

              <div
                className="grid grid-cols-1 gap-4 text-left opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[2000ms] fill-mode-forwards"
                style={{ animationDelay: "2s", animationFillMode: "forwards" }}
              >
                <div className="p-3 bg-card dark:bg-primary border border-border rounded-[7px] shadow-sm flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center">
                    <Bell size={16} />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      Anomaly Detected
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      — Q3 Sales projections updated in 3 separate docs
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-card dark:bg-primary border border-border rounded-[7px] shadow-sm flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
                    <GitCommit size={16} />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-foreground">
                      New Commitment
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      — @Alex to finalize API specs by Friday
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        commonFinish,
      ];
    } else if (persona === "ic") {
      return [
        {
          title: "Welcome, Alex",
          render: () => (
            <div className="space-y-8 text-center px-4">
              <div className="w-20 h-20 bg-muted dark:bg-neutral-800 rounded-full mx-auto flex items-center justify-center text-muted-foreground">
                <User size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Sentra is here to help you remember
                </h3>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Your admin has already connected the team's tools. Sentra runs
                  in the background to capture commitments and context, so you
                  can focus on the work.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300 p-3 rounded-[7px] text-sm inline-block">
                  <Shield className="inline-block w-4 h-4 mr-2 -mt-0.5" />
                  Sentra is designed for personal memory, not performance
                  monitoring.
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Your Personal Feed",
          render: () => (
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Here is a preview of what Sentra has found for you today:
              </p>
              <div className="space-y-3">
                <div className="p-4 bg-card dark:bg-primary border border-border rounded-[7px] flex gap-4">
                  <div className="mt-1">
                    <GitCommit className="text-accent" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      Update Q3 Roadmap
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      You mentioned this in #product-strategy yesterday.
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-card dark:bg-primary border border-border rounded-[7px] flex gap-4">
                  <div className="mt-1">
                    <Calendar className="text-purple-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">
                      Design Review Prep
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Meeting in 2 hours. Review the latest Figma mocks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: "Daily Workflow",
          render: () => (
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: "Check Commitments",
                  desc: "Start your day by reviewing what you promised.",
                  icon: CheckCircle2,
                },
                {
                  title: "Prep for Meetings",
                  desc: "Get a 2-minute briefing before every call.",
                  icon: Zap,
                },
                {
                  title: "Ask Sentra",
                  desc: "Search across all apps when you lose context.",
                  icon: Search,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border border-border rounded-[7px] hover:bg-background dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-muted dark:bg-neutral-800 rounded-full flex items-center justify-center text-muted-foreground">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        commonFinish,
      ];
    } else {
      // Self-Service
      return [
        {
          title: "Welcome",
          render: () => (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-foreground">
                What is your primary goal with Sentra?
              </h3>
              <div className="space-y-3">
                {[
                  "Boost personal productivity & recall",
                  "Clarify project status for my small team",
                  "Automate meeting notes and action items",
                ].map((goal, i) => (
                  <label
                    key={i}
                    className="flex items-center p-4 border border-border rounded-[7px] cursor-pointer hover:border-accent transition-colors group"
                  >
                    <input
                      type="radio"
                      name="goal"
                      className="mr-4 w-5 h-5 accent-primary dark:accent-muted"
                      defaultChecked={i === 0}
                    />
                    <span className="text-foreground group-hover:text-foreground">
                      {goal}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Connect Your Tools",
          render: () => (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Connect your daily driver tools.
              </p>
              <div className="space-y-3">
                {[
                  { id: "gcal", name: "Google Calendar", icon: Calendar },
                  { id: "slack", name: "Slack", icon: MessageSquare },
                  { id: "notion", name: "Notion", icon: FileText },
                  { id: "gmail", name: "Gmail", icon: Mail },
                ].map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-3 bg-card dark:bg-primary border border-border rounded-[7px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-muted dark:bg-neutral-800 flex items-center justify-center text-muted-foreground">
                        <app.icon size={16} />
                      </div>
                      <span className="font-medium text-foreground">
                        {app.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleConnect(app.id)}
                      className={`w-10 h-6 rounded-full transition-colors relative ${connected[app.id] ? "bg-accent" : "bg-neutral-200 dark:bg-neutral-800"}`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-card rounded-full shadow-sm transition-all ${connected[app.id] ? "right-1" : "left-1"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
        {
          title: "Building Memory Map",
          render: () => (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-muted dark:border-neutral-800 rounded-full"></div>
                <motion.div
                  className="absolute inset-0 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="text-accent" size={32} />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-medium text-foreground">
                  Analyzing Context...
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Connecting meetings to documents
                </p>
              </div>
            </div>
          ),
        },
        {
          title: "Daily Workflow",
          render: () => (
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: "Check Commitments",
                  desc: "Review your auto-detected promises.",
                  icon: CheckCircle2,
                },
                {
                  title: "Prep for Meetings",
                  desc: "Get briefed before every call.",
                  icon: Zap,
                },
                {
                  title: "Ask Sentra",
                  desc: "Search across all apps.",
                  icon: Search,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border border-border rounded-[7px] hover:bg-background dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-muted dark:bg-neutral-800 rounded-full flex items-center justify-center text-muted-foreground">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: "Try a Search",
          render: () => (
            <div className="space-y-6">
              <div className="bg-muted dark:bg-neutral-800/50 p-6 rounded-2xl">
                <p className="text-sm font-medium text-muted-foreground mb-2 uppercase">
                  Ask Sentra
                </p>
                <div className="bg-card dark:bg-primary border border-border rounded-[7px] p-3 flex items-center gap-2 shadow-sm">
                  <Search size={18} className="text-muted-foreground" />
                  <span className="text-foreground">
                    What did we decide about the Q3 launch date?
                  </span>
                </div>

                <motion.div
                  className="mt-4 bg-card dark:bg-primary border border-border rounded-[7px] p-4 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/15 dark:bg-accent/20 rounded-full flex items-center justify-center text-accent shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-sm text-foreground leading-relaxed">
                        The launch was moved to{" "}
                        <span className="font-semibold text-accent">
                          October 15th
                        </span>{" "}
                        to accommodate the new security audit.
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <MessageSquare size={12} />
                        <span>Source: Slack #leadership (Yesterday)</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          ),
        },
        commonFinish,
      ];
    }
  };

  const currentSteps = getSteps();
  const currentStepData = currentSteps[step];
  const isFirstStep = step === 0;
  const isLastStep = step === currentSteps.length - 1;

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl bg-card dark:bg-neutral-950 rounded-[2rem] shadow-2xl border border-white/20 dark:border-border overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header - Hidden on persona chooser */}
        {persona && (
          <header className="px-8 py-6 border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={isFirstStep}
                className={`p-2 rounded-full hover:bg-muted dark:hover:bg-neutral-800 transition-colors ${isFirstStep ? "opacity-0 pointer-events-none" : "opacity-100"}`}
              >
                <ChevronLeft size={20} className="text-muted-foreground" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {currentStepData?.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-1">
                  <span>
                    Step {step + 1} of {currentSteps.length}
                  </span>
                  <div className="w-24 h-1.5 bg-muted dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary dark:bg-muted transition-all duration-300"
                      style={{
                        width: `${((step + 1) / currentSteps.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted dark:hover:bg-neutral-800 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </header>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {!persona ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
                    Simulate Onboarding
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Choose a persona to preview the onboarding experience.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted dark:hover:bg-neutral-800 text-muted-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {personas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPersona(p.id as Persona)}
                    className="group relative flex flex-col text-left p-6 rounded-2xl border border-border hover:border-accent hover:shadow-lg transition-all duration-300 bg-background/50 dark:bg-neutral-900/50"
                  >
                    <div className="w-12 h-12 rounded-[7px] bg-card dark:bg-neutral-800 shadow-sm border border-border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <p.icon className="text-foreground" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 flex-1">
                      {p.desc}
                    </p>
                    <ul className="space-y-2">
                      {p.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2
                            size={14}
                            className="mt-0.5 text-accent shrink-0"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full max-w-2xl mx-auto"
            >
              {currentStepData?.render()}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        {persona && !isLastStep && (
          <footer className="px-8 py-6 border-t border-border flex items-center justify-between bg-background/50 dark:bg-neutral-900/50 shrink-0">
            <button
              onClick={handleFinish}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>

            <button
              onClick={() =>
                setStep((s) => Math.min(currentSteps.length - 1, s + 1))
              }
              className="flex items-center gap-2 px-6 py-2.5 bg-primary dark:bg-muted text-white dark:text-foreground rounded-[7px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/10"
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          </footer>
        )}
      </motion.div>
    </motion.div>
  );
};
