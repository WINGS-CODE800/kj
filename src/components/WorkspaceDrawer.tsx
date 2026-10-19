import React, { useState, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Keyboard,
  Volume2,
  Cpu,
  Settings,
  FolderOpen,
  Download,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  FileCode,
  ShieldCheck,
  ExternalLink,
  Laptop,
  Smartphone,
  Upload,
  CheckCircle2,
  Sparkles,
  Bot,
  Plus,
  Trash2,
  Search,
  Filter,
  Monitor,
  Globe,
  Radio
} from 'lucide-react';
import { SpreadsheetState, exportToExcel, exportToCSV, setCellValue, readCellValue } from '../services/excelService';
import {
  UNIVERSAL_APPS_CATALOG,
  getCustomApps,
  saveCustomApp,
  deleteCustomApp,
  SupportedPlatform,
  PreferredBrowser
} from '../services/appLauncherService';
import { LanguageMode, DiscoveredApp } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WorkspaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  spreadsheetState: SpreadsheetState;
  onUpdateSpreadsheet: (updater: (prev: SpreadsheetState) => SpreadsheetState) => void;
  typingBuffer: string;
  onUpdateTypingBuffer: (text: string) => void;
  onUndoTyping: () => void;
  readAloudText: string;
  onUpdateReadAloudText: (text: string) => void;
  isReading: boolean;
  isReadingPaused: boolean;
  onStartReading: (text: string) => void;
  onPauseReading: () => void;
  onResumeReading: () => void;
  onStopReading: () => void;
  readingSpeed: number;
  onSpeedChange: (speed: number) => void;
  currentReadingIndex: number;
  language: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  companionStatus: { connected: boolean; platform?: string };
  onRunMacAction: (actionType: string, payload: Record<string, unknown>) => void;
  customLogo: string;
  onUpdateCustomLogo: (logoDataUrl: string) => void;
  preferredPlatform: SupportedPlatform;
  onPlatformChange: (platform: SupportedPlatform) => void;
  preferredBrowser: PreferredBrowser;
  onBrowserChange: (browser: PreferredBrowser) => void;
  onLaunchApp: (appNameOrDiscovered: string | DiscoveredApp) => void;
}

