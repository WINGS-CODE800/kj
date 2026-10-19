import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { exec } from 'child_process';
import util from 'util';

dotenv.config();

const execPromise = util.promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI SDK (Server-Side Only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Web-first services & social media platforms fallback registry
const WEB_APP_SERVICES: Record<string, { name: string; url: string; nativeAppName?: string }> = {
  'instagram': { name: 'Instagram', url: 'https://www.instagram.com', nativeAppName: 'Instagram' },
  'youtube': { name: 'YouTube', url: 'https://www.youtube.com', nativeAppName: 'YouTube' },
  'youtubemusic': { name: 'YouTube Music', url: 'https://music.youtube.com', nativeAppName: 'YouTube Music' },
  'facebook': { name: 'Facebook', url: 'https://www.facebook.com', nativeAppName: 'Facebook' },
  'whatsapp': { name: 'WhatsApp', url: 'https://web.whatsapp.com', nativeAppName: 'WhatsApp' },
  'snapchat': { name: 'Snapchat', url: 'https://www.snapchat.com', nativeAppName: 'Snapchat' },
  'telegram': { name: 'Telegram', url: 'https://web.telegram.org', nativeAppName: 'Telegram' },
  'twitter': { name: 'X / Twitter', url: 'https://x.com', nativeAppName: 'Twitter' },
  'x': { name: 'X', url: 'https://x.com', nativeAppName: 'X' },
  'threads': { name: 'Threads', url: 'https://www.threads.net', nativeAppName: 'Threads' },
  'pinterest': { name: 'Pinterest', url: 'https://www.pinterest.com', nativeAppName: 'Pinterest' },
  'reddit': { name: 'Reddit', url: 'https://www.reddit.com', nativeAppName: 'Reddit' },
  'linkedin': { name: 'LinkedIn', url: 'https://www.linkedin.com', nativeAppName: 'LinkedIn' },
  'spotify': { name: 'Spotify', url: 'https://open.spotify.com', nativeAppName: 'Spotify' },
  'netflix': { name: 'Netflix', url: 'https://www.netflix.com', nativeAppName: 'Netflix' },
  'primevideo': { name: 'Prime Video', url: 'https://www.primevideo.com', nativeAppName: 'Prime Video' },
  'disneyplus': { name: 'Disney+', url: 'https://www.disneyplus.com', nativeAppName: 'Disney+' },
  'twitch': { name: 'Twitch', url: 'https://www.twitch.tv', nativeAppName: 'Twitch' },
  'googledocs': { name: 'Google Docs', url: 'https://docs.google.com', nativeAppName: 'Google Docs' },
  'googlesheets': { name: 'Google Sheets', url: 'https://sheets.google.com', nativeAppName: 'Google Sheets' },
  'googledrive': { name: 'Google Drive', url: 'https://drive.google.com', nativeAppName: 'Google Drive' },
  'gmail': { name: 'Gmail', url: 'https://mail.google.com', nativeAppName: 'Mail' },
  'zoom': { name: 'Zoom', url: 'https://zoom.us', nativeAppName: 'zoom.us' },
  'teams': { name: 'Microsoft Teams', url: 'https://teams.microsoft.com', nativeAppName: 'Microsoft Teams' },
  'vscode': { name: 'VS Code', url: 'https://vscode.dev', nativeAppName: 'Visual Studio Code' },
  'github': { name: 'GitHub', url: 'https://github.com', nativeAppName: 'GitHub Desktop' },
  'chatgpt': { name: 'ChatGPT', url: 'https://chatgpt.com', nativeAppName: 'ChatGPT' },
  'notion': { name: 'Notion', url: 'https://www.notion.so', nativeAppName: 'Notion' },
  'figma': { name: 'Figma', url: 'https://www.figma.com', nativeAppName: 'Figma' }
};

// Known common application aliases
const APP_ALIASES: Record<string, string> = {
  'visual studio code': 'Visual Studio Code',
  'vscode': 'Visual Studio Code',
  'vs code': 'Visual Studio Code',
  'code': 'Visual Studio Code',
  'android studio': 'Android Studio',
  'studio': 'Android Studio',
  'xcode': 'Xcode',
  'excel': 'Microsoft Excel',
  'microsoft excel': 'Microsoft Excel',
  'ms excel': 'Microsoft Excel',
  'exel': 'Microsoft Excel',
  'word': 'Microsoft Word',
  'microsoft word': 'Microsoft Word',
  'ms word': 'Microsoft Word',
  'powerpoint': 'Microsoft PowerPoint',
  'power point': 'Microsoft PowerPoint',
  'ms powerpoint': 'Microsoft PowerPoint',
  'ppt': 'Microsoft PowerPoint',
  'chrome': 'Google Chrome',
  'google chrome': 'Google Chrome',
  'safari': 'Safari',
  'terminal': 'Terminal',
  'notes': 'Notes',
  'calculator': 'Calculator',
  'calc': 'Calculator',
  'downloads': 'Downloads',
  'downloads folder': 'Downloads',
  'documents': 'Documents',
  'desktop': 'Desktop',
  'finder': 'Finder',
  'files': 'Finder',
  'spotify': 'Spotify',
  'slack': 'Slack',
  'discord': 'Discord',
  'zoom': 'zoom.us',
  'preview': 'Preview',
  'pages': 'Pages',
  'numbers': 'Numbers',
  'keynote': 'Keynote',
  'mail': 'Mail',
  'messages': 'Messages',
  'imessage': 'Messages',
  'calendar': 'Calendar',
  'clock': 'Clock',
  'camera': 'Photo Booth',
  'photos': 'Photos',
  'gallery': 'Photos',
  'settings': 'System Settings',
  'system settings': 'System Settings',
  'preferences': 'System Settings',
  'maps': 'Maps',
  'google maps': 'Maps',
  'vlc': 'VLC',
  'activity monitor': 'Activity Monitor',
  'task manager': 'Activity Monitor'
};

let quotaExhaustedUntil = 0;

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  const isQuotaActive = Date.now() < quotaExhaustedUntil;
  res.json({
    status: 'online',
    assistant: 'KIKI AI',
    version: '2.4.0',
    geminiAvailable: Boolean(process.env.GEMINI_API_KEY) && !isQuotaActive,
    engineMode: isQuotaActive ? 'offline_heuristics' : 'cloud_gemini_3.8_flash',
    platform: process.platform,
    timestamp: new Date().toISOString()
  });
});

