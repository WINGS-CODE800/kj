import React from 'react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, Rocket, CheckCircle2 } from 'lucide-react';
import { AssistantState } from '../types';

interface AiCoreOrbProps {
  state: AssistantState;
  onClick: () => void;
  disabled?: boolean;
}

export const AiCoreOrb: React.FC<AiCoreOrbProps> = ({ state, onClick, disabled }) => {
  const isListening = state === 'listening';
  const isProcessing = state === 'processing';
  const isLaunching = state === 'launching';
  const isSpeaking = state === 'speaking';
  const isSuccess = state === 'success';
  const isPaused = state === 'paused';
  const isError = state === 'error';

  return (
    <div className="relative flex flex-col items-center justify-center my-auto select-none">
      {/* Outer ambient glow nebula */}
      <div
        className={`absolute rounded-full filter blur-[70px] pointer-events-none transition-all duration-1000 ${
          isListening
            ? 'w-96 h-96 bg-cyan-500/25 scale-125'
            : isProcessing
            ? 'w-96 h-96 bg-purple-600/30 scale-110 animate-pulse'
            : isLaunching
            ? 'w-96 h-96 bg-sky-500/35 scale-125 animate-pulse'
            : isSpeaking
            ? 'w-96 h-96 bg-emerald-500/25 scale-120'
            : isSuccess
            ? 'w-96 h-96 bg-emerald-400/30 scale-125'
            : isPaused
            ? 'w-80 h-80 bg-amber-500/20'
            : isError
            ? 'w-80 h-80 bg-rose-600/25'
            : 'w-72 h-72 bg-blue-600/15'
        }`}
      />

      {/* Orbiting concentric ring 1 */}
      <div
        className={`absolute rounded-full border border-dashed transition-all duration-700 pointer-events-none ${
          isListening
            ? 'w-72 h-72 border-cyan-400/40 animate-[spin_12s_linear_infinite]'
            : isProcessing
            ? 'w-72 h-72 border-purple-400/50 animate-[spin_4s_linear_infinite]'
            : isLaunching
            ? 'w-72 h-72 border-sky-400/60 animate-[spin_2s_linear_infinite]'
            : isSpeaking
            ? 'w-72 h-72 border-emerald-400/40 animate-[spin_8s_linear_infinite]'
            : isSuccess
            ? 'w-72 h-72 border-emerald-300/60'
            : 'w-64 h-64 border-cyan-500/20'
        }`}
      />

      {/* Orbiting concentric ring 2 with glowing dots */}
      <div
        className={`absolute rounded-full border transition-all duration-700 pointer-events-none ${
          isListening
            ? 'w-84 h-84 border-cyan-500/30 animate-[spin_18s_linear_infinite_reverse]'
            : isProcessing || isLaunching
            ? 'w-84 h-84 border-sky-500/40 animate-[spin_5s_linear_infinite_reverse]'
            : 'w-80 h-80 border-slate-700/20'
        }`}
      >
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
      </div>

      {/* Simulated soundwave bars when listening, speaking or launching */}
      {(isListening || isSpeaking || isLaunching) && (
        <div className="absolute -top-16 flex items-center justify-center gap-1.5 h-10 pointer-events-none">
          {[40, 75, 55, 90, 65, 80, 45, 95, 70, 50, 85].map((height, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isListening
                  ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                  : isLaunching
                  ? 'bg-sky-400 shadow-[0_0_8px_#38bdf8]'
                  : 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
              }`}
              style={{
                height: `${Math.max(12, (height * (isSpeaking ? 0.9 : 0.75)) + (Math.sin(i * 1.5) * 15))}px`,
                animation: `bounce 0.8s ease-in-out infinite alternate ${i * 0.08}s`
              }}
            />
          ))}
        </div>
      )}

      {/* THE ONLY ONE PROMINENT MICROPHONE BUTTON */}
      <button
        onClick={onClick}
        disabled={disabled}
        aria-label={isListening ? 'Stop listening' : 'Start speaking with KIKI AI'}
        className={`relative z-20 group flex items-center justify-center w-36 h-36 rounded-full transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 shadow-2xl cursor-pointer ${
          isListening
            ? 'bg-gradient-to-tr from-cyan-600 via-teal-500 to-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.5)] scale-105 ring-4 ring-cyan-300/60'
            : isProcessing
            ? 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 shadow-[0_0_50px_rgba(168,85,247,0.45)] scale-100 ring-2 ring-purple-400/50'
            : isLaunching
            ? 'bg-gradient-to-tr from-sky-600 via-cyan-500 to-blue-500 shadow-[0_0_60px_rgba(56,189,248,0.6)] scale-110 ring-4 ring-sky-300/70'
            : isSuccess
            ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-[0_0_55px_rgba(52,211,153,0.6)] scale-105 ring-4 ring-emerald-300/60'
            : isSpeaking
            ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 shadow-[0_0_55px_rgba(52,211,153,0.5)] scale-105 ring-4 ring-emerald-300/50'
            : isPaused
            ? 'bg-gradient-to-tr from-amber-600 to-orange-500 shadow-[0_0_35px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/50'
            : isError
            ? 'bg-gradient-to-tr from-rose-700 to-red-500 shadow-[0_0_35px_rgba(244,63,94,0.35)] ring-2 ring-rose-400/50'
            : 'bg-gradient-to-tr from-slate-900 via-slate-800 to-cyan-950 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:scale-105'
        }`}
      >
        {/* Inner glass highlight */}
        <div className="absolute inset-1.5 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

        {/* Dynamic Center Icon */}
        <div className="relative text-white transition-transform duration-300 group-hover:scale-110">
          {isListening ? (
            <Mic className="w-14 h-14 animate-pulse text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          ) : isProcessing ? (
            <Sparkles className="w-14 h-14 animate-spin text-cyan-200" style={{ animationDuration: '3s' }} />
          ) : isLaunching ? (
            <Rocket className="w-14 h-14 animate-bounce text-sky-100 drop-shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-14 h-14 text-emerald-200 drop-shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          ) : isSpeaking ? (
            <Volume2 className="w-14 h-14 animate-bounce text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          ) : isError ? (
            <AlertCircle className="w-14 h-14 text-rose-200" />
          ) : isPaused ? (
            <MicOff className="w-14 h-14 text-amber-200" />
          ) : (
            <Mic className="w-14 h-14 text-cyan-300 group-hover:text-cyan-100 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
          )}
        </div>
      </button>

      {/* Prominent Button Label & Status Indicator */}
      <div className="mt-8 flex flex-col items-center gap-1.5 text-center pointer-events-none">
        <span
          className={`text-xs font-mono tracking-widest uppercase transition-colors duration-300 font-semibold ${
            isListening
              ? 'text-cyan-400'
              : isProcessing
              ? 'text-purple-400'
              : isLaunching
              ? 'text-sky-400'
              : isSuccess
              ? 'text-emerald-400'
              : isSpeaking
              ? 'text-emerald-400'
              : isPaused
              ? 'text-amber-400'
              : isError
              ? 'text-rose-400'
              : 'text-slate-400'
          }`}
        >
          {isListening
            ? 'LISTENING ACTIVE'
            : isProcessing
            ? 'THINKING & RESOLVING'
            : isLaunching
            ? 'LAUNCHING APPLICATION'
            : isSuccess
            ? 'SUCCESSFULLY OPENED'
            : isSpeaking
            ? 'KIKI RESPONDING'
            : isPaused
            ? 'PAUSED'
            : isError
            ? 'ATTENTION NEEDED'
            : 'READY TO LISTEN'}
        </span>
        <p className="text-sm text-slate-300 font-medium">
          {isListening
            ? 'Say any app name (e.g. "Open Instagram", "Open YouTube", "Open Excel")...'
            : isProcessing
            ? 'Resolving application name across device registry...'
            : isLaunching
            ? 'Opening application natively on device...'
            : isSuccess
            ? 'Application opened successfully.'
            : isSpeaking
            ? 'Tap to pause or stop speaking'
            : isPaused
            ? 'Tap to resume voice engine'
            : 'Tap the microphone or press Space to speak'}
        </p>
      </div>
    </div>
  );
};