export const WorkspaceDrawer: React.FC<WorkspaceDrawerProps> = ({
  isOpen,
  onClose,
  spreadsheetState,
  onUpdateSpreadsheet,
  typingBuffer,
  onUpdateTypingBuffer,
  onUndoTyping,
  readAloudText,
  onUpdateReadAloudText,
  isReading,
  isReadingPaused,
  onStartReading,
  onPauseReading,
  onResumeReading,
  onStopReading,
  readingSpeed,
  onSpeedChange,
  currentReadingIndex,
  language,
  onLanguageChange,
  companionStatus,
  onRunMacAction,
  customLogo,
  onUpdateCustomLogo,
  preferredPlatform,
  onPlatformChange,
  preferredBrowser,
  onBrowserChange,
  onLaunchApp
}) => {
  const [activeTab, setActiveTab] = useState<'launcher' | 'standalone' | 'branding' | 'excel' | 'typing' | 'read' | 'settings'>('launcher');
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [newCellRef, setNewCellRef] = useState('C3');
  const [newCellValue, setNewCellValue] = useState('Rahul');

  // App Launcher catalog state
  const [appSearch, setAppSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customAppsList, setCustomAppsList] = useState<DiscoveredApp[]>(() => getCustomApps());
  const [showAddCustomModal, setShowAddCustomModal] = useState(false);
  const [customAppName, setCustomAppName] = useState('');
  const [customAppCategory, setCustomAppCategory] = useState<'work' | 'entertainment' | 'system' | 'custom'>('work');
  const [customAppMacName, setCustomAppMacName] = useState('');
  const [customAppWebUrl, setCustomAppWebUrl] = useState('');
  const [customAppAliases, setCustomAppAliases] = useState('');
  const [customAppDesc, setCustomAppDesc] = useState('');

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleCopyTyping = () => {
    navigator.clipboard.writeText(typingBuffer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleSetCell = () => {
    onUpdateSpreadsheet(prev => {
      const { newState } = setCellValue(prev, newCellRef, newCellValue);
      return newState;
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onUpdateCustomLogo(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreateCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAppName.trim()) return;

    const aliases = customAppAliases
      .split(',')
      .map(a => a.trim().toLowerCase())
      .filter(Boolean);

    const newApp: DiscoveredApp = {
      id: customAppName.trim().toLowerCase().replace(/\s+/g, '-'),
      name: customAppName.trim(),
      category: customAppCategory,
      aliases: aliases.length > 0 ? aliases : [customAppName.trim().toLowerCase()],
      macAppName: customAppMacName.trim() || customAppName.trim(),
      webUrl: customAppWebUrl.trim() || `https://www.google.com/search?q=${encodeURIComponent(customAppName.trim())}`,
      description: customAppDesc.trim() || `Custom registered application: ${customAppName.trim()}`
    };

    const updated = saveCustomApp(newApp);
    setCustomAppsList(updated);
    setCustomAppName('');
    setCustomAppMacName('');
    setCustomAppWebUrl('');
    setCustomAppAliases('');
    setCustomAppDesc('');
    setShowAddCustomModal(false);
  };

  const handleDeleteCustomApp = (id: string) => {
    const updated = deleteCustomApp(id);
    setCustomAppsList(updated);
  };

  // Filtered applications list
  const combinedApps = [...UNIVERSAL_APPS_CATALOG, ...customAppsList];
  const filteredApps = combinedApps.filter(app => {
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    const query = appSearch.toLowerCase().trim();
    const matchesSearch =
      !query ||
      app.name.toLowerCase().includes(query) ||
      app.aliases.some(a => a.toLowerCase().includes(query)) ||
      (app.description && app.description.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-700/70 shadow-2xl flex flex-col h-full animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-cyan-500/40 p-1 flex items-center justify-center shrink-0">
              <img src={customLogo} alt="KIKI AI Mascot" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <span>KIKI AI Universal Studio</span>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                  APP LAUNCHER ACTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">Manage Universal App Launcher, custom apps, platform targets, and desktop packaging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close workspace"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-2 overflow-x-auto py-2">
          {[
            { id: 'launcher', label: 'App Launcher & Registry', icon: ExternalLink },
            { id: 'standalone', label: 'Standalone Packages', icon: Laptop },
            { id: 'branding', label: 'Robot Mascot', icon: Bot },
            { id: 'excel', label: 'Excel Assistant', icon: FileSpreadsheet },
            { id: 'typing', label: 'Voice Typing', icon: Keyboard },
            { id: 'read', label: 'Read-Aloud', icon: Volume2 },
            { id: 'settings', label: 'Settings & Platform', icon: Settings },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: UNIVERSAL APP LAUNCHER & REGISTRY */}
          {activeTab === 'launcher' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    <span>Universal Dynamic App Launcher</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                      {combinedApps.length} Apps Indexed
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Say "Open [App Name]" to launch natively on MacBook/Windows/Android or via verified official web fallback.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCustomModal(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors cursor-pointer shrink-0 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom App</span>
                </button>
              </div>

              {/* Target Platform Quick Selector */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-slate-300 font-medium">Target Platform:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'darwin', label: 'macOS (MacBook)' },
                    { id: 'win32', label: 'Windows PC' },
                    { id: 'android', label: 'Android' },
                    { id: 'ios', label: 'iOS' },
                    { id: 'web', label: 'Web Sandbox' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => onPlatformChange(p.id as SupportedPlatform)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                        preferredPlatform === p.id
                          ? 'bg-cyan-500 text-black font-bold shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom App Drawer / Form */}
              {showAddCustomModal && (
                <form
                  onSubmit={handleCreateCustomApp}
                  className="p-4 rounded-xl bg-slate-950 border border-cyan-500/50 space-y-3 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-cyan-300">Register Custom Application</span>
                    <button
                      type="button"
                      onClick={() => setShowAddCustomModal(false)}
                      className="text-slate-400 hover:text-slate-200 text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Application Name *</label>
                      <input
                        type="text"
                        required
                        value={customAppName}
                        onChange={e => setCustomAppName(e.target.value)}
                        placeholder="e.g. Blender, Postman, Notion"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Category</label>
                      <select
                        value={customAppCategory}
                        onChange={e => setCustomAppCategory(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-400"
                      >
                        <option value="work">Work & Development</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="system">System & Tools</option>
                        <option value="custom">Custom / Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">macOS App Name / Executable</label>
                      <input
                        type="text"
                        value={customAppMacName}
                        onChange={e => setCustomAppMacName(e.target.value)}
                        placeholder="e.g. Blender.app or Postman"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Web Fallback URL</label>
                      <input
                        type="url"
                        value={customAppWebUrl}
                        onChange={e => setCustomAppWebUrl(e.target.value)}
                        placeholder="e.g. https://blender.org"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="text-slate-400 block mb-1">Voice Recognition Aliases (comma separated)</label>
                    <input
                      type="text"
                      value={customAppAliases}
                      onChange={e => setCustomAppAliases(e.target.value)}
                      placeholder="e.g. blender 3d, 3d modeler, render app"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                  >
                    Save & Enable Voice Launching
                  </button>
                </form>
              )}

              {/* Search & Category Filter */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={appSearch}
                    onChange={e => setAppSearch(e.target.value)}
                    placeholder="Search 60+ applications by name or spoken alias (e.g. Instagram, Excel, VS Code)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'All Apps' },
                    { id: 'social', label: 'Social Media' },
                    { id: 'entertainment', label: 'Video & Entertainment' },
                    { id: 'work', label: 'Work & Dev' },
                    { id: 'system', label: 'System & Utilities' },
                    { id: 'custom', label: `Custom (${customAppsList.length})` },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer text-xs font-medium ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apps Grid */}
              <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredApps.map(app => {
                  const isCustom = app.category === 'custom' || customAppsList.some(c => c.id === app.id);
                  return (
                    <div
                      key={app.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300">
                              {app.name}
                            </span>
                            {isCustom && (
                              <span className="text-[9px] font-mono px-1 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                                CUSTOM
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{app.description}</p>
                        </div>

                        {isCustom ? (
                          <button
                            onClick={() => handleDeleteCustomApp(app.id)}
                            title="Delete custom app"
                            className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[9px] font-mono uppercase text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {app.category}
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-mono truncate max-w-[140px]">
                          "{app.aliases[0] || app.name}"
                        </span>
                        <button
                          onClick={() => onLaunchApp(app)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 hover:bg-cyan-600 text-cyan-400 hover:text-white transition-colors cursor-pointer font-medium"
                        >
                          <span>Test Launch</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredApps.length === 0 && (
                  <div className="col-span-2 p-8 text-center text-slate-500 text-xs">
                    No applications matched your filter. Click "Add Custom App" above to add any application.
                  </div>
                )}
              </div>

              {/* Natural Voice Command Examples */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-semibold block">
                  Universal Voice Command Examples
                </span>
                <p className="text-slate-300">&bull; <span className="text-cyan-300">"KIKI, open Visual Studio Code"</span> &rarr; launches editor</p>
                <p className="text-slate-300">&bull; <span className="text-cyan-300">"Open Instagram"</span> &rarr; opens native app or verified web app</p>
                <p className="text-slate-300">&bull; <span className="text-cyan-300">"Open Chrome and search for Python tutorials"</span> &rarr; searches Google in Chrome</p>
                <p className="text-slate-300">&bull; <span className="text-cyan-300">"Open my Downloads folder"</span> &rarr; reveals Downloads in Finder</p>
                <p className="text-slate-300">&bull; <span className="text-cyan-300">"Excel open pannu" (Tamil/Tanglish)</span> &rarr; launches Microsoft Excel</p>
              </div>
            </div>
          )}

          {/* TAB 2: STANDALONE PACKAGES & INSTALLATION */}
          {activeTab === 'standalone' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span>Standalone Application Packages (macOS, Windows, Android, iOS)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Run KIKI AI as a true independent application with its own dock icon, menu bar, and launch experience.
                </p>
              </div>

              {/* macOS DMG & Native Electron App Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 shadow-lg shadow-cyan-950/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                      <Laptop className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">macOS Desktop Application (.DMG / .APP)</h4>
                      <p className="text-[11px] text-slate-400">Native frameless MacBook app built with Electron & AppleScript</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
                    RECOMMENDED FOR MAC
                  </span>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono text-slate-300 block font-semibold">
                    Option A: Run Native Desktop Window on your MacBook
                  </span>
                  <div className="p-3 rounded-xl bg-black border border-slate-800 flex items-center justify-between font-mono text-xs text-emerald-400">
                    <code>npm run electron</code>
                    <button
                      onClick={() => copyCommand('npm run electron', 'electron-run')}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedCmd === 'electron-run' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-slate-300 block font-semibold mt-3">
                    Option B: Build Distributable macOS DMG Installer
                  </span>
                  <div className="p-3 rounded-xl bg-black border border-slate-800 flex items-center justify-between font-mono text-xs text-emerald-400">
                    <code>npm run dist:mac</code>
                    <button
                      onClick={() => copyCommand('npm run dist:mac', 'electron-dist')}
                      className="text-slate-400 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedCmd === 'electron-dist' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Outputs ready-to-install: <code>release/KIKI AI-1.0.0.dmg</code> for drag-and-drop into Applications.
                  </p>
                </div>
              </div>

              {/* Mobile and Web PWA Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Android & iOS Mobile Installation</h4>
                    <p className="text-[11px] text-slate-400">Standalone progressive application with official robot mascot icon</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isInstallable && (
                    <button
                      onClick={install}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install KIKI AI App on Device</span>
                    </button>
                  )}

                  {isIOS && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex-1">
                      <p>
                        On iPhone/iPad Safari: tap <strong>Share</strong> &rarr; <strong>Add to Home Screen</strong> for standalone mode.
                      </p>
                    </div>
                  )}

                  {isInstalled && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 flex-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Running in Standalone Installed App Mode</span>
                    </div>
                  )}
                </div>

                {/* Windows instructions */}
                <div className="pt-2 border-t border-slate-900 space-y-1.5 text-xs text-slate-400">
                  <p className="font-semibold text-slate-300">Windows Standalone Installer:</p>
                  <p className="font-mono text-[11px] text-slate-400">
                    Run: <code>npm run dist:win</code> &rarr; builds <code>release/KIKI AI Setup.exe</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROBOT MASCOT & LOGO MANAGER */}
          {activeTab === 'branding' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Official KIKI AI Robot Mascot & Logo Manager</h3>
                <p className="text-xs text-slate-400">
                  Preserve the official robot mascot branding, or upload your exact image graphic file.
                </p>
              </div>

              {/* Current Active Mascot Showcase */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-500/40 flex flex-col items-center justify-center text-center space-y-3">
                <div className="relative w-28 h-28 rounded-2xl bg-slate-900 border-2 border-cyan-400/50 p-2 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
                  <img src={customLogo} alt="Official Mascot" className="w-full h-full object-contain" />
                  <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-500 text-black text-[9px] font-bold uppercase tracking-wider">
                    ACTIVE
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Official KIKI AI Robot Mascot</h4>
                  <p className="text-xs text-slate-400">Cyan visor eyes &bull; Audio sensor ears &bull; Holographic chest core</p>
                </div>
              </div>

              {/* User Logo Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 text-center space-y-3 bg-slate-950/60 transition-colors">
                <Upload className="w-7 h-7 text-cyan-400 mx-auto" />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Upload Your Exact Logo / Mascot File</p>
                  <p className="text-[11px] text-slate-400">Select any PNG, JPG, or SVG file from your MacBook</p>
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer shadow-sm transition-colors">
                  <span>Browse Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onUpdateCustomLogo('/kiki-robot.svg')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  Reset to Default Official KIKI Mascot
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EXCEL ASSISTANT */}
          {activeTab === 'excel' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Smart Spreadsheet & Student Marksheet</h3>
                  <p className="text-xs text-slate-400">Real XLSX data manipulation, cell navigation, and live export</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => exportToExcel(spreadsheetState)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .XLSX</span>
                  </button>
                  <button
                    onClick={() => exportToCSV(spreadsheetState)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.CSV</span>
                  </button>
                </div>
              </div>

              {/* Cell Input Controller */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <span className="text-xs text-slate-400 font-mono">Cell:</span>
                <input
                  type="text"
                  value={newCellRef}
                  onChange={(e) => setNewCellRef(e.target.value.toUpperCase())}
                  placeholder="e.g. C3"
                  className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300"
                />
                <span className="text-xs text-slate-400 font-mono">Value:</span>
                <input
                  type="text"
                  value={newCellValue}
                  onChange={(e) => setNewCellValue(e.target.value)}
                  placeholder="e.g. 95 or Rahul"
                  className="flex-1 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-100"
                />
                <button
                  onClick={handleSetCell}
                  className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
                >
                  Set Cell
                </button>
              </div>

              {/* Live Interactive Spreadsheet Grid */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-2.5 px-3 border-r border-slate-800 w-12 text-center text-slate-600">#</th>
                      {spreadsheetState.headers.map((h, i) => (
                        <th key={i} className="py-2.5 px-4 border-r border-slate-800 font-semibold text-slate-300">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {spreadsheetState.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors">
                        <td className="py-2 px-3 border-r border-slate-800 text-center font-mono text-slate-500 bg-slate-900/30">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="py-2 px-4 border-r border-slate-800/60 text-slate-200">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: UNIVERSAL VOICE TYPING */}
          {activeTab === 'typing' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Universal Voice Typing & Dictation Engine</h3>
                  <p className="text-xs text-slate-400">Punctuation formatting, sentence correction, and native typing simulation</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onUndoTyping}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={handleCopyTyping}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <textarea
                  value={typingBuffer}
                  onChange={(e) => onUpdateTypingBuffer(e.target.value)}
                  rows={8}
                  placeholder="Voice typing text will stream here in real-time..."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono leading-relaxed"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="font-semibold text-cyan-400">Voice Typing Commands:</span>
                <p className="text-slate-300">&bull; "Type Hello, how are you?" &rarr; inserts text</p>
                <p className="text-slate-300">&bull; "Correct last sentence with [new sentence]" &rarr; replaces previous phrase</p>
                <p className="text-slate-300">&bull; "Undo typing" &rarr; restores previous state</p>
              </div>
            </div>
          )}

          {/* TAB 6: READ-ALOUD ENGINE */}
          {activeTab === 'read' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">Read-Aloud Engine with Sentence Tracking</h3>
                  <p className="text-xs text-slate-400">Natural voice reading with speed adjustment and real-time highlighter</p>
                </div>
                <div className="flex items-center gap-2">
                  {!isReading ? (
                    <button
                      onClick={() => onStartReading(readAloudText)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Read Aloud</span>
                    </button>
                  ) : isReadingPaused ? (
                    <button
                      onClick={onResumeReading}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Continue</span>
                    </button>
                  ) : (
                    <button
                      onClick={onPauseReading}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </button>
                  )}
                  {isReading && (
                    <button
                      onClick={onStopReading}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-medium border border-slate-700 cursor-pointer"
                    >
                      <span>Stop</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Speed rate control */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <span className="text-slate-300 font-medium">Speech Speed:</span>
                <input
                  type="range"
                  min="0.7"
                  max="1.75"
                  step="0.05"
                  value={readingSpeed}
                  onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400 cursor-pointer"
                />
                <span className="font-mono text-cyan-300 w-12 text-right">{readingSpeed.toFixed(2)}x</span>
              </div>

              <div className="space-y-2">
                <textarea
                  value={readAloudText}
                  onChange={(e) => onUpdateReadAloudText(e.target.value)}
                  rows={7}
                  placeholder="Paste text here to read aloud in Tamil or English..."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS & PLATFORM CONFIG */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">Application Configuration & Preferences</h3>
                <p className="text-xs text-slate-400">Target operating system, browser fallbacks, language, and privacy settings</p>
              </div>

              {/* Target Platform selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Target Operating System:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'darwin', title: 'macOS (MacBook)', desc: 'AppleScript, Spotlight & native .app execution' },
                    { id: 'win32', title: 'Windows PC', desc: 'PowerShell, URI schemes & win32 start' },
                    { id: 'android', title: 'Android Mobile', desc: 'Android Intents & Play Store fallback' },
                    { id: 'ios', title: 'iPhone / iPad (iOS)', desc: 'URL Schemes & Safari web fallback' },
                    { id: 'web', title: 'Web Preview', desc: 'Browser simulation & official web app links' },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => onPlatformChange(p.id as SupportedPlatform)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        preferredPlatform === p.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-semibold block">{p.title}</span>
                      <span className="text-[10px] text-slate-500">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Browser */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Preferred Web Browser:</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'default', label: 'System Default' },
                    { id: 'chrome', label: 'Google Chrome' },
                    { id: 'safari', label: 'Apple Safari' },
                    { id: 'firefox', label: 'Mozilla Firefox' },
                    { id: 'edge', label: 'Microsoft Edge' },
                    { id: 'brave', label: 'Brave Browser' },
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => onBrowserChange(b.id as PreferredBrowser)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        preferredBrowser === b.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Voice & Speech Language Mode:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'en', label: 'English (US / IN)', sub: 'Standard voice' },
                    { id: 'ta', label: 'தமிழ் (Tamil)', sub: 'Native Tamil' },
                    { id: 'tanglish', label: 'Tanglish', sub: 'Tamil + English mix' },
                  ].map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => onLanguageChange(lang.id as LanguageMode)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        language === lang.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="text-xs font-semibold block">{lang.label}</span>
                      <span className="text-[10px] text-slate-500">{lang.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy and Security Policy */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-semibold block">
                  Security & Safety Guard
                </span>
                <p className="text-slate-300">
                  &bull; <strong className="text-slate-200">Zero Audio Storage:</strong> Audio recordings are never retained.
                </p>
                <p className="text-slate-300">
                  &bull; <strong className="text-slate-200">Offline Fallback:</strong> Application resolution works 100% offline without sending commands to cloud models when not required.
                </p>
                <p className="text-slate-300">
                  &bull; <strong className="text-slate-200">Confirmation Guard:</strong> Dangerous operations (deletions, file overwrites) require explicit confirmation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
