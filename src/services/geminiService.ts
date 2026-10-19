import { IntentResponse, LanguageMode } from '../types';

export async function parseVoiceIntent(
  transcript: string,
  language: LanguageMode,
  context?: Record<string, unknown>
): Promise<IntentResponse> {
  try {
    const res = await fetch('/api/gemini/parse-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language, context }),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err: unknown) {
    const error = err as Error;
    console.warn('Falling back to local heuristic intent parser:', error.message);
    return fallbackClientParser(transcript);
  }
}

export async function explainOrRewriteText(
  text: string,
  mode: 'explain' | 'translate' | 'rewrite',
  targetLanguage = 'English and Tamil'
): Promise<string> {
  try {
    const res = await fetch('/api/gemini/explain-rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode, targetLanguage }),
    });

    const data = await res.json();
    return data.result || 'No response generated.';
  } catch (err: unknown) {
    const error = err as Error;
    return `Error: ${error.message}`;
  }
}

export async function executeMacAutomation(
  actionType: string,
  payload: Record<string, unknown>,
  isConfirmed = false
): Promise<{ success: boolean; executed?: boolean; explanation?: string; script?: string; error?: string }> {
  try {
    // First try the native companion if running locally on port 5055
    try {
      const companionRes = await fetch('http://localhost:5055', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionType, ...payload }),
      });
      if (companionRes.ok) {
        const data = await companionRes.json();
        return { success: true, executed: true, explanation: 'Executed via local macOS companion bridge (port 5055)', ...data };
      }
    } catch {
      // Local port 5055 not running, forward to server API
    }

    const res = await fetch('/api/macos/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actionType, payload, isConfirmed }),
    });

    return await res.json();
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

function fallbackClientParser(transcript: string): IntentResponse {
  const t = transcript.toLowerCase().trim();

  if (t.includes('excel') && (t.includes('student') || t.includes('table'))) {
    return {
      intent: 'EXCEL_ACTION',
      spokenResponse: 'Creating student table with Name, Tamil, English, Maths, and Result.',
      confidence: 0.9,
      excelAction: {
        action: 'create_table',
        headers: ['Student Name', 'Tamil', 'English', 'Maths', 'Total', 'Result'],
        rows: [
          ['Rahul Sharma', 85, 90, 95, 270, 'Pass'],
          ['Priya Natarajan', 92, 94, 98, 284, 'Pass'],
          ['Karthik Raja', 78, 80, 85, 243, 'Pass']
        ]
      }
    };
  }

  if (t.includes('open') || t.includes('launch') || t.includes('thira') || t.includes('pannu')) {
    let app = 'Finder';
    if (t.includes('instagram')) app = 'Instagram';
    else if (t.includes('youtube')) app = 'YouTube';
    else if (t.includes('whatsapp')) app = 'WhatsApp';
    else if (t.includes('facebook')) app = 'Facebook';
    else if (t.includes('spotify')) app = 'Spotify';
    else if (t.includes('code') || t.includes('visual studio') || t.includes('vs code')) app = 'Visual Studio Code';
    else if (t.includes('excel')) app = 'Microsoft Excel';
    else if (t.includes('chrome')) app = 'Google Chrome';
    else if (t.includes('download')) app = 'Downloads';
    else if (t.includes('notes')) app = 'Notes';
    else if (t.includes('terminal')) app = 'Terminal';
    else if (t.includes('safari')) app = 'Safari';

    return {
      intent: 'APP_LAUNCH',
      spokenResponse: `Opening ${app} on your Mac.`,
      confidence: 0.9,
      appLaunch: { appName: app }
    };
  }

  if (t.startsWith('type ') || t.includes('type this')) {
    const text = transcript.replace(/^type\s+/i, '');
    return {
      intent: 'VOICE_TYPING',
      spokenResponse: `Typing: ${text}`,
      confidence: 0.9,
      voiceTyping: { action: 'insert', textToType: text }
    };
  }

  if (t.includes('read')) {
    return {
      intent: 'READ_ALOUD',
      spokenResponse: 'Reading selected document aloud.',
      confidence: 0.85,
      readAloud: { action: 'start' }
    };
  }

  return {
    intent: 'GENERAL_CHAT',
    spokenResponse: `KIKI AI: "${transcript}". How can I help you automate your tasks?`,
    confidence: 0.75
  };
}
