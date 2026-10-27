/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExperienceState, InteractionTarget, isWindmillState, SeasonalState, getNextSeasonalState, getPrevSeasonalState } from './types';
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

  const [isWindmillRepaired, setIsWindmillRepaired] = useState<boolean>(false);
  const [seasonalState, setSeasonalState] = useState<SeasonalState>(SeasonalState.SPRING_SUNNY);
  const [isSeasonalTransitioning, setIsSeasonalTransitioning] = useState<boolean>(false);

  const stateMachineRef = useRef<LumoriStateMachine | null>(null);

  // Latch windmill repaired state once interaction / repair succeeds, persisting across later room states
  useEffect(() => {
    if (
      state === ExperienceState.STATE_2D_INTERACTION ||
      state === ExperienceState.STATE_2E_AUTONOMOUS ||
      state === ExperienceState.STATE_2F_SUCCESS ||
      state === ExperienceState.STATE_2G_CLOSURE
    ) {
      setIsWindmillRepaired(true);
    } else if (state === ExperienceState.STATE_0_DORMANT_ORB) {
      setIsWindmillRepaired(false);
    }

    if (
      state === ExperienceState.STATE_4B_RESCUED_REUNION ||
      state === ExperienceState.STATE_5_FREE_PLAY
    ) {
      setMoriRescued(true);
    } else if (
      state === ExperienceState.STATE_0_DORMANT_ORB ||
      state === ExperienceState.STATE_1_EMERGENCE ||
      state === ExperienceState.STATE_3_SOFA_ADVENTURE ||
      state === ExperienceState.STATE_3A_SPROUT_HEADREST ||
      state === ExperienceState.STATE_3B_SPROUT_JUMP ||
      state === ExperienceState.STATE_3C_BELLFLOWER_HEADREST ||
      state === ExperienceState.STATE_3D_BELLFLOWER_JUMP_TRAPPED
    ) {
      setMoriRescued(false);
    }
  }, [state]);

  // Seasonal swipe handler with strict transition lockout
  const handleSeasonalSwipe = useCallback(
    (direction: 'next' | 'prev') => {
      if (state !== ExperienceState.STATE_10_SEASONAL_WORLD) return;
      if (isSeasonalTransitioning) return; // Strict lockout during transition; ignore additional swipes, do not queue!

      setIsSeasonalTransitioning(true);
      soundEngine.playSeasonalSwipeSound(direction);
      setSeasonalState((prev) => (direction === 'next' ? getNextSeasonalState(prev) : getPrevSeasonalState(prev)));

      // Lockout lasts 2.2s for complete environmental and audio transition
      window.setTimeout(() => {
        setIsSeasonalTransitioning(false);
      }, 2200);
    },
    [state, isSeasonalTransitioning]
  );

  // Manage spatial sound and transition lockout during camera transitions into Seasonal World
  useEffect(() => {
    if (state === ExperienceState.STATE_9_ENTER_MINIATURE_WORLD) {
      soundEngine.playOrbSpatialEnter();
      setIsSeasonalTransitioning(true); // Disable gestures throughout camera transition
    } else if (state === ExperienceState.STATE_10_SEASONAL_WORLD) {
      // Enable exploration gestures only after camera has fully settled!
      const timer = window.setTimeout(() => {
        setIsSeasonalTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    } else if (state < ExperienceState.STATE_8_REVEAL_ORB) {
      soundEngine.stopSeasonalAmbience();
    }
  }, [state]);

  // Trigger Return to Orb Command
  const handleTriggerReturnToOrb = useCallback(() => {
    // Return to orb is valid from any room state outside the orb
    if (
      state === ExperienceState.STATE_0_DORMANT_ORB ||
      state === ExperienceState.STATE_6_RETURN_TO_ORB ||
      state === ExperienceState.STATE_7_LUMORI_IDLING
    ) {
      return;
    }
    soundEngine.playOrbResonance();
    soundEngine.playChirp('alert');
    stateMachineRef.current?.transitionTo(ExperienceState.STATE_6_RETURN_TO_ORB);
  }, [state]);

  // Handle Windmill User Interaction (Blowing / Waving / Clicking)
  const handleWindmillUserInteract = useCallback(() => {
    if (
      state === ExperienceState.STATE_2C_INVITATION ||
      state === ExperienceState.STATE_2A_DISCOVERY ||
      state === ExperienceState.STATE_2B_OBSERVATION
    ) {
      soundEngine.playChirp('happy');
      soundEngine.playWaterfallChime();
      setIsWindmillRepaired(true);
      stateMachineRef.current?.transitionTo(ExperienceState.STATE_2D_INTERACTION);
    }
  }, [state]);

  // Handle Mori rescue (User-assisted or Autonomous)
  // Advances directly to STATE_4B_RESCUED_REUNION which cleanly and automatically
  // advances to STATE_5_FREE_PLAY via the State Machine's own timer.
  const handleRescueMori = useCallback(() => {
    if (moriRescued) return;
    setMoriRescued(true);
    soundEngine.playPop();
    soundEngine.playChirp('happy');
    stateMachineRef.current?.transitionTo(ExperienceState.STATE_4B_RESCUED_REUNION);
  }, [moriRescued]);

  // Unified Target Action Dispatcher (called by webcam pinch, mouse click, and debug tests)
  const handleExecuteTargetAction = useCallback(
    (target: InteractionTarget) => {
      if (target === 'orb') {
        handleTriggerReturnToOrb();
      } else if (target === 'windmill') {
        handleWindmillUserInteract();
      } else if (target === 'sofa_rescue') {
        handleRescueMori();
      }
    },
    [handleTriggerReturnToOrb, handleWindmillUserInteract, handleRescueMori]
  );

  // Robust Hand tracking hook with fresh state and DOM hit testing
  const {
    trackingState,
    videoRef,
    toggleCamera,
    triggerActionForTarget,
  } = useHandTracking({
    appState: state,
    onExecuteTargetAction: handleExecuteTargetAction,
    onSeasonalSwipe: handleSeasonalSwipe,
    isSeasonalTransitioning: isSeasonalTransitioning,
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
    };
  }, []);

  // Update State Machine auto-transition toggle
  useEffect(() => {
    stateMachineRef.current?.setAutoTransitions(autoTransitions);
  }, [autoTransitions]);

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
    soundEngine.stopSeasonalAmbience();
    setMoriRescued(false);
    setIsWindmillRepaired(false);
    setFreePlayPhase(0);
    setSeasonalState(SeasonalState.SPRING_SUNNY);
    setIsSeasonalTransitioning(false);
    stateMachineRef.current?.reset();
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAF8F5] font-sans">
      {/* Hidden webcam video element for hand tracking processing */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className={`absolute bottom-4 left-4 w-32 h-24 object-cover rounded-xl border border-stone-300 shadow-xl z-40 transition-opacity duration-300 pointer-events-none ${
          trackingState.isActive ? 'opacity-80' : 'opacity-0'
        }`}
      />

      {/* Main AR Living Room Scene */}
      <LivingRoom
        state={state}
        isPinching={trackingState.isPinching}
        isInsideOrb={trackingState.isInsideOrb}
        isNearWindmill={trackingState.isNearWindmill}
        isWindmillRepaired={isWindmillRepaired}
        moriRescued={moriRescued}
        freePlayPhase={freePlayPhase}
        onOrbClick={handleTriggerReturnToOrb}
        onWindmillInteract={handleWindmillUserInteract}
        onMoriRescue={handleRescueMori}
        seasonalState={seasonalState}
        isSeasonalTransitioning={isSeasonalTransitioning}
        onSeasonalSwipe={handleSeasonalSwipe}
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
          onSimulatePinchOnCurrentTarget={() => {
            if (trackingState.currentTarget !== 'none') {
              triggerActionForTarget(trackingState.currentTarget);
            } else if (isWindmillState(state)) {
              handleWindmillUserInteract();
            } else if (state === ExperienceState.STATE_4_HELPING_FRIEND) {
              handleRescueMori();
            } else {
              handleTriggerReturnToOrb();
            }
          }}
          onToggleAutoTransitions={() => setAutoTransitions(!autoTransitions)}
          onToggleCamera={toggleCamera}
          onOpenStoryboard={() => setShowStoryboard(true)}
          onClose={() => setShowDebug(false)}
          seasonalState={seasonalState}
          isSeasonalTransitioning={isSeasonalTransitioning}
          onSeasonalSwipe={handleSeasonalSwipe}
          onSetSeasonalState={(s) => setSeasonalState(s)}
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
