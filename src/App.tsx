/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExperienceState, isWindmillState } from './types';
import { LumoriStateMachine } from './stateMachine';
import { useHandTracking } from './useHandTracking';
import { LivingRoom } from './components/LivingRoom';
import { AROverlay } from './components/AROverlay';
import { DebugPanel } from './components/DebugPanel';
import { StoryboardModal } from './components/StoryboardModal';
import { soundEngine } from './utils/audio';

export default function App() {
  const [state, setState] = useState<ExperienceState>(ExperienceState.STATE_0_DORMANT_ORB);
  const [moriRescued, setMoriRescued] = useState<boolean>(false);
  const [freePlayPhase, setFreePlayPhase] = useState<number>(0);
  const [autoTransitions, setAutoTransitions] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showStoryboard, setShowStoryboard] = useState<boolean>(false);

  const stateMachineRef = useRef<LumoriStateMachine | null>(null);
  const autonomousTimerRef = useRef<number | null>(null);

  // Trigger Return to Orb Command
  const handleTriggerReturnToOrb = useCallback(() => {
    if (
      state === ExperienceState.STATE_0_DORMANT_ORB ||
      state === ExperienceState.STATE_6_RETURN_TO_ORB ||
      state === ExperienceState.STATE_7_LUMORI_IDLING
    ) {
      return;
    }
    soundEngine.playOrbResonance();
    soundEngine.playChirp('alert');
    if (autonomousTimerRef.current) {
      clearTimeout(autonomousTimerRef.current);
      autonomousTimerRef.current = null;
    }
    stateMachineRef.current?.transitionTo(ExperienceState.STATE_6_RETURN_TO_ORB);
  }, [state]);

  // Handle Windmill User Interaction (Blowing / Waving / Clicking)
  const handleWindmillUserInteract = useCallback(() => {
    // Only accept if currently in an interactive windmill sub-state
    if (
      state === ExperienceState.STATE_2C_INVITATION ||
      state === ExperienceState.STATE_2A_DISCOVERY ||
      state === ExperienceState.STATE_2B_OBSERVATION
    ) {
      soundEngine.playChirp('happy');
      soundEngine.playWaterfallChime();
      stateMachineRef.current?.transitionTo(ExperienceState.STATE_2D_INTERACTION);
    }
  }, [state]);

  // Handle Mori rescue (User-assisted or Autonomous)
  const handleRescueMori = useCallback(() => {
    if (moriRescued) return;
    setMoriRescued(true);
    soundEngine.playPop();
    soundEngine.playChirp('happy');

    if (autonomousTimerRef.current) clearTimeout(autonomousTimerRef.current);
    autonomousTimerRef.current = window.setTimeout(() => {
      stateMachineRef.current?.transitionTo(ExperienceState.STATE_5_FREE_PLAY);
    }, 2500);
  }, [moriRescued]);

  // Hand tracking hook
  const {
    trackingState,
    videoRef,
    toggleCamera,
  } = useHandTracking({
    onPinchAtOrb: handleTriggerReturnToOrb,
    onPinchStart: (clientX, clientY) => {
      // Windmill gesture proxy (pinch or wave near windmill)
      const normX = clientX / window.innerWidth;
      const normY = clientY / window.innerHeight;

      if (isWindmillState(state)) {
        if (normX >= 0.22 && normX <= 0.60 && normY >= 0.48 && normY <= 0.90) {
          handleWindmillUserInteract();
        }
      }

      // Sofa cushion crevice rescue
      if (state === ExperienceState.STATE_4_HELPING_FRIEND && !moriRescued) {
        if (normX >= 0.70 && normX <= 0.88 && normY >= 0.45 && normY <= 0.75) {
          handleRescueMori();
        }
      }
    },
  });

  // Initialize state machine on mount
  useEffect(() => {
    const sm = new LumoriStateMachine({
      autoTransitions: true,
      onStateChange: (newState) => {
        setState(newState);
      },
      onPlayChirp: (type) => soundEngine.playChirp(type),
      onPlayWaterfall: () => soundEngine.playWaterfallChime(),
      onPlayPop: () => soundEngine.playPop(),
      onPlayOrb: () => soundEngine.playOrbResonance(),
    });
    stateMachineRef.current = sm;
    sm.start();

    return () => {
      sm.clearAllTimers();
      if (autonomousTimerRef.current) clearTimeout(autonomousTimerRef.current);
    };
  }, []);

  // Update State Machine auto-transition toggle
  useEffect(() => {
    stateMachineRef.current?.setAutoTransitions(autoTransitions);
  }, [autoTransitions]);

  // Manage Autonomous Timers for State 4 (Sofa rescue)
  useEffect(() => {
    if (!autoTransitions) return;

    if (state === ExperienceState.STATE_4_HELPING_FRIEND && !moriRescued) {
      autonomousTimerRef.current = window.setTimeout(() => {
        handleRescueMori();
      }, 5500);
    }

    if (state === ExperienceState.STATE_0_DORMANT_ORB || state === ExperienceState.STATE_1_EMERGENCE) {
      setMoriRescued(false);
    }

    return () => {
      if (autonomousTimerRef.current) {
        clearTimeout(autonomousTimerRef.current);
        autonomousTimerRef.current = null;
      }
    };
  }, [state, autoTransitions, moriRescued, handleRescueMori]);

  // Free play cyclical autonomous antics timer
  useEffect(() => {
    if (state !== ExperienceState.STATE_5_FREE_PLAY) return;

    const interval = window.setInterval(() => {
      setFreePlayPhase((prev) => prev + 1);
    }, 3200);

    return () => clearInterval(interval);
  }, [state]);

  // Debug controls
  const handleSetState = (newState: ExperienceState) => {
    if (newState === ExperienceState.STATE_4_HELPING_FRIEND) setMoriRescued(false);
    stateMachineRef.current?.transitionTo(newState);
  };

  const handleNextState = () => {
    stateMachineRef.current?.next();
  };

  const handleReset = () => {
    setMoriRescued(false);
    setFreePlayPhase(0);
    stateMachineRef.current?.reset();
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Hidden webcam video element for hand tracking processing */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute bottom-4 left-4 w-32 h-24 object-cover rounded-xl border border-white/20 shadow-xl z-40 transition-opacity duration-300 pointer-events-none ${
          trackingState.isActive ? 'opacity-70' : 'opacity-0'
        }`}
      />

      {/* Main AR Living Room Scene */}
      <LivingRoom
        state={state}
        isPinching={trackingState.isPinching}
        isInsideOrb={trackingState.isInsideOrb}
        isNearWindmill={trackingState.isNearWindmill}
        moriRescued={moriRescued}
        freePlayPhase={freePlayPhase}
        onOrbClick={handleTriggerReturnToOrb}
        onWindmillInteract={handleWindmillUserInteract}
        onMoriRescue={handleRescueMori}
      />

      {/* AR HUD Overlay & Reticle */}
      <AROverlay
        state={state}
        tracking={trackingState}
        isMuted={isMuted}
        onToggleCamera={toggleCamera}
        onToggleMute={handleToggleMute}
        onOpenDebug={() => setShowDebug(!showDebug)}
        onOpenStoryboard={() => setShowStoryboard(true)}
        showDebug={showDebug}
      />

      {/* Collapsible Testing & Debug Panel */}
      {showDebug && (
        <DebugPanel
          state={state}
          tracking={trackingState}
          autoTransitions={autoTransitions}
          onSetState={handleSetState}
          onNextState={handleNextState}
          onReset={handleReset}
          onTriggerReturnHome={handleTriggerReturnToOrb}
          onEnterLumoriIdling={() => handleSetState(ExperienceState.STATE_7_LUMORI_IDLING)}
          onSimulateWindmillUserHelp={handleWindmillUserInteract}
          onTriggerWindmillAutonomous={() => stateMachineRef.current?.transitionTo(ExperienceState.STATE_2E_AUTONOMOUS)}
          onToggleAutoTransitions={() => setAutoTransitions(!autoTransitions)}
          onToggleCamera={toggleCamera}
          onOpenStoryboard={() => setShowStoryboard(true)}
          onClose={() => setShowDebug(false)}
        />
      )}

      {/* Miro Storyboard & Characters Reference Modal */}
      <StoryboardModal
        isOpen={showStoryboard}
        onClose={() => setShowStoryboard(false)}
      />
    </div>
  );
}