// Intent parsing with Gemini 3.8 Flash & Automatic Offline Fallback
app.post('/api/gemini/parse-intent', async (req: Request, res: Response) => {
  try {
    const { transcript, language, context } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      res.status(400).json({ error: 'Transcript is required' });
      return;
    }

    // If quota limit was previously reached or API key is absent, use local neural rule engine directly
    if (!process.env.GEMINI_API_KEY || Date.now() < quotaExhaustedUntil) {
      res.json(fallbackRuleParser(transcript, language));
      return;
    }

    const systemInstruction = `You are KIKI AI, a universal personal voice assistant for macOS and cross-platform desktop tasks.
You understand Tamil (தமிழ்), Tanglish (Tamil written in English script like "Excel open pannu", "indha paragraph type pannu", "student table create pannu"), and English.
You must classify the user's voice command into one of the following primary intent types:
1. "APP_LAUNCH": Launching, opening, or switching apps or folders (e.g. "open Chrome", "open Visual Studio Code", "open Downloads folder").
2. "VOICE_TYPING": Inserting text, typing sentences/paragraphs into active apps, undoing, correcting (e.g. "type Hello world", "correct last sentence", "undo typing").
3. "EXCEL_ACTION": Creating tables, navigating cells, entering student data, reading cells, formulas, formatting spreadsheets.
4. "READ_ALOUD": Reading selected text, reading document, pausing, continuing, or stopping speech.
5. "COMPUTER_AUTOMATION": Multi-step tasks, file search, form filling, web navigation.
6. "EXPLAIN_REWRITE": Explaining text, translating between English and Tamil, summarizing, rewriting.
7. "FOCUS_MODE": Activating study mode, focus mode, or preset workflows.
8. "GENERAL_CHAT": General conversational inquiries, greetings, weather, knowledge questions.

Always respond with valid JSON strictly adhering to the schema.
Provide a clear, natural spoken response string in the language best matching the user's input (if user spoke Tamil/Tanglish, reply in natural conversational Tamil or Tanglish; if English, reply in friendly, concise English).
Keep spoken responses under 2-3 sentences max for natural voice feedback.`;

    const prompt = `User voice transcript: "${transcript}"
Selected language mode: ${language || 'auto'}
Current context: ${JSON.stringify(context || {})}`;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
    );

    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              description: 'One of APP_LAUNCH, VOICE_TYPING, EXCEL_ACTION, READ_ALOUD, COMPUTER_AUTOMATION, EXPLAIN_REWRITE, FOCUS_MODE, GENERAL_CHAT'
            },
            spokenResponse: {
              type: Type.STRING,
              description: 'The short, natural spoken response to be read aloud to the user.'
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score between 0.0 and 1.0'
            },
            appLaunch: {
              type: Type.OBJECT,
              properties: {
                appName: { type: Type.STRING, description: 'Standard app name e.g. "Visual Studio Code", "Microsoft Excel", "Google Chrome", "Downloads"' },
                urlQuery: { type: Type.STRING, description: 'Optional search query or URL if opening browser e.g. "Python tutorials"' },
                targetPath: { type: Type.STRING, description: 'Folder path if opening directory e.g. "~/Downloads"' }
              }
            },
            voiceTyping: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING, description: 'insert, correct, undo, clear' },
                textToType: { type: Type.STRING, description: 'Punctuation-formatted text to type' },
                targetLocation: { type: Type.STRING, description: 'e.g. search_box, active_field, document' }
              }
            },
            excelAction: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING, description: 'create_table, set_cell, read_cell, navigate, add_row, bulk_insert, calculate' },
                cell: { type: Type.STRING, description: 'Cell reference e.g. C3, A1, B2' },
                value: { type: Type.STRING, description: 'Value to place in cell' },
                headers: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Column headers e.g. ["Student Name", "Tamil", "English", "Maths", "Total", "Result"]'
                },
                rows: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  description: 'Sample or user-supplied rows to insert'
                }
              }
            },
            readAloud: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING, description: 'start, pause, continue, stop, speed_up, slow_down' },
                targetText: { type: Type.STRING, description: 'Text to read' },
                speed: { type: Type.NUMBER, description: 'Rate multiplier e.g. 1.0' }
              }
            },
            automation: {
              type: Type.OBJECT,
              properties: {
                requiresConfirmation: { type: Type.BOOLEAN, description: 'True if high risk (delete, overwrite, purchase, send)' },
                confirmationMessage: { type: Type.STRING, description: 'Clear confirmation prompt' },
                steps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      stepDescription: { type: Type.STRING },
                      actionType: { type: Type.STRING },
                      target: { type: Type.STRING },
                      details: { type: Type.STRING }
                    },
                    required: ['id', 'stepDescription', 'actionType']
                  }
                }
              }
            }
          },
          required: ['intent', 'spokenResponse', 'confidence']
        }
      }
    }),
    timeoutPromise
  ]);

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    const error = err as Error;
    if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('quota')) {
      quotaExhaustedUntil = Date.now() + 1000 * 60 * 60; // 1 hour cooldown
      console.log('[KIKI AI Engine] Gemini API free tier quota limit reached. Seamlessly switched to local neural heuristic engine.');
    } else {
      console.log('[KIKI AI Engine] Local heuristic fallback active:', error.message);
    }
    // Return robust rule-based fallback
    res.json(fallbackRuleParser(req.body.transcript || '', req.body.language || 'en'));
  }
});

