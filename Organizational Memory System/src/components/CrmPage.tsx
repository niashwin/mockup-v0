import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Users,
  Building2,
  UserCircle,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  X,
  Clock,
  AlertTriangle,
  Star,
  Flame,
  Snowflake,
  Sparkles,
  Target,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  Globe,
  Briefcase,
  MapPin,
  FileText,
  Link,
} from "lucide-react";
import {
  Contact,
  Company,
  RelationshipType,
  RelationshipWarmth,
  ContactCategory,
  CompanyStatus,
  DealStage,
} from "../types";

// Relationship type config
const RELATIONSHIP_CONFIG: Record<
  RelationshipType,
  { label: string; color: string; icon: React.ElementType }
> = {
  key_stakeholder: {
    label: "Key Stakeholder",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: Star,
  },
  champion: {
    label: "Champion",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: UserCheck,
  },
  decision_maker: {
    label: "Decision Maker",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Target,
  },
  influencer: {
    label: "Influencer",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: Sparkles,
  },
  blocker: {
    label: "Blocker",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: UserX,
  },
  contact: {
    label: "Contact",
    color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    icon: UserCircle,
  },
};

// Warmth config
const WARMTH_CONFIG: Record<
  RelationshipWarmth,
  { label: string; icon: React.ElementType; color: string }
> = {
  hot: { label: "Hot", icon: Flame, color: "text-red-500" },
  warm: { label: "Warm", icon: Flame, color: "text-orange-400" },
  cool: { label: "Cool", icon: Snowflake, color: "text-blue-400" },
  cold: { label: "Cold", icon: Snowflake, color: "text-blue-600" },
  new: { label: "New", icon: Sparkles, color: "text-emerald-500" },
};

// Category config
const CATEGORY_CONFIG: Record<
  ContactCategory,
  { label: string; color: string }
