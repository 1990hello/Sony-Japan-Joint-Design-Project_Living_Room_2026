import React, { useState } from 'react';
import { X, Layers, Users } from 'lucide-react';

interface StoryboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryboardModal: React.FC<StoryboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'characters'>('storyboard');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100 tracking-wide uppercase font-mono">
                Sony NTU NITech 2026 · Authoritative Reference Sheets
              </h2>
              <p className="text-xs text-slate-400">
                Miro Storyboard and Character Design Model Sheets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('storyboard')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                  activeTab === 'storyboard'
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Windmill Storyboard (6 Stages)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('characters')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all cursor-pointer font-medium ${
                  activeTab === 'characters'
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>4 Lumori Characters</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/40">
          {activeTab === 'storyboard' ? (
            <div className="flex flex-col items-center gap-3 w-full">
              <img
                src="./assets/aistudio/image_ddf866d7.png"
                alt="Lumori Storyboard — Broken Windmill Field"
                className="max-h-[70vh] w-auto object-contain rounded-xl border border-slate-700/80 shadow-lg"
              />
              <div className="grid grid-cols-6 gap-2 w-full text-center text-[11px] text-slate-400 px-2">
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">1. Discovery</div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">2. Observation</div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">3. Invitation</div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">4. Interaction</div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">5. Success</div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800">6. Closure</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full">
              <img
                src="./assets/aistudio/image_f00e7209.png"
                alt="Authoritative Lumori Character Sheet"
                className="max-h-[70vh] w-auto object-contain rounded-xl border border-slate-700/80 shadow-lg"
              />
              <div className="grid grid-cols-4 gap-2 w-full text-center text-[11px] text-slate-400 px-2">
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800 text-pink-300 font-medium">Sakura Lumi (Pink)</div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800 text-teal-300 font-medium">Bellflower Lumi (Mint)</div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800 text-sky-300 font-medium">Sprout Lumi (Blue)</div>
                <div className="bg-slate-900/60 p-1.5 rounded border border-slate-800 text-purple-300 font-medium">Lotus Lumi (Purple)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
