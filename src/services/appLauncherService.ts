import { DiscoveredApp, AppResolutionResult } from '../types';

export type SupportedPlatform = 'darwin' | 'win32' | 'android' | 'ios' | 'web';
export type PreferredBrowser = 'default' | 'chrome' | 'safari' | 'firefox' | 'edge' | 'brave';

// Comprehensive catalog of cross-platform applications across all categories
export const UNIVERSAL_APPS_CATALOG: DiscoveredApp[] = [
  // --- SOCIAL MEDIA ---
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    aliases: ['insta', 'instagramm', 'ig', 'inztagram', 'istagram', 'instagaram'],
    macAppName: 'Instagram',
    windowsUri: 'instagram:',
    androidPackage: 'com.instagram.android',
    iosScheme: 'instagram://',
    webUrl: 'https://www.instagram.com',
    description: 'Photo and video sharing social network'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    aliases: ['fb', 'face book', 'meta', 'facebuk'],
    macAppName: 'Facebook',
    windowsUri: 'fb:',
    androidPackage: 'com.facebook.katana',
    iosScheme: 'fb://',
    webUrl: 'https://www.facebook.com',
    description: 'Social networking and media feed'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'social',
    aliases: ['watsapp', 'vatsapp', 'whatsup', 'whatsapp web', 'wapp', 'wattsapp', 'watsp'],
    macAppName: 'WhatsApp',
    windowsUri: 'whatsapp:',
    androidPackage: 'com.whatsapp',
    iosScheme: 'whatsapp://',
    webUrl: 'https://web.whatsapp.com',
    description: 'Instant messaging and voice/video calling'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    category: 'social',
    aliases: ['snap', 'snap chat', 'sc', 'snapp'],
    macAppName: 'Snapchat',
    windowsUri: 'snapchat:',
    androidPackage: 'com.snapchat.android',
    iosScheme: 'snapchat://',
    webUrl: 'https://www.snapchat.com',
    description: 'Multimedia messaging and snaps'
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'social',
    aliases: ['tg', 'tele gram', 'telegram messenger'],
    macAppName: 'Telegram',
    windowsUri: 'tg:',
    androidPackage: 'org.telegram.messenger',
    iosScheme: 'tg://',
    webUrl: 'https://web.telegram.org',
    description: 'Cloud-based messaging and channels'
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    category: 'social',
    aliases: ['twitter', 'twiter', 'tweet', 'x app', 'tweeter'],
    macAppName: 'Twitter',
    windowsUri: 'twitter:',
    androidPackage: 'com.twitter.android',
    iosScheme: 'twitter://',
    webUrl: 'https://x.com',
    description: 'Real-time microblogging and news platform'
  },
  {
    id: 'threads',
    name: 'Threads',
    category: 'social',
    aliases: ['threads by instagram', 'meta threads'],
    macAppName: 'Threads',
    windowsUri: 'threads:',
    androidPackage: 'com.instagram.barcelona',
    iosScheme: 'threads://',
    webUrl: 'https://www.threads.net',
    description: 'Text-based conversation platform'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    category: 'social',
    aliases: ['pin', 'pntrst', 'pinterests'],
    macAppName: 'Pinterest',
    windowsUri: 'pinterest:',
    androidPackage: 'com.pinterest',
    iosScheme: 'pinterest://',
    webUrl: 'https://www.pinterest.com',
    description: 'Visual discovery and moodboards'
  },
  {
    id: 'reddit',
    name: 'Reddit',
    category: 'social',
    aliases: ['redit', 'r/', 'subreddits'],
    macAppName: 'Reddit',
    windowsUri: 'reddit:',
    androidPackage: 'com.reddit.frontpage',
    iosScheme: 'reddit://',
    webUrl: 'https://www.reddit.com',
    description: 'Community forums, discussions, and feeds'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    aliases: ['linked in', 'linkdin', 'professional network'],
    macAppName: 'LinkedIn',
    windowsUri: 'linkedin:',
    androidPackage: 'com.linkedin.android',
    iosScheme: 'linkedin://',
    webUrl: 'https://www.linkedin.com',
    description: 'Professional careers and networking'
  },
  {
    id: 'discord',
    name: 'Discord',
    category: 'social',
    aliases: ['disc', 'discord app', 'gaming chat'],
    macAppName: 'Discord',
    windowsUri: 'discord:',
    androidPackage: 'com.discord',
    iosScheme: 'discord://',
    webUrl: 'https://discord.com/app',
    description: 'Voice, video, and text community chat'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'social',
    aliases: ['tik tok', 'tok', 'short videos'],
    macAppName: 'TikTok',
    windowsUri: 'tiktok:',
    androidPackage: 'com.zhiliaoapp.musically',
    iosScheme: 'snssdk1233://',
    webUrl: 'https://www.tiktok.com',
    description: 'Short-form mobile video feeds'
  },

  // --- VIDEO & ENTERTAINMENT ---
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'entertainment',
    aliases: ['yt', 'you tube', 'yutube', 'utube', 'yu tube'],
    macAppName: 'YouTube',
    windowsUri: 'youtube:',
    androidPackage: 'com.google.android.youtube',
    iosScheme: 'youtube://',
    webUrl: 'https://www.youtube.com',
    description: 'Video streaming and tutorials'
  },
  {
    id: 'youtubemusic',
    name: 'YouTube Music',
    category: 'entertainment',
    aliases: ['yt music', 'youtube songs', 'ytmusic'],
    macAppName: 'YouTube Music',
    windowsUri: 'youtubemusic:',
    androidPackage: 'com.google.android.apps.youtube.music',
    iosScheme: 'youtubemusic://',
    webUrl: 'https://music.youtube.com',
    description: 'Music streaming service'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'entertainment',
    aliases: ['spotfy', 'spoty', 'songs app', 'music app'],
    macAppName: 'Spotify',
    windowsUri: 'spotify:',
    androidPackage: 'com.spotify.music',
    iosScheme: 'spotify://',
    webUrl: 'https://open.spotify.com',
    description: 'Music, playlists, and podcasts'
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'entertainment',
    aliases: ['net flix', 'netfix', 'movies app'],
    macAppName: 'Netflix',
    windowsUri: 'netflix:',
    androidPackage: 'com.netflix.mediaclient',
    iosScheme: 'nflx://',
    webUrl: 'https://www.netflix.com',
    description: 'Movies and TV series streaming'
  },
  {
    id: 'primevideo',
    name: 'Prime Video',
    category: 'entertainment',
    aliases: ['amazon prime', 'amazon video', 'prime', 'amazon prime video'],
    macAppName: 'Prime Video',
    windowsUri: 'primevideo:',
    androidPackage: 'com.amazon.avod.thirdpartyclient',
    iosScheme: 'aiv://',
    webUrl: 'https://www.primevideo.com',
    description: 'Amazon Prime streaming video'
  },
  {
    id: 'disneyplus',
    name: 'Disney+',
    category: 'entertainment',
    aliases: ['disney', 'hotstar', 'disney plus', 'disney plus hotstar', 'disneyhotstar'],
    macAppName: 'Disney+',
    windowsUri: 'disneyplus:',
    androidPackage: 'com.disney.disneyplus',
    iosScheme: 'disneyplus://',
    webUrl: 'https://www.disneyplus.com',
    description: 'Family movies, Marvel, Star Wars streaming'
  },
  {
    id: 'vlc',
    name: 'VLC Media Player',
    category: 'entertainment',
    aliases: ['vlc', 'vlc player', 'media player', 'video player'],
    macAppName: 'VLC',
    windowsUri: 'vlc:',
    androidPackage: 'org.videolan.vlc',
    iosScheme: 'vlc://',
    webUrl: 'https://www.videolan.org',
    description: 'Cross-platform multimedia player'
  },
  {
    id: 'twitch',
    name: 'Twitch',
    category: 'entertainment',
    aliases: ['twich', 'gaming streams', 'live streams'],
    macAppName: 'Twitch',
    windowsUri: 'twitch:',
    androidPackage: 'tv.twitch.android.app',
    iosScheme: 'twitch://',
    webUrl: 'https://www.twitch.tv',
    description: 'Live interactive streaming platform'
  },

  // --- WORK, EDUCATION & PRODUCTIVITY ---
  {
    id: 'word',
    name: 'Microsoft Word',
    category: 'work',
    aliases: ['word', 'ms word', 'microsoft word document', 'doc editor', 'word doc'],
    macAppName: 'Microsoft Word',
    windowsUri: 'ms-word:',
    androidPackage: 'com.microsoft.office.word',
    iosScheme: 'ms-word://',
    webUrl: 'https://office.live.com',
    description: 'Word processing and document editing'
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    category: 'work',
    aliases: ['excel', 'ms excel', 'spreadsheet', 'sheets app', 'exel', 'egsel', 'student table'],
    macAppName: 'Microsoft Excel',
    windowsUri: 'ms-excel:',
    androidPackage: 'com.microsoft.office.excel',
    iosScheme: 'ms-excel://',
    webUrl: 'https://office.live.com',
    description: 'Spreadsheet formulas and table builder'
  },
  {
    id: 'powerpoint',
    name: 'Microsoft PowerPoint',
    category: 'work',
    aliases: ['powerpoint', 'ppt', 'power point', 'slides', 'presentations', 'ms powerpoint'],
    macAppName: 'Microsoft PowerPoint',
    windowsUri: 'ms-powerpoint:',
    androidPackage: 'com.microsoft.office.powerpoint',
    iosScheme: 'ms-powerpoint://',
    webUrl: 'https://office.live.com',
    description: 'Slide presentations'
  },
  {
    id: 'googledocs',
    name: 'Google Docs',
    category: 'work',
    aliases: ['docs', 'google doc', 'gdocs', 'doc'],
    macAppName: 'Google Docs',
    windowsUri: 'googledocs:',
    androidPackage: 'com.google.android.apps.docs.editors.docs',
    iosScheme: 'googledocs://',
    webUrl: 'https://docs.google.com',
    description: 'Collaborative online document editor'
  },
  {
    id: 'googlesheets',
    name: 'Google Sheets',
    category: 'work',
    aliases: ['google sheets', 'gsheets', 'online spreadsheet'],
    macAppName: 'Google Sheets',
    windowsUri: 'googlesheets:',
    androidPackage: 'com.google.android.apps.docs.editors.sheets',
    iosScheme: 'googlesheets://',
    webUrl: 'https://sheets.google.com',
    description: 'Cloud spreadsheets with collaboration'
  },
  {
    id: 'googledrive',
    name: 'Google Drive',
    category: 'work',
    aliases: ['drive', 'gdrive', 'google drive storage'],
    macAppName: 'Google Drive',
    windowsUri: 'googledrive:',
    androidPackage: 'com.google.android.apps.docs',
    iosScheme: 'googledrive://',
    webUrl: 'https://drive.google.com',
    description: 'Cloud file storage and backup'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'work',
    aliases: ['mail', 'google mail', 'email', 'inbox', 'g mail'],
    macAppName: 'Mail',
    windowsUri: 'mailto:',
    androidPackage: 'com.google.android.gm',
    iosScheme: 'googlegmail://',
    webUrl: 'https://mail.google.com',
    description: 'Email and communications'
  },
  {
    id: 'zoom',
    name: 'Zoom Meetings',
    category: 'work',
    aliases: ['zoom', 'zoom video', 'zoom conference', 'zoom meeting'],
    macAppName: 'zoom.us',
    windowsUri: 'zoommtg:',
    androidPackage: 'us.zoom.videomeetings',
    iosScheme: 'zoommtg://',
    webUrl: 'https://zoom.us',
    description: 'Video conferencing and team meetings'
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    category: 'work',
    aliases: ['teams', 'ms teams', 'microsoft teams meeting'],
    macAppName: 'Microsoft Teams',
    windowsUri: 'msteams:',
    androidPackage: 'com.microsoft.teams',
    iosScheme: 'msteams://',
    webUrl: 'https://teams.microsoft.com',
    description: 'Enterprise team communication'
  },
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'work',
    aliases: ['vs code', 'code', 'vscode', 'visual studio', 'editor', 'code editor', 'vs'],
    macAppName: 'Visual Studio Code',
    windowsUri: 'vscode:',
    androidPackage: '',
    iosScheme: '',
    webUrl: 'https://vscode.dev',
    description: 'Code editor and development environment'
  },
  {
    id: 'androidstudio',
    name: 'Android Studio',
    category: 'work',
    aliases: ['android studio', 'studio', 'android dev'],
    macAppName: 'Android Studio',
    windowsUri: '',
    androidPackage: '',
    iosScheme: '',
    webUrl: 'https://developer.android.com/studio',
    description: 'Official IDE for Android app development'
  },
  {
    id: 'xcode',
    name: 'Xcode',
    category: 'work',
    aliases: ['x code', 'apple developer'],
    macAppName: 'Xcode',
    windowsUri: '',
    androidPackage: '',
    iosScheme: '',
    webUrl: 'https://developer.apple.com/xcode',
    description: 'Apple IDE for iOS and macOS development'
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'work',
    aliases: ['slak', 'work chat', 'workspace'],
    macAppName: 'Slack',
    windowsUri: 'slack:',
    androidPackage: 'com.Slack',
    iosScheme: 'slack://',
    webUrl: 'https://app.slack.com',
    description: 'Team messaging and workspace collaboration'
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'work',
    aliases: ['notion notes', 'notes notion', 'wiki'],
    macAppName: 'Notion',
    windowsUri: 'notion:',
    androidPackage: 'notion.id',
    iosScheme: 'notion://',
    webUrl: 'https://www.notion.so',
    description: 'Connected workspace for docs and wikis'
  },
  {
    id: 'figma',
    name: 'Figma',
    category: 'work',
    aliases: ['figma design', 'ui design'],
    macAppName: 'Figma',
    windowsUri: 'figma:',
    androidPackage: 'com.figma.mirror',
    iosScheme: 'figma://',
    webUrl: 'https://www.figma.com',
    description: 'Collaborative UI/UX design tool'
  },
  {
    id: 'github',
    name: 'GitHub Desktop',
    category: 'work',
    aliases: ['github', 'git', 'git hub', 'github app'],
    macAppName: 'GitHub Desktop',
    windowsUri: 'github-windows:',
    androidPackage: 'com.github.android',
    iosScheme: 'github://',
    webUrl: 'https://github.com',
    description: 'Git repositories and version control'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'work',
    aliases: ['open ai', 'openai', 'gpt', 'chat gpt'],
    macAppName: 'ChatGPT',
    windowsUri: 'chatgpt:',
    androidPackage: 'com.openai.chatgpt',
    iosScheme: 'chatgpt://',
    webUrl: 'https://chatgpt.com',
    description: 'AI conversational assistant'
  },

  // --- SYSTEM & EVERYDAY APPS ---
  {
    id: 'camera',
    name: 'Camera',
    category: 'system',
    aliases: ['cam', 'photo camera', 'video camera', 'webcam', 'photo booth'],
    macAppName: 'Photo Booth',
    windowsUri: 'microsoft.windows.camera:',
    androidPackage: 'com.google.android.GoogleCamera',
    iosScheme: 'camera:',
    description: 'Device photo and video camera'
  },
  {
    id: 'photos',
    name: 'Photos & Gallery',
    category: 'system',
    aliases: ['gallery', 'photo album', 'pictures', 'image gallery', 'photos app'],
    macAppName: 'Photos',
    windowsUri: 'ms-photos:',
    androidPackage: 'com.google.android.apps.photos',
    iosScheme: 'photos-redirect://',
    description: 'View photos and media gallery'
  },
  {
    id: 'settings',
    name: 'System Settings',
    category: 'system',
    aliases: ['settings', 'preferences', 'system preferences', 'config', 'control panel'],
    macAppName: 'System Settings',
    windowsUri: 'ms-settings:',
    androidPackage: 'com.android.settings',
    iosScheme: 'app-settings:',
    description: 'Device preferences and controls'
  },
  {
    id: 'calculator',
    name: 'Calculator',
    category: 'system',
    aliases: ['calc', 'kalkulator', 'maths calc', 'calculate'],
    macAppName: 'Calculator',
    windowsUri: 'calculator:',
    androidPackage: 'com.google.android.calculator',
    iosScheme: 'calc:',
    description: 'Mathematical calculations'
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'system',
    aliases: ['calender', 'schedule', 'events', 'calendar app'],
    macAppName: 'Calendar',
    windowsUri: 'outlookcal:',
    androidPackage: 'com.google.android.calendar',
    iosScheme: 'calshow:',
    description: 'Schedule, dates, and reminders'
  },
  {
    id: 'clock',
    name: 'Clock & Timer',
    category: 'system',
    aliases: ['alarm', 'timer', 'stopwatch', 'clock app', 'world clock'],
    macAppName: 'Clock',
    windowsUri: 'ms-clock:',
    androidPackage: 'com.google.android.deskclock',
    iosScheme: 'clock-alarm:',
    description: 'Alarms, timers, and world clock'
  },
  {
    id: 'files',
    name: 'Files & Finder',
    category: 'system',
    aliases: ['finder', 'file manager', 'file explorer', 'explorer', 'my files', 'files app'],
    macAppName: 'Finder',
    windowsUri: 'explorer.exe',
    androidPackage: 'com.google.android.apps.nbu.files',
    iosScheme: 'shareddocuments://',
    description: 'Browse local files and folders'
  },
  {
    id: 'maps',
    name: 'Maps & Navigation',
    category: 'system',
    aliases: ['google maps', 'apple maps', 'gps', 'navigation', 'map'],
    macAppName: 'Maps',
    windowsUri: 'bingmaps:',
    androidPackage: 'com.google.android.apps.maps',
    iosScheme: 'maps://',
    webUrl: 'https://maps.google.com',
    description: 'Maps, directions, and traffic'
  },
  {
    id: 'browser',
    name: 'Google Chrome',
    category: 'system',
    aliases: ['chrome', 'google chrome', 'safari', 'web browser', 'edge', 'internet', 'browser'],
    macAppName: 'Google Chrome',
    windowsUri: 'microsoft-edge:',
    androidPackage: 'com.android.chrome',
    iosScheme: 'googlechrome://',
    webUrl: 'https://www.google.com',
    description: 'Internet web browser'
  },
  {
    id: 'safari',
    name: 'Safari Browser',
    category: 'system',
    aliases: ['safari', 'apple browser'],
    macAppName: 'Safari',
    windowsUri: '',
    androidPackage: '',
    iosScheme: '',
    webUrl: 'https://www.apple.com/safari',
    description: 'macOS & iOS native browser'
  },
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'system',
    aliases: ['command prompt', 'bash', 'zsh', 'iterm', 'cmd', 'powershell', 'console'],
    macAppName: 'Terminal',
    windowsUri: 'cmd.exe',
    androidPackage: 'com.termux',
    iosScheme: '',
    description: 'Command line terminal'
  },
  {
    id: 'notes',
    name: 'Notes',
    category: 'system',
    aliases: ['apple notes', 'notepad', 'quick notes', 'memo'],
    macAppName: 'Notes',
    windowsUri: 'notepad.exe',
    androidPackage: 'com.google.android.keep',
    iosScheme: 'mobilenotes://',
    description: 'Quick notes and scratchpad'
  },
  {
    id: 'downloads',
    name: 'Downloads Folder',
    category: 'system',
    aliases: ['downloads', 'download folder', 'downloaded files', 'my downloads'],
    macAppName: 'Downloads',
    description: 'User downloaded files directory'
  },
  {
    id: 'documents',
    name: 'Documents Folder',
    category: 'system',
    aliases: ['documents', 'docs folder', 'my documents'],
    macAppName: 'Documents',
    description: 'User documents directory'
  },
  {
    id: 'desktop_folder',
    name: 'Desktop Folder',
    category: 'system',
    aliases: ['desktop', 'desktop screen', 'show desktop'],
    macAppName: 'Desktop',
    description: 'Desktop files and icons'
  },
  {
    id: 'activity_monitor',
    name: 'Activity Monitor',
    category: 'system',
    aliases: ['task manager', 'processes', 'cpu usage', 'memory'],
    macAppName: 'Activity Monitor',
    windowsUri: 'taskmgr.exe',
    description: 'Monitor system resource usage'
  }
];

