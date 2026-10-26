import React, { useState, useEffect } from 'react';
import { ExperienceState, isWindmillState } from '../types';
import { Lumi } from './Lumi';
import { soundEngine } from '../utils/audio';

interface WindmillFieldProps {
  state: ExperienceState;
  isNearWindmill: boolean;
  isWindmillRepaired: boolean;
  onUserInteract: () => void;
  className?: string;
}

export const WindmillField: React.FC<WindmillFieldProps> = ({
  state,
  isNearWindmill,
  isWindmillRepaired,
  onUserInteract,
  className = '',
}) => {
  // Phase tracker for 2B tool search (0: inspecting, 1: fetching tool from crate, 2: carrying to hub)
  const [repairPhase, setRepairPhase] = useState<number>(0);

  useEffect(() => {
    if (state === ExperienceState.STATE_2B_OBSERVATION) {
      setRepairPhase(0);
      const t1 = setTimeout(() => setRepairPhase(1), 1400); // Sakura walks to crate
      const t2 = setTimeout(() => setRepairPhase(2), 2800); // Sakura carries wrench to Lotus
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setRepairPhase(0);
    }
  }, [state]);

  const isStalled =
    !isWindmillRepaired &&
    (state === ExperienceState.STATE_2A_DISCOVERY ||
      state === ExperienceState.STATE_2B_OBSERVATION ||
      state === ExperienceState.STATE_2C_INVITATION);

  const isAccelerating =
    state === ExperienceState.STATE_2D_INTERACTION ||
    state === ExperienceState.STATE_2E_AUTONOMOUS;

  const isSpinning =
    isWindmillRepaired ||
    state === ExperienceState.STATE_2F_SUCCESS ||
    state === ExperienceState.STATE_2G_CLOSURE ||
    state === ExperienceState.STATE_2_ZOOM_OUT;

  const isInviting = state === ExperienceState.STATE_2C_INVITATION;
  const showFieldLumis = isWindmillState(state);

  const handleWindmillClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInviting || isStalled) {
      soundEngine.playChirp('happy');
      soundEngine.playWaterfallChime();
      onUserInteract();
    }
  };

  return (
    <div
      id="lumori-windmill-target"
      onClick={handleWindmillClick}
      className={`relative select-none transition-all duration-700 ${
        isInviting ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: 340, height: 260 }}
      title="Broken Windmill Field (Miro Storyboard)"
    >
      {/* Soft Daytime Shadow on Tabletop */}
      <div className="absolute bottom-2 inset-x-6 h-10 rounded-[50%] bg-stone-900/30 blur-md pointer-events-none" />

      {/* Miniature Grassy Field Base with Flowers & Fencing */}
      <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-gradient-to-b from-[#4A7C3A] via-[#3B662C] to-[#2B4E1F] border border-[#7CB364]/70 shadow-2xl p-2">
        {/* Sunlit Grassy Texture Speckles */}
        <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#bbf7d0_1px,transparent_1px)] [background-size:6px_6px]" />
        <div className="absolute -top-10 -left-10 w-52 h-52 bg-amber-200/25 rounded-full blur-2xl pointer-events-none" />

        {/* Miniature Wooden Split-Rail Fence in Background */}
        <div className="absolute top-10 inset-x-8 h-8 pointer-events-none flex justify-between items-center opacity-85">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div className="w-1.5 h-7 rounded-sm bg-[#8B5A2B] border-t border-[#CD853F]" />
              {i < 5 && (
                <div className="absolute top-2 left-1 w-12 h-1 bg-[#A0522D] -rotate-1 shadow-sm" />
              )}
            </div>
          ))}
        </div>

        {/* Miniature Tool Crate / Box beside the fence (Where Sakura searches for parts) */}
        <div className="absolute top-16 left-8 w-7 h-5 rounded bg-[#6D4C30] border border-[#8B5A2B] shadow-sm flex items-center justify-center">
          <div className="w-4 h-0.5 bg-[#4A321E]" />
        </div>

        {/* Miniature Wildflower Sprinkles (White Daisies & Lavender) */}
        <div className="absolute bottom-5 inset-x-6 flex justify-between pointer-events-none z-10">
          <span className="text-[10px] drop-shadow-sm">🌼</span>
          <span className="text-[9px] drop-shadow-sm">🌸</span>
          <span className="text-[11px] drop-shadow-sm">🌾</span>
          <span className="text-[9px] drop-shadow-sm">🌼</span>
          <span className="text-[10px] drop-shadow-sm">🌸</span>
        </div>

        {/* Floating Petals / Pollen in Success / Repaired State */}
        {(isSpinning || isAccelerating) && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-pink-300 shadow-[0_0_8px_#f472b6] animate-pulse"
                style={{
                  left: `${15 + ((i * 23) % 70)}%`,
                  top: `${20 + ((i * 17) % 60)}%`,
                  transform: `translate(${Math.sin(i) * 20}px, ${Math.cos(i) * 20}px)`,
                  transition: 'all 2s ease-in-out',
                }}
              />
            ))}
          </div>
        )}

        {/* ---------------- THE RUSTIC WOODEN WINDMILL ---------------- */}
        <div className="absolute left-[34%] bottom-6 z-20 flex flex-col items-center pointer-events-none">
          {/* Windmill Roof Cap */}
          <div className="relative w-16 h-12 flex flex-col items-center">
            {/* Cone Roof Shingles */}
            <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[24px] border-b-[#A0522D] drop-shadow-md" />
            <div className="w-12 h-2 bg-[#8B4513] rounded-b shadow" />

            {/* SHARED ROTOR ASSEMBLY & CONCENTRIC HUB - PERFECTLY CO-LOCATED PIVOT */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 flex items-center justify-center z-30">
              {/* The Four Rotating Blades */}
              <div
                className={`w-48 h-48 flex items-center justify-center origin-center pointer-events-none ${
                  isSpinning
                    ? 'animate-spin'
                    : isAccelerating
                    ? 'animate-spin-slow'
                    : 'rotate-12 transition-transform duration-500'
                }`}
                style={{
                  animationDuration: isSpinning ? '1.8s' : '5s',
                }}
              >
                <svg
                  viewBox="-80 -80 160 160"
                  className="w-full h-full overflow-visible drop-shadow-md"
                >
                  {[0, 90, 180, 270].map((deg) => (
                    <g key={deg} transform={`rotate(${deg})`}>
                      {/* Main Timber Spar */}
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="-72"
                        stroke="#8B4513"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Canvas & Lattice Vane */}
                      <path
                        d="M 2 -20 L 16 -24 L 16 -68 L 2 -68 Z"
                        fill="#FFFBEB"
                        stroke="#B45309"
                        strokeWidth="1.2"
                        opacity="0.95"
                      />
                      {/* Lattice Cross Grid */}
                      <line x1="2" y1="-32" x2="16" y2="-34" stroke="#B45309" strokeWidth="0.8" />
                      <line x1="2" y1="-44" x2="16" y2="-46" stroke="#B45309" strokeWidth="0.8" />
                      <line x1="2" y1="-56" x2="16" y2="-58" stroke="#B45309" strokeWidth="0.8" />
                    </g>
                  ))}
                </svg>
              </div>

              {/* Exact Concentric Center Axle Hub Cap */}
              <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 via-amber-700 to-amber-900 border-2 border-amber-300 shadow-md flex items-center justify-center pointer-events-none z-35">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-100" />
              </div>
            </div>
          </div>

          {/* Windmill Tower Body (Sunlit Timber Beams & Shingles) */}
          <div className="relative w-24 h-24 bg-gradient-to-b from-[#8B5A2B] via-[#704214] to-[#4A2E11] border-x-2 border-amber-600/60 shadow-xl flex flex-col items-center justify-between p-1.5 -mt-1 rounded-sm">
            {/* Upper Railing & Inspection Platform */}
            <div className="w-28 -mt-2 h-3.5 bg-[#5C3317] border-t border-b border-amber-400 rounded-sm shadow-md flex justify-around px-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-full bg-[#CD853F]" />
              ))}
            </div>

            {/* Little arched window with warm light inside */}
            <div className="w-5 h-7 rounded-t-full bg-amber-200/50 border border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)] flex items-center justify-center">
              <div className="w-1 h-full bg-amber-900/40" />
            </div>

            {/* Hanging Lantern (Glows warmly in success/closure) */}
            <div className="absolute top-6 -right-2 flex flex-col items-center">
              <div className="w-0.5 h-3 bg-stone-600" />
              <div
                className={`w-3 h-4 rounded-sm border border-amber-300 ${
                  isSpinning ? 'bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-pulse' : 'bg-stone-700'
                }`}
              />
            </div>

            {/* Small Wooden Access Ladder */}
            <div className="absolute bottom-1 -left-3 w-4 h-16 flex flex-col justify-around">
              <div className="w-full h-0.5 bg-amber-600" />
              <div className="w-full h-0.5 bg-amber-600" />
              <div className="w-full h-0.5 bg-amber-600" />
              <div className="w-full h-0.5 bg-amber-600" />
            </div>
          </div>

          {/* Stone Foundation Base */}
          <div className="w-28 h-4 rounded-b-lg bg-gradient-to-r from-stone-400 via-stone-300 to-stone-500 border-t border-stone-200 shadow-md" />
        </div>

        {/* ---------------- INVITATION AR VISUAL CUES (Storyboard Panel 3) ---------------- */}
        {isInviting && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
            {/* Rotating Arrow Ring around Hub */}
            <div className="absolute top-[32%] left-[43.5%] w-24 h-24 rounded-full border-2 border-dashed border-amber-300 animate-spin-slow pointer-events-none" />

            {/* Blowing & Waving Action Badge */}
            <div className="absolute top-2 right-4 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-400/80 shadow-2xl text-amber-200 text-xs flex items-center gap-2 animate-bounce">
              <span className="text-base">💨</span>
              <span className="font-semibold">Wave / Click to Blow Wind!</span>
            </div>
          </div>
        )}

        {/* ---------------- THE FOUR LUMORI IN THE FIELD (ONLY during Windmill States) ---------------- */}
        {showFieldLumis && (
          <>
            {/* 1. SPROUT LUMI (Blue) - Up on the windmill platform observing blades & steadying */}
            <div
              className="absolute z-25 transition-all duration-700"
              style={{
                left: '32%',
                top: isSpinning ? '24%' : '26%',
              }}
            >
              <Lumi
                type="sprout"
                size={46}
                mood={
                  isSpinning
                    ? 'dancing'
                    : isInviting
                    ? 'inviting'
                    : isAccelerating
                    ? 'happy'
                    : 'working'
                }
                emote={
                  state === ExperienceState.STATE_2A_DISCOVERY
                    ? '?'
                    : isInviting
                    ? '!'
                    : isSpinning
                    ? '♫'
                    : undefined
                }
              />
            </div>

            {/* 2. BELLFLOWER LUMI (Mint) - Pushing lower spar */}
            <div
              className="absolute z-25 transition-all duration-700"
              style={{
                left: isSpinning ? '64%' : '58%',
                bottom: isSpinning ? '24%' : '26%',
              }}
            >
              <Lumi
                type="bellflower"
                size={46}
                mood={
                  isSpinning
                    ? 'dancing'
                    : isInviting
                    ? 'inviting'
                    : isAccelerating
                    ? 'happy'
                    : 'working'
                }
                emote={
                  isInviting
                    ? '!'
                    : isSpinning
                    ? '♥'
                    : undefined
                }
              />
            </div>

            {/* 3. SAKURA LUMI (Pink) - Visibly finds tool in crate and carries it to Lotus! */}
            <div
              className="absolute z-25 transition-all duration-1000 ease-in-out"
              style={{
                left:
                  state === ExperienceState.STATE_2B_OBSERVATION
                    ? repairPhase === 1
                      ? '9%' // At the crate
                      : repairPhase === 2
                      ? '26%' // Carrying to Lotus
                      : '14%'
                    : isSpinning
                    ? '12%'
                    : '14%',
                bottom:
                  state === ExperienceState.STATE_2B_OBSERVATION && repairPhase === 1
                    ? '32%' // Standing up at crate
                    : '18%',
              }}
            >
              <Lumi
                type="sakura"
                size={44}
                toolHolding={
                  state === ExperienceState.STATE_2B_OBSERVATION && repairPhase >= 1
                    ? 'wrench'
                    : 'none'
                }
                mood={
                  isSpinning
                    ? 'happy'
                    : isInviting
                    ? 'inviting'
                    : isAccelerating
                    ? 'happy'
                    : repairPhase === 1
                    ? 'working'
                    : 'concerned'
                }
                emote={
                  state === ExperienceState.STATE_2B_OBSERVATION
                    ? repairPhase === 1
                      ? '?' // Inspecting crate
                      : '!' // Found wrench!
                    : isSpinning
                    ? '^.^'
                    : undefined
                }
              />
            </div>

            {/* 4. LOTUS LUMI (Purple) - Inspecting cog at base with wrench, tightening axle */}
            <div
              className="absolute z-25 transition-all duration-700"
              style={{
                left: isSpinning ? '44%' : '42%',
                bottom: '10%',
              }}
            >
              <Lumi
                type="lotus"
                size={46}
                toolHolding={
                  state === ExperienceState.STATE_2B_OBSERVATION ||
                  state === ExperienceState.STATE_2C_INVITATION ||
                  state === ExperienceState.STATE_2E_AUTONOMOUS
                    ? 'wrench'
                    : 'none'
                }
                mood={
                  isSpinning
                    ? state === ExperienceState.STATE_2G_CLOSURE || state === ExperienceState.STATE_2_ZOOM_OUT
                      ? 'resting'
                      : 'dancing'
                    : isAccelerating
                    ? 'happy'
                    : 'working'
                }
                emote={
                  isSpinning
                    ? '♫'
                    : state === ExperienceState.STATE_2B_OBSERVATION
                    ? '>_<'
                    : undefined
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
