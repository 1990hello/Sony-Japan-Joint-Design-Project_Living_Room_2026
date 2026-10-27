import { useState, useEffect, useRef, useCallback } from 'react';
import { HandTrackingState, InteractionTarget, ExperienceState, isWindmillState } from './types';

interface UseHandTrackingProps {
  appState: ExperienceState;
  onExecuteTargetAction?: (target: InteractionTarget) => void;
  onSeasonalSwipe?: (direction: "next" | "prev") => void;
  isSeasonalTransitioning?: boolean;
}

export function useHandTracking({
  appState,
  onExecuteTargetAction,
  onSeasonalSwipe,
  isSeasonalTransitioning,
}: UseHandTrackingProps) {
  const [trackingState, setTrackingState] = useState<HandTrackingState>({
    isActive: false,
    isPinching: false,
    pinchX: 0.5,
    pinchY: 0.5,
    isInsideOrb: false,
    isNearWindmill: false,
    currentTarget: 'none',
    isTargetHit: false,
    lastActionTriggered: 'None',
    landmarksCount: 0,
    permissionStatus: 'idle',
    source: 'mouse',
    lastPinchTime: 0,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaPipeHandsRef = useRef<any>(null);

  // Stale-closure avoidance references
  const latestAppStateRef = useRef<ExperienceState>(appState);
  latestAppStateRef.current = appState;

  const onExecuteTargetActionRef = useRef(onExecuteTargetAction);
  onExecuteTargetActionRef.current = onExecuteTargetAction;

  const onSeasonalSwipeRef = useRef(onSeasonalSwipe);
  onSeasonalSwipeRef.current = onSeasonalSwipe;

  const isSeasonalTransitioningRef = useRef(isSeasonalTransitioning);
  isSeasonalTransitioningRef.current = isSeasonalTransitioning;

  const motionHistoryRef = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const needsNeutralResetRef = useRef<boolean>(false);
  const mouseDragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Gesture state management
  const isPinchingRef = useRef<boolean>(false);
  const isMouseDownRef = useRef<boolean>(false);
  const consecutivePinchFramesRef = useRef<number>(0);
  const hasTriggeredCurrentPinchRef = useRef<boolean>(false);
  const lastActionTimeRef = useRef<number>(0);

  // Landmark smoothing
  const smoothedXRef = useRef<number>(0.5);
  const smoothedYRef = useRef<number>(0.5);

  // Pixel-accurate target intersection check using actual DOM bounding boxes
  const identifyInteractionTarget = useCallback((clientX: number, clientY: number): {
    target: InteractionTarget;
    isHit: boolean;
    isOrb: boolean;
    isWindmill: boolean;
  } => {
    const currentState = latestAppStateRef.current;

    // 1. Check Orb Target
    const orbEl = document.getElementById('lumori-orb-target');
    let isOrb = false;
    if (orbEl) {
      const rect = orbEl.getBoundingClientRect();
      const margin = 28;
      if (
        clientX >= rect.left - margin &&
        clientX <= rect.right + margin &&
        clientY >= rect.top - margin &&
        clientY <= rect.bottom + margin
      ) {
        isOrb = true;
      }
    }

    // 2. Check Windmill Target (Valid during all windmill states)
    const windmillEl = document.getElementById('lumori-windmill-target');
    let isWindmill = false;
    if (windmillEl && isWindmillState(currentState)) {
      const rect = windmillEl.getBoundingClientRect();
      const margin = 28;
      if (
        clientX >= rect.left - margin &&
        clientX <= rect.right + margin &&
        clientY >= rect.top - margin &&
        clientY <= rect.bottom + margin
      ) {
        isWindmill = true;
      }
    }

    // 3. Check Sofa Rescue Target (Valid in State 4 Helping a Friend)
    const sofaRescueEl = document.getElementById('lumori-sofa-rescue-target');
    const sofaEl = document.getElementById('lumori-sofa-target');
    let isSofaRescue = false;
    if (currentState === ExperienceState.STATE_4_HELPING_FRIEND) {
      if (sofaRescueEl) {
        const rect = sofaRescueEl.getBoundingClientRect();
        const margin = 36;
        if (
          clientX >= rect.left - margin &&
          clientX <= rect.right + margin &&
          clientY >= rect.top - margin &&
          clientY <= rect.bottom + margin
        ) {
          isSofaRescue = true;
        }
      }
      // Also hit-test the sofa cushion area where Bellflower is stuck
      if (!isSofaRescue && sofaEl) {
        const rect = sofaEl.getBoundingClientRect();
        if (
          clientX >= rect.left + rect.width * 0.35 &&
          clientX <= rect.right + 20 &&
          clientY >= rect.top + rect.height * 0.35 &&
          clientY <= rect.bottom + 20
        ) {
          isSofaRescue = true;
        }
      }
    }

    let target: InteractionTarget = 'none';
    if (isOrb) target = 'orb';
    else if (isWindmill) target = 'windmill';
    else if (isSofaRescue) target = 'sofa_rescue';

    return {
      target,
      isHit: target !== 'none',
      isOrb,
      isWindmill,
    };
  }, []);

  // Central Action Execution Router
  const triggerActionForTarget = useCallback((target: InteractionTarget) => {
    const now = Date.now();
    if (target === 'none') return;

    // Cooldown check
    if (now - lastActionTimeRef.current < 450) return;
    lastActionTimeRef.current = now;

    const actionName =
      target === 'orb'
        ? 'Return to Orb Triggered'
        : target === 'windmill'
        ? 'Windmill Wind Activated'
        : target === 'sofa_rescue'
        ? 'Sofa Rescue Performed'
        : 'None';

    setTrackingState((prev) => ({
      ...prev,
      lastActionTriggered: actionName,
    }));

    // Execute through ref to guarantee fresh state closure
    onExecuteTargetActionRef.current?.(target);
  }, []);

  // Mouse & Touch fallback
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // If webcam is active with valid hand landmarks, do not overwrite coordinates with mouse
      if (trackingState.isActive && trackingState.source === 'webcam') {
        return;
      }

      const clientX = e.clientX;
      const clientY = e.clientY;
      const normX = clientX / window.innerWidth;
      const normY = clientY / window.innerHeight;

      const { target, isHit, isOrb, isWindmill } = identifyInteractionTarget(clientX, clientY);

      setTrackingState((prev) => ({
        ...prev,
        isPinching: isPinchingRef.current || isMouseDownRef.current,
        pinchX: normX,
        pinchY: normY,
        isInsideOrb: isOrb,
        isNearWindmill: isWindmill,
        currentTarget: target,
        isTargetHit: isHit,
        source: 'mouse',
      }));
    };

    const handleMouseDown = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement;
      if (targetEl?.closest?.('.no-gesture-trigger')) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      if (latestAppStateRef.current === ExperienceState.STATE_10_SEASONAL_WORLD) {
        mouseDragStartRef.current = { x: clientX, y: clientY, time: Date.now() };
      }
      const { target, isHit, isOrb, isWindmill } = identifyInteractionTarget(clientX, clientY);

      isMouseDownRef.current = true;
      isPinchingRef.current = true;

      setTrackingState((prev) => ({
        ...prev,
        isPinching: true,
        pinchX: clientX / window.innerWidth,
        pinchY: clientY / window.innerHeight,
        isInsideOrb: isOrb,
        isNearWindmill: isWindmill,
        currentTarget: target,
        isTargetHit: isHit,
        lastPinchTime: Date.now(),
        source: 'mouse',
      }));

      if (isHit && target !== 'none') {
        triggerActionForTarget(target);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (
        latestAppStateRef.current === ExperienceState.STATE_10_SEASONAL_WORLD &&
        mouseDragStartRef.current &&
        !isSeasonalTransitioningRef.current
      ) {
        const dx = e.clientX - mouseDragStartRef.current.x;
        const dy = e.clientY - mouseDragStartRef.current.y;
        const dt = Date.now() - mouseDragStartRef.current.time;
        if (Math.abs(dx) > 60 && Math.abs(dx) > 1.6 * Math.abs(dy) && dt < 800) {
          const direction: "next" | "prev" = dx > 0 ? "next" : "prev";
          onSeasonalSwipeRef.current?.(direction);
        }
      }
      mouseDragStartRef.current = null;

      isMouseDownRef.current = false;
      isPinchingRef.current = false;
      setTrackingState((prev) => ({
        ...prev,
        isPinching: false,
      }));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (latestAppStateRef.current !== ExperienceState.STATE_10_SEASONAL_WORLD) return;
      if (isSeasonalTransitioningRef.current) return;
      if (e.key === "ArrowRight") {
        onSeasonalSwipeRef.current?.("next");
      } else if (e.key === "ArrowLeft") {
        onSeasonalSwipeRef.current?.("prev");
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [identifyInteractionTarget, triggerActionForTarget, trackingState.isActive, trackingState.source]);

  // Request & Start Webcam
  const startCamera = useCallback(async () => {
    try {
      setTrackingState((prev) => ({ ...prev, permissionStatus: 'requesting' }));

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setTrackingState((prev) => ({ ...prev, permissionStatus: 'unsupported' }));
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setTrackingState((prev) => ({
        ...prev,
        isActive: true,
        permissionStatus: 'granted',
        source: 'webcam',
      }));

      initializeTrackingEngine();
    } catch (err: any) {
      console.warn('Webcam permission error:', err);
      setTrackingState((prev) => ({
        ...prev,
        permissionStatus: 'denied',
        isActive: false,
        source: 'mouse',
      }));
    }
  }, []);

  // Stop Webcam
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setTrackingState((prev) => ({
      ...prev,
      isActive: false,
      source: 'mouse',
      landmarksCount: 0,
    }));
  }, []);

  const toggleCamera = useCallback(() => {
    if (trackingState.isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [trackingState.isActive, startCamera, stopCamera]);

  // Tracking Engine Initialization
  const initializeTrackingEngine = useCallback(() => {
    const loadMediaPipe = async () => {
      if ((window as any).Hands) {
        setupMediaPipe();
        return;
      }

      if (!document.getElementById('mediapipe-hands-script')) {
        const script = document.createElement('script');
        script.id = 'mediapipe-hands-script';
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => setupMediaPipe();
        script.onerror = () => startOpticalLoop();
        document.head.appendChild(script);
      }
    };

    const setupMediaPipe = () => {
      try {
        const Hands = (window as any).Hands;
        if (!Hands) {
          startOpticalLoop();
          return;
        }

        const hands = new Hands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];

            // Mirrored horizontal coordinate for natural 1st person AR
            const rawX = 1 - (thumbTip.x + indexTip.x) / 2;
            const rawY = (thumbTip.y + indexTip.y) / 2;

            // Exponential Moving Average (EMA) smoothing
            smoothedXRef.current = smoothedXRef.current * 0.6 + rawX * 0.4;
            smoothedYRef.current = smoothedYRef.current * 0.6 + rawY * 0.4;

            const clientX = smoothedXRef.current * window.innerWidth;
            const clientY = smoothedYRef.current * window.innerHeight;

            // Euclidean 3D pinch distance
            const dx = thumbTip.x - indexTip.x;
            const dy = thumbTip.y - indexTip.y;
            const dz = (thumbTip.z || 0) - (indexTip.z || 0);
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Dual Hysteresis Thresholds
            const PINCH_START_DIST = 0.075;
            const PINCH_RELEASE_DIST = 0.098;

            let isPinchingNow = isPinchingRef.current;
            if (!isPinchingNow && dist < PINCH_START_DIST) {
              consecutivePinchFramesRef.current += 1;
              if (consecutivePinchFramesRef.current >= 2) {
                isPinchingNow = true;
              }
            } else if (isPinchingNow && dist > PINCH_RELEASE_DIST) {
              isPinchingNow = false;
              consecutivePinchFramesRef.current = 0;
              hasTriggeredCurrentPinchRef.current = false;
            }

            isPinchingRef.current = isPinchingNow;

            // --- SEASONAL WORLD OPEN-PALM SWIPE RECOGNITION ---
            if (latestAppStateRef.current === ExperienceState.STATE_10_SEASONAL_WORLD) {
              const wrist = landmarks[0];
              const middleTip = landmarks[12];
              const ringTip = landmarks[16];
              const pinkyTip = landmarks[20];
              const palmCenterRawX = 1 - (wrist.x + landmarks[5].x + landmarks[9].x + landmarks[17].x) / 4;
              const palmCenterRawY = (wrist.y + landmarks[5].y + landmarks[9].y + landmarks[17].y) / 4;

              const distWrist = (pt: any) => Math.hypot(pt.x - wrist.x, pt.y - wrist.y);
              const isOpenPalm =
                distWrist(indexTip) > distWrist(landmarks[5]) * 1.15 &&
                distWrist(middleTip) > distWrist(landmarks[9]) * 1.15 &&
                distWrist(ringTip) > distWrist(landmarks[13]) * 1.15;

              const now = Date.now();
              motionHistoryRef.current.push({ x: palmCenterRawX, y: palmCenterRawY, time: now });
              motionHistoryRef.current = motionHistoryRef.current.filter((item) => now - item.time < 350);

              if (isSeasonalTransitioningRef.current) {
                // Ignore additional swipes during transition; do NOT queue them!
                motionHistoryRef.current = [];
              } else if (needsNeutralResetRef.current) {
                // Require hand to return to neutral state before another swipe can register
                if (motionHistoryRef.current.length >= 4) {
                  const first = motionHistoryRef.current[0];
                  const last = motionHistoryRef.current[motionHistoryRef.current.length - 1];
                  const speed = Math.abs(last.x - first.x) / ((last.time - first.time) || 1);
                  if (speed < 0.00035) {
                    needsNeutralResetRef.current = false;
                  }
                }
              } else if (isOpenPalm && motionHistoryRef.current.length >= 4) {
                const first = motionHistoryRef.current[0];
                const last = motionHistoryRef.current[motionHistoryRef.current.length - 1];
                const dt = last.time - first.time;
                const dx = last.x - first.x;
                const dy = last.y - first.y;

                if (dt > 100 && dt < 420 && Math.abs(dx) > 0.16 && Math.abs(dx) > 1.8 * Math.abs(dy)) {
                  const direction: "next" | "prev" = dx > 0 ? "next" : "prev";
                  needsNeutralResetRef.current = true;
                  motionHistoryRef.current = [];
                  onSeasonalSwipeRef.current?.(direction);
                }
              }
            }

            // Identify current target using fresh DOM coordinates
            const { target, isHit, isOrb, isWindmill } = identifyInteractionTarget(clientX, clientY);

            // Execute action if pinching on a valid target
            if (isPinchingNow && isHit && !hasTriggeredCurrentPinchRef.current) {
              hasTriggeredCurrentPinchRef.current = true;
              triggerActionForTarget(target);
            }

            setTrackingState((prev) => ({
              ...prev,
              isActive: true,
              isPinching: isPinchingNow,
              pinchX: smoothedXRef.current,
              pinchY: smoothedYRef.current,
              isInsideOrb: isOrb,
              isNearWindmill: isWindmill,
              currentTarget: target,
              isTargetHit: isHit,
              landmarksCount: landmarks.length,
              source: 'webcam',
            }));
          } else {
            // Hand out of frame
            isPinchingRef.current = false;
            consecutivePinchFramesRef.current = 0;
            hasTriggeredCurrentPinchRef.current = false;
            setTrackingState((prev) => ({
              ...prev,
              landmarksCount: 0,
              isPinching: false,
              isTargetHit: false,
            }));
          }
        });

        mediaPipeHandsRef.current = hands;

        const processVideoFrame = async () => {
          if (videoRef.current && videoRef.current.readyState >= 2 && mediaPipeHandsRef.current) {
            try {
              await mediaPipeHandsRef.current.send({ image: videoRef.current });
            } catch {
              // Ignore transient frame dropping
            }
          }
          if (streamRef.current) {
            animFrameRef.current = requestAnimationFrame(processVideoFrame);
          }
        };

        processVideoFrame();
      } catch (e) {
        console.warn('MediaPipe initialization fallback to optical:', e);
        startOpticalLoop();
      }
    };

    const startOpticalLoop = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 120;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      const checkFrame = () => {
        if (!streamRef.current || !videoRef.current || videoRef.current.readyState < 2) {
          if (streamRef.current) animFrameRef.current = requestAnimationFrame(checkFrame);
          return;
        }

        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 160, 120);
          const imgData = ctx.getImageData(0, 0, 160, 120);
          const data = imgData.data;

          let sumX = 0;
          let sumY = 0;
          let count = 0;

          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
              const pixelIdx = i / 4;
              sumX += pixelIdx % 160;
              sumY += Math.floor(pixelIdx / 160);
              count++;
            }
          }

          if (count > 25) {
            const rawX = 1 - (sumX / count) / 160;
            const rawY = (sumY / count) / 120;

            smoothedXRef.current = smoothedXRef.current * 0.7 + rawX * 0.3;
            smoothedYRef.current = smoothedYRef.current * 0.7 + rawY * 0.3;

            const clientX = smoothedXRef.current * window.innerWidth;
            const clientY = smoothedYRef.current * window.innerHeight;

            const { target, isHit, isOrb, isWindmill } = identifyInteractionTarget(clientX, clientY);

            setTrackingState((prev) => ({
              ...prev,
              isPinching: isPinchingRef.current || isMouseDownRef.current,
              pinchX: smoothedXRef.current,
              pinchY: smoothedYRef.current,
              isInsideOrb: isOrb,
              isNearWindmill: isWindmill,
              currentTarget: target,
              isTargetHit: isHit,
              landmarksCount: count,
              source: 'webcam',
            }));
          }
        }

        if (streamRef.current) {
          animFrameRef.current = requestAnimationFrame(checkFrame);
        }
      };

      checkFrame();
    };

    loadMediaPipe();
  }, [identifyInteractionTarget, triggerActionForTarget]);

  // Teardown
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    trackingState,
    videoRef,
    startCamera,
    stopCamera,
    toggleCamera,
    triggerActionForTarget,
  };
}