// Local storage management for user-added custom applications
const CUSTOM_APPS_KEY = 'kiki_custom_apps_registry';

export function getCustomApps(): DiscoveredApp[] {
  try {
    const raw = localStorage.getItem(CUSTOM_APPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomApp(app: DiscoveredApp): DiscoveredApp[] {
  try {
    const existing = getCustomApps().filter(a => a.id !== app.id);
    const updated = [...existing, app];
    localStorage.setItem(CUSTOM_APPS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteCustomApp(id: string): DiscoveredApp[] {
  try {
    const existing = getCustomApps().filter(a => a.id !== id);
    localStorage.setItem(CUSTOM_APPS_KEY, JSON.stringify(existing));
    return existing;
  } catch {
    return [];
  }
}

// Phonetic and speech-recognition mishearing dictionary
const SPEECH_NORMALIZATION_MAP: Record<string, string> = {
  'insta': 'instagram',
  'inztagram': 'instagram',
  'istagram': 'instagram',
  'instagaram': 'instagram',
  'yt': 'youtube',
  'yutube': 'youtube',
  'utube': 'youtube',
  'yu tube': 'youtube',
  'vatsapp': 'whatsapp',
  'watsapp': 'whatsapp',
  'whatsup': 'whatsapp',
  'wapp': 'whatsapp',
  'wattsapp': 'whatsapp',
  'face book': 'facebook',
  'fb': 'facebook',
  'twiter': 'twitter',
  'tweeter': 'twitter',
  'x app': 'x',
  'tele gram': 'telegram',
  'tg': 'telegram',
  'spoty': 'spotify',
  'spotfy': 'spotify',
  'exel': 'excel',
  'egsel': 'excel',
  'spredsheet': 'excel',
  'ms excel': 'excel',
  'microsoft excel': 'excel',
  'vs code': 'visual studio code',
  'vscode': 'visual studio code',
  'code editor': 'visual studio code',
  'visual studio': 'visual studio code',
  'word doc': 'word',
  'ms word': 'word',
  'microsoft word': 'word',
  'ppt': 'powerpoint',
  'power point': 'powerpoint',
  'calc': 'calculator',
  'kalkulator': 'calculator',
  'cam': 'camera',
  'photo booth': 'camera',
  'file manager': 'files',
  'finder': 'files',
  'file explorer': 'files',
  'explorer': 'files',
  'my files': 'files',
  'prime': 'prime video',
  'amazon prime': 'prime video',
  'disney': 'disneyplus',
  'hotstar': 'disneyplus',
  'disney plus': 'disneyplus',
  'gdocs': 'google docs',
  'google doc': 'google docs',
  'gdrive': 'google drive',
  'gmail': 'gmail',
  'g mail': 'gmail',
  'email': 'gmail',
  'teams meeting': 'teams',
  'ms teams': 'teams',
  'studio': 'android studio',
  'android dev': 'android studio',
  'gallery': 'photos',
  'preferences': 'settings',
  'system preferences': 'settings',
  'alarm': 'clock',
  'timer': 'clock',
  'stopwatch': 'clock',
  'google maps': 'maps',
  'apple maps': 'maps',
  'web browser': 'browser',
  'chrome': 'browser',
  'safari': 'safari',
  'download folder': 'downloads',
  'downloaded files': 'downloads'
};

// Clean spoken string to extract potential app name
export function cleanSpokenCommand(transcript: string): {
  extractedName: string;
  requestedBrowser?: string;
  query?: string;
  isExplicitLaunch: boolean;
} {
  let text = transcript.toLowerCase().trim();

  // Detect explicit browser request e.g., "Open YouTube in Chrome"
  let requestedBrowser: string | undefined;
  const browserMatch = text.match(/\bin\s+(chrome|safari|firefox|edge|browser)\b/i);
  if (browserMatch) {
    requestedBrowser = browserMatch[1].toLowerCase();
    text = text.replace(browserMatch[0], '');
  }

  // Detect search query e.g., "search for python tutorials"
  let query: string | undefined;
  const searchMatch = text.match(/(?:and\s+)?search\s+(?:for\s+)?(.*)/i);
  if (searchMatch) {
    query = searchMatch[1].trim();
    text = text.replace(searchMatch[0], '');
  }

  // Multi-lingual voice wake words and command phrases (Tamil, Tanglish, English)
  const stripPrefixes = [
    /^hey\s+kiki[,\s]*/i,
    /^kiki[,\s]*/i,
    /^hi\s+kiki[,\s]*/i,
    /^ok\s+kiki[,\s]*/i,
    /^please\s+/i,
    /^can\s+you\s+/i,
    /^would\s+you\s+/i,
    /^open\s+the\s+app\s+/i,
    /^open\s+the\s+application\s+/i,
    /^open\s+up\s+/i,
    /^open\s+my\s+/i,
    /^open\s+/i,
    /^launch\s+the\s+app\s+/i,
    /^launch\s+/i,
    /^start\s+up\s+/i,
    /^start\s+/i,
    /^run\s+/i,
    /^switch\s+to\s+/i,
    /^bring\s+up\s+/i,
    /^go\s+to\s+/i,
    /^show\s+me\s+/i,
    /^thira\s+/i,
    /^thiravavum\s+/i,
    /^kiki\s+thira\s+/i
  ];

  let isExplicitLaunch = false;
  for (const prefix of stripPrefixes) {
    if (prefix.test(text)) {
      isExplicitLaunch = true;
      text = text.replace(prefix, '');
    }
  }

  // Strip suffixes e.g. "open pannu", "thira", "app", "application"
  const suffixMatches = [
    /\s+open\s+pannu$/i,
    /\s+launch\s+pannu$/i,
    /\s+start\s+pannu$/i,
    /\s+pannu$/i,
    /\s+thira$/i,
    /\s+app$/i,
    /\s+application$/i,
    /\s+folder$/i,
    /\s+please$/i
  ];

  for (const suffix of suffixMatches) {
    if (suffix.test(text)) {
      isExplicitLaunch = true;
      text = text.replace(suffix, '');
    }
  }

  text = text.trim();

  // If normalized lookup matches a known synonym
  if (SPEECH_NORMALIZATION_MAP[text]) {
    text = SPEECH_NORMALIZATION_MAP[text];
  }

  return { extractedName: text, requestedBrowser, query, isExplicitLaunch };
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // deletion
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

// Similarity score between 0.0 and 1.0
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  // Exact substring match
  if (s1.includes(s2) || s2.includes(s1)) {
    const longer = Math.max(s1.length, s2.length);
    const shorter = Math.min(s1.length, s2.length);
    return 0.85 + (shorter / longer) * 0.15;
  }

  const distance = levenshteinDistance(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - distance / maxLen);
}

// Main resolution engine for ANY application
export function resolveApplication(
  transcript: string,
  platform: SupportedPlatform = 'darwin',
  customRegistry: DiscoveredApp[] = []
): AppResolutionResult {
  const { extractedName, requestedBrowser, query, isExplicitLaunch } = cleanSpokenCommand(transcript);
  const allApps = [...UNIVERSAL_APPS_CATALOG, ...customRegistry, ...getCustomApps()];

  if (!extractedName) {
    return {
      matchType: 'not_found',
      confidence: 0,
      launchMethod: 'web_fallback',
      spokenFeedback: "I didn't catch the application name. Please say 'Open' followed by any app name.",
      explanation: 'No application name detected in spoken transcript.'
    };
  }

  let bestMatch: DiscoveredApp | null = null;
  let highestScore = 0;
  let matchReason: 'exact' | 'alias' | 'fuzzy' = 'fuzzy';
  const candidates: { app: DiscoveredApp; score: number }[] = [];

  for (const app of allApps) {
    // 1. Exact match on official name
    if (app.name.toLowerCase() === extractedName) {
      bestMatch = app;
      highestScore = 1.0;
      matchReason = 'exact';
      break;
    }

    // 2. Exact match on known aliases
    const exactAlias = app.aliases.some(alias => alias.toLowerCase() === extractedName);
    if (exactAlias) {
      bestMatch = app;
      highestScore = 0.98;
      matchReason = 'alias';
      break;
    }

    // 3. Fuzzy matching on name
    const nameScore = calculateSimilarity(app.name, extractedName);
    let appScore = nameScore;

    // Check fuzzy match against all aliases
    for (const alias of app.aliases) {
      const aliasScore = calculateSimilarity(alias, extractedName);
      if (aliasScore > appScore) {
        appScore = aliasScore;
      }
    }

    if (appScore > 0.58) {
      candidates.push({ app, score: appScore });
    }

    if (appScore > highestScore) {
      highestScore = appScore;
      bestMatch = app;
    }
  }

  // Sort candidates by score descending
  candidates.sort((a, b) => b.score - a.score);

  // If score is above 0.65 threshold, we consider it a verified match
  if (bestMatch && highestScore >= 0.65) {
    const app = bestMatch;
    let launchMethod: 'native_mac' | 'native_windows' | 'android_intent' | 'ios_scheme' | 'web_fallback' = 'native_mac';
    let targetUrlOrPath = app.macAppName || app.name;
    let spoken = `Opening ${app.name}.`;

    if (platform === 'darwin') {
      launchMethod = 'native_mac';
      targetUrlOrPath = app.macAppName || app.name;
    } else if (platform === 'win32') {
      launchMethod = app.windowsUri ? 'native_windows' : 'web_fallback';
      targetUrlOrPath = app.windowsUri || app.webUrl || app.name;
    } else if (platform === 'android') {
      launchMethod = app.androidPackage ? 'android_intent' : 'web_fallback';
      targetUrlOrPath = app.androidPackage || app.webUrl || '';
    } else if (platform === 'ios') {
      launchMethod = app.iosScheme ? 'ios_scheme' : 'web_fallback';
      targetUrlOrPath = app.iosScheme || app.webUrl || '';
    } else {
      launchMethod = app.webUrl ? 'web_fallback' : 'native_mac';
      targetUrlOrPath = app.webUrl || app.name;
    }

    // If user requested a specific browser or web fallback needed
    if (requestedBrowser && app.webUrl) {
      launchMethod = 'web_fallback';
      targetUrlOrPath = app.webUrl;
      spoken = `Opening ${app.name} in ${requestedBrowser.charAt(0).toUpperCase() + requestedBrowser.slice(1)}.`;
    }

    // If query provided (e.g. search for tutorials on YouTube or Google)
    if (query) {
      if (app.id === 'youtube') {
        targetUrlOrPath = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        spoken = `Opening YouTube and searching for "${query}".`;
        launchMethod = 'web_fallback';
      } else if (app.id === 'browser' || app.id === 'safari') {
        targetUrlOrPath = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        spoken = `Searching for "${query}" in browser.`;
        launchMethod = 'web_fallback';
      }
    }

    return {
      matchedApp: app,
      matchType: matchReason,
      confidence: highestScore,
      launchMethod,
      targetUrlOrPath,
      spokenFeedback: spoken,
      explanation: `Resolved "${extractedName}" to ${app.name} (${Math.round(highestScore * 100)}% match)`,
      candidates: candidates.filter(c => c.app.id !== app.id).slice(0, 3).map(c => c.app)
    };
  }

  // DYNAMIC APP DISCOVERY: Not in fixed catalog, but user requested an application!
  // Capitalize properly for OS search
  const capitalized = extractedName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const dynamicApp: DiscoveredApp = {
    id: extractedName.replace(/\s+/g, '-').toLowerCase(),
    name: capitalized,
    category: 'custom',
    aliases: [extractedName],
    macAppName: capitalized,
    webUrl: `https://www.google.com/search?q=${encodeURIComponent(capitalized + ' app')}`,
    description: `Dynamically discovered application: ${capitalized}`
  };

  return {
    matchedApp: dynamicApp,
    matchType: 'fuzzy',
    confidence: isExplicitLaunch ? 0.72 : 0.45,
    launchMethod: platform === 'darwin' ? 'native_mac' : (platform === 'win32' ? 'native_windows' : 'web_fallback'),
    targetUrlOrPath: capitalized,
    spokenFeedback: `Attempting to launch ${capitalized} on your device.`,
    explanation: `Dynamic Application Discovery: Recognized "${capitalized}". Resolving via native OS search.`,
    candidates: candidates.slice(0, 3).map(c => c.app)
  };
}

// Helper to determine if a transcript is clearly an app launch command
export function isAppLaunchIntent(transcript: string): boolean {
  const { extractedName, isExplicitLaunch } = cleanSpokenCommand(transcript);
  if (!extractedName) return false;
  if (isExplicitLaunch) return true;

  // Check if extractedName is in our catalog
  const lower = extractedName.toLowerCase();
  for (const app of UNIVERSAL_APPS_CATALOG) {
    if (app.name.toLowerCase() === lower || app.aliases.some(a => a.toLowerCase() === lower)) {
      return true;
    }
  }
  return false;
}
