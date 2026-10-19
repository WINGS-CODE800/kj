/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AiCoreOrb } from './components/AiCoreOrb';
import { StatusFeed } from './components/StatusFeed';
import { WorkspaceDrawer } from './components/WorkspaceDrawer';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AssistantState, LanguageMode, IntentResponse, DiscoveredApp } from './types';
import { speechEngine } from './services/speechService';
import { parseVoiceIntent, executeMacAutomation } from './services/geminiService';
import {
  resolveApplication,
  isAppLaunchIntent,
  UNIVERSAL_APPS_CATALOG,
  SupportedPlatform,
  PreferredBrowser
} from './services/appLauncherService';
import {
  SpreadsheetState,
  DEFAULT_STUDENT_HEADERS,
  DEFAULT_STUDENT_ROWS,
  setCellValue,
  readCellValue,
} from './services/excelService';

export default function App() {
  // Assistant states
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [lastSpokenResponse, setLastSpokenResponse] = useState<string>('');
  const [lastActionMessage, setLastActionMessage] = useState<string>('');
  const [lastActionType, setLastActionType] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [language, setLanguage] = useState<LanguageMode>('en');

  // Disambiguation candidates
  const [candidates, setCandidates] = useState<DiscoveredApp[]>([]);

  // Platform and Browser preferences
  const [preferredPlatform, setPreferredPlatform] = useState<SupportedPlatform>(() => {
    try {
      const saved = localStorage.getItem('kiki_preferred_platform');
      if (saved) return saved as SupportedPlatform;
      // Default to darwin (MacBook) or detect navigator
      if (typeof navigator !== 'undefined') {
        if (/Mac/i.test(navigator.userAgent)) return 'darwin';
        if (/Win/i.test(navigator.userAgent)) return 'win32';
        if (/Android/i.test(navigator.userAgent)) return 'android';
        if (/iPhone|iPad/i.test(navigator.userAgent)) return 'ios';
      }
      return 'darwin';
    } catch {
      return 'darwin';
    }
  });

  const [preferredBrowser, setPreferredBrowser] = useState<PreferredBrowser>(() => {
    try {
      return (localStorage.getItem('kiki_preferred_browser') as PreferredBrowser) || 'default';
    } catch {
      return 'default';
    }
  });

  const handlePlatformChange = (p: SupportedPlatform) => {
    setPreferredPlatform(p);
    try {
      localStorage.setItem('kiki_preferred_platform', p);
    } catch {}
  };

  const handleBrowserChange = (b: PreferredBrowser) => {
    setPreferredBrowser(b);
    try {
      localStorage.setItem('kiki_preferred_browser', b);
    } catch {}
  };

  // Custom Logo and Official Mascot state
  const [customLogo, setCustomLogo] = useState<string>(() => {
    try {
      return localStorage.getItem('kiki_custom_logo') || '/kiki-robot.svg';
    } catch {
      return '/kiki-robot.svg';
    }
  });

  const handleUpdateCustomLogo = (logoUrl: string) => {
    setCustomLogo(logoUrl);
    try {
      localStorage.setItem('kiki_custom_logo', logoUrl);
    } catch {
      // Storage unavailable
    }
  };

  // Workspace Drawer state
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(false);

  // Spreadsheet Engine state
  const [spreadsheetState, setSpreadsheetState] = useState<SpreadsheetState>({
    sheetName: 'Student_Marks',
    headers: DEFAULT_STUDENT_HEADERS,
    rows: DEFAULT_STUDENT_ROWS,
    activeCell: 'A1',
  });

  // Voice Typing Buffer and Undo stack
  const [typingBuffer, setTypingBuffer] = useState<string>('Hello! Welcome to KIKI AI on macOS.');
  const [typingUndoStack, setTypingUndoStack] = useState<string[]>([]);

  // Read-Aloud Engine state
  const [readAloudText, setReadAloudText] = useState<string>(
    'KIKI AI is your universal voice assistant for macOS and cross-platform devices. You can speak in Tamil, Tanglish, or English to launch any application, navigate Excel spreadsheets, and dictate text effortlessly.'
  );
  const [isReading, setIsReading] = useState<boolean>(false);
  const [isReadingPaused, setIsReadingPaused] = useState<boolean>(false);
  const [readingSpeed, setReadingSpeed] = useState<number>(1.0);
  const [readingCharIndex, setReadingCharIndex] = useState<number>(0);

  // Safety Confirmation modal state
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  // macOS Companion Status
  const [companionStatus, setCompanionStatus] = useState<{ connected: boolean; platform?: string }>({
    connected: false,
    platform: 'darwin',
  });

  // Check companion status on mount
  useEffect(() => {
    fetch('http://localhost:5055/status')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'connected') {
          setCompanionStatus({ connected: true, platform: data.platform });
        }
      })
      .catch(() => {
        setCompanionStatus({ connected: false });
      });
  }, []);

  // Keyboard shortcut listener: Space to toggle mic, Esc to stop, Cmd+K / Cmd+, to open workspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleMicButtonClick();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        handleStopAll();
      } else if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === ',')) {
        e.preventDefault();
        setIsWorkspaceOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [assistantState]);

  // Read-aloud actions
  const handleStartReading = useCallback((text: string) => {
    if (!text.trim()) return;
    setIsReading(true);
    setIsReadingPaused(false);
    setAssistantState('speaking');
    setLastActionMessage('Reading document aloud');
    setLastActionType('READ_ALOUD');

    speechEngine.speak(text, {
      rate: readingSpeed,
      onBoundary: (charIndex) => {
        setReadingCharIndex(charIndex);
      },
      onEnd: () => {
        setIsReading(false);
        setIsReadingPaused(false);
        setAssistantState('idle');
      },
    });
  }, [readingSpeed]);

  const handlePauseReading = useCallback(() => {
    speechEngine.pauseSpeaking();
    setIsReadingPaused(true);
    setAssistantState('paused');
  }, []);

  const handleResumeReading = useCallback(() => {
    speechEngine.resumeSpeaking();
    setIsReadingPaused(false);
    setAssistantState('speaking');
  }, []);

  const handleStopReading = useCallback(() => {
    speechEngine.stopSpeaking();
    setIsReading(false);
    setIsReadingPaused(false);
    setAssistantState('idle');
  }, []);

  const handleStopAll = useCallback(() => {
    speechEngine.stopListening();
    speechEngine.stopSpeaking();
    setAssistantState('idle');
    setIsReading(false);
    setIsReadingPaused(false);
  }, []);

  // Execute macOS automation helper
  const runMacAction = useCallback(async (actionType: string, payload: Record<string, unknown>, confirmed = false) => {
    const res = await executeMacAutomation(actionType, payload, confirmed);
    if (res.success) {
      setLastActionMessage(res.explanation || `Executed: ${actionType}`);
    } else {
      setErrorMessage(res.error || 'macOS automation error');
    }
  }, []);

  // Dynamic Application Launch Execution
  const executeAppLaunch = useCallback(async (transcript: string) => {
    setAssistantState('launching');
    setErrorMessage('');

    const resolution = resolveApplication(transcript, preferredPlatform);

    // If ambiguous candidates found, show chips
    if (resolution.candidates && resolution.candidates.length > 0) {
      setCandidates(resolution.candidates);
    } else {
      setCandidates([]);
    }

    setLastSpokenResponse(resolution.spokenFeedback);
    setLastActionType('APP_LAUNCH');

    // Speak natural audio feedback immediately
    speechEngine.speak(resolution.spokenFeedback, {
      rate: 1.0,
      onEnd: () => {
        setAssistantState('idle');
      }
    });

    // Check if in Electron standalone app
    const isElectron = typeof window !== 'undefined' && Boolean((window as any).electronAPI?.launchApp);

    if (isElectron) {
      try {
        const result = await (window as any).electronAPI.launchApp(resolution.targetUrlOrPath);
        if (result.success) {
          setLastActionMessage(`Launched "${result.app || resolution.targetUrlOrPath}" via native Electron desktop shell.`);
          return;
        }
      } catch (err: any) {
        console.warn('Electron launch fallback:', err);
      }
    }

    // Launch based on resolved method
    if (resolution.launchMethod === 'web_fallback' || preferredPlatform === 'web') {
      const url = resolution.matchedApp?.webUrl || resolution.targetUrlOrPath || 'https://www.google.com';
      if (url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
        setLastActionMessage(`Opened official platform for ${resolution.matchedApp?.name || transcript} (${url})`);
      } else {
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(url + ' app')}`;
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
        setLastActionMessage(`Opened search platform for ${url}`);
      }
      return;
    }

    // Native macOS launch request
    if (resolution.launchMethod === 'native_mac') {
      await runMacAction('launch_app', {
        appName: resolution.matchedApp?.macAppName || resolution.matchedApp?.name || resolution.targetUrlOrPath,
        url: resolution.matchedApp?.webUrl
      });

      // If user is testing in web preview without companion, also trigger official web fallback for best UX
      if (!companionStatus.connected && resolution.matchedApp?.webUrl) {
        window.open(resolution.matchedApp.webUrl, '_blank', 'noopener,noreferrer');
        setLastActionMessage(`Launching ${resolution.matchedApp.name} (Opened official web platform while macOS native bridge prepares)`);
      }
      return;
    }

    // Windows or Mobile
    if (resolution.matchedApp?.webUrl) {
      window.open(resolution.matchedApp.webUrl, '_blank', 'noopener,noreferrer');
    }
    setLastActionMessage(resolution.explanation);
  }, [preferredPlatform, companionStatus, runMacAction]);

  // Process structured intent response from Gemini / Backend
  const handleIntentExecution = useCallback(async (intentData: IntentResponse) => {
    const { intent, spokenResponse, appLaunch, voiceTyping, excelAction, readAloud, automation } = intentData;

    setLastSpokenResponse(spokenResponse);

    // Speak the response using speech engine
    setAssistantState('speaking');
    speechEngine.speak(spokenResponse, {
      rate: 1.0,
      onEnd: () => {
        setAssistantState('idle');
      },
    });

    // 1. APP LAUNCH
    if (intent === 'APP_LAUNCH' && appLaunch) {
      await executeAppLaunch(appLaunch.appName);
    }

    // 2. VOICE TYPING
    else if (intent === 'VOICE_TYPING' && voiceTyping) {
      setLastActionType('VOICE_TYPING');
      if (voiceTyping.action === 'undo') {
        handleUndoTyping();
        setLastActionMessage('Reverted last typing action');
      } else if (voiceTyping.action === 'correct') {
        const sentences = typingBuffer.split(/(?<=[.?!])\s+/);
        if (sentences.length > 0 && voiceTyping.textToType) {
          sentences[sentences.length - 1] = voiceTyping.textToType;
          const updated = sentences.join(' ');
          setTypingUndoStack(prev => [...prev, typingBuffer]);
          setTypingBuffer(updated);
          setLastActionMessage(`Corrected last sentence: "${voiceTyping.textToType}"`);
        }
      } else {
        const textToInsert = voiceTyping.textToType || '';
        setTypingUndoStack(prev => [...prev, typingBuffer]);
        setTypingBuffer(prev => (prev ? `${prev} ${textToInsert}` : textToInsert));
        setLastActionMessage(`Typed: "${textToInsert}"`);
        await runMacAction('simulate_typing', { text: textToInsert });
      }
    }

    // 3. EXCEL ACTIONS
    else if (intent === 'EXCEL_ACTION' && excelAction) {
      setLastActionType('EXCEL_ACTION');
      if (excelAction.action === 'create_table') {
        const headers = excelAction.headers || DEFAULT_STUDENT_HEADERS;
        const rows = excelAction.rows && excelAction.rows.length > 0 ? excelAction.rows : DEFAULT_STUDENT_ROWS;
        setSpreadsheetState({
          sheetName: 'Student_Marks',
          headers,
          rows,
          activeCell: 'A1',
        });
        setLastActionMessage(`Created student table with ${headers.length} columns`);
        setIsWorkspaceOpen(true);
      } else if (excelAction.action === 'set_cell' && excelAction.cell) {
        const cell = excelAction.cell.toUpperCase();
        const val = excelAction.value || '';
        setSpreadsheetState(prev => {
          const { newState } = setCellValue(prev, cell, val);
          return newState;
        });
        setLastActionMessage(`Set cell ${cell} to "${val}"`);
        await runMacAction('excel_cell', { cell, value: val });
      } else if (excelAction.action === 'read_cell' && excelAction.cell) {
        const info = readCellValue(spreadsheetState, excelAction.cell);
        setLastActionMessage(info);
        speechEngine.speak(info);
      }
    }

    // 4. READ ALOUD
    else if (intent === 'READ_ALOUD') {
      setLastActionType('READ_ALOUD');
      if (readAloud?.action === 'pause') {
        handlePauseReading();
      } else if (readAloud?.action === 'stop') {
        handleStopReading();
      } else if (readAloud?.action === 'continue') {
        handleResumeReading();
      } else {
        handleStartReading(readAloud?.targetText || readAloudText);
      }
    }

    // 5. COMPUTER AUTOMATION & HIGH-RISK ACTIONS
    else if (intent === 'COMPUTER_AUTOMATION' && automation) {
      setLastActionType('AUTOMATION');
      if (automation.requiresConfirmation) {
        setConfirmationModal({
          isOpen: true,
          message: automation.confirmationMessage || 'This automation action may modify files or system settings. Do you wish to continue?',
          onConfirm: async () => {
            setConfirmationModal(prev => ({ ...prev, isOpen: false }));
            setLastActionMessage('Executing confirmed automation plan...');
            for (const step of automation.steps) {
              await runMacAction(step.actionType, { target: step.target, details: step.details }, true);
            }
          },
        });
      } else {
        for (const step of automation.steps) {
          setLastActionMessage(`Running step: ${step.stepDescription}`);
          await runMacAction(step.actionType, { target: step.target, details: step.details });
        }
      }
    }

    // 6. FOCUS / STUDY MODE
    else if (intent === 'FOCUS_MODE') {
      setLastActionType('FOCUS_MODE');
      setLastActionMessage('Study Mode activated: Workspace prepared');
      setIsWorkspaceOpen(true);
      await runMacAction('launch_app', { appName: 'Visual Studio Code' });
    }

    // Check if user asked to open settings / workspace
    const rawLower = currentTranscript.toLowerCase();
    if (rawLower.includes('setting') || rawLower.includes('workspace') || rawLower.includes('drawer')) {
      setIsWorkspaceOpen(true);
    }
  }, [
    typingBuffer,
    spreadsheetState,
    readAloudText,
    runMacAction,
    executeAppLaunch,
    handleStartReading,
    handlePauseReading,
    handleStopReading,
    handleResumeReading
  ]);

  // Undo typing handler
  const handleUndoTyping = () => {
    if (typingUndoStack.length === 0) return;
    const previous = typingUndoStack[typingUndoStack.length - 1];
    setTypingUndoStack(prev => prev.slice(0, prev.length - 1));
    setTypingBuffer(previous);
    runMacAction('undo', {});
  };

  // Prominent Mic Button click handler
  const handleMicButtonClick = () => {
    setErrorMessage('');
    setCandidates([]);

    // If currently speaking or reading, stop speech
    if (assistantState === 'speaking' || isReading) {
      handleStopAll();
      return;
    }

    // If already listening, stop listening and process
    if (assistantState === 'listening') {
      speechEngine.stopListening();
      if (currentTranscript.trim()) {
        processTranscript(currentTranscript);
      } else {
        setAssistantState('idle');
      }
      return;
    }

    // Start listening
    setAssistantState('listening');
    setCurrentTranscript('');
    setLastActionMessage('');

    speechEngine.startListening({
      onStart: () => {
        setAssistantState('listening');
      },
      onResult: (transcript, isFinal) => {
        setCurrentTranscript(transcript);
        if (isFinal && transcript.trim().length > 1) {
          speechEngine.stopListening();
          processTranscript(transcript);
        }
      },
      onError: (err) => {
        setErrorMessage(err);
        setAssistantState('error');
        setTimeout(() => setAssistantState('idle'), 4000);
      },
      onEnd: () => {
        setAssistantState(prev => (prev === 'listening' ? 'idle' : prev));
      },
    });
  };

  // Process user speech transcript through client-first discovery engine with cloud fallback
  const processTranscript = async (transcript: string) => {
    if (!transcript.trim()) {
      setAssistantState('idle');
      return;
    }

    // FAST-PATH: If this is an application launch command, resolve locally with zero latency & 100% offline reliability!
    if (isAppLaunchIntent(transcript)) {
      await executeAppLaunch(transcript);
      return;
    }

    setAssistantState('processing');

    try {
      const intentResult = await parseVoiceIntent(transcript, language, {
        activeSpreadsheet: spreadsheetState.sheetName,
        currentCell: spreadsheetState.activeCell,
        hasTypingBuffer: Boolean(typingBuffer),
      });

      await handleIntentExecution(intentResult);
    } catch (err: unknown) {
      // If server or network error, execute robust local rule fallback
      const error = err as Error;
      if (transcript.toLowerCase().includes('open') || transcript.toLowerCase().includes('launch')) {
        await executeAppLaunch(transcript);
      } else {
        setErrorMessage(`Processing error: ${error.message}. Offline heuristic active.`);
        setAssistantState('idle');
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#07090e] text-slate-100 flex flex-col justify-between overflow-hidden font-sans">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP STATUS BAR (No share button, minimalist, provides subtle access to workspace/settings) */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl bg-slate-900 border border-cyan-400/50 p-1 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
            <img src={customLogo} alt="KIKI AI Mascot" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-sm font-bold tracking-widest uppercase text-slate-200 flex items-center gap-2">
            <span>KIKI AI</span>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 px-1.5 py-0.2 rounded font-normal">
              {preferredPlatform === 'darwin' ? 'MACOS' : preferredPlatform.toUpperCase()}
            </span>
          </h1>
        </div>

        {/* Subtle Ambient System Status Pill (Clicking opens Workspace & Settings without adding cluttered buttons) */}
        <button
          onClick={() => setIsWorkspaceOpen(true)}
          title="Click to open KIKI Universal App Launcher, Custom Apps Registry, and Settings (⌘K)"
          className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-400 hover:text-cyan-300 transition-all cursor-pointer shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono text-[11px]">CORE ONLINE</span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] uppercase font-mono">{language}</span>
          <span className="text-[10px] bg-slate-800 group-hover:bg-cyan-950 px-1.5 py-0.5 rounded text-slate-400 group-hover:text-cyan-300 font-mono">
            ⌘K
          </span>
        </button>
      </header>

      {/* CENTER STAGE: ONLY ONE PROMINENT MICROPHONE BUTTON */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 my-auto">
        <AiCoreOrb
          state={assistantState}
          onClick={handleMicButtonClick}
        />

        {/* Short, elegant status messages & disambiguation chips below the core orb */}
        <div className="mt-8 w-full">
          <StatusFeed
            currentTranscript={currentTranscript}
            isListening={assistantState === 'listening'}
            isLaunching={assistantState === 'launching'}
            lastSpokenResponse={lastSpokenResponse}
            lastActionMessage={lastActionMessage}
            lastActionType={lastActionType}
            errorMessage={errorMessage}
            candidates={candidates}
            onSelectCandidate={(cand) => {
              setCurrentTranscript(`Open ${cand.name}`);
              processTranscript(`Open ${cand.name}`);
            }}
          />
        </div>
      </main>

      {/* MINIMAL FOOTER: Ambient voice prompt suggestions & subtle drawer indicator */}
      <footer className="relative z-20 w-full px-6 py-4 flex flex-col items-center justify-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-[10px] uppercase font-mono text-slate-600 tracking-wider">Try saying:</span>
          <button
            onClick={() => {
              setCurrentTranscript('Open Instagram');
              processTranscript('Open Instagram');
            }}
            className="hover:text-cyan-400 hover:underline cursor-pointer transition-colors"
          >
            "Open Instagram"
          </button>
          <span>&bull;</span>
          <button
            onClick={() => {
              setCurrentTranscript('Open YouTube and search Python tutorials');
              processTranscript('Open YouTube and search Python tutorials');
            }}
            className="hover:text-cyan-400 hover:underline cursor-pointer transition-colors"
          >
            "Open YouTube"
          </button>
          <span>&bull;</span>
          <button
            onClick={() => {
              setCurrentTranscript('Open WhatsApp');
              processTranscript('Open WhatsApp');
            }}
            className="hover:text-cyan-400 hover:underline cursor-pointer transition-colors"
          >
            "Open WhatsApp"
          </button>
          <span>&bull;</span>
          <button
            onClick={() => {
              setCurrentTranscript('Open Visual Studio Code');
              processTranscript('Open Visual Studio Code');
            }}
            className="hover:text-cyan-400 hover:underline cursor-pointer transition-colors"
          >
            "Open VS Code"
          </button>
          <span>&bull;</span>
          <button
            onClick={() => {
              setCurrentTranscript('Open Excel and create a student table');
              processTranscript('Open Excel and create a student table');
            }}
            className="hover:text-cyan-400 hover:underline cursor-pointer transition-colors"
          >
            "Open Excel"
          </button>
          <span>&bull;</span>
          <button
            onClick={() => {
              setCurrentTranscript('Excel open pannu');
              processTranscript('Excel open pannu');
            }}
            className="hover:text-cyan-400 hover:underline cursor-pointer transition-colors text-slate-400"
          >
            "Excel open pannu (Tamil)"
          </button>
        </div>

        {/* Subtle drawer trigger bar (drag or click to reveal workspace without cluttering hero) */}
        <button
          onClick={() => setIsWorkspaceOpen(true)}
          className="mt-1 w-16 h-1 rounded-full bg-slate-800 hover:bg-cyan-500/60 transition-colors cursor-pointer"
          aria-label="Open Workspace & Settings Drawer"
          title="Open Workspace & Settings (⌘K)"
        />
      </footer>

      {/* WORKSPACE & SETTINGS DRAWER (Accessible via subtle status pill, gesture, or voice command) */}
      <WorkspaceDrawer
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        spreadsheetState={spreadsheetState}
        onUpdateSpreadsheet={setSpreadsheetState}
        typingBuffer={typingBuffer}
        onUpdateTypingBuffer={setTypingBuffer}
        onUndoTyping={handleUndoTyping}
        readAloudText={readAloudText}
        onUpdateReadAloudText={setReadAloudText}
        isReading={isReading}
        isReadingPaused={isReadingPaused}
        onStartReading={handleStartReading}
        onPauseReading={handlePauseReading}
        onResumeReading={handleResumeReading}
        onStopReading={handleStopReading}
        readingSpeed={readingSpeed}
        onSpeedChange={setReadingSpeed}
        currentReadingIndex={readingCharIndex}
        language={language}
        onLanguageChange={(lang) => {
          setLanguage(lang);
          speechEngine.setLanguage(lang);
        }}
        companionStatus={companionStatus}
        onRunMacAction={runMacAction}
        customLogo={customLogo}
        onUpdateCustomLogo={handleUpdateCustomLogo}
        preferredPlatform={preferredPlatform}
        onPlatformChange={handlePlatformChange}
        preferredBrowser={preferredBrowser}
        onBrowserChange={handleBrowserChange}
        onLaunchApp={(app) => {
          const appName = typeof app === 'string' ? app : app.name;
          setCurrentTranscript(`Open ${appName}`);
          processTranscript(`Open ${appName}`);
        }}
      />

      {/* SAFETY CONFIRMATION MODAL (High-risk action safeguard) */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        message={confirmationModal.message}
        onConfirm={confirmationModal.onConfirm}
        onCancel={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
