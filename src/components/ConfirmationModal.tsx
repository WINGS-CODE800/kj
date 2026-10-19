import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">KIKI Security Confirmation</h3>
            <p className="text-xs text-amber-300">Consequential or high-risk action detected</p>
          </div>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
          {message || 'Are you sure you want to execute this action? This operation may alter files or existing data.'}
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancel Action
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
          >
            Confirm & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
