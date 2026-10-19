export type AssistantState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'launching'
  | 'speaking'
  | 'paused'
  | 'success'
  | 'error';

export type LanguageMode = 'en' | 'ta' | 'tanglish';

export interface DiscoveredApp {
  id: string;
  name: string;
  category: 'social' | 'entertainment' | 'work' | 'system' | 'custom';
  aliases: string[];
  macAppName?: string;
  windowsUri?: string;
  androidPackage?: string;
  iosScheme?: string;
  webUrl?: string;
  isInstalled?: boolean;
  description?: string;
}

export interface AppResolutionResult {
  matchedApp?: DiscoveredApp;
  matchType: 'exact' | 'alias' | 'fuzzy' | 'web_fallback' | 'not_found';
  confidence: number;
  launchMethod: 'native_mac' | 'native_windows' | 'android_intent' | 'ios_scheme' | 'web_fallback';
  spokenFeedback: string;
  explanation: string;
  targetUrlOrPath?: string;
  candidates?: DiscoveredApp[];
}

export interface VoiceTypingAction {
  action: 'insert' | 'correct' | 'undo' | 'clear';
  textToType?: string;
  targetLocation?: string;
}

export interface ExcelCellData {
  [cellRef: string]: string | number;
}

export interface ExcelAction {
  action: 'create_table' | 'set_cell' | 'read_cell' | 'navigate' | 'add_row' | 'bulk_insert' | 'calculate';
  cell?: string;
  value?: string;
  headers?: string[];
  rows?: (string | number)[][];
}

export interface AppLaunchPayload {
  appName: string;
  urlQuery?: string;
  targetPath?: string;
  browser?: string;
}

export interface ReadAloudAction {
  action: 'start' | 'pause' | 'continue' | 'stop' | 'speed_up' | 'slow_down';
  targetText?: string;
  speed?: number;
}

export interface AutomationStep {
  id: string;
  stepDescription: string;
  actionType: string;
  target?: string;
  details?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

export interface AutomationPlan {
  requiresConfirmation: boolean;
  confirmationMessage?: string;
  steps: AutomationStep[];
}

export interface IntentResponse {
  intent: 'APP_LAUNCH' | 'VOICE_TYPING' | 'EXCEL_ACTION' | 'READ_ALOUD' | 'COMPUTER_AUTOMATION' | 'EXPLAIN_REWRITE' | 'FOCUS_MODE' | 'GENERAL_CHAT';
  spokenResponse: string;
  confidence: number;
  appLaunch?: AppLaunchPayload;
  voiceTyping?: VoiceTypingAction;
  excelAction?: ExcelAction;
  readAloud?: ReadAloudAction;
  automation?: AutomationPlan;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  sender: 'user' | 'kiki';
  text: string;
  intent?: string;
  details?: any;
}

export interface CompanionStatus {
  connected: boolean;
  platform?: string;
  version?: string;
}
