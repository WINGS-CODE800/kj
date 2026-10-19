import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowUpRight, Rocket } from 'lucide-react';
import { DiscoveredApp } from '../types';

interface StatusFeedProps {
  currentTranscript: string;
  isListening: boolean;
  isLaunching?: boolean;
  lastSpokenResponse: string;
  lastActionMessage?: string;
  lastActionType?: string;
  errorMessage?: string;
  candidates?: DiscoveredApp[];
  onSelectCandidate?: (app: DiscoveredApp) => void;
}

export const StatusFeed: React.FC<StatusFeedProps> = ({
  currentTranscript,
  isListening,
  isLaunching,
  lastSpokenResponse,
  lastActionMessage,
  lastActionType,
  errorMessage,
  candidates,
  onSelectCandidate,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center gap-3">
      {/* Live Transcript Bubble */}
      {(currentTranscript || isListening) && (
        <div className="w-full px-5 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.4)] text-center transition-all animate-fadeIn">
          <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-semibold block mb-1">
            {isListening ? 'Voice Input Received' : 'Recognized Command'}
          </span>
          <p className="text-base text-slate-100 font-medium italic">
            "{currentTranscript || 'Listening...'}"
          </p>
        </div>
      )}

      {/* Launching indicator banner */}
      {isLaunching && (
        <div className="w-full px-4 py-2.5 rounded-xl bg-sky-950/80 border border-sky-500/40 text-center flex items-center justify-center gap-2 animate-pulse">
          <Rocket className="w-4 h-4 text-sky-400" />
          <span className="text-xs text-sky-200 font-medium">Resolving and launching application...</span>
        </div>
      )}

      {/* Spoken AI Response Pill */}
      {lastSpokenResponse && !errorMessage && !isLaunching && (
        <div className="w-full px-5 py-2.5 rounded-xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-sm text-slate-200">
            {lastSpokenResponse}
          </p>
        </div>
      )}

      {/* Disambiguation Candidates Pill */}
      {candidates && candidates.length > 0 && (
        <div className="w-full p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-xs space-y-1.5 animate-fadeIn">
          <span className="text-[10px] font-mono text-cyan-400 font-semibold block">
            Multiple Matches Found — Select your target:
          </span>
          <div className="flex flex-wrap gap-2">
            {candidates.map((cand) => (
              <button
                key={cand.id}
                onClick={() => onSelectCandidate?.(cand)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 border border-slate-700 hover:border-cyan-400 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                {cand.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Execution Pill */}
      {lastActionMessage && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{lastActionMessage}</span>
          {lastActionType && (
            <span className="bg-cyan-900/80 px-2 py-0.5 rounded text-[10px] text-cyan-200 uppercase font-semibold">
              {lastActionType}
            </span>
          )}
        </div>
      )}

      {/* Error Message Pill */}
      {errorMessage && (
        <div className="w-full px-4 py-2.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
