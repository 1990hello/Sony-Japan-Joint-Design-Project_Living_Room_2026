import React from 'react';
import { ExperienceState, HandTrackingState, STATE_METAS } from '../types';
import { X, Play, RotateCcw, SkipForward, Home, Pause, Camera, Wind, BookOpen } from 'lucide-react';

interface DebugPanelProps {
  state: ExperienceState;
  tracking: HandTrackingState;
  autoTransitions: boolean;
  onSetState: (newState: ExperienceState) => void;
  onNextState: () => void;
  onReset: () => void;
  onTriggerReturnHome: () => void;
  onEnterLumoriIdling: () => void;
  onSimulateWindmillUserHelp: () => void;
  onTriggerWindmillAutonomous: () => void;
  onToggleAutoTransitions: () => void;
  onToggleCamera: () => void;
  onOpenStoryboard: () => void;
  onClose: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  state,
  tracking,
  autoTransitions,
  onSetState,
  onNextState,
  onReset,
  onTriggerReturnHome,
  onEnterLumoriIdling,
  onSimulateWindmillUserHelp,
  onTriggerWindmillAutonomous,
  onToggleAutoTransitions,
  onToggleCamera,
  onOpenStoryboard,
  onClose,
}) => {
  const currentMeta = STATE_METAS[state] || {
    id: state,
    name: `State ${state}`,
    shortDesc: '',
  };

  const isWaitingForUser =
    state === ExperienceState.STATE_2C_INVITATION ||
    state === ExperienceState.STATE_4_HELPING_FRIEND ||
    state === ExperienceState.STATE_5_FREE_PLAY;

  const windmillStates: { label: string; state: ExperienceState }[] = [
    { label: '2A Disc', state: ExperienceState.STATE_2A_DISCOVERY },
    { label: '2B Obs', state: ExperienceState.STATE_2B_OBSERVATION },
    { label: '2C Inv', state: ExperienceState.STATE_2C_INVITATION },
    { label: '2D Int', state: ExperienceState.STATE_2D_INTERACTION },
    { label: '2E Auto', state: ExperienceState.STATE_2E_AUTONOMOUS },
    { label: '2F Succ', state: ExperienceState.STATE_2F_SUCCESS },
    { label: '2G Clos', state: ExperienceState.STATE_2G_CLOSURE },
  ];

  return (
    <div className="no-gesture-trigger absolute right-4 top-16 z-50 w-88 rounded-2xl bg-slate-950/95 border border-slate-700/80 shadow-2xl p-4 text-slate-200 font-sans backdrop-blur-xl animate-fade-in select-none">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <h2 className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
            Debug & State Controls
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* State Telemetry */}
      <div className="space-y-1.5 mb-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Current State:</span>
          <span className="font-mono font-bold text-amber-300">
            {currentMeta.name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Waiting for User:</span>
          <span className={`font-mono ${isWaitingForUser ? 'text-teal-400 font-bold' : 'text-slate-500'}`}>
            {isWaitingForUser ? 'YES (Interactive)' : 'NO (Autonomous)'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Auto Transitions:</span>
          <span className={`font-mono ${autoTransitions ? 'text-emerald-400' : 'text-rose-400'}`}>
            {autoTransitions ? 'ENABLED' : 'PAUSED'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Near Windmill:</span>
          <span className={tracking.isNearWindmill ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
            {tracking.isNearWindmill ? 'IN RANGE' : 'NO'}
          </span>
        </div>
      </div>

      {/* Storyboard Button */}
      <button
        type="button"
        onClick={onOpenStoryboard}
        className="w-full mb-3 flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-cyan-900/60 to-blue-900/60 hover:from-cyan-800/70 hover:to-blue-800/70 border border-cyan-500/40 text-cyan-200 text-xs rounded-xl font-medium cursor-pointer shadow-lg transition-all"
      >
        <BookOpen className="w-4 h-4 text-cyan-300" />
        <span>View Miro Storyboard & Characters</span>
      </button>

      {/* Windmill Specific Action Buttons */}
      <div className="mb-3 space-y-1.5 bg-slate-900/40 p-2 rounded-lg border border-slate-800/60">
        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
          Windmill Testing Controls
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onSimulateWindmillUserHelp}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs rounded-lg transition-all cursor-pointer font-medium"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Simulate User Blow</span>
          </button>
          <button
            type="button"
            onClick={onTriggerWindmillAutonomous}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-200 text-xs rounded-lg transition-all cursor-pointer font-medium"
          >
            <span>Trigger Auto Solve</span>
          </button>
        </div>
      </div>

      {/* General Action Buttons */}
      <div className="space-y-1.5 mb-3">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs rounded-lg transition-all cursor-pointer font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset (State 0)</span>
          </button>
          <button
            type="button"
            onClick={onNextState}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs rounded-lg transition-all cursor-pointer font-medium"
          >
            <SkipForward className="w-3.5 h-3.5 text-cyan-400" />
            <span>Advance Next</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onTriggerReturnHome}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs rounded-lg transition-all cursor-pointer font-medium"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Pinch Orb Return</span>
          </button>
          <button
            type="button"
            onClick={onEnterLumoriIdling}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 text-xs rounded-lg transition-all cursor-pointer font-medium"
          >
            <span>Idling (State 7)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onToggleAutoTransitions}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-all cursor-pointer font-medium"
          >
            {autoTransitions ? (
              <>
                <Pause className="w-3.5 h-3.5 text-rose-400" />
                <span>Pause Auto</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Resume Auto</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onToggleCamera}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-all cursor-pointer font-medium"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            <span>{tracking.isActive ? 'Stop Cam' : 'Start Cam'}</span>
          </button>
        </div>
      </div>

      {/* Jump to Windmill Sub-States */}
      <div className="mb-2">
        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
          Jump to Windmill Sub-State
        </div>
        <div className="grid grid-cols-4 gap-1">
          {windmillStates.map((item) => (
            <button
              key={item.state}
              type="button"
              onClick={() => onSetState(item.state)}
              className={`py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
                state === item.state
                  ? 'bg-cyan-400 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jump to Core States */}
      <div>
        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
          Jump to Other States
        </div>
        <div className="grid grid-cols-6 gap-1">
          {[
            { label: 'S0', state: ExperienceState.STATE_0_DORMANT_ORB },
            { label: 'S1', state: ExperienceState.STATE_1_EMERGENCE },
            { label: 'S3', state: ExperienceState.STATE_3_SOFA_ADVENTURE },
            { label: 'S4', state: ExperienceState.STATE_4_HELPING_FRIEND },
            { label: 'S5', state: ExperienceState.STATE_5_FREE_PLAY },
            { label: 'S6', state: ExperienceState.STATE_6_RETURN_TO_ORB },
            { label: 'S7', state: ExperienceState.STATE_7_LUMORI_IDLING },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSetState(item.state)}
              className={`py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                state === item.state
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