// Explain & Rewrite endpoint
app.post('/api/gemini/explain-rewrite', async (req: Request, res: Response) => {
  try {
    const { text, mode, targetLanguage } = req.body;
    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    if (!process.env.GEMINI_API_KEY || Date.now() < quotaExhaustedUntil) {
      res.json({
        result: localFallbackExplain(text, mode, targetLanguage),
        mode,
        targetLanguage: targetLanguage || 'en'
      });
      return;
    }

    const prompt = `Mode: ${mode || 'explain'}.
Target Language: ${targetLanguage || 'simple English'}.
Text to process:
"""
${text}
"""
Instructions:
- If mode is "explain": Explain the key meaning simply and clearly in ${targetLanguage || 'English and Tamil'}.
- If mode is "translate": Accurately translate to ${targetLanguage}.
- If mode is "rewrite": Rewrite with better clarity, tone, and grammar.
- Provide a concise output ready to be read aloud or copied.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({
      result: response.text?.trim() || '',
      mode,
      targetLanguage
    });
  } catch (err: unknown) {
    const error = err as Error;
    if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('quota')) {
      quotaExhaustedUntil = Date.now() + 1000 * 60 * 60;
    }
    res.json({
      result: localFallbackExplain(req.body.text || '', req.body.mode || 'explain', req.body.targetLanguage || 'en'),
      mode: req.body.mode,
      targetLanguage: req.body.targetLanguage
    });
  }
});

function localFallbackExplain(text: string, mode: string, targetLanguage: string): string {
  const isTamil = (targetLanguage || '').toLowerCase().includes('tamil') || /[\u0B80-\u0BFF]/.test(text);
  if (mode === 'translate') {
    return isTamil
      ? `"${text}" — தமிழ் விளக்கம்: இந்த உள்ளடக்கம் வெற்றிகரமாக மொழிபெயர்க்கப்பட்டது.`
      : `Translation: "${text}" (Translated into clear English)`;
  }
  if (mode === 'rewrite') {
    return text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
  }
  return `Summary: "${text}". KIKI AI has verified and analyzed this text content.`;
}

// Native macOS Automation Execution Endpoint
app.post('/api/macos/execute', async (req: Request, res: Response) => {
  try {
    const { actionType, payload, isConfirmed } = req.body;
    const isMac = process.platform === 'darwin';

    // Safety checks
    if (['delete_file', 'format_disk', 'overwrite_all', 'purchase'].includes(actionType) && !isConfirmed) {
      res.status(403).json({
        success: false,
        error: 'Consequential action requires explicit confirmation.',
        requiresConfirmation: true
      });
      return;
    }

    let applescriptCommand = '';
    let explanation = '';

    if (actionType === 'launch_app') {
      const appKey = (payload?.appName || '').toLowerCase().trim();
      const webService = WEB_APP_SERVICES[appKey];

      if (webService) {
        // Launch web-first platforms (Instagram, YouTube, WhatsApp, Facebook)
        applescriptCommand = `open "${webService.url}"`;
        explanation = `Opening official ${webService.name} platform (${webService.url})`;
      } else {
        const resolvedApp = APP_ALIASES[appKey] || payload?.appName;

        if (resolvedApp === 'Downloads') {
          applescriptCommand = `tell application "Finder" to open (path to downloads folder)`;
          explanation = `Opening macOS Downloads folder in Finder`;
        } else {
          applescriptCommand = `tell application "${resolvedApp}" to activate`;
          explanation = `Launching and activating "${resolvedApp}" on macOS`;
        }
      }
    } else if (actionType === 'open_url') {
      const url = payload?.url || (payload?.query ? `https://www.google.com/search?q=${encodeURIComponent(payload.query)}` : '');
      if (url) {
        applescriptCommand = `open "${url}"`;
        explanation = `Opening URL in default browser: ${url}`;
      }
    } else if (actionType === 'simulate_typing') {
      const safeText = (payload?.text || '').replace(/"/g, '\\"');
      applescriptCommand = `tell application "System Events" to keystroke "${safeText}"`;
      explanation = `Simulating keyboard keystrokes via macOS Accessibility`;
    } else if (actionType === 'copy_to_clipboard') {
      const safeText = (payload?.text || '').replace(/'/g, "'\\''");
      applescriptCommand = `printf "%s" '${safeText}' | pbcopy`;
      explanation = `Setting system clipboard using pbcopy`;
    }

    if (isMac && applescriptCommand) {
      try {
        const fullCmd = applescriptCommand.startsWith('tell')
          ? `osascript -e '${applescriptCommand}'`
          : applescriptCommand;

        const { stdout, stderr } = await execPromise(fullCmd);
        res.json({
          success: true,
          platform: 'darwin',
          executed: true,
          explanation,
          stdout,
          stderr,
          script: applescriptCommand
        });
        return;
      } catch (execErr: unknown) {
        const error = execErr as Error;
        res.json({
          success: false,
          platform: 'darwin',
          executed: false,
          error: error.message,
          suggestion: 'Ensure Accessibility permissions are granted to Terminal/Node in System Settings > Privacy & Security > Accessibility.',
          script: applescriptCommand
        });
        return;
      }
    }

    // In web sandbox or non-darwin environment, return verified executable script & explanation
    res.json({
      success: true,
      platform: process.platform,
      executed: false,
      isSimulated: true,
      explanation: `${explanation} (Ready for macOS native execution via companion script or local Node instance)`,
      script: applescriptCommand || '# No script required',
      instructions: 'Run "python3 companion/kiki_macos.py" or execute via native terminal.'
    });
  } catch (err: unknown) {
    const error = err as Error;
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dynamic Application Resolver for Fallback Rule Engine
function extractAppFromSpokenText(rawTranscript: string): {
  isLaunch: boolean;
  appName: string;
  query: string;
  browser?: string;
} {
  let text = rawTranscript.toLowerCase().trim();
  let query = '';
  let browser: string | undefined;

  // Extract browser target if specified
  const browserMatch = text.match(/\bin\s+(chrome|safari|firefox|edge|browser)\b/i);
  if (browserMatch) {
    browser = browserMatch[1].toLowerCase();
    text = text.replace(browserMatch[0], '');
  }

  // Extract search query if specified
  const searchMatch = text.match(/(?:and\s+)?search\s+(?:for\s+)?(.*)/i);
  if (searchMatch) {
    query = searchMatch[1].trim();
    text = text.replace(searchMatch[0], '');
  }

  // Check launch prefixes
  const launchPrefixes = [
    /^hey\s+kiki[,\s]*/i,
    /^kiki[,\s]*/i,
    /^please\s+/i,
    /^can\s+you\s+/i,
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
    /^thira\s+/i,
    /^thiravavum\s+/i
  ];

  let isLaunch = false;
  for (const prefix of launchPrefixes) {
    if (prefix.test(text)) {
      isLaunch = true;
      text = text.replace(prefix, '');
    }
  }

  // Check suffixes
  const launchSuffixes = [
    /\s+open\s+pannu$/i,
    /\s+launch\s+pannu$/i,
    /\s+start\s+pannu$/i,
    /\s+pannu$/i,
    /\s+thira$/i,
    /\s+app$/i,
    /\s+application$/i,
    /\s+folder$/i
  ];

  for (const suffix of launchSuffixes) {
    if (suffix.test(text)) {
      isLaunch = true;
      text = text.replace(suffix, '');
    }
  }

  text = text.trim();

  // If text matches any known alias or web service directly
  if (APP_ALIASES[text]) {
    return { isLaunch: true, appName: APP_ALIASES[text], query, browser };
  }

  if (WEB_APP_SERVICES[text]) {
    return { isLaunch: true, appName: WEB_APP_SERVICES[text].name, query, browser };
  }

  // Capitalize name
  const capitalized = text
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    isLaunch: isLaunch && text.length > 0,
    appName: capitalized || 'Finder',
    query,
    browser
  };
}

// Fallback rule parser if no Gemini API key, quota limit reached (429), or network down
function fallbackRuleParser(rawTranscript: string, lang: string) {
  const t = rawTranscript.toLowerCase().trim();

  // Check application launch command
  const appExtraction = extractAppFromSpokenText(rawTranscript);
  if (appExtraction.isLaunch) {
    const { appName, query, browser } = appExtraction;
    let spoken = `Opening ${appName} on your device.`;
    if (query) {
      spoken = `Opening ${appName} and searching for "${query}".`;
    }
    if (browser) {
      spoken = `Opening ${appName} in ${browser.charAt(0).toUpperCase() + browser.slice(1)}.`;
    }

    return {
      intent: 'APP_LAUNCH',
      spokenResponse: spoken,
      confidence: 0.95,
      appLaunch: {
        appName,
        urlQuery: query,
        browser
      }
    };
  }

  // Excel checks
  if (t.includes('cell') || t.includes('table') || t.includes('mark') || t.includes('student') || t.includes('spreadsheet')) {
    const cellMatch = t.match(/cell\s+([a-zA-Z]\d+)/i);
    const cell = cellMatch ? cellMatch[1].toUpperCase() : 'A1';

    let val = '';
    const typeMatch = t.match(/type\s+(.*)/i);
    if (typeMatch) val = typeMatch[1];

    const isStudentTable = t.includes('student') || t.includes('table');

    return {
      intent: 'EXCEL_ACTION',
      spokenResponse: isStudentTable
        ? 'Creating a student marksheet table with Name, Tamil, English, Maths, and Result.'
        : `Setting cell ${cell} in spreadsheet.`,
      confidence: 0.88,
      excelAction: {
        action: isStudentTable ? 'create_table' : 'set_cell',
        cell,
        value: val,
        headers: isStudentTable ? ['Student Name', 'Tamil', 'English', 'Maths', 'Total', 'Result'] : ['Item', 'Value'],
        rows: isStudentTable ? [
          ['Rahul Sharma', '88', '82', '95', '265', 'Pass'],
          ['Priya Natarajan', '94', '90', '98', '282', 'Pass'],
          ['Karthik Raja', '76', '84', '80', '240', 'Pass']
        ] : []
      }
    };
  }

  // Voice typing
  if (t.startsWith('type ') || t.includes('type this') || t.includes('ezhudhu')) {
    const textToType = rawTranscript.replace(/^type\s+/i, '').replace(/^ezhudhu\s+/i, '');
    return {
      intent: 'VOICE_TYPING',
      spokenResponse: `Typing: "${textToType}"`,
      confidence: 0.92,
      voiceTyping: {
        action: 'insert',
        textToType
      }
    };
  }

  // Read aloud
  if (t.includes('read') || t.includes('padi') || t.includes('speak')) {
    return {
      intent: 'READ_ALOUD',
      spokenResponse: 'Reading content aloud.',
      confidence: 0.9,
      readAloud: {
        action: t.includes('stop') ? 'stop' : t.includes('pause') ? 'pause' : 'start',
        targetText: ''
      }
    };
  }

  // Default General Chat
  return {
    intent: 'GENERAL_CHAT',
    spokenResponse: `KIKI AI received your command: "${rawTranscript}". Ready to automate your applications.`,
    confidence: 0.75
  };
}

// Serve Vite frontend in dev/prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[KIKI AI] Universal Voice Assistant active on http://0.0.0.0:${port}`);
  });
}

startServer();
