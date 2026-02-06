import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { 
  Maximize2, 
  Minimize2, 
  Layout, 
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
  Monitor
} from 'lucide-react';
import sentraLogo from './assets/2d867a3a115cb7771d8ca0fe7bf3c137b72785fa.png';
import { PillState } from './components/PillState';
import { NowScreen } from './components/NowScreen';
import { SwimlaneDetailScreen } from './components/SwimlaneDetailScreen';
import { SwimlanesScreen as NewSwimlanesScreen } from './components/SwimlanesScreen';
import { PersistentChatBar } from './components/PersistentChatBar';
import { ChatInterface } from './components/ChatInterface';
import { alerts, commitments, meetingBriefs, memoryMap, extendedReports, ExtendedReport, swimlanesList, SwimlaneMeta, timelineData, TimelineItem, relationshipAlerts, asyncCommitments, contacts, companies } from './data';
import { Alert, Commitment, MeetingBrief } from './types';
import { DynamicBackground } from './components/DynamicBackground';
import { HighlightedContent, CommentLayer, CommentPanel, CommentHighlight } from './components/ReportComments';
import { CrmPage } from './components/CrmPage';

// --- Types ---
type ViewMode = 'pill' | 'compact' | 'expanded';
type NavTab = 'Now' | 'Reports' | 'Swimlanes' | 'Meetings' | 'CRM' | 'ToDo' | 'Settings';
type ReportCategory = 'Ad Hoc' | 'Weekly' | 'Radar' | 'Team';

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
  const [activeSection, setActiveSection] = useState('Account');
  const { theme, setTheme } = useTheme();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamNote, setNewTeamNote] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [teamMemberQuery, setTeamMemberQuery] = useState('');
  const [newTeamMembersText, setNewTeamMembersText] = useState('');
  const integrationIcons: Record<string, React.ReactNode> = {
    Slack: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <rect x="2" y="9" width="6" height="6" rx="2" fill="#36C5F0" />
        <rect x="8" y="2" width="6" height="6" rx="2" fill="#2EB67D" />
        <rect x="16" y="8" width="6" height="6" rx="2" fill="#E01E5A" />
        <rect x="10" y="16" width="6" height="6" rx="2" fill="#ECB22E" />
      </svg>
    ),
    'Google Workspace': (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#E9F1FF" />
        <path d="M12 5.5a6.5 6.5 0 1 0 4.6 11.1l-2.4-2.1H12V11h6.2A6.5 6.5 0 0 0 12 5.5z" fill="#4285F4" />
        <path d="M5.7 9.5 8.4 11a4.5 4.5 0 0 1 3.6-2.1c1 0 2 .3 2.7.9l2-2A6.5 6.5 0 0 0 12 5.5c-2.5 0-4.7 1.4-6 3.5z" fill="#34A853" />
        <path d="M6.7 16.2 9 14.5a4.5 4.5 0 0 1-1-2.5H5.2c.1 1.6.7 3 1.5 4.2z" fill="#FBBC05" />
        <path d="M12 18.5c1.6 0 3.1-.6 4.2-1.5l-2.4-2.1c-.5.3-1.1.4-1.8.4-1.7 0-3.1-1.1-3.6-2.6l-2.3 1.7c1 2.3 3.3 4.1 5.9 4.1z" fill="#EA4335" />
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
        <path d="M7 12a5 5 0 1 1 5 5" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 7a5 5 0 0 1 5 5" fill="none" stroke="#7A7A7A" strokeWidth="1.8" strokeLinecap="round" />
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
        <path d="M9 18c0-1.2.9-2.1 2.1-2.1h1.8c1.2 0 2.1.9 2.1 2.1" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8 10c.6-1.1 2-2 4-2s3.4.9 4 2" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="9.5" cy="12" r="1" fill="#fff" />
        <circle cx="14.5" cy="12" r="1" fill="#fff" />
      </svg>
    )
  };

  const sections = [
    { id: 'Account', label: 'Account', icon: Users },
    { id: 'Integrations', label: 'Integrations', icon: GitCommit },
    { id: 'Privacy', label: 'Privacy & Permissions', icon: AlertTriangle }, // reusing icon for now
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Personalization', label: 'Personalization', icon: Layout },
    { id: 'Users', label: 'Users & Teams', icon: Users }
  ];

  return (
    <div className="flex h-full bg-[color:var(--app-surface-2)] relative">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-[color:var(--app-border)] p-6 flex flex-col gap-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 px-3">Settings</h2>
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === section.id ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-2xl">
          <header className="mb-8 border-b border-[color:var(--app-border)] pb-4">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{activeSection}</h1>
          </header>

          {activeSection === 'Personalization' && (
            <div className="space-y-8">
               <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase mb-4">Appearance</label>
                  <div className="grid grid-cols-3 gap-4">
                     <button 
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                     >
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900">
                           <Sun size={20} />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'light' ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>Light</span>
                     </button>
                     
                     <button 
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                     >
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-100">
                           <Moon size={20} />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>Dark</span>
                     </button>
                     
                     <button 
                        onClick={() => setTheme('system')}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'system' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
                     >
                        <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                           <Monitor size={20} />
                        </div>
                        <span className={`text-sm font-medium ${theme === 'system' ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>System</span>
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeSection === 'Users' && (
            <div className="space-y-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Users</h3>
                </div>
                <div className="border border-[color:var(--app-border)] rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-[color:var(--app-border)]">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Photo</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-2">
                            <input
                              value={user.name}
                              onChange={(e) => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, name: e.target.value } : u))}
                              className="w-full rounded-md border border-[color:var(--app-border)] bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={user.title}
                              onChange={(e) => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, title: e.target.value } : u))}
                              className="w-full rounded-md border border-[color:var(--app-border)] bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={user.email}
                              onChange={(e) => setUsers(prev => prev.map(u => u.id === user.id ? { ...u, email: e.target.value } : u))}
                              className="w-full rounded-md border border-[color:var(--app-border)] bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => setUsers(prev => prev.filter(u => u.id !== user.id))}
                              className="text-xs font-semibold text-zinc-400 hover:text-red-600"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="px-4 py-2 text-xs text-zinc-500">{users.length} employees</td>
                        <td />
                        <td />
                        <td />
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => setUsers(prev => ([
                              ...prev,
                              {
                                id: `u-${Date.now()}`,
                                name: 'New User',
                                title: 'Team Member',
                                email: 'new.user@sentra.ai',
                                avatar: `https://i.pravatar.cc/64?u=${Date.now()}`,
                              },
                            ]))}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
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
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Teams</h3>
                  
                </div>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Members</th>
                        <th className="px-4 py-2">Note</th>
                        <th className="px-4 py-2 text-right">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--app-border)]">
                      {teams.map(team => (
                        <tr key={team.id}>
                          <td className="px-4 py-2">
                            <input
                              value={team.name}
                              onChange={(e) => setTeams(prev => prev.map(t => t.id === team.id ? { ...t, name: e.target.value } : t))}
                              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={team.membersText ?? team.memberIds.map(id => users.find(u => u.id === id)?.name).filter(Boolean).join(', ')}
                              onChange={(e) => setTeams(prev => prev.map(t => t.id === team.id ? { ...t, membersText: e.target.value } : t))}
                              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                              placeholder="Type names, comma separated"
                              list="team-members"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              value={team.note || ''}
                              onChange={(e) => setTeams(prev => prev.map(t => t.id === team.id ? { ...t, note: e.target.value } : t))}
                              className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                            />
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              onClick={() => setTeams(prev => prev.filter(t => t.id !== team.id))}
                              className="text-xs font-semibold text-zinc-400 hover:text-red-600"
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
                            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                            placeholder="Team name"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={newTeamMembersText}
                            onChange={(e) => setNewTeamMembersText(e.target.value)}
                            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                            placeholder="Type names, comma separated"
                            list="team-members"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={newTeamNote}
                            onChange={(e) => setNewTeamNote(e.target.value)}
                            className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-sm"
                            placeholder="Team note"
                          />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => {
                              if (!newTeamName.trim()) return;
                              const names = newTeamMembersText.split(',').map(n => n.trim()).filter(Boolean);
                              const memberIds = names.map(name => users.find(u => u.name.toLowerCase() === name.toLowerCase())?.id).filter(Boolean) as string[];
                              setTeams(prev => ([
                                ...prev,
                                {
                                  id: `t-${Date.now()}`,
                                  name: newTeamName.trim(),
                                  memberIds,
                                  membersText: newTeamMembersText,
                                  note: newTeamNote.trim() || undefined,
                                },
                              ]));
                              setNewTeamName('');
                              setNewTeamMembersText('');
                              setNewTeamNote('');
                            }}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                          >
                            Add team +
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <datalist id="team-members">
                    {users.map(user => (
                      <option key={user.id} value={user.name} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Account' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                   <label className="block text-xs font-medium text-zinc-500 uppercase mb-2">Profile</label>
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-500">AL</div>
                     <div>
                       <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1.5 rounded-md transition-colors">
                         Upload New Photo
                       </button>
                       <p className="text-xs text-zinc-400 mt-1.5">JPG or PNG. Max 2MB.</p>
                     </div>
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase mb-1.5">First Name</label>
                    <input type="text" defaultValue="Alex" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase mb-1.5">Last Name</label>
                    <input type="text" defaultValue="Lewis" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 uppercase mb-1.5">Email Address</label>
                  <input type="email" defaultValue="alex.lewis@sentra.ai" className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Integrations' && (
            <div className="space-y-6">
              <p className="text-sm text-zinc-500 mb-6">Manage connections to your organization's data sources. Sentra uses these to generate intelligence.</p>
              
              {[
                { name: 'Slack', status: 'connected', description: 'Reading public channels and authorized private channels.' },
                { name: 'Google Workspace', status: 'connected', description: 'Indexing Calendar and Drive documents.' },
                { name: 'Jira', status: 'connected', description: 'Tracking issue status and velocity.' },
                { name: 'Linear', status: 'disconnected', description: 'Sync issues and project updates.' },
                { name: 'Zoom', status: 'disconnected', description: 'Import transcripts for meeting intelligence.' },
                { name: 'Asana', status: 'disconnected', description: 'Task tracking and project updates.' },
                { name: 'GitHub', status: 'disconnected', description: 'Link pull requests and engineering activity.' }
              ].map(app => (
                <div key={app.name} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-[color:var(--app-border)] rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                      {integrationIcons[app.name] ?? app.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{app.name}</h3>
                      <p className="text-xs text-zinc-500">{app.description}</p>
                    </div>
                  </div>
                  <button className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                    app.status === 'connected' 
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700' 
                      : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-200 dark:border-emerald-800/30'
                  }`}>
                    {app.status === 'connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'Privacy' && (
            <div className="space-y-8">
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 rounded-lg flex gap-3">
                <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">Enterprise Policy Active</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">Some settings are managed by your organization administrator.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">PII Redaction</h3>
                    <p className="text-xs text-zinc-500">Automatically redact emails and phone numbers from memory snapshots.</p>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Data Retention</h3>
                    <p className="text-xs text-zinc-500">How long Sentra stores processed intelligence.</p>
                  </div>
                  <select className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs text-zinc-700 dark:text-zinc-300">
                    <option>90 Days</option>
                    <option>1 Year</option>
                    <option>Indefinite</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'Notifications' && (
             <div className="space-y-6">
               {[
                 { title: 'Critical Alerts', desc: 'Immediate notification for high-risk anomalies.', state: true },
                 { title: 'Meeting Briefs', desc: 'Receive a briefing 15 mins before meetings.', state: true },
                 { title: 'Daily Digest', desc: 'Morning summary of yesterday’s memory.', state: true },
                 { title: 'New Swimlane Activity', desc: 'Updates on followed swimlanes.', state: false }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between">
                   <div>
                     <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                     <p className="text-xs text-zinc-500">{item.desc}</p>
                   </div>
                   <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors border ${item.state ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600'}`}>
                     <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${item.state ? 'right-1' : 'left-1'}`} />
                   </div>
                 </div>
               ))}
             </div>
          )}
          
          {activeSection === 'Personalization' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase mb-3">Theme</label>
                <div className="flex gap-4">
                  {['System', 'Light', 'Dark'].map(theme => (
                    <button key={theme} className={`px-4 py-2 rounded-md text-sm border transition-all ${theme === 'System' ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium' : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'}`}>
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                 <label className="block text-xs font-medium text-zinc-500 uppercase mb-3">Density</label>
                 <div className="flex gap-4">
                   <button className="px-4 py-2 rounded-md text-sm border border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-medium">Compact</button>
                   <button className="px-4 py-2 rounded-md text-sm border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300">Relaxed</button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button 
        className="absolute bottom-8 right-8 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg shadow-xl ring-1 ring-zinc-900/10 dark:ring-white/20 text-sm font-semibold hover:scale-105 transition-transform"
        onClick={onSimulateOnboarding}
      >
        Simulate Onboarding
      </button>
    </div>
  );
};

// --- Home Screen Components (from previous step) ---

const ViewControls = ({ mode, setMode }: { mode: ViewMode, setMode: (m: ViewMode) => void }) => {
  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <button 
        onClick={(e) => { e.stopPropagation(); setMode('pill'); }}
        className={`p-1.5 rounded-md transition-all ${mode === 'pill' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
        title="Minimize to Pill"
      >
        <Minimize2 size={14} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); setMode('compact'); }}
        className={`p-1.5 rounded-md transition-all ${mode === 'compact' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
        title="Compact Panel"
      >
        <Layout size={14} />
      </button>
      <button 
        onClick={(e) => { e.stopPropagation(); setMode('expanded'); }}
        className={`p-1.5 rounded-md transition-all ${mode === 'expanded' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
        title="Expand Window"
      >
        <Maximize2 size={14} />
      </button>
    </div>
  );
};

const SectionHeader = ({ title, count, icon: Icon }: { title: string, count?: number, icon?: any }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon size={14} className="text-zinc-400" />}
    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h3>
    {count !== undefined && (
      <span className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </div>
);

// --- Home Screen Components (from previous step) ---
const AlertItem = ({ alert }: { alert: Alert }) => (
  <div className="group p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm cursor-pointer">
    <div className="flex items-start gap-3">
      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate pr-2">{alert.title}</h4>
          <span className="text-[10px] text-zinc-400 font-mono whitespace-nowrap">{new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
        <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{alert.description}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-100 dark:border-zinc-800 text-zinc-500 flex items-center gap-1">
            <Hash size={8} /> {alert.source}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const CommitmentItem = ({ commitment, onClick }: { commitment: Commitment, onClick?: () => void }) => (
  <div onClick={onClick} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 cursor-pointer">
    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${commitment.status === 'completed' ? 'bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100' : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400'}`}>
      {commitment.status === 'completed' && <CheckCircle2 size={10} className="text-white dark:text-zinc-900" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium truncate transition-colors ${commitment.status === 'completed' ? 'text-zinc-400 line-through' : 'text-zinc-900 dark:text-zinc-200'}`}>{commitment.title}</p>
      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
        To: <span className="font-medium">{commitment.assignee}</span> • {commitment.dueDate}
      </p>
    </div>
    {commitment.status === 'overdue' && commitment.status !== 'completed' && (
      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">OD</span>
    )}
  </div>
);

const MeetingCard = ({ brief }: { brief: MeetingBrief }) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
          <Calendar size={16} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Next Meeting</h4>
          <p className="text-xs text-zinc-500 font-mono">{brief.time}</p>
        </div>
      </div>
      <button className="text-zinc-400 hover:text-zinc-600">
        <ArrowUpRight size={16} />
      </button>
    </div>
    
    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">{brief.title}</h3>
    
    <div className="space-y-3">
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium mb-1">Context</p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{brief.summary}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {brief.attendees.slice(0, 3).map(p => (
          <span key={p} className="text-xs px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400">
            {p}
          </span>
        ))}
        {brief.attendees.length > 3 && (
          <span className="text-xs px-2 py-1 text-zinc-400">+ {brief.attendees.length - 3}</span>
        )}
      </div>
    </div>
  </div>
);

const MemoryMap = () => {
  const [activeTab, setActiveTab] = useState<'topics' | 'decisions' | 'changes'>('topics');
  
  const items = memoryMap[activeTab] || [];
  
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col h-full min-h-[300px]">
      <div className="px-5 pt-5 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Memory Map</h3>
        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          {(['topics', 'decisions', 'changes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-2 overflow-y-auto flex-1">
        {items.map(item => (
          <div key={item.id} className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group cursor-pointer">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-mono text-zinc-400">{item.timestamp}</span>
              <span className="text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                {item.source}
              </span>
            </div>
            <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium mb-1">{item.text}</p>
            {item.context && <p className="text-xs text-zinc-500">{item.context}</p>}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 text-zinc-400 text-sm">
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
  { id: 'personal-commitment', name: 'Personal Commitment Report', question: 'What did I commit to, and what is pending or overdue?', timing: 'Daily / Weekly / Monthly', category: 'Personal', notes: 'Foundational trust-building report' },
  { id: 'weekly-activity', name: 'Weekly Personal Activity Summary', question: 'What happened this week across meetings and work?', timing: 'Weekly (auto-generated)', category: 'Personal', notes: 'Low-risk, high adoption' },
  { id: 'meeting-load', name: 'Meeting Load Report', question: 'How many meetings, with whom, and on what topics?', timing: 'Weekly / Monthly', category: 'Personal', notes: 'Useful for burnout / optimization' },
  { id: 'followup-debt', name: 'Follow-up Debt Report', question: 'What conversations require follow-up?', timing: 'Continuous, daily refresh', category: 'Personal', notes: 'Strong differentiator to note-takers' },
  { id: 'topic-engagement', name: 'Topic Engagement Report', question: 'What topics am I spending time on?', timing: 'Weekly / Monthly', category: 'Personal', notes: 'Evolves into focus analysis' },
  { id: 'relationship-touchpoint', name: 'Relationship Touchpoint Report', question: 'Who have I interacted with recently vs not?', timing: 'Weekly', category: 'Personal', notes: 'CRM-light but personal' },
  { id: 'performance-reflection', name: 'Personal Performance Reflection', question: 'What patterns are emerging in my work?', timing: 'Weekly / Monthly', category: 'Personal', notes: 'Should be phrased reflectively, not evaluative' },
  { id: 'deep-research', name: 'Deep Research / Topic Brief', question: 'What do we know about X from my memory?', timing: 'On-demand', category: 'Research', notes: 'Memory-grounded synthesis' },
  { id: 'meeting-series', name: 'Meeting Series Report', question: 'What has happened across recurring meetings?', timing: 'Weekly / On-demand', category: 'Team', notes: 'Extremely high value' },
  { id: 'decision-log', name: 'Decision Log (Meeting-Derived)', question: 'What decisions were made, when, and by whom?', timing: 'Continuous, append-only', category: 'Team', notes: 'Be careful with accuracy guarantees' },
  { id: 'action-items', name: 'Action Item Report', question: 'What actions emerged across meetings?', timing: 'Continuous, daily refresh', category: 'Team', notes: 'Closely tied to commitment tracker' },
  { id: 'unresolved-topics', name: 'Unresolved Topics Report', question: 'What keeps coming up but never gets resolved?', timing: 'Weekly', category: 'Team', notes: 'Early misalignment signal' },
  { id: 'attendance-participation', name: 'Attendance & Participation Report', question: 'Who is showing up and contributing?', timing: 'Weekly / Monthly', category: 'Team', notes: 'Sensitive; needs careful framing' },
  { id: 'team-weekly-memory', name: 'Team Weekly Memory Report', question: 'What happened across the team this week?', timing: 'Weekly', category: 'Team', notes: 'Admin-initially' },
  { id: 'shared-commitments', name: 'Shared Commitments Report', question: 'What has the team committed to collectively?', timing: 'Continuous, weekly roll-up', category: 'Team', notes: 'Forces clarity' },
  { id: 'ownership-responsibility', name: 'Ownership & Responsibility Report', question: 'Who owns what, implicitly or explicitly?', timing: 'Weekly / Monthly', category: 'Team', notes: 'Evolves into ownership drift' },
  { id: 'team-focus', name: 'Team Focus Report', question: 'What topics dominate team attention?', timing: 'Weekly / Monthly', category: 'Team', notes: 'Useful for founders' },
  { id: 'cross-meeting-consistency', name: 'Cross-Meeting Consistency Report', question: 'Are we saying the same thing across meetings?', timing: 'Weekly / On-demand', category: 'Team', notes: 'Very strong differentiator' },
  { id: 'team-checkin-synthesis', name: 'Team Check-in Synthesis', question: 'What did team members report this week?', timing: 'Weekly', category: 'Team', notes: 'Derived from check-ins' },
  { id: 'collaboration-graph', name: 'Collaboration Graph', question: 'How does information flow in the team?', timing: 'Monthly / On-demand', category: 'Team', notes: 'Often visual, not just text' },
  { id: 'misalignment-radar', name: 'Misalignment Radar', question: 'Where do narratives or goals diverge?', timing: 'Weekly', category: 'Radar', notes: "One of Sentra's signature reports" },
  { id: 'topic-drift', name: 'Topic Drift Report', question: 'How has focus shifted over time?', timing: 'Monthly', category: 'Radar', notes: 'Time-aware memory required' },
  { id: 'ownership-drift', name: 'Ownership Drift Report', question: 'Where ownership has silently shifted or disappeared', timing: 'Monthly / Quarterly', category: 'Radar', notes: 'Requires longitudinal memory' },
  { id: 'decision-reversal', name: 'Decision Reversal Report', question: 'Where decisions were implicitly undone', timing: 'On-demand', category: 'Radar', notes: 'Powerful but sensitive' },
  { id: 'responsibility-overload', name: 'Responsibility Overload Report', question: 'Who is overloaded with commitments?', timing: 'Weekly', category: 'Radar', notes: 'Needs careful UX' },
  { id: 'escalation-signal', name: 'Escalation Signal Report', question: 'Where issues are bubbling but not addressed', timing: 'Continuous monitoring', category: 'Radar', notes: 'Early warning system' },
  { id: 'organizational-decision-history', name: 'Organizational Decision History', question: 'How and why major decisions were made', timing: 'Continuous, append-only', category: 'Institutional', notes: 'Institutional memory' },
  { id: 'project-memory', name: 'Project Memory Report', question: 'What actually happened in a project lifecycle?', timing: 'On-demand / Post-project', category: 'Institutional', notes: 'Postmortem-ready' },
  { id: 'root-cause-analysis', name: 'Root Cause Analysis', question: 'Why did something fail or succeed?', timing: 'On-demand', category: 'Institutional', notes: 'Derived across many memories' },
  { id: 'cross-team-alignment', name: 'Cross-Team Alignment Report', question: 'Are teams aligned on priorities and language?', timing: 'Monthly / Quarterly', category: 'Institutional', notes: 'Exec-facing' },
  { id: 'institutional-knowledge', name: 'Institutional Knowledge Report', question: 'What does the organization "know" about X?', timing: 'On-demand', category: 'Institutional', notes: 'Replaces tribal knowledge' },
  { id: 'onboarding-memory-pack', name: 'Onboarding Memory Pack', question: 'What should a new hire know?', timing: 'On-demand (per hire)', category: 'Institutional', notes: 'Extremely compelling use case' },
  { id: 'sales-conversation-synthesis', name: 'Sales Conversation Synthesis', question: 'What are customers saying consistently?', timing: 'Weekly / Monthly', category: 'Customer', notes: 'Requires sales meeting ingestion' },
  { id: 'objection-theme', name: 'Objection & Theme Report', question: 'What objections recur across calls?', timing: 'Weekly / Monthly', category: 'Customer', notes: 'High ROI' },
  { id: 'deal-decision-history', name: 'Deal Decision History', question: 'How deals progressed or stalled', timing: 'Continuous', category: 'Customer', notes: 'CRM-adjacent but memory-based' },
  { id: 'account-relationship-map', name: 'Account Relationship Map', question: 'Who talks to whom at accounts?', timing: 'Continuous', category: 'Customer', notes: 'Strong differentiation' },
  { id: 'memory-coverage', name: 'Memory Coverage Report', question: 'What does Sentra know vs not know?', timing: 'On-demand / Monthly', category: 'Meta', notes: 'Transparency feature' },
  { id: 'data-source-utilization', name: 'Data Source Utilization Report', question: 'Which sources contribute most?', timing: 'Monthly', category: 'Meta', notes: 'Admin-facing' },
  { id: 'confidence-uncertainty', name: 'Confidence / Uncertainty Report', question: 'Where memory is weak or inferred', timing: 'On-demand', category: 'Meta', notes: 'Very important for trust' },
  { id: 'pre-mortem-risk', name: 'Pre-Mortem Risk Analysis', question: 'If this initiative fails, what are the most likely causes?', timing: 'On-demand', category: 'Risk', notes: 'Core pre-mortem artifact' },
  { id: 'assumption-risk', name: 'Assumption Risk Report', question: 'What assumptions are we making that may be wrong?', timing: 'On-demand', category: 'Risk', notes: 'Derived from language & commitments' },
  { id: 'historical-failure-analogy', name: 'Historical Failure Analogy Report', question: 'Where have we seen similar patterns fail before?', timing: 'On-demand', category: 'Risk', notes: 'Uses organizational memory' },
  { id: 'unowned-risk', name: 'Unowned Risk Report', question: 'What risks exist without clear ownership?', timing: 'Weekly / On-demand', category: 'Risk', notes: 'Tied to ownership drift' },
  { id: 'dependency-fragility', name: 'Dependency Fragility Report', question: 'Which dependencies create single points of failure?', timing: 'On-demand', category: 'Risk', notes: 'Requires project + people memory' },
  { id: 'silent-disagreement', name: 'Silent Disagreement Report', question: 'Where are people implicitly disagreeing?', timing: 'Weekly', category: 'Risk', notes: 'Strong differentiator' },
  { id: 'decision-confidence-gradient', name: 'Decision Confidence Gradient', question: 'How confident vs uncertain were key decisions?', timing: 'On-demand', category: 'Meta', notes: 'Uses uncertainty signals' },
  { id: 'risk-accumulation', name: 'Risk Accumulation Timeline', question: 'How has risk increased over time?', timing: 'Monthly', category: 'Risk', notes: 'Time-aware memory required' },
  { id: 'missed-signal', name: 'Missed Signal Report', question: 'What warning signs are already present?', timing: 'Weekly', category: 'Risk', notes: 'Early detection system' },
  { id: 'execution-readiness', name: 'Execution Readiness Report', question: 'Are we actually ready to execute this?', timing: 'On-demand', category: 'Risk', notes: 'Combines commitments + capacity' },
];

// Helper types for report grouping
type ReportGroupMode = 'date' | 'category';

interface ReportGroup {
  key: string;
  label: string;
  reports: ExtendedReport[];
}

// Helper to parse date from dateRange string
function parseDateFromRange(dateRange: string): Date {
  // Handle formats like "Jan 26 - Feb 01", "Q1 2026", "January 2026", "Feb 2026", etc.
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const lowerRange = dateRange.toLowerCase();

  // Try to extract month and year
  let month = monthNames.findIndex(m => lowerRange.includes(m));
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
  const monthShort = date.toLocaleDateString('en-US', { month: 'short' });
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
  const monthFull = date.toLocaleDateString('en-US', { month: 'long' });
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
    const monthName = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const key = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;

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
  const categoryOrder = ['Weekly', 'Radar', 'Team', 'Ad Hoc'];
  const groups = new Map<string, ReportGroup>();

  for (const report of reports) {
    const category = report.category;
    if (!groups.has(category)) {
      groups.set(category, { key: category, label: category.toUpperCase(), reports: [] });
    }
    groups.get(category)!.reports.push(report);
  }

  // Sort groups by category order
  return Array.from(groups.values()).sort((a, b) =>
    categoryOrder.indexOf(a.key) - categoryOrder.indexOf(b.key)
  );
}

const ReportsScreen = ({
  teams,
  users,
}: {
  teams: AppTeam[];
  users: AppUser[];
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(extendedReports[0]?.id || null);
  const [showNewReport, setShowNewReport] = useState(false);
  const [reportsState, setReportsState] = useState<ExtendedReport[]>(extendedReports);
  const [reportType, setReportType] = useState<ReportCategory>('Ad Hoc');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedReportType, setSelectedReportType] = useState<typeof REPORT_TYPES[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groupMode, setGroupMode] = useState<ReportGroupMode>('date');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [contentTab, setContentTab] = useState<'reports' | 'radar'>('reports');
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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Comment state
  const [highlights, setHighlights] = useState<CommentHighlight[]>([]);
  const [activeHighlightId, setActiveHighlight] = useState<string | null>(null);
  const [pendingSelection, setPendingSelection] = useState<{ text: string; startOffset: number; endOffset: number } | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups(prev => {
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
        userName: users[0]?.name || 'You',
        text,
        createdAt: new Date(),
      },
    };
    setHighlights(prev => [...prev, newHighlight]);
    setPendingSelection(null);
    setIsComposerOpen(false);
    setActiveHighlight(newHighlight.id);
  };

  const updateComment = (highlightId: string, newText: string) => {
    setHighlights(prev => prev.map(h =>
      h.id === highlightId && h.comment ? { ...h, comment: { ...h.comment, text: newText } } : h
    ));
  };

  const deleteComment = (highlightId: string) => {
    setHighlights(prev => prev.filter(h => h.id !== highlightId));
    if (activeHighlightId === highlightId) setActiveHighlight(null);
  };

  // Filter reports based on search and category
  const filteredReports = React.useMemo(() => {
    return reportsState.filter(report => {
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
    return groupMode === 'date'
      ? groupReportsByDate(filteredReports)
      : groupReportsByCategory(filteredReports);
  }, [filteredReports, groupMode]);

  const activeReport = reportsState.find(r => r.id === selectedReportId);
  const hasActiveFilters = selectedCategory !== null;

  // Track scroll progress
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const progress = scrollHeight > clientHeight
        ? scrollTop / (scrollHeight - clientHeight)
        : 0;
      setScrollProgress(progress);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
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
        className="flex-none border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/50 relative"
        style={{ width: sidebarWidth }}
      >
        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`absolute top-0 right-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500/50 transition-colors z-10 ${isResizing ? 'bg-emerald-500/50' : ''}`}
        />
        {/* Header */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Reports</span>
            <button
              onClick={() => setShowNewReport(true)}
              className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
              title="Settings"
            >
              <Settings size={12} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-7 pl-7 pr-2 text-[11px] rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Type Selection - always visible */}
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-2 py-1.5 text-[11px] rounded transition-colors ${
                !selectedCategory
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                  : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              All Reports
            </button>
            {['Weekly', 'Radar', 'Team', 'Ad Hoc'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`w-full text-left px-2 py-1.5 text-[11px] rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium'
                    : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
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
                  className="w-full flex items-center gap-1 px-3 py-1.5 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <ChevronRight
                    size={10}
                    className={`text-zinc-400 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                  />
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-zinc-400">
                    {group.label}
                  </span>
                </button>

                {/* Reports in this group */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
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
                                  ? 'bg-zinc-200/70 dark:bg-zinc-800'
                                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                              }`}
                            >
                              <div className="text-[10px] text-zinc-400 mb-0.5">
                                {formatReportDate(report.dateRange)}
                              </div>
                              <h3 className={`font-medium text-[12px] leading-tight line-clamp-2 ${
                                isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'
                              }`}>
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
              <p className="text-[11px] text-zinc-400">No reports</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-1 text-[10px] text-emerald-600 hover:underline">
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-zinc-400">Auto-generated</span>
          </div>
        </div>
      </div>

      {/* Right Reading Pane */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {/* Top header with tabs */}
        <div className="shrink-0 px-8 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-4">
          <button
            onClick={() => setContentTab('reports')}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              contentTab === 'reports'
                ? 'text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <FileText size={12} />
            Reports
          </button>
          <button
            onClick={() => setContentTab('radar')}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
              contentTab === 'radar'
                ? 'text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            <BarChart2 size={12} />
            Radar
          </button>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {/* Reading progress indicator */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px] bg-emerald-500 origin-left z-10"
            style={{ scaleX: scrollProgress }}
          />

          {selectedReportId && activeReport ? (
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-auto"
            >
              <div ref={positioningRef} className="relative min-h-full">
                <div className="max-w-2xl mx-auto px-8 py-8 lg:px-12 lg:py-10">
                  {/* Report Header - redesigned to match screenshot */}
                  <div className="mb-8">
                    {/* Week badge and date */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Week {getWeekNumber(activeReport.dateRange)}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {formatFullDateRange(activeReport.dateRange)}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 leading-tight">
                      {activeReport.title}
                    </h1>

                    {/* Action buttons row */}
                    <div className="flex items-center justify-end gap-3">
                      <button className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors">
                        <ExternalLink size={14} />
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <Sparkles size={12} />
                        Review
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
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
                          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                            {section.heading}
                          </h2>
                          <p className="text-sm leading-7 text-zinc-700 dark:text-zinc-300 mb-4">
                            {section.body}
                          </p>

                          {section.evidence.length > 0 && (
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
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
                <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                <p className="text-xs text-zinc-400">Select a report</p>
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNewReport(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">New Report</h2>
                <p className="text-xs text-zinc-500 mt-1">Choose report category and type</p>
              </div>
              <button
                onClick={() => {
                  setShowNewReport(false);
                  setSelectedReportType(null);
                  setReportType('Ad Hoc');
                }}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-700"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Step 1: Category Selection */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Report Category</label>
                <select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value as ReportCategory);
                    setSelectedReportType(null);
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                >
                  <option value="Ad Hoc">Ad Hoc (On-Demand)</option>
                  <option value="Weekly">Weekly / Recurring</option>
                  <option value="Radar">Radar / Monitoring</option>
                  <option value="Team">Team Reports</option>
                </select>
              </div>

              {/* Step 2: Specific Report Type Dropdown */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Report Type</label>
                <select
                  value={selectedReportType?.id || ''}
                  onChange={(e) => {
                    const report = REPORT_TYPES.find(rt => rt.id === e.target.value);
                    setSelectedReportType(report || null);
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                >
                  <option value="">Select a report type...</option>
                  {(() => {
                    let filteredReportTypes: typeof REPORT_TYPES = [];

                    if (reportType === 'Ad Hoc') {
                      filteredReportTypes = REPORT_TYPES.filter(rt =>
                        rt.timing.toLowerCase().includes('on-demand') ||
                        rt.timing.toLowerCase().includes('post-project')
                      );
                    } else if (reportType === 'Weekly') {
                      filteredReportTypes = REPORT_TYPES.filter(rt =>
                        rt.timing.toLowerCase().includes('weekly') ||
                        rt.timing.toLowerCase().includes('daily') ||
                        rt.timing.toLowerCase().includes('continuous')
                      );
                    } else if (reportType === 'Radar') {
                      filteredReportTypes = REPORT_TYPES.filter(rt =>
                        rt.category === 'Radar' ||
                        rt.category === 'Risk' ||
                        rt.category === 'Meta'
                      );
                    } else if (reportType === 'Team') {
                      filteredReportTypes = REPORT_TYPES.filter(rt =>
                        rt.category === 'Team' ||
                        rt.category === 'Institutional'
                      );
                    }

                    return filteredReportTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              {/* Show details when report type selected */}
              {selectedReportType && (
                <div className="bg-zinc-50 dark:bg-zinc-950 rounded-lg p-4 border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">What it answers</span>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{selectedReportType.question}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Timing</span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{selectedReportType.timing}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Notes</span>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 italic">{selectedReportType.notes}</p>
                  </div>
                </div>
              )}

              {/* Additional context */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Additional Context (Optional)</label>
                <div className="relative mt-1">
                  <textarea
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm min-h-[100px] pr-12"
                    placeholder="Add any specific requirements or context..."
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-700 shadow-sm"
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
                  setReportType('Ad Hoc');
                }}
                className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700"
              >
                Cancel
              </button>
              <button
                disabled={!selectedReportType}
                onClick={() => {
                  if (!selectedReportType) return;

                  setReportsState(prev => ([
                    {
                      id: `rep-new-${Date.now()}`,
                      title: selectedReportType.name,
                      category: reportType,
                      dateRange: selectedReportType.timing.split(' / ')[0],
                      summary: reportDescription || selectedReportType.question,
                      status: 'ready',
                      author: users[0]?.name || 'You',
                      readTime: '3 min read',
                      content: [{
                        heading: 'Summary',
                        body: reportDescription || selectedReportType.question,
                        evidence: []
                      }]
                    },
                    ...prev,
                  ]));
                  setShowNewReport(false);
                  setReportDescription('');
                  setSelectedReportType(null);
                  setReportType('Ad Hoc');
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  selectedReportType
                    ? 'bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900'
                    : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
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
  const [selectedLaneId, setSelectedLaneId] = useState<string | null>(swimlanesList[0]?.id || null);
  const [lanes, setLanes] = useState(swimlanesList);
  const [showNewSwimlane, setShowNewSwimlane] = useState(false);
  const [newLaneName, setNewLaneName] = useState('');
  const [newLaneDescription, setNewLaneDescription] = useState('');
  const [selectedLaneMemberIds, setSelectedLaneMemberIds] = useState<string[]>([]);
  const [laneMemberQuery, setLaneMemberQuery] = useState('');

  const activeLane = lanes.find(l => l.id === selectedLaneId);
  const filteredTimeline = activeLane ? timelineData.filter(t => t.swimlaneId === activeLane.id) : [];

  // Copy the Reports screen pattern exactly
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'blocked': return 'bg-red-500 text-red-500 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30';
      case 'on-track': return 'bg-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30';
      case 'delayed': return 'bg-orange-500 text-orange-500 bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30';
      case 'finished': return 'bg-zinc-400 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700';
      default: return 'bg-zinc-300 text-zinc-400';
    }
  };
  
  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'blocked': return 'Blocked';
          case 'on-track': return 'On Track';
          case 'delayed': return 'Late/Delayed';
          case 'finished': return 'Finished';
          default: return status;
      }
  };

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* Swimlanes List - copying Reports pattern */}
      <div className={`${selectedLaneId ? 'hidden md:flex md:w-80' : 'flex-1'} flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/30`}>
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Swimlanes</h2>
            <span className="text-xs text-zinc-400">{lanes.length} active</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Program timelines</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Active swimlanes</h3>
            <p className="text-xs text-zinc-400 mb-4">Click a swimlane to review decisions</p>
          </div>

          <div className="space-y-3">
            {lanes.map(lane => {
              const isSelected = selectedLaneId === lane.id;
              const statusStyles = getStatusColor(lane.status);

              return (
                <button
                  key={lane.id}
                  onClick={() => setSelectedLaneId(lane.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-sm'
                      : 'bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{lane.name}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${statusStyles.replace(statusStyles.split(' ')[0], '')}`}>
                      {getStatusLabel(lane.status)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">{lane.description}</p>
                  <div className="text-xs text-zinc-400">Updated {lane.lastUpdated}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setShowNewSwimlane(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 rounded-lg text-sm font-medium transition-colors"
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
        <div className="hidden md:flex flex-1 items-center justify-center text-zinc-300 dark:text-zinc-700 flex-col gap-4">
          <GitCommit size={48} className="opacity-20" />
          <p className="text-sm">Select a swimlane to view timeline</p>
        </div>
      )}

      {/* New Swimlane Modal */}
      {showNewSwimlane && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNewSwimlane(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">New Swimlane</h2>
                <p className="text-xs text-zinc-500 mt-1">Define the lane and what it should track.</p>
              </div>
              <button
                onClick={() => setShowNewSwimlane(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-700"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</label>
                <input
                  value={newLaneName}
                  onChange={(e) => setNewLaneName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                  placeholder="Q3 Product Strategy"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Members</label>
                <div className="mt-1 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 bg-zinc-50 dark:bg-zinc-950 relative">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedLaneMemberIds.map(id => {
                      const member = users.find(u => u.id === id);
                      if (!member) return null;
                      return (
                        <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600">
                          {member.name}
                          <button
                            onClick={() => setSelectedLaneMemberIds(prev => prev.filter(mid => mid !== id))}
                            className="text-zinc-400 hover:text-red-500"
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
                    <div className="absolute left-0 right-0 mt-2 max-h-40 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg z-10">
                      {users
                        .filter(u => u.name.toLowerCase().includes(laneMemberQuery.toLowerCase()))
                        .filter(u => !selectedLaneMemberIds.includes(u.id))
                        .map(u => (
                          <button
                            key={u.id}
                            onClick={() => {
                              setSelectedLaneMemberIds(prev => [...prev, u.id]);
                              setLaneMemberQuery('');
                            }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            {u.name}
                          </button>
                        ))}
                      {users.filter(u => u.name.toLowerCase().includes(laneMemberQuery.toLowerCase()) && !selectedLaneMemberIds.includes(u.id)).length === 0 && (
                        <div className="px-3 py-2 text-xs text-zinc-400">No matches</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Description</label>
                <textarea
                  value={newLaneDescription}
                  onChange={(e) => setNewLaneDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm min-h-[120px]"
                  placeholder="Describe what this swimlane should track and how it should filter relevant signals."
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNewSwimlane(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newLaneName.trim()) return;
                  const owner = users.find(u => u.id === selectedLaneMemberIds[0])?.name || 'Unassigned';
                  setLanes(prev => ([
                    ...prev,
                    {
                      id: `lane-${Date.now()}`,
                      name: newLaneName.trim(),
                      description: newLaneDescription.trim() || 'New swimlane.',
                      owner,
                      lastUpdated: 'Just now',
                      status: 'on-track',
                      summary: newLaneDescription.trim() || 'New swimlane created.',
                    },
                  ]));
                  setNewLaneName('');
                  setSelectedLaneMemberIds([]);
                  setLaneMemberQuery('');
                  setNewLaneDescription('');
                  setShowNewSwimlane(false);
                }}
                className="px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg"
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

// --- View States ---

// --- View States ---

const CommitmentItemCompact = ({ commitment, index, onComplete }: { commitment: Commitment, index: number, onComplete: () => void }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isCompleting) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1; // 1% every 100ms -> 10s total (approx, adjusted below)
        });
      }, 100); // 100ms * 100 = 10000ms = 10s
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isCompleting]);

  useEffect(() => {
    if (progress >= 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  const handleToggle = () => {
    if (isCompleting) {
      // Cancel completion
      setIsCompleting(false);
    } else {
      // Start completion
      setIsCompleting(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 group">
      {/* Progress Overlay - fills from left to right with visible green color */}
      {isCompleting && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-emerald-500/20 dark:from-emerald-500/25 dark:to-emerald-500/15 pointer-events-none z-0"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 10, ease: 'linear' }}
        />
      )}

      <div className="relative z-10 flex gap-3 p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
        <div
          onClick={handleToggle}
          className={`mt-0.5 w-5 h-5 rounded-md border cursor-pointer shrink-0 flex items-center justify-center transition-all ${
            isCompleting
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400'
          }`}
        >
          {isCompleting && <CheckCircle2 size={14} />}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium leading-snug mb-1 transition-colors ${isCompleting ? 'text-emerald-700 dark:text-emerald-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {commitment.title}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400">{commitment.context}</span>
            <span className="w-1 h-1 bg-zinc-300 rounded-full" />
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
              index === 0 ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
              index === 1 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
              'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
            }`}>
              {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : 'This week'}
            </span>
            {isCompleting && (
              <span className="ml-auto text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                {Math.floor(10 - (progress / 10))}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CompactState = ({
  setMode,
  commitments,
  onCompleteCommitment,
  isDesktopShell = false,
}: {
  setMode: (m: ViewMode) => void;
  commitments: Commitment[];
  onCompleteCommitment: (id: string) => void;
  isDesktopShell?: boolean;
}) => {
  const [viewState, setViewState] = useState<'default' | 'brief_expanded' | 'alerts_expanded'>('default');
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Filter active commitments for display
  const activeCommitments = commitments.filter(c => c.status !== 'completed').slice(0, 3);
  
  const nextMeeting = meetingBriefs[0];
  const activeAlerts = alerts;

  // Mock calendar data
  const todaysSchedule = [
    { id: 'cal1', time: '09:00 AM', title: 'Product Sync: Mobile Launch', duration: '30m', attendees: ['Alex', 'Sam', 'Jordan', 'Casey'] },
    { id: 'cal2', time: '11:00 AM', title: 'Client Call - Acme Corp', duration: '45m', attendees: ['Alex', 'Client'] },
    { id: 'cal3', time: '02:00 PM', title: 'Design Review', duration: '1h', attendees: ['Alex', 'Sarah'] },
    { id: 'cal4', time: '04:30 PM', title: 'Wrap-up', duration: '15m', attendees: ['Alex', 'Sam'] }
  ];

  const compactClass = isDesktopShell
    ? "absolute inset-0 w-full h-full bg-[color:var(--app-surface-2)] rounded-none shadow-none border-none z-50 flex flex-col overflow-hidden font-sans"
    : "fixed w-[400px] max-h-[85vh] bg-zinc-50 dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-40 flex flex-col overflow-hidden font-sans";

  // Position compact view: bottom-right corner, extends to edge (pill overlays)
  const compactStyle = isDesktopShell
    ? {}
    : {
        right: '8px',
        bottom: '32px'
      };

  return (
    <motion.div
      layoutId={isDesktopShell ? undefined : "sentra-shell"}
      className={compactClass}
      style={compactStyle}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
    >
      {/* Header Section */}
      <div className="px-6 pt-6 pb-2 flex justify-between items-start shrink-0">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Good afternoon, Alex</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Here's what needs your attention today.</p>
        </div>
        <div className="scale-90 origin-top-right">
           <ViewControls mode="compact" setMode={setMode} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
        
        {/* WHAT'S NEXT / CALENDAR / BRIEF CARD */}
        <AnimatePresence mode="wait">
          {viewState === 'brief_expanded' ? (
             <motion.div 
                key="brief"
                initial={{ opacity: 0, height: 200 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 200 }}
                className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800"
             >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    <Sparkles size={12} className="text-emerald-500" />
                    <span>Pre-Meeting Brief</span>
                  </div>
                  <button onClick={() => setViewState('default')} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">{nextMeeting.title}</h3>
                
                <div className="space-y-4">
                   <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">Context</p>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{nextMeeting.summary}</p>
                   </div>
                   
                   <div>
                      <p className="text-xs font-semibold text-zinc-500 mb-2">Key Topics</p>
                      <div className="flex flex-wrap gap-2">
                        {nextMeeting.keyTopics.map(topic => (
                          <span key={topic} className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                            {topic}
                          </span>
                        ))}
                      </div>
                   </div>

                   <div className="flex gap-2 pt-2">
                      <button className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
                        Join Meeting
                      </button>
                      <button className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        View Documents
                      </button>
                   </div>
                </div>
             </motion.div>
          ) : showCalendar ? (
            <motion.div 
               key="calendar"
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 min-h-[300px]"
            >
               <div className="flex justify-between items-center mb-5">
                 <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                   <Calendar size={12} />
                   <span>Today's Schedule</span>
                 </div>
                 <button onClick={() => setShowCalendar(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                   <X size={16} />
                 </button>
               </div>
               
               <div className="space-y-4 relative">
                 {/* Timeline line */}
                 <div className="absolute left-[52px] top-2 bottom-2 w-px bg-zinc-100 dark:bg-zinc-800" />

                 {todaysSchedule.map((event, i) => (
                   <div key={event.id} className="flex gap-4 relative">
                     <div className="w-10 text-[10px] font-mono text-zinc-400 pt-1 shrink-0 text-right">
                       {event.time.split(' ')[0]}
                     </div>
                     <div className={`flex-1 p-2 rounded-lg border ${i === 0 ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'} transition-colors`}>
                        <h4 className={`text-sm font-semibold ${i === 0 ? 'text-blue-900 dark:text-blue-100' : 'text-zinc-900 dark:text-zinc-200'}`}>{event.title}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{event.duration} • {event.attendees.length} attendees</p>
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          ) : (
            <motion.div 
               key="whatsnext"
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 group relative"
            >
               <button 
                  onClick={() => setShowCalendar(true)}
                  className="absolute right-3 top-3 p-1.5 rounded-md text-zinc-300 hover:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100"
                  title="View full schedule"
               >
                 <X size={14} />
               </button>

               <div className="flex justify-between items-center mb-4">
                 <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                   <Calendar size={12} />
                   <span>What's Next</span>
                 </div>
                 <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                   In 12 min
                 </span>
               </div>

               <div className="flex justify-between items-start mb-2">
                 <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{nextMeeting.title}</h3>
                 <div className="flex -space-x-2">
                   {nextMeeting.attendees.slice(0, 2).map((a, i) => (
                     <div key={i} className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                       {a.charAt(0)}
                     </div>
                   ))}
                   <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[8px] font-bold text-zinc-500">
                     +2
                   </div>
                 </div>
               </div>

               <div className="flex items-center gap-2 text-zinc-500 text-sm mb-5">
                 <Clock size={14} />
                 <span>9:00 AM</span>
                 <span className="text-zinc-300">•</span>
                 <span>30 min</span>
               </div>

               <button 
                 onClick={() => setViewState('brief_expanded')}
                 className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors mb-4"
               >
                 <Sparkles size={14} />
                 View Pre-Meeting Brief
               </button>

               <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
                 <span className="font-medium text-zinc-400">Later: Client Call - Acme Corp</span>
                 <span>11:00 AM</span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* COMMITMENTS CARD */}
        {viewState === 'default' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">
               <CheckCircle2 size={12} />
               <span>Commitments and Asks</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {activeCommitments.map((c, i) => (
                  <motion.div 
                    key={c.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                  >
                    <CommitmentItemCompact 
                      commitment={c} 
                      index={i} 
                      onComplete={() => onCompleteCommitment(c.id)} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {activeCommitments.length === 0 && (
                <div className="text-center py-4 text-sm text-zinc-400">
                  All caught up!
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ALERTS CARD */}
        {viewState === 'brief_expanded' ? null : (
          viewState === 'alerts_expanded' ? (
             <motion.div 
               layout
               className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 flex-1 min-h-0 flex flex-col"
             >
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    <AlertTriangle size={12} />
                    <span>Top Alerts</span>
                    <span className="ml-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {activeAlerts.length}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewState('default');
                    }}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="overflow-y-auto pr-2 space-y-3 -mr-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                  {activeAlerts.map(alert => (
                     <div key={alert.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/50">
                        <div className="flex gap-3">
                           <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                           <div>
                              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{alert.title}</h4>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2">{alert.description}</p>
                              <div className="text-[10px] font-mono text-zinc-400">{alert.source} • {new Date(alert.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                           </div>
                        </div>
                     </div>
                  ))}
                </div>
             </motion.div>
          ) : (
            <motion.div 
              layout
              onClick={() => setViewState('alerts_expanded')}
              className="bg-white dark:bg-zinc-900 px-5 py-4 rounded-2xl shadow-sm border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors shrink-0"
            >
               <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                 <AlertTriangle size={12} />
                 <span>Alerts</span>
                 <span className="ml-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                   {activeAlerts.length}
                 </span>
               </div>
               <ChevronRight size={16} className="text-zinc-300 rotate-90" />
            </motion.div>
          )
        )}
      </div>
    </motion.div>
  );
};

import { MeetingDetailCard, PreMeetingBriefOverlay } from './components/MeetingComponents';
import { MeetingDetailModal } from './components/MeetingDetailModal';
import { PersonDetailPanel } from './components/PersonDetailPanel';

import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

const MeetingsScreen = ({ setMode, setIsRecording, meetings, onTogglePrivacy }: { setMode: (m: ViewMode) => void, setIsRecording: (b: boolean) => void, meetings: MeetingBrief[], onTogglePrivacy: (id: string) => void }) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [selectedPersonName, setSelectedPersonName] = useState<string | null>(null);
  const [showTranscriptId, setShowTranscriptId] = useState<string | null>(null);
  const [activeReportsDropdownId, setActiveReportsDropdownId] = useState<string | null>(null);

  // Convert relative dates to actual date format (Feb 3, Feb 4, etc.)
  const formatMeetingTime = (timeString: string) => {
    const today = new Date(2026, 1, 3); // Feb 3, 2026 (months are 0-indexed)

    if (timeString.includes('Today')) {
      const timePart = timeString.split(', ')[1];
      return `Feb 3, ${timePart}`;
    } else if (timeString.includes('Tomorrow')) {
      const timePart = timeString.split(', ')[1];
      return `Feb 4, ${timePart}`;
    } else if (timeString.includes('Yesterday')) {
      const timePart = timeString.split(', ')[1];
      return `Feb 2, ${timePart}`;
    } else if (timeString.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/)) {
      // For day names like "Wed, 9:00 AM"
      const parts = timeString.split(', ');
      const dayName = parts[0];
      const timePart = parts[1];

      // Map day names to dates (assuming current week)
      const dayMap: Record<string, number> = {
        'Mon': 3, 'Tue': 4, 'Wed': 5, 'Thu': 6, 'Fri': 7, 'Sat': 8, 'Sun': 9
      };

      const date = dayMap[dayName] || 3;
      return `Feb ${date}, ${timePart}`;
    }

    return timeString; // Return as-is if already formatted
  };

  const getDateLabel = (timeString: string) => {
    if (timeString.includes('Today')) {
      return 'Feb 3';
    } else if (timeString.includes('Tomorrow')) {
      return 'Feb 4';
    } else if (timeString.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/)) {
      const dayName = timeString.split(',')[0];
      const dayMap: Record<string, string> = {
        'Mon': 'Feb 3', 'Tue': 'Feb 4', 'Wed': 'Feb 5', 'Thu': 'Feb 6', 'Fri': 'Feb 7', 'Sat': 'Feb 8', 'Sun': 'Feb 9'
      };
      return dayMap[dayName] || timeString.split(',')[0];
    }
    return timeString.split(',')[0];
  };

  const mockReports = [
    { id: 'rep-1', title: 'Executive Strategy Sync', category: 'Strategic', date: 'Feb 2, 2026' },
    { id: 'rep-2', title: 'Infrastructure Audit Results', category: 'Technical', date: 'Feb 1, 2026' },
    { id: 'rep-3', title: 'Q3 Product Roadmap v2', category: 'Product', date: 'Jan 30, 2026' },
    { id: 'rep-4', title: 'Team Performance Review', category: 'Operations', date: 'Jan 28, 2026' },
  ];
  const completed = meetings.filter(m => m.status === 'completed').sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  // Sort Upcoming: Newest (soonest) -> Furthest
  const upcoming = meetings.filter(m => m.status === 'scheduled').sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  
  const selectedMeeting = selectedMeetingId ? meetings.find(m => m.id === selectedMeetingId) || null : null;

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const upNextRef = React.useRef<HTMLDivElement>(null);
  
  // State for interactivity
  const [viewReportId, setViewReportId] = useState<string | null>(null);
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(null);

  React.useEffect(() => {
    // Scroll to the "Up Next" section on mount
    if (upNextRef.current && scrollContainerRef.current) {
        // Use a small timeout to ensure layout is stable
        setTimeout(() => {
            // Align "Up Next" to the top of the viewport with some padding
            const offset = upNextRef.current?.offsetTop || 0;
            scrollContainerRef.current?.scrollTo({
                top: offset - 20, // 20px padding from top
                behavior: 'smooth' // or 'auto' for instant
            });
        }, 100);
    }
  }, []);
  
  const viewingReport = viewReportId ? meetings.find(m => m.id === viewReportId) : null;
  const selectedDetail = selectedDetailId ? meetings.find(m => m.id === selectedDetailId) : null;
  const transcriptMeeting = showTranscriptId ? meetings.find(m => m.id === showTranscriptId) : null;

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth h-full relative">
      <TranscriptModal 
        isOpen={!!showTranscriptId} 
        onClose={() => setShowTranscriptId(null)} 
        meetingTitle={transcriptMeeting?.title}
      />
      {viewingReport && (
          <PreMeetingBriefOverlay 
            meeting={viewingReport} 
            onClose={() => setViewReportId(null)} 
          />
      )}
      
      {/* Modal for "Later" meetings details */}
      {selectedDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-3xl shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                 <button 
                    onClick={() => setSelectedDetailId(null)}
                    className="absolute top-4 right-4 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors z-10"
                 >
                    <X size={16} className="text-zinc-500" />
                 </button>
                 <MeetingDetailCard 
                    meeting={selectedDetail}
                    onDescriptionClick={() => {
                        // Close modal and open report
                        setSelectedDetailId(null);
                        setViewReportId(selectedDetail.id);
                    }}
                    onTogglePrivacy={() => onTogglePrivacy(selectedDetail.id)}
                 />
             </div>
             {/* Click outside to close */}
             <div className="absolute inset-0 -z-10" onClick={() => setSelectedDetailId(null)} />
          </div>
      )}

      <div className="max-w-5xl mx-auto flex flex-col min-h-full relative">
         <div className="absolute -inset-6 rounded-[2.5rem] bg-orange-500/10 blur-3xl pointer-events-none" />
         <div className="absolute -inset-1 rounded-[2.25rem] border border-orange-200/50 dark:border-orange-900/30 pointer-events-none" />
         <div className="relative flex flex-col min-h-full">
           <header className="mb-8 flex items-center justify-between shrink-0">
              <div>
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Meetings</h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-1">Upcoming and past discussions.</p>
              </div>
              <div className="flex items-center gap-3">
                 <button onClick={() => { setIsRecording(true); setMode('pill'); }} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/50 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors">
                    <Mic size={16} />
                    Start
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                   <Calendar size={16} />
                   Schedule
                 </button>
              </div>
           </header>

           <div className="space-y-6 pb-20">
            {/* History Section (Past Meetings) */}
            <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-center pb-2 pt-10">
                    <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex flex-col items-center gap-1 animate-pulse">
                       <ArrowUp size={12} />
                       Scroll for History
                    </div>
                </div>

                {completed.map(meeting => (
                   <div key={meeting.id} onClick={() => setSelectedMeetingId(meeting.id)} className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between group/card cursor-pointer hover:bg-white dark:hover:bg-zinc-900 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover/card:text-zinc-600 dark:group-hover/card:text-zinc-300 transition-colors">
                            <Calendar size={18} />
                         </div>
                         <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 group-hover/card:text-zinc-900 dark:group-hover/card:text-zinc-100">{meeting.title}</h3>
                              <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                                meeting.isPrivate 
                                  ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30'
                                  : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30'
                              }`}>
                                {meeting.isPrivate ? <Lock size={9} /> : <Unlock size={9} />}
                                {meeting.isPrivate ? 'Private' : 'Shared'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                               <span>{formatMeetingTime(meeting.time)}</span>
                               <span>•</span>
                               <span>{meeting.attendees.length} attendees</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             onTogglePrivacy(meeting.id);
                           }}
                           className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border transition-all shadow-sm cursor-pointer group/btn active:scale-95 ${
                             meeting.isPrivate
                               ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100 dark:border-orange-900/30 hover:bg-orange-100/70'
                               : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                           }`}
                         >
                           {meeting.isPrivate ? <Lock size={10} /> : <Unlock size={10} />}
                           {meeting.isPrivate ? 'Private' : 'Shared'}
                         </button>
                         {meeting.reportStatus === 'published' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowTranscriptId(meeting.id);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 rounded text-[10px] font-bold border border-emerald-100 dark:border-emerald-900/30 transition-all shadow-sm cursor-pointer group/btn active:scale-95"
                            >
                               <MessageSquare size={10} className="group-hover/btn:scale-110 transition-transform" />
                               View Transcript
                            </button>
                         )}
                         {meeting.reportStatus === 'published' && (
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveReportsDropdownId(activeReportsDropdownId === meeting.id ? null : meeting.id);
                                }}
                                className={`flex items-center gap-1.5 px-2 py-1 ${activeReportsDropdownId === meeting.id ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-blue-50 dark:bg-blue-900/20'} text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded text-[10px] font-bold border border-blue-100 dark:border-blue-900/30 transition-all shadow-sm cursor-pointer group/btn active:scale-95`}
                              >
                                 <FileText size={10} />
                                 Reports ({mockReports.length})
                                 <ChevronDown size={10} className={`transition-transform duration-200 ${activeReportsDropdownId === meeting.id ? 'rotate-180' : ''}`} />
                              </button>

                              <AnimatePresence>
                                {activeReportsDropdownId === meeting.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-2 w-64 max-h-56 overflow-y-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl z-[60] p-1.5 custom-scrollbar"
                                  >
                                    <div className="px-2 py-1 mb-1 border-b border-zinc-100 dark:border-white/5">
                                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Select Report</span>
                                    </div>
                                    <div className="space-y-0.5">
                                      {mockReports.map((report) => (
                                        <button
                                          key={report.id}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setViewReportId(meeting.id);
                                            setActiveReportsDropdownId(null);
                                          }}
                                          className="w-full text-left px-2 py-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors group/item"
                                        >
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                              <h4 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover/item:text-blue-500 transition-colors">{report.title}</h4>
                                              <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[8px] text-zinc-400 uppercase font-medium">{report.category}</span>
                                                <span className="text-[8px] text-zinc-400 font-mono">{report.date}</span>
                                              </div>
                                            </div>
                                            <ArrowUpRight size={10} className="text-zinc-300 group-hover/item:text-blue-500 mt-0.5" />
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                         )}
                         {meeting.status === 'completed' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Share logic would go here
                              }}
                              className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-[10px] font-bold border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm cursor-pointer group/btn active:scale-95"
                            >
                               <Share2 size={10} />
                               Share
                            </button>
                         )}
                         <ChevronRight size={14} className="text-zinc-300 group-hover/card:translate-x-0.5 transition-transform" />
                      </div>
                   </div>
                ))}
            </div>

            {/* Now Marker */}
            <div className="flex items-center gap-4 py-6 sticky top-0 z-10 -mx-8 px-8 backdrop-blur-sm" ref={upNextRef}>
                <div className="h-px bg-emerald-500/30 flex-1" />
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   UP NEXT
                </div>
                <div className="h-px bg-emerald-500/30 flex-1" />
            </div>

            {/* Upcoming Section */}
            <section className="space-y-4">
               {upcoming.length > 0 && (
                  <MeetingDetailCard 
                    meeting={upcoming[0]}
                    isHero={true}
                    onDescriptionClick={() => setViewReportId(upcoming[0].id)}
                    onTogglePrivacy={() => onTogglePrivacy(upcoming[0].id)}
                  />
               )}

               {/* Other Upcoming */}
               <div className="space-y-3 pt-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-1">Later</h3>
                  {upcoming.slice(1).map(meeting => (
                     <div 
                        key={meeting.id} 
                        onClick={() => setSelectedDetailId(meeting.id)}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm opacity-90 hover:opacity-100 transition-opacity cursor-pointer group"
                     >
                        <div className="flex justify-between items-start mb-2 gap-4">
                           <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-center text-zinc-400 border border-zinc-100 dark:border-zinc-800">
                                 <span className="text-xs font-bold text-zinc-500">{getDateLabel(meeting.time)}</span>
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 flex-wrap">
                                   <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors">{meeting.title}</h3>
                                   <span className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                                     meeting.isPrivate 
                                       ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/30'
                                       : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30'
                                   }`}>
                                     {meeting.isPrivate ? <Lock size={9} /> : <Unlock size={9} />}
                                     {meeting.isPrivate ? 'Private' : 'Shared'}
                                   </span>
                                 </div>
                                 <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                    <span>{formatMeetingTime(meeting.time)}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                       {meeting.location.includes('Zoom') || meeting.location.includes('Meet') ? <Video size={10} /> : <MapPin size={10} />}
                                       {meeting.location}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               onTogglePrivacy(meeting.id);
                             }}
                             className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold border transition-all shadow-sm cursor-pointer group/btn active:scale-95 ${
                               meeting.isPrivate
                                 ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100 dark:border-orange-900/30 hover:bg-orange-100/70'
                                 : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                             }`}
                           >
                             {meeting.isPrivate ? <Lock size={10} /> : <Unlock size={10} />}
                             {meeting.isPrivate ? 'Private' : 'Shared'}
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         </div>
        </div>

         {/* Meeting Detail Modal */}
         <MeetingDetailModal 
           meeting={selectedMeeting}
           onClose={() => setSelectedMeetingId(null)}
           onPersonClick={(name) => {
             setSelectedMeetingId(null);
             setSelectedPersonName(name);
           }}
           onViewTranscript={(id) => setShowTranscriptId(id)}
           onViewReport={(id) => setViewReportId(id)}
           onTogglePrivacy={onTogglePrivacy}
         />
         
         {/* Person Detail Panel */}
         <PersonDetailPanel 
           personName={selectedPersonName}
           onClose={() => setSelectedPersonName(null)}
         />
      </div>
    </div>
  );
};

import { CommitmentRow } from './components/CommitmentRow';

const CommitmentsScreen = ({
  commitments,
  onToggle,
  onAddCommitment,
}: {
  commitments: Commitment[];
  onToggle: (id: string) => void;
  onAddCommitment: (commitment: Commitment) => void;
}) => {
  const [viewMode, setViewMode] = useState<'temporal' | 'grouped'>('temporal');
  const [groupBy, setGroupBy] = useState<'okr' | 'priority'>('okr');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showOkrs, setShowOkrs] = useState(false);
  const [okrPeriod, setOkrPeriod] = useState('Q1 2026');
  const [okrs, setOkrs] = useState<Array<{ title: string; detail: string }>>([
    { title: 'Ship v2 insights dashboard', detail: 'Launch by end of quarter with KPI coverage.' },
    { title: 'Reduce MTTR by 30%', detail: 'Operationalize new on-call workflows.' },
    { title: 'Expand enterprise adoption', detail: 'Convert 3 pilots into paid accounts.' },
  ]);
  const [newItem, setNewItem] = useState({
    title: '',
    assignee: 'Me',
    dueDate: '',
    priority: 'Medium' as Commitment['priority'],
    okr: '',
    context: '',
  });
  const teamMembers = ['Me', 'Alex Lewis', 'Sarah Chen', 'Mike Johnson', 'Emma Davis'];
  
  const completed = commitments.filter(c => c.status === 'completed').sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  const upcoming = commitments.filter(c => c.status !== 'completed').sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const grouped = commitments.reduce((acc, curr) => {
    const key = groupBy === 'okr' ? (curr.okr || 'Unassigned') : (curr.priority || 'No Priority');
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, Commitment[]>);

  return (
    <div className="flex-1 flex flex-col h-full bg-[color:var(--app-surface-2)] relative">
      <header className="px-8 py-6 flex items-center justify-between shrink-0">
         <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Commitments & Asks</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your promises and requests.</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
               <button onClick={() => setViewMode('temporal')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'temporal' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}>
                 Timeline
               </button>
               <button onClick={() => setViewMode('grouped')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'grouped' ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}>
                 Grouped
               </button>
            </div>
            
            <button
              onClick={() => setShowAddItem(true)}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
               <Plus size={16} />
               Add Item
            </button>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto px-8 pb-20 relative">
        {viewMode === 'temporal' ? (
          <div className="space-y-8 min-h-[101%]">
             <div className="relative group pt-4">
                 <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-200/50 dark:from-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-center pt-1 pointer-events-none">
                     <ArrowUp size={12} className="text-zinc-400 animate-bounce" />
                 </div>
                 
                 <div className="opacity-60 hover:opacity-100 transition-opacity mb-8 space-y-3">
                     <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <CheckCircle2 size={12} />
                        Completed (History)
                     </h3>
                     {completed.map(c => (
                        <CommitmentRow key={c.id} commitment={c} onToggle={onToggle} isHistory={true} />
                     ))}
                     {completed.length === 0 && <div className="text-xs text-zinc-400 italic">No completed items yet.</div>}
                 </div>
             </div>
             
             <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Clock size={12} />
                   Upcoming
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                   {upcoming.map((c) => (
                      <div key={c.id} className="h-full">
                          <CommitmentRow commitment={c} onToggle={onToggle} isCard={true} />
                      </div>
                   ))}
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-8">
             <div className="flex justify-end mb-4">
                <button onClick={() => setGroupBy(groupBy === 'okr' ? 'priority' : 'okr')} className="text-xs flex items-center gap-1 text-zinc-500 hover:text-zinc-900">
                   <Filter size={12} /> Group by: <span className="font-semibold uppercase">{groupBy}</span>
                </button>
             </div>
             {Object.entries(grouped).map(([group, items]) => (
                <div key={group}>
                   <h3 className="sticky top-2 z-10 w-fit ml-2 mb-4 px-4 py-1.5 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-200/50 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 shadow-sm">{group}</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                      {items.map(c => (
                         <div key={c.id} className="h-full">
                            <CommitmentRow commitment={c} onToggle={onToggle} isCard={true} />
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
           className="h-14 px-6 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-full shadow-2xl ring-1 ring-zinc-900/10 dark:ring-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 font-semibold"
         >
             <Plus size={20} />
             Change Personal OKR
         </button>
      </div>

      {showAddItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddItem(false)} />
          <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Add Commitment</h2>
                <p className="text-xs text-zinc-500 mt-1">Default assignee is you. Change if it belongs to someone else.</p>
              </div>
              <button
                onClick={() => setShowAddItem(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-700"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Title</label>
                <input
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                  placeholder="Write incident summary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Assignee</label>
                  <select
                    value={newItem.assignee}
                    onChange={(e) => setNewItem(prev => ({ ...prev, assignee: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                  >
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    value={newItem.dueDate}
                    onChange={(e) => setNewItem(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as Commitment['priority'] }))}
                    className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">OKR</label>
                  <input
                    value={newItem.okr}
                    onChange={(e) => setNewItem(prev => ({ ...prev, okr: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                    placeholder="Growth, Reliability, ..."
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Context</label>
                <textarea
                  value={newItem.context}
                  onChange={(e) => setNewItem(prev => ({ ...prev, context: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm min-h-[80px]"
                  placeholder="Notes, rationale, or related links."
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddItem(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700"
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
                    dueDate: newItem.dueDate || 'TBD',
                    status: 'pending',
                    priority: newItem.priority,
                    okr: newItem.okr || undefined,
                    context: newItem.context || 'Added via quick capture.',
                  });
                  setNewItem({ title: '', assignee: 'Me', dueDate: '', priority: 'Medium', okr: '', context: '' });
                  setShowAddItem(false);
                }}
                className="px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showOkrs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowOkrs(false)} />
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Personal OKRs</h2>
                <p className="text-xs text-zinc-500 mt-1">Define a small set of goals for the quarter.</p>
              </div>
              <button
                onClick={() => setShowOkrs(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-700"
              >
                <X size={14} />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time Period</label>
                <input
                  value={okrPeriod}
                  onChange={(e) => setOkrPeriod(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                  placeholder="Q1 2026"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Goals</label>
                <button
                  onClick={() => {
                    const derived = commitments.slice(0, 3).map(c => ({
                      title: c.title,
                      detail: c.context || 'Derived from current commitments.',
                    }));
                    if (derived.length > 0) setOkrs(derived);
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Get from Create OKRs
                </button>
              </div>
              <div className="space-y-3">
                {okrs.map((okr, idx) => (
                  <div key={idx} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        value={okr.title}
                        onChange={(e) => {
                          const next = [...okrs];
                          next[idx] = { ...next[idx], title: e.target.value };
                          setOkrs(next);
                        }}
                        className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                        placeholder="Objective"
                      />
                      <button
                        onClick={() => setOkrs(prev => prev.filter((_, i) => i !== idx))}
                        className="shrink-0 px-3 py-2 text-xs font-bold text-zinc-500 hover:text-red-600 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors"
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
                      className="mt-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm min-h-[70px]"
                      placeholder="Key results or sub-goals"
                    />
                  </div>
                ))}
              </div>
              {okrs.length > 5 && (
                <div className="text-xs font-medium text-orange-600 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 px-3 py-2 rounded-lg">
                  Keep it focused. 5 OKRs or fewer is recommended.
                </div>
              )}
              <button
                onClick={() => setOkrs(prev => [...prev, { title: '', detail: '' }])}
                className="text-xs font-bold text-zinc-600 hover:text-zinc-800"
              >
                + Add another OKR
              </button>
            </div>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowOkrs(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-700"
              >
                Close
              </button>
              <button
                onClick={() => setShowOkrs(false)}
                className="px-4 py-2 text-sm font-semibold bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-lg"
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

import { OnboardingSimulator } from './components/OnboardingSimulator';
import { TranscriptModal } from './components/TranscriptModal';

const ExpandedState = ({
  setMode,
  setIsRecording,
  commitments,
  onToggleCommitment,
  onAddCommitment,
  onTogglePrivacy,
  meetings,
  users,
  setUsers,
  teams,
  setTeams,
  isDesktopShell = false,
}: {
  setMode: (m: ViewMode) => void;
  setIsRecording: (b: boolean) => void;
  commitments: Commitment[];
  onToggleCommitment: (id: string) => void;
  onAddCommitment: (commitment: Commitment) => void;
  onTogglePrivacy: (id: string) => void;
  meetings: MeetingBrief[];
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  teams: AppTeam[];
  setTeams: React.Dispatch<React.SetStateAction<AppTeam[]>>;
  isDesktopShell?: boolean;
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>('Now');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const privateCount = meetings.filter(m => m.isPrivate).length;
  const totalCount = meetings.length;
  const privatePercent = totalCount === 0 ? 0 : Math.round((privateCount / totalCount) * 100);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const toggleTheme = () => {
     setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const expandedClass = isDesktopShell
    ? "absolute inset-0 bg-[color:var(--app-surface)] border-none rounded-none shadow-none z-50 flex overflow-hidden"
    : "fixed bg-[color:var(--app-surface)] backdrop-blur-2xl rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-[color:var(--app-border)] z-40 flex overflow-hidden";

  // Position expanded view: extends to edges with minimal margins (pill overlays)
  const expandedStyle = isDesktopShell
    ? { width: '100%', height: '100%' }
    : {
        top: '32px',
        left: '32px',
        right: '8px',
        bottom: '32px'
      };

  return (
    <motion.div
      layoutId={isDesktopShell ? undefined : "sentra-shell"}
      className={expandedClass}
      style={expandedStyle}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
    >
      {/* Sidebar */}
      <nav className="w-14 lg:w-16 bg-[color:var(--app-surface-2)] backdrop-blur-xl border-r border-[color:var(--app-border)] flex flex-col shrink-0 items-center py-3">
        <div className="h-12 flex items-center justify-center w-full mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center shadow-lg shadow-zinc-900/20">
             <img src={sentraLogo} alt="Sentra Logo" className="w-5 h-5 object-contain invert brightness-0 filter" />
          </div>
        </div>

        <div className="flex-1 space-y-3 flex flex-col items-center w-full">
          {[
            { id: 'Now', label: 'Home', icon: Layout },
            { id: 'Meetings', label: 'Meetings', icon: Calendar },
            { id: 'CRM', label: 'CRM', icon: Users },
            { id: 'Reports', label: 'Reports', icon: BarChart2 },
            { id: 'Swimlanes', label: 'Swimlanes', icon: GitCommit },
            { id: 'ToDo', label: 'Commitments & Asks', icon: CheckCircle2 },
            { id: 'Settings', label: 'Settings', icon: Settings }
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveTab(item.id as any)}
              title={item.label}
              className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 relative group ${activeTab === item.id ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-zinc-900/10' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'}`}
            >
              <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              {activeTab === item.id && <motion.div layoutId="nav-pill" className="absolute -left-1.5 w-0.5 h-3 rounded-full bg-zinc-900 dark:bg-zinc-100" />}
            </div>
          ))}
        </div>

        <div className="p-3 w-full flex flex-col items-center gap-3 mt-auto">
          <button 
             onClick={toggleTheme}
             className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center justify-center transition-colors"
             title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
             {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 text-[10px] font-bold cursor-pointer hover:ring-2 ring-zinc-200 dark:ring-zinc-700 transition-all" title="Alex Lewis" onClick={() => setActiveTab('Settings')}>
            AL
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[color:var(--app-surface-2)] backdrop-blur-sm relative">
        {/* Background Noise/Grain Overlay can be added here if needed via CSS */}
        
        {/* Top Toolbar */}
        <header className="h-16 px-8 border-b border-[color:var(--app-border)] flex items-center justify-between sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3">
             <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">{activeTab === 'Now' ? 'Home' : activeTab === 'ToDo' ? 'Commitments & Asks' : activeTab}</h2>
             {activeTab !== 'Now' && (
                <>
                   <span className="text-zinc-300 dark:text-zinc-600">/</span>
                   <span className="text-sm font-medium text-zinc-500">Overview</span>
                </>
             )}
          </div>

          <div className="flex items-center gap-3">
             {activeTab === 'Meetings' && (
               <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/70">
                 <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600">
                   <Lock size={11} />
                   {privatePercent}% Private
                 </div>
                 <div className="w-px h-3.5 bg-zinc-200 dark:bg-zinc-800" />
                 <div className="text-[11px] text-zinc-500">
                   {privateCount}/{totalCount}
                 </div>
               </div>
             )}
             <ViewControls mode="expanded" setMode={setMode} />
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
                  setActiveTab('Now');
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
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-full shadow-xl flex items-center gap-3"
              >
                <CheckCircle2 size={20} className="text-emerald-500" />
                <span className="font-medium">You're all set! Sentra is now active.</span>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {activeTab === 'Now' && (
              <motion.div key="now" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                 <DynamicBackground className="h-full">
                   <NowScreen
                      commitments={[...commitments, ...asyncCommitments]}
                      onToggle={onToggleCommitment}
                      alerts={alerts}
                      meetingBriefs={meetingBriefs}
                      relationshipAlerts={relationshipAlerts}
                      onNavigate={setActiveTab}
                   />
                 </DynamicBackground>
              </motion.div>
            )}
            {activeTab === 'Meetings' && (
              <motion.div key="meetings" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <MeetingsScreen setMode={setMode} setIsRecording={setIsRecording} meetings={meetings} onTogglePrivacy={onTogglePrivacy} />
              </motion.div>
            )}
            {activeTab === 'Reports' && (
              <motion.div key="reports" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <ReportsScreen teams={teams} users={users} />
              </motion.div>
            )}
            {activeTab === 'CRM' && (
              <motion.div key="crm" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <CrmPage contacts={contacts} companies={companies} />
              </motion.div>
            )}
            {activeTab === 'Swimlanes' && (
              <motion.div key="swimlanes" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <NewSwimlanesScreen />
              </motion.div>
            )}
            {activeTab === 'Settings' && (
              <motion.div key="settings" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                <SettingsScreen
                  onSimulateOnboarding={() => setShowOnboarding(true)}
                  users={users}
                  setUsers={setUsers}
                  teams={teams}
                  setTeams={setTeams}
                />
              </motion.div>
            )}
            {activeTab === 'ToDo' && (
               <motion.div key="todo" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                 <CommitmentsScreen commitments={commitments} onToggle={onToggleCommitment} onAddCommitment={onAddCommitment} />
               </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* Chat Interface Modal */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </motion.div>
  );
};

export default function App() {
  const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const initialModeParam = queryParams.get('mode') as ViewMode | null;
  const initialMode: ViewMode = initialModeParam && ['pill', 'compact', 'expanded'].includes(initialModeParam)
    ? initialModeParam
    : 'pill';
  const isOverlay = queryParams.get('overlay') === '1';
  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [isRecording, setIsRecording] = useState(false);
  const [commitmentsData, setCommitmentsData] = useState<Commitment[]>(commitments);
  const [meetingsData, setMeetingsData] = useState<MeetingBrief[]>(meetingBriefs);
  const [usersData, setUsersData] = useState<AppUser[]>([
    { id: 'u-1', name: 'Alex Lewis', title: 'Head of Product', email: 'alex.lewis@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=alex' },
    { id: 'u-2', name: 'Sarah Chen', title: 'Engineering Manager', email: 'sarah.chen@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=sarah' },
    { id: 'u-3', name: 'Mike Johnson', title: 'Staff Engineer', email: 'mike.johnson@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=mike' },
    { id: 'u-4', name: 'Emma Davis', title: 'Program Manager', email: 'emma.davis@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=emma' },
    { id: 'u-5', name: 'Priya Desai', title: 'Product Manager', email: 'priya.desai@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=priya' },
    { id: 'u-6', name: 'Jordan Lee', title: 'Design Lead', email: 'jordan.lee@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=jordan' },
    { id: 'u-7', name: 'Samir Patel', title: 'Solutions Engineer', email: 'samir.patel@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=samir' },
    { id: 'u-8', name: 'Nina Park', title: 'Customer Success', email: 'nina.park@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=nina' },
    { id: 'u-9', name: 'Omar Haddad', title: 'Security Lead', email: 'omar.haddad@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=omar' },
    { id: 'u-10', name: 'Grace Kim', title: 'Marketing Manager', email: 'grace.kim@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=grace' },
    { id: 'u-11', name: 'Liam Torres', title: 'Data Engineer', email: 'liam.torres@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=liam' },
    { id: 'u-12', name: 'Maya Singh', title: 'UX Researcher', email: 'maya.singh@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=maya' },
    { id: 'u-13', name: 'Eva Chen', title: 'People Ops', email: 'eva.chen@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=eva' },
    { id: 'u-14', name: 'Noah Brooks', title: 'RevOps Lead', email: 'noah.brooks@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=noah' },
    { id: 'u-15', name: 'Riya Rao', title: 'QA Engineer', email: 'riya.rao@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=riya' },
    { id: 'u-16', name: 'Daniel Wu', title: 'Platform Engineer', email: 'daniel.wu@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=daniel' },
    { id: 'u-17', name: 'Sofia Alvarez', title: 'Sales Lead', email: 'sofia.alvarez@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=sofia' },
    { id: 'u-18', name: 'Miguel Santos', title: 'Account Executive', email: 'miguel.santos@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=miguel' },
    { id: 'u-19', name: 'Tara Collins', title: 'Finance Manager', email: 'tara.collins@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=tara' },
    { id: 'u-20', name: 'Ben Foster', title: 'GTM Ops', email: 'ben.foster@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=ben' },
    { id: 'u-21', name: 'Ava Nguyen', title: 'Customer Support', email: 'ava.nguyen@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=ava' },
    { id: 'u-22', name: 'Caleb Reed', title: 'Fullstack Engineer', email: 'caleb.reed@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=caleb' },
    { id: 'u-23', name: 'Hannah Price', title: 'Legal Counsel', email: 'hannah.price@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=hannah' },
    { id: 'u-24', name: 'Victor Chen', title: 'IT Admin', email: 'victor.chen@sentra.ai', avatar: 'https://i.pravatar.cc/64?u=victor' },
  ]);
  const [teamsData, setTeamsData] = useState<AppTeam[]>([
    { id: 't-1', name: 'Product Strategy', memberIds: ['u-1', 'u-2', 'u-3'], note: 'Q1 roadmap, positioning, and launch readiness.', membersText: 'Alex Lewis, Sarah Chen, Mike Johnson' },
    { id: 't-2', name: 'Platform Ops', memberIds: ['u-1', 'u-4'], note: 'Incident response, reliability, and SLA reporting.', membersText: 'Alex Lewis, Emma Davis' },
    { id: 't-3', name: 'Customer Expansion', memberIds: ['u-8', 'u-17', 'u-18'], note: 'Renewals, upsells, and health scoring.', membersText: 'Nina Park, Sofia Alvarez, Miguel Santos' },
    { id: 't-4', name: 'Security & Compliance', memberIds: ['u-9', 'u-23', 'u-16'], note: 'Audit readiness, access reviews, and risk mitigation.', membersText: 'Omar Haddad, Hannah Price, Daniel Wu' },
    { id: 't-5', name: 'Design & Research', memberIds: ['u-6', 'u-12'], note: 'Experience, research, and design system.', membersText: 'Jordan Lee, Maya Singh' },
  ]);

  const handleToggleCommitment = (id: string) => {
    setCommitmentsData(prev => prev.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'completed' ? 'pending' : 'completed' }
        : c
    ));
  };
  
  const handleCompleteCommitment = (id: string) => {
     setCommitmentsData(prev => prev.map(c => 
      c.id === id 
        ? { ...c, status: 'completed' }
        : c
    ));
  };

  const handleCommitMeeting = (type: 'private' | 'public', title: string, references: string) => {
    const cleanTitle = title?.trim() || 'New Meeting Note';
    const cleanRefs = references?.trim();
    const newMeeting: MeetingBrief = {
      id: `m-new-${Date.now()}`,
      title: cleanTitle,
      time: 'Just now',
      timestamp: new Date().toISOString(),
      attendees: ['Me'],
      summary: cleanRefs
        ? `Voice note recorded via Sentra. Transcript is ready. References: ${cleanRefs}`
        : 'Voice note recorded via Sentra. Transcript is ready.',
      keyTopics: [],
      status: 'completed',
      reportStatus: 'published',
      location: 'Phone',
      isPrivate: type === 'private'
    };
    setMeetingsData(prev => [newMeeting, ...prev]);
    toast.success(type === 'private' ? 'Private memory saved' : 'Meeting committed to memory');
  };
  
  const handleToggleMeetingPrivacy = (id: string) => {
    setMeetingsData(prev => prev.map(m => (
      m.id === id ? { ...m, isPrivate: !m.isPrivate } : m
    )));
  };

  const handleAddCommitment = (commitment: Commitment) => {
    setCommitmentsData(prev => [commitment, ...prev]);
  };

  useEffect(() => {
    if (!window?.electronAPI?.onSetMode) return;
    const unsubscribe = window.electronAPI.onSetMode((nextMode: ViewMode) => {
      if (nextMode) setMode(nextMode);
    });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (isOverlay) return;
    if (window?.electronAPI?.modeChanged) {
      window.electronAPI.modeChanged(mode);
    }
    if (mode === 'pill' && window?.electronAPI?.hideMain) {
      window.electronAPI.hideMain();
    }
  }, [mode, isOverlay]);

  useEffect(() => {
    if (!isOverlay) return;
    document.body.classList.add('overlay-body');
    document.documentElement.classList.add('overlay-body');
    return () => {
      document.body.classList.remove('overlay-body');
      document.documentElement.classList.remove('overlay-body');
    };
  }, [isOverlay]);

  useEffect(() => {
    if (isOverlay) return;
    if (!window?.electronAPI?.onCommitMeeting) return;
    const unsubscribe = window.electronAPI.onCommitMeeting((payload) => {
      if (!payload) return;
      handleCommitMeeting(
        payload.type as 'private' | 'public',
        payload.title,
        payload.references
      );
    });
    return () => unsubscribe?.();
  }, [isOverlay, handleCommitMeeting]);

  const isDesktopShell = Boolean(window?.electronAPI) && !isOverlay;

  if (isOverlay) {
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="min-h-screen app-shell overlay-root font-sans text-zinc-900 dark:text-zinc-100 relative overflow-hidden transition-colors duration-500">
          <PillState 
            key="pill-overlay" 
            onClick={() => window?.electronAPI?.openMain?.('compact')} 
            isRecording={isRecording} 
            setIsRecording={setIsRecording} 
            setMode={setMode} 
            onCommit={handleCommitMeeting}
            isOverlay={true}
          />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark">
      <div className={`min-h-screen app-shell font-sans text-zinc-900 dark:text-zinc-100 relative overflow-hidden transition-colors duration-500 ${isOverlay ? 'overlay-root' : ''}`}>
        <Toaster />

        <AnimatePresence mode="wait">
          {mode === 'pill' && !window?.electronAPI && (
            <PillState 
              key="pill" 
              onClick={() => {
                if (isOverlay && window?.electronAPI?.openMain) {
                  window.electronAPI.openMain();
                } else {
                  setMode('compact');
                }
              }} 
              isRecording={isRecording} 
              setIsRecording={setIsRecording} 
              setMode={setMode} 
              onCommit={handleCommitMeeting}
              isOverlay={isOverlay}
            />
          )}
          {mode === 'compact' && (
            <CompactState 
              key="compact" 
              setMode={setMode} 
              commitments={commitmentsData} 
              onCompleteCommitment={handleCompleteCommitment} 
              isDesktopShell={isDesktopShell}
            />
          )}
          {mode === 'expanded' && (
            <ExpandedState
              key="expanded"
              setMode={setMode}
              setIsRecording={setIsRecording}
              commitments={commitmentsData}
              onToggleCommitment={handleToggleCommitment}
              onAddCommitment={handleAddCommitment}
              onTogglePrivacy={handleToggleMeetingPrivacy}
              meetings={meetingsData}
              users={usersData}
              setUsers={setUsersData}
              teams={teamsData}
              setTeams={setTeamsData}
              isDesktopShell={isDesktopShell}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Chat Bar - rendered OUTSIDE the overflow-hidden container */}
      {mode === 'expanded' && <PersistentChatBar />}
    </ThemeProvider>
  );
}
