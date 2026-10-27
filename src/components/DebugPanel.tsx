import React from 'react';
import { ExperienceState, HandTrackingState, STATE_METAS, isWindmillZoomed, SeasonalState, SEASONAL_METAS } from '../types';
import { X, Play, RotateCcw, SkipForward, Home, Pause, Camera, Wind, BookOpen, HandMetal, Target, Eye } from 'lucide-react';

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
  onSimulatePinchOnCurrentTarget: () => void;
  onToggleAutoTransitions: () => void;
  onToggleCamera: () => void;
  onOpenStoryboard: () => void;
  onClose: () => void;
  seasonalState?: SeasonalState;
  isSeasonalTransitioning?: boolean;
  onSeasonalSwipe?: (direction: 'next' | 'prev') => void;
  onSetSeasonalState?: (season: SeasonalState) => void;
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
  onSimulatePinchOnCurrentTarget,
  onToggleAutoTransitions,
  onToggleCamera,
  onOpenStoryboard,
  onClose,
  seasonalState = SeasonalState.SPRING_SUNNY,
  isSeasonalTransitioning = false,
  onSeasonalSwipe,
  onSetSeasonalState,
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

  const isZoomed = isWindmillZoomed(state);

  const windmillStates: { label: string; state: ExperienceState }[] = [
    { label: '2A Disc', state: ExperienceState.STATE_2A_DISCOVERY },
    { label: '2B Obs', state: ExperienceState.STATE_2B_OBSERVATION },
    { label: '2C Inv', state: ExperienceState.STATE_2C_INVITATION },
    { label: '2D Int', state: ExperienceState.STATE_2D_INTERACTION },
    { label: '2E Auto', state: ExperienceState.STATE_2E_AUTONOMOUS },
    { label: '2F Succ', state: ExperienceState.STATE_2F_SUCCESS },
    { label: '2G Clos', state: ExperienceState.STATE_2G_CLOSURE },
    { label: '2 ZoomOut', state: ExperienceState.STATE_2_ZOOM_OUT },
  ];

  return (
    <div className="no-gesture-trigger absolute right-4 top-16 z-50 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-5rem)] flex flex-col rounded-2xl bg-slate-950/95 border border-slate-700/80 shadow-2xl text-slate-200 font-sans backdrop-blur-xl animate-fade-in select-none overflow-hidden">
      {/* Panel Header (Pinned) */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-950/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <h2 className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase">
            Debug & Interaction Pipeline
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

      {/* Scrollable Content Body */}
      <div className="overflow-y-auto flex-1 p-4 pt-3 custom-scrollbar">

      {/* State Machine Status */}
      <div className="space-y-1.5 mb-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Current State:</span>
          <span className="font-mono font-bold text-amber-300">
            {currentMeta.name}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Camera View:</span>
          <span className={`font-mono text-[11px] font-bold ${isZoomed ? 'text-amber-300' : 'text-emerald-400'}`}>
            {isZoomed ? 'ZOOMED IN (2.05x Table)' : 'FULL ROOM (1.0x)'}
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
      </div>

      {/* 4-Step Interaction Pipeline Telemetry */}
      <div className="space-y-1.5 mb-3 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800/80 text-xs font-mono">
        <div className="text-[10px] text-cyan-300 uppercase tracking-wider mb-1 font-sans flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          <span>4-Step Interaction Pipeline</span>
        </div>

        {/* Step 1: Hand Detected */}
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">1. Hand Detected:</span>
          <span className={tracking.isActive && tracking.landmarksCount > 0 ? 'text-emerald-400' : 'text-slate-500'}>
            {tracking.source === 'webcam'
              ? tracking.landmarksCount > 0
                ? `YES (${tracking.landmarksCount} pts)`
                : 'WAITING (Out of frame)'
              : 'MOUSE ACTIVE'}
          </span>
        </div>

        {/* Step 2: Pinch State */}
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">2. Pinch Detected:</span>
          <span className={tracking.isPinching ? 'text-amber-400 font-bold' : 'text-slate-500'}>
            {tracking.isPinching ? 'PINCHING (Closed)' : 'OPEN (Released)'}
          </span>
        </div>

        {/* Coords */}
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">Pinch Point (X, Y):</span>
          <span className="text-slate-300 tabular-nums">
            {(tracking.pinchX * 100).toFixed(1)}%, {(tracking.pinchY * 100).toFixed(1)}%
          </span>
        </div>

        {/* Step 3: Target Identified */}
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">3. Target Identified:</span>
          <span
            className={
              tracking.currentTarget !== 'none'
                ? 'text-cyan-300 font-bold uppercase'
                : 'text-slate-500'
            }
          >
            {tracking.currentTarget.replace('_', ' ')}
          </span>
        </div>

        {/* Step 3b: Hit Test */}
        <div className="flex justify-between">
          <span className="text-slate-400 font-sans">Hit Test Succeeded:</span>
          <span className={tracking.isTargetHit ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
            {tracking.isTargetHit ? 'TRUE (Intersected)' : 'FALSE'}
          </span>
        </div>

        {/* Step 4: Action Executed */}
        <div className="flex justify-between border-t border-slate-800 pt-1">
          <span className="text-slate-400 font-sans">4. Last Action Executed:</span>
          <span className="text-amber-300 font-medium truncate max-w-[150px]">
            {tracking.lastActionTriggered}
          </span>
        </div>
      </div>

      {/* Test Button: Simulate Pinch on Target */}
      <button
        type="button"
        onClick={onSimulatePinchOnCurrentTarget}
        className="w-full mb-3 flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-amber-600/70 to-orange-600/70 hover:from-amber-500/80 hover:to-orange-500/80 border border-amber-400/50 text-amber-100 text-xs rounded-xl font-bold cursor-pointer shadow-lg transition-all active:scale-95"
      >
        <HandMetal className="w-4 h-4 text-amber-200" />
        <span>Simulate Pinch on Target</span>
      </button>

      {/* Storyboard Button */}
      <button
        type="button"
        onClick={onOpenStoryboard}
        className="w-full mb-3 flex items-center justify-center gap-2 py-1.5 px-3 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 text-xs rounded-xl font-medium cursor-pointer transition-all"
      >
        <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
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

      {/* Jump to Sofa Sequence */}
      <div className="mb-2">
        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
          Jump to Sofa Sequence
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: '3A Sprout', state: ExperienceState.STATE_3A_SPROUT_HEADREST },
            { label: '3B Jump', state: ExperienceState.STATE_3B_SPROUT_JUMP },
            { label: '3C Bell', state: ExperienceState.STATE_3C_BELLFLOWER_HEADREST },
            { label: '3D Trap', state: ExperienceState.STATE_3D_BELLFLOWER_JUMP_TRAPPED },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSetState(item.state)}
              className={`py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                state === item.state
                  ? 'bg-teal-400 text-slate-950 font-bold'
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
        <div className="grid grid-cols-4 gap-1">
          {[
            { label: 'S0 Orb', state: ExperienceState.STATE_0_DORMANT_ORB },
            { label: 'S1 Emerge', state: ExperienceState.STATE_1_EMERGENCE },
            { label: 'S3 Sofa', state: ExperienceState.STATE_3_SOFA_ADVENTURE },
            { label: 'S4 Help', state: ExperienceState.STATE_4_HELPING_FRIEND },
            { label: 'S4B Reun', state: ExperienceState.STATE_4B_RESCUED_REUNION },
            { label: 'S5 Play', state: ExperienceState.STATE_5_FREE_PLAY },
            { label: 'S6 Return', state: ExperienceState.STATE_6_RETURN_TO_ORB },
            { label: 'S7 Idle', state: ExperienceState.STATE_7_LUMORI_IDLING },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSetState(item.state)}
              className={`py-1 rounded text-[11px] font-mono transition-all cursor-pointer ${
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
      {/* Jump to Seasonal World States */}
      <div className="mb-2">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
          <span>Seasonal World (Stage 1-4)</span>
          {state === ExperienceState.STATE_10_SEASONAL_WORLD && (
            <span className={isSeasonalTransitioning ? "text-amber-400 animate-pulse" : "text-emerald-400"}>
              {isSeasonalTransitioning ? "LOCKOUT (Transitioning)" : "READY (Neutral)"}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1 mb-1.5">
          <button
            type="button"
            onClick={() => onSetState(ExperienceState.STATE_8_REVEAL_ORB)}
            className={`py-1 px-1.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
              state === ExperienceState.STATE_8_REVEAL_ORB
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Stage 2: Reveal Orb
          </button>
          <button
            type="button"
            onClick={() => onSetState(ExperienceState.STATE_9_ENTER_MINIATURE_WORLD)}
            className={`py-1 px-1.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
              state === ExperienceState.STATE_9_ENTER_MINIATURE_WORLD
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Stage 3: Enter Orb
          </button>
          <button
            type="button"
            onClick={() => onSetState(ExperienceState.STATE_10_SEASONAL_WORLD)}
            className={`py-1 px-1.5 rounded text-[10px] font-mono transition-all cursor-pointer ${
              state === ExperienceState.STATE_10_SEASONAL_WORLD
                ? 'bg-cyan-400 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Stage 4: Explore
          </button>
        </div>

        {/* 8 Persistent Environment States */}
        <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">
          8 Persistent Seasonal Environments
        </div>
        <div className="grid grid-cols-4 gap-1 mb-2">
          {[
            { id: SeasonalState.SPRING_SUNNY, label: "1. Spr Sun" },
            { id: SeasonalState.SPRING_RAINY, label: "2. Spr Rain" },
            { id: SeasonalState.SUMMER_SUNNY, label: "3. Sum Sun" },
            { id: SeasonalState.SUMMER_RAINY, label: "4. Sum Rain" },
            { id: SeasonalState.AUTUMN_SUNNY, label: "5. Aut Sun" },
            { id: SeasonalState.AUTUMN_RAINY, label: "6. Aut Rain" },
            { id: SeasonalState.WINTER_SUNNY, label: "7. Win Sun" },
            { id: SeasonalState.WINTER_RAINY, label: "8. Win Rain" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSetState(ExperienceState.STATE_10_SEASONAL_WORLD);
                onSetSeasonalState?.(item.id);
              }}
              className={`py-1 px-0.5 rounded text-[10px] font-mono transition-all cursor-pointer text-center ${
                seasonalState === item.id && state === ExperienceState.STATE_10_SEASONAL_WORLD
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Swipe Simulator */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            disabled={isSeasonalTransitioning}
            onClick={() => onSeasonalSwipe?.('prev')}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border flex items-center justify-center gap-1 ${
              isSeasonalTransitioning
                ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600/30 hover:bg-indigo-600/50 border-indigo-500/50 text-indigo-200 cursor-pointer'
            }`}
          >
            <span>‹ Swipe Left (Prev)</span>
          </button>
          <button
            type="button"
            disabled={isSeasonalTransitioning}
            onClick={() => onSeasonalSwipe?.('next')}
            className={`py-1.5 px-2 rounded-lg text-xs font-mono font-medium border flex items-center justify-center gap-1 ${
              isSeasonalTransitioning
                ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-indigo-600/30 hover:bg-indigo-600/50 border-indigo-500/50 text-indigo-200 cursor-pointer'
            }`}
          >
            <span>Swipe Right (Next) ›</span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};
