import React from 'react';
import { HandTrackingState, ExperienceState, STATE_METAS, isWindmillState } from '../types';
import { Camera, CameraOff, Volume2, VolumeX, BookOpen } from 'lucide-react';

interface AROverlayProps {
  state: ExperienceState;
  tracking: HandTrackingState;
  isMuted: boolean;
  onToggleCamera: () => void;
  onToggleMute: () => void;
  onOpenDebug: () => void;
  onOpenStoryboard: () => void;
  showDebug: boolean;
}

export const AROverlay: React.FC<AROverlayProps> = ({
  state,
  tracking,
  isMuted,
  onToggleCamera,
  onToggleMute,
  onOpenDebug,
  onOpenStoryboard,
  showDebug,
}) => {
  const currentMeta = STATE_METAS[state] || {
    id: state,
    name: `State ${state}`,
    shortDesc: '',
  };
  const screenX = tracking.pinchX * 100;
  const screenY = tracking.pinchY * 100;

  // Contextual instruction toast
  const getContextualInstruction = () => {
    if (state === ExperienceState.STATE_2C_INVITATION) {
      return 'Wave hand, pinch/rotate blades, or click the windmill to help create wind.';
    }
    if (state === ExperienceState.STATE_2D_INTERACTION) {
      return 'Your breeze turns the blades! The Lumori cheer with excitement.';
    }
    if (state === ExperienceState.STATE_2E_AUTONOMOUS) {
      return 'The Lumori coordinate their efforts to loosen the axle cog.';
    }
    if (state === ExperienceState.STATE_2F_SUCCESS) {
      return 'Success! The windmill spins smoothly and petals float through the air.';
    }
    if (state === ExperienceState.STATE_2G_CLOSURE) {
      return 'The windmill field is revived and flourishing.';
    }
    if (state === ExperienceState.STATE_2_ZOOM_OUT) {
      return 'Camera zooms out as Sprout and Bellflower head to the sofa...';
    }
    if (state === ExperienceState.STATE_2A_DISCOVERY) {
      return 'A tiny Broken Windmill Field appears on the coffee table (Camera zooms in).';
    }
    if (state === ExperienceState.STATE_2B_OBSERVATION) {
      return 'Sakura fetches tools from the crate while Sprout and Lotus inspect the axle.';
    }
    if (state === ExperienceState.STATE_3_SOFA_ADVENTURE) {
      return 'Sprout jumps down to the cushion, but Bellflower slips into the cushion crevice!';
    }
    if (state === ExperienceState.STATE_4_HELPING_FRIEND) {
      return 'Pinch or click Bellflower to pull him out, or let Sprout help autonomously!';
    }
    if (state === ExperienceState.STATE_4B_RESCUED_REUNION) {
      return 'Bellflower is rescued! Both Lumori celebrate together.';
    }
    if (state === ExperienceState.STATE_5_FREE_PLAY) {
      return 'Pinch at the orb to call the Lumis home.';
    }
    if (state === ExperienceState.STATE_0_DORMANT_ORB) {
      return 'Observe the Lumori orb resting on the shelf.';
    }
    if (state === ExperienceState.STATE_7_LUMORI_IDLING) {
      return 'The Lumori are resting peacefully inside their miniature world.';
    }
    return null;
  };

  const instruction = getContextualInstruction();

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden font-sans">
      {/* AR Headset Optical Reticle Framing Corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br pointer-events-none" />

      {/* Top Bar HUD */}
      <div className="absolute top-4 inset-x-8 flex items-center justify-between pointer-events-auto">
        {/* AR Session Branding */}
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded bg-slate-900/70 border border-white/15 backdrop-blur-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-200 tracking-wider font-mono">
              LUMORI AR · SONY NTU NITECH 2026
            </span>
          </div>

          {/* Current State Label */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/50 border border-white/10 text-xs text-slate-300">
            <span className="font-semibold text-amber-200">
              {currentMeta.name}
            </span>
          </div>
        </div>

        {/* Quick Controls */}
        <div className="flex items-center gap-2 no-gesture-trigger">
          {/* Reference Storyboard Button */}
          <button
            type="button"
            onClick={onOpenStoryboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 text-xs font-medium transition-all cursor-pointer backdrop-blur-md shadow-sm"
            title="View Miro Storyboard & 4 Character Designs"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden lg:inline">Storyboard Reference</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="p-2 rounded-lg bg-slate-900/70 border border-white/15 text-slate-200 hover:bg-slate-800/80 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-teal-300" />}
          </button>

          {/* Camera / Gesture Toggle */}
          <button
            type="button"
            onClick={onToggleCamera}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
              tracking.isActive
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30'
                : 'bg-slate-900/70 border-white/15 text-slate-300 hover:bg-slate-800'
            }`}
            title="Enable or disable webcam hand tracking"
          >
            {tracking.isActive ? (
              <>
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Hand Tracking: ON</span>
              </>
            ) : (
              <>
                <CameraOff className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Enable Hand Tracking</span>
              </>
            )}
          </button>

          {/* Debug Panel Toggle */}
          <button
            type="button"
            onClick={onOpenDebug}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer backdrop-blur-md ${
              showDebug
                ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                : 'bg-slate-900/70 border-white/15 text-slate-300 hover:bg-slate-800'
            }`}
          >
            DEBUG
          </button>
        </div>
      </div>

      {/* Camera Denied Notice */}
      {tracking.permissionStatus === 'denied' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-auto px-3.5 py-1.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs shadow-lg backdrop-blur-md flex items-center gap-2 animate-fade-in">
          <span>Webcam permission denied. You can interact smoothly with your mouse or trackpad.</span>
        </div>
      )}

      {/* Central Contextual Instruction */}
      {instruction && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300">
          <div className="px-4 py-2 rounded-full bg-slate-950/85 border border-white/20 backdrop-blur-md shadow-2xl text-xs md:text-sm text-amber-100/90 font-medium tracking-wide flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>{instruction}</span>
          </div>
        </div>
      )}

      {/* AR Hand Tracking / Mouse Pinch Reticle Indicator */}
      <div
        className="absolute pointer-events-none transition-transform duration-75 z-40"
        style={{
          left: `${screenX}%`,
          top: `${screenY}%`,
          transform: 'translate(-50%, -50%)',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.35))',
        }}
      >
        {/* Identified Target Badge */}
        {tracking.isTargetHit && tracking.currentTarget !== 'none' && (
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-cyan-200 bg-slate-950/90 px-2 py-0.5 rounded-full border border-cyan-400/60 shadow-md flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>TARGET: {tracking.currentTarget.toUpperCase().replace('_', ' ')}</span>
          </div>
        )}

        <div
          className={`rounded-full border-2 transition-all duration-150 flex items-center justify-center ${
            tracking.isPinching
              ? 'w-7 h-7 border-amber-400 bg-amber-400/40 scale-95 shadow-[0_0_14px_#fbbf24]'
              : tracking.isTargetHit
              ? 'w-11 h-11 border-cyan-400 bg-cyan-400/20 scale-110 shadow-[0_0_12px_#38bdf8]'
              : 'w-8 h-8 border-slate-700/80 bg-white/40 shadow-sm'
          }`}
        >
          <div
            className={`rounded-full transition-all duration-150 ${
              tracking.isPinching
                ? 'w-2.5 h-2.5 bg-amber-400'
                : tracking.isTargetHit
                ? 'w-2 h-2 bg-cyan-300'
                : 'w-1.5 h-1.5 bg-slate-800'
            }`}
          />
        </div>

        {tracking.isPinching && (
          <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-amber-300 bg-slate-950/95 px-2 py-0.5 rounded-full border border-amber-400/60 shadow-md">
            PINCH
          </div>
        )}
      </div>
    </div>
  );
};
