import { useState, useEffect, useRef, useCallback } from 'react';
import { HandTrackingState } from './types';

interface UseHandTrackingProps {
  onPinchAtOrb?: () => void;
  onPinchStart?: (x: number, y: number) => void;
  onPinchEnd?: () => void;
}

export function useHandTracking({
  onPinchAtOrb,
  onPinchStart,
  onPinchEnd,
}: UseHandTrackingProps = {}) {
  const [trackingState, setTrackingState] = useState<HandTrackingState>({
    isActive: false,
    isPinching: false,
    pinchX: 0.5,
    pinchY: 0.5,
    isInsideOrb: false,
    isNearWindmill: false,
    permissionStatus: 'idle',
    source: 'mouse',
    lastPinchTime: 0,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const orbBoundsRef = useRef<DOMRect | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const hasTriggeredPinchRef = useRef<boolean>(false);
  const lastPinchTimestampRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const mediaPipeHandsRef = useRef<any>(null);

  // Set the orb boundary for hit detection
  const setOrbElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      orbBoundsRef.current = element.getBoundingClientRect();
    } else {
      orbBoundsRef.current = null;
    }
  }, []);

  // Update bounds on resize/scroll
  useEffect(() => {
    const handleResize = () => {
      const orbEl = document.getElementById('lumori-orb-target');
      if (orbEl) {
        orbBoundsRef.current = orbEl.getBoundingClientRect();
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, []);

  // Check if normalized or pixel coordinates hit the orb
  const checkInsideOrb = useCallback((clientX: number, clientY: number): boolean => {
    let rect = orbBoundsRef.current;
    if (!rect) {
      const el = document.getElementById('lumori-orb-target');
      if (el) {
        rect = el.getBoundingClientRect();
        orbBoundsRef.current = rect;
      }
    }
    if (!rect) return false;

    // Expand interactive region slightly for generous AR gesture targeting
    const margin = 28;
    return (
      clientX >= rect.left - margin &&
      clientX <= rect.right + margin &&
      clientY >= rect.top - margin &&
      clientY <= rect.bottom + margin
    );
  }, []);

  const checkNearWindmill = useCallback((clientX: number, clientY: number): boolean => {
    const normX = clientX / window.innerWidth;
    const normY = clientY / window.innerHeight;
    return normX >= 0.22 && normX <= 0.60 && normY >= 0.48 && normY <= 0.90;
  }, []);

  // Handle pinch gesture trigger with debounce & single activation
  const handlePinchAction = useCallback((isPinching: boolean, clientX: number, clientY: number) => {
    const now = Date.now();
    const isAtOrb = checkInsideOrb(clientX, clientY);

    if (isPinching) {
      if (!hasTriggeredPinchRef.current && now - lastPinchTimestampRef.current > 700) {
        hasTriggeredPinchRef.current = true;
        lastPinchTimestampRef.current = now;
        onPinchStart?.(clientX, clientY);

        if (isAtOrb) {
          onPinchAtOrb?.();
        }
      }
    } else {
      if (hasTriggeredPinchRef.current) {
        hasTriggeredPinchRef.current = false;
        onPinchEnd?.();
      }
    }
  }, [checkInsideOrb, onPinchAtOrb, onPinchStart, onPinchEnd]);

  // Mouse fallback handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const isInside = checkInsideOrb(e.clientX, e.clientY);
      const isNearMill = checkNearWindmill(e.clientX, e.clientY);
      setTrackingState((prev) => {
        if (prev.source === 'webcam' && prev.isActive) {
          return { ...prev, isInsideOrb: isInside, isNearWindmill: isNearMill };
        }
        return {
          ...prev,
          pinchX: e.clientX / window.innerWidth,
          pinchY: e.clientY / window.innerHeight,
          isInsideOrb: isInside,
          isNearWindmill: isNearMill,
          source: 'mouse',
        };
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Ignore clicks on debug panel or interactive buttons to avoid double triggering
      const target = e.target as HTMLElement;
      if (target?.closest?.('.no-gesture-trigger')) return;

      const isInside = checkInsideOrb(e.clientX, e.clientY);
      setTrackingState((prev) => ({
        ...prev,
        isPinching: true,
        pinchX: e.clientX / window.innerWidth,
        pinchY: e.clientY / window.innerHeight,
        isInsideOrb: isInside,
        lastPinchTime: Date.now(),
        source: 'mouse',
      }));

      handlePinchAction(true, e.clientX, e.clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setTrackingState((prev) => ({
        ...prev,
        isPinching: false,
      }));
      handlePinchAction(false, e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [checkInsideOrb, handlePinchAction]);

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

      // Initialize MediaPipe Hands if available, or initialize optical landmark processor
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
    }));
  }, []);

  const toggleCamera = useCallback(() => {
    if (trackingState.isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [trackingState.isActive, startCamera, stopCamera]);

  // Optical / MediaPipe Tracking engine
  const initializeTrackingEngine = useCallback(() => {
    // Attempt dynamic load of MediaPipe Hands
    const loadMediaPipe = async () => {
      if ((window as any).Hands) {
        setupMediaPipeInstance();
        return;
      }

      // Check if scripts already injected
      if (!document.getElementById('mediapipe-hands-script')) {
        const script = document.createElement('script');
        script.id = 'mediapipe-hands-script';
        script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          setupMediaPipeInstance();
        };
        script.onerror = () => {
          // Fallback to optical motion tracking if CDN unavailable
          startOpticalTrackingLoop();
        };
        document.head.appendChild(script);
      }
    };

    const setupMediaPipeInstance = () => {
      try {
        const Hands = (window as any).Hands;
        if (!Hands) {
          startOpticalTrackingLoop();
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

            // Mirrored X for natural user orientation
            const normX = 1 - (thumbTip.x + indexTip.x) / 2;
            const normY = (thumbTip.y + indexTip.y) / 2;

            const clientX = normX * window.innerWidth;
            const clientY = normY * window.innerHeight;

            // 3D Euclidean distance between thumb and index
            const dx = thumbTip.x - indexTip.x;
            const dy = thumbTip.y - indexTip.y;
            const dz = (thumbTip.z || 0) - (indexTip.z || 0);
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            const isPinching = dist < 0.085;
            const isInside = checkInsideOrb(clientX, clientY);
            const isNearMill = checkNearWindmill(clientX, clientY);

            setTrackingState((prev) => ({
              ...prev,
              isActive: true,
              isPinching,
              pinchX: normX,
              pinchY: normY,
              isInsideOrb: isInside,
              isNearWindmill: isNearMill,
              source: 'webcam',
            }));

            handlePinchAction(isPinching, clientX, clientY);
          }
        });

        mediaPipeHandsRef.current = hands;

        const processVideoFrame = async () => {
          if (videoRef.current && videoRef.current.readyState >= 2 && mediaPipeHandsRef.current) {
            try {
              await mediaPipeHandsRef.current.send({ image: videoRef.current });
            } catch {
              // Ignore transient frame errors
            }
          }
          if (streamRef.current) {
            animFrameRef.current = requestAnimationFrame(processVideoFrame);
          }
        };

        processVideoFrame();
      } catch (e) {
        console.warn('MediaPipe initialization fallback:', e);
        startOpticalTrackingLoop();
      }
    };

    // Offscreen Canvas optical tracking fallback
    const startOpticalTrackingLoop = () => {
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

          // Simple skin tone / high contrast motion detector
          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Basic skin tone heuristic
            if (r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
              const pixelIdx = i / 4;
              const px = pixelIdx % 160;
              const py = Math.floor(pixelIdx / 160);
              sumX += px;
              sumY += py;
              count++;
            }
          }

          if (count > 25) {
            // Mirror X
            const normX = 1 - (sumX / count) / 160;
            const normY = (sumY / count) / 120;
            const clientX = normX * window.innerWidth;
            const clientY = normY * window.innerHeight;
            const isInside = checkInsideOrb(clientX, clientY);

            setTrackingState((prev) => ({
              ...prev,
              pinchX: prev.pinchX * 0.7 + normX * 0.3, // smooth smoothing
              pinchY: prev.pinchY * 0.7 + normY * 0.3,
              isInsideOrb: isInside,
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
  }, [checkInsideOrb, handlePinchAction]);

  // Cleanup on unmount
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
    setOrbElement,
  };
}