> = {
  investor: {
    label: "Investor",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  client: {
    label: "Client",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  partner: {
    label: "Partner",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
  team: {
    label: "Team",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  other: {
    label: "Other",
    color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

// Company status config
const STATUS_CONFIG: Record<CompanyStatus, { label: string; color: string }> = {
  active: {
    label: "Active",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  prospect: {
    label: "Prospect",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  churned: {
    label: "Churned",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  paused: {
    label: "Paused",
    color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
};

// Deal stage config
const DEAL_STAGE_CONFIG: Record<DealStage, { label: string; color: string }> = {
  lead: { label: "Lead", color: "bg-zinc-100 text-zinc-600" },
  qualified: { label: "Qualified", color: "bg-blue-100 text-blue-700" },
  proposal: { label: "Proposal", color: "bg-purple-100 text-purple-700" },
  negotiation: { label: "Negotiation", color: "bg-amber-100 text-amber-700" },
  closed_won: { label: "Won", color: "bg-emerald-100 text-emerald-700" },
  closed_lost: { label: "Lost", color: "bg-red-100 text-red-700" },
};

type ViewMode = "companies" | "contacts";

interface CrmPageProps {
  contacts: Contact[];
  companies: Company[];
}

// Company Card Component
const CompanyCard: React.FC<{
  company: Company;
  contactCount: number;
  onClick: () => void;
}> = ({ company, contactCount, onClick }) => {
  const statusConfig = STATUS_CONFIG[company.status];
  const totalDealValue =
    company.activeDeals?.reduce((sum, deal) => sum + deal.value, 0) || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center shrink-0">
          <Building2 size={18} className="text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
              {company.name}
            </h3>
          </div>
          <p className="text-xs text-zinc-500 truncate">{company.industry}</p>
          <p className="text-xs text-zinc-400 truncate">{company.location}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <span
          className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${statusConfig.color}`}
        >
          {statusConfig.label}
        </span>
        <span
          className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${CATEGORY_CONFIG[company.category].color}`}
        >
          {CATEGORY_CONFIG[company.category].label}
        </span>
        {company.tier && (
          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {company.tier.charAt(0).toUpperCase() + company.tier.slice(1)}
          </span>
        )}
      </div>

      {/* AI Summary */}
      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
        {company.aiSummary}
      </p>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
          <Users size={10} />
          <span>{contactCount} contacts</span>
        </div>
        {totalDealValue > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
            <DollarSign size={10} />
            <span>${(totalDealValue / 1000).toFixed(0)}K pipeline</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <Clock size={10} />
          <span>Last: {company.lastActivity}</span>
        </div>
        {company.needsAttention && (
          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
            <AlertTriangle size={10} />
            <span>Needs attention</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Company Drawer Component
const CompanyDrawer: React.FC<{
  company: Company | null;
  contacts: Contact[];
  onClose: () => void;
  onContactClick: (contact: Contact) => void;
}> = ({ company, contacts, onClose, onContactClick }) => {
  if (!company) return null;

  const companyContacts = contacts.filter((c) =>
    company.contactIds.includes(c.id),
  );
  const statusConfig = STATUS_CONFIG[company.status];
  const totalDealValue =
    company.activeDeals?.reduce((sum, deal) => sum + deal.value, 0) || 0;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail;
      case "meeting":
        return Calendar;
      case "call":
        return Phone;
      case "note":
        return FileText;
      case "deal_update":
        return TrendingUp;
      default:
        return MessageSquare;
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center">
            <Building2 size={24} className="text-zinc-500 dark:text-zinc-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {company.name}
            </h2>
            <p className="text-sm text-zinc-500">
              {company.industry} • {company.size}
            </p>
            <p className="text-sm text-zinc-400">{company.location}</p>
          </div>
        </div>

        {/* Status and Category */}
        <div className="flex items-center gap-2 mt-4">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-lg ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-lg ${CATEGORY_CONFIG[company.category].color}`}
          >
            {CATEGORY_CONFIG[company.category].label}
          </span>
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 mt-4">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Globe size={12} />
              Website
            </a>
          )}
          {company.linkedIn && (
            <a
              href={`https://${company.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Link size={12} />
              LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Attention Alert */}
        {company.needsAttention && company.attentionReason && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle
                size={14}
                className="text-amber-600 dark:text-amber-400 mt-0.5"
              />
              <div>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Needs Attention
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  {company.attentionReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Summary */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            AI Summary
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {company.aiSummary}
          </p>
        </div>

        {/* Active Deals */}
        {company.activeDeals && company.activeDeals.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Active Deals ({company.activeDeals.length})
            </h3>
            <div className="space-y-2">
              {company.activeDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {deal.name}
                    </span>
                    <span
                      className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${DEAL_STAGE_CONFIG[deal.stage].color}`}
                    >
                      {DEAL_STAGE_CONFIG[deal.stage].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <DollarSign size={10} />${(deal.value / 1000).toFixed(0)}K
                    </span>
                    <span>{deal.probability}% probability</span>
                    {deal.closeDate && <span>Close: {deal.closeDate}</span>}
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Total Pipeline</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ${(totalDealValue / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Insights */}
        {company.keyInsights && company.keyInsights.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Key Insights
            </h3>
            <ul className="space-y-1.5">
              {company.keyInsights.map((insight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <ChevronRight
                    size={12}
                    className="text-blue-500 mt-1 shrink-0"
                  />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {company.risks && company.risks.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Risks
            </h3>
            <ul className="space-y-1.5">
              {company.risks.map((risk, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                >
                  <AlertTriangle size={12} className="mt-1 shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Opportunities */}
        {company.opportunities && company.opportunities.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Opportunities
            </h3>
            <ul className="space-y-1.5">
              {company.opportunities.map((opp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                >
                  <TrendingUp size={12} className="mt-1 shrink-0" />
                  {opp}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contacts */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Contacts ({companyContacts.length})
          </h3>
          <div className="space-y-2">
            {companyContacts.map((contact) => {
              const initials = `${contact.firstName[0]}${contact.lastName[0]}`;
              const isPrimary = contact.id === company.primaryContactId;
              const warmthConfig = WARMTH_CONFIG[contact.warmth];
              const WarmthIcon = warmthConfig.icon;

              return (
                <div
                  key={contact.id}
                  onClick={() => onContactClick(contact)}
                  className="flex items-center gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">
                        {contact.firstName} {contact.lastName}
                      </span>
                      {isPrimary && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          Primary
                        </span>
                      )}
                      <WarmthIcon size={10} className={warmthConfig.color} />
                    </div>
                    <p className="text-xs text-zinc-500 truncate">
                      {contact.title}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-zinc-400" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Recent Activity ({company.totalInteractions} total)
          </h3>
          <div className="space-y-2">
            {company.activities.slice(0, 6).map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                    <Icon size={12} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                        {activity.title}
                      </p>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {activity.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                      {activity.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        {company.tags.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {company.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Contact Card Component
const ContactCard: React.FC<{
  contact: Contact;
  onClick: () => void;
}> = ({ contact, onClick }) => {
  const relationshipConfig = RELATIONSHIP_CONFIG[contact.relationship];
  const warmthConfig = WARMTH_CONFIG[contact.warmth];
  const WarmthIcon = warmthConfig.icon;
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center text-sm font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
              {contact.firstName} {contact.lastName}
            </h3>
            <WarmthIcon size={12} className={warmthConfig.color} />
          </div>
          <p className="text-xs text-zinc-500 truncate">{contact.title}</p>
          <p className="text-xs text-zinc-400 truncate">{contact.company}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <span
          className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${relationshipConfig.color}`}
        >
          {relationshipConfig.label}
        </span>
        <span
          className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${CATEGORY_CONFIG[contact.category].color}`}
        >
          {CATEGORY_CONFIG[contact.category].label}
        </span>
      </div>

      {/* AI Summary */}
      <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
        {contact.aiSummary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[10px] text-zinc-400">
          <Clock size={10} />
          <span>Last: {contact.lastContacted}</span>
        </div>
        {contact.needsAttention && (
          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
            <AlertTriangle size={10} />
            <span>Needs attention</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Contact Drawer Component
const ContactDrawer: React.FC<{
  contact: Contact | null;
  onClose: () => void;
}> = ({ contact, onClose }) => {
  if (!contact) return null;

  const relationshipConfig = RELATIONSHIP_CONFIG[contact.relationship];
  const warmthConfig = WARMTH_CONFIG[contact.warmth];
  const WarmthIcon = warmthConfig.icon;
  const RelationshipIcon = relationshipConfig.icon;
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`;

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail;
      case "meeting":
        return Calendar;
      case "call":
        return Phone;
      case "slack":
        return MessageSquare;
      default:
        return MessageSquare;
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 400 }}
      className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center text-lg font-bold text-zinc-600 dark:text-zinc-300">
            {initials}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {contact.firstName} {contact.lastName}
            </h2>
            <p className="text-sm text-zinc-500">{contact.title}</p>
            <p className="text-sm text-zinc-400">{contact.company}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
            <Mail size={12} />
            Email
          </button>
          {contact.phone && (
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
              <Phone size={12} />
              Call
            </button>
          )}
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <Calendar size={12} />
            Schedule
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Attention Alert */}
        {contact.needsAttention && contact.attentionReason && (
          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle
                size={14}
                className="text-amber-600 dark:text-amber-400 mt-0.5"
              />
              <div>
                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                  Needs Attention
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  {contact.attentionReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Relationship Info */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Relationship
          </h3>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${relationshipConfig.color}`}
            >
              <RelationshipIcon size={12} />
              <span className="text-xs font-medium">
                {relationshipConfig.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <WarmthIcon size={12} className={warmthConfig.color} />
              <span>{warmthConfig.label}</span>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            AI Summary
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {contact.aiSummary}
          </p>
        </div>

        {/* Talking Points */}
        {contact.talkingPoints && contact.talkingPoints.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Suggested Talking Points
            </h3>
            <ul className="space-y-1.5">
              {contact.talkingPoints.map((point, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400"
                >
                  <ChevronRight
                    size={12}
                    className="text-emerald-500 mt-1 shrink-0"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {contact.risks && contact.risks.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Risks
            </h3>
            <ul className="space-y-1.5">
              {contact.risks.map((risk, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                >
                  <AlertTriangle size={12} className="mt-1 shrink-0" />
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Interactions */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Recent Interactions
          </h3>
          <div className="space-y-2">
            {contact.interactions.slice(0, 5).map((interaction) => {
              const Icon = getInteractionIcon(interaction.type);
              return (
                <div
                  key={interaction.id}
                  className="flex items-start gap-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50"
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0">
                    <Icon size={12} className="text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                        {interaction.subject}
                      </p>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        {interaction.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                      {interaction.summary}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Contact Info
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <Mail size={12} className="text-zinc-400" />
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {contact.email}
              </a>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Phone size={12} className="text-zinc-400" />
                <span>{contact.phone}</span>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <MapPin size={12} className="text-zinc-400" />
                <span>{contact.location}</span>
              </div>
            )}
            {contact.linkedIn && (
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <ExternalLink size={12} className="text-zinc-400" />
                <a
                  href={`https://${contact.linkedIn}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {contact.notes && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Notes
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {contact.notes}
            </p>
          </div>
        )}

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {contact.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const CrmPage: React.FC<CrmPageProps> = ({ contacts, companies }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("companies");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ContactCategory | null>(null);
  const [showNeedsAttention, setShowNeedsAttention] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchable = [
          contact.firstName,
          contact.lastName,
          contact.company,
          contact.title,
          contact.email,
          contact.aiSummary,
        ]
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      // Category filter
      if (selectedCategory && contact.category !== selectedCategory)
        return false;

      // Needs attention filter
      if (showNeedsAttention && !contact.needsAttention) return false;

      return true;
    });
  }, [contacts, searchQuery, selectedCategory, showNeedsAttention]);

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchable = [
          company.name,
          company.industry,
          company.location,
          company.aiSummary,
        ]
          .join(" ")
          .toLowerCase();
        if (!searchable.includes(query)) return false;
      }

      // Category filter
      if (selectedCategory && company.category !== selectedCategory)
        return false;

      // Needs attention filter
      if (showNeedsAttention && !company.needsAttention) return false;

      return true;
    });
  }, [companies, searchQuery, selectedCategory, showNeedsAttention]);

  // Group contacts by category
  const groupedContacts = useMemo(() => {
    const groups: Record<string, Contact[]> = {};
    filteredContacts.forEach((contact) => {
      const key = contact.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(contact);
    });
    return Object.entries(groups).sort(([a], [b]) => {
      const order = ["client", "investor", "partner", "team", "other"];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [filteredContacts]);

  // Group companies by category
  const groupedCompanies = useMemo(() => {
    const groups: Record<string, Company[]> = {};
    filteredCompanies.forEach((company) => {
      const key = company.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(company);
    });
    return Object.entries(groups).sort(([a], [b]) => {
      const order = ["client", "investor", "partner", "team", "other"];
      return order.indexOf(a) - order.indexOf(b);
    });
  }, [filteredCompanies]);

  const needsAttentionCount =
    viewMode === "companies"
      ? companies.filter((c) => c.needsAttention).length
      : contacts.filter((c) => c.needsAttention).length;

  const getContactCountForCompany = (company: Company) => {
    return contacts.filter((c) => company.contactIds.includes(c.id)).length;
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                CRM
              </h1>
              <p className="text-xs text-zinc-500">
                {viewMode === "companies"
                  ? `${companies.length} companies`
                  : `${contacts.length} contacts`}
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <button
                onClick={() => setViewMode("companies")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "companies"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <Building2 size={12} />
                Companies
              </button>
              <button
                onClick={() => setViewMode("contacts")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "contacts"
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <Users size={12} />
                Contacts
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  viewMode === "companies"
                    ? "Search companies..."
                    : "Search contacts..."
                }
                className="w-full h-9 pl-9 pr-4 text-sm rounded-lg bg-zinc-100 dark:bg-zinc-800 border-0 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Needs Attention Toggle */}
            <button
              onClick={() => setShowNeedsAttention(!showNeedsAttention)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                showNeedsAttention
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <AlertTriangle size={12} />
              Needs Attention ({needsAttentionCount})
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                !selectedCategory
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === key ? null : (key as ContactCategory),
                  )
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedCategory === key
                    ? config.color
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "companies" ? (
            // Companies View
            filteredCompanies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Building2 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                <p className="text-sm text-zinc-500">No companies found</p>
                <p className="text-xs text-zinc-400 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {groupedCompanies.map(([category, categoryCompanies]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {CATEGORY_CONFIG[category as ContactCategory].label}
                      </h2>
                      <span className="text-[10px] text-zinc-400">
                        ({categoryCompanies.length})
                      </span>
                      <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <AnimatePresence>
                        {categoryCompanies.map((company) => (
                          <CompanyCard
                            key={company.id}
                            company={company}
                            contactCount={getContactCountForCompany(company)}
                            onClick={() => setSelectedCompany(company)}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : // Contacts View
          filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Users className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="text-sm text-zinc-500">No contacts found</p>
              <p className="text-xs text-zinc-400 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedContacts.map(([category, categoryContacts]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {CATEGORY_CONFIG[category as ContactCategory].label}
                    </h2>
                    <span className="text-[10px] text-zinc-400">
                      ({categoryContacts.length})
                    </span>
                    <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {categoryContacts.map((contact) => (
                        <ContactCard
                          key={contact.id}
                          contact={contact}
                          onClick={() => setSelectedContact(contact)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Drawer */}
      <AnimatePresence>
        {selectedContact && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedContact(null)}
              className="fixed inset-0 bg-black/20 z-40"
            />
            <ContactDrawer
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Company Drawer */}
      <AnimatePresence>
        {selectedCompany && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCompany(null)}
              className="fixed inset-0 bg-black/20 z-40"
            />
            <CompanyDrawer
              company={selectedCompany}
              contacts={contacts}
              onClose={() => setSelectedCompany(null)}
              onContactClick={(contact) => {
                setSelectedCompany(null);
                setSelectedContact(contact);
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CrmPage;
