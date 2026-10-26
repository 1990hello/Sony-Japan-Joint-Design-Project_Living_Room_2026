import React, { useState, useEffect } from 'react';
import { ExperienceState, isWindmillState } from '../types';
import { soundEngine } from '../utils/audio';

interface OrbProps {
  state: ExperienceState;
  isPinching: boolean;
  isHoveredOrTargeted: boolean;
  onClick?: () => void;
  onCallHome?: () => void;
}

export const Orb: React.FC<OrbProps> = ({
  state,
  isPinching,
  isHoveredOrTargeted,
  onClick,
  onCallHome,
}) => {
  const isInsideWorld =
    state === ExperienceState.STATE_0_DORMANT_ORB ||
    state === ExperienceState.STATE_7_LUMORI_IDLING;

  const isTransitioningIn = state === ExperienceState.STATE_6_RETURN_TO_ORB;
  const isIdling = state === ExperienceState.STATE_7_LUMORI_IDLING;

  // Miniature idle behaviors inside Lumori during State 7
  const [miniActivity, setMiniActivity] = useState<number>(0);

  useEffect(() => {
    if (!isIdling) return;
    const interval = setInterval(() => {
      setMiniActivity((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(interval);
  }, [isIdling]);

  const handleClick = () => {
    soundEngine.playOrbResonance();
    onClick?.();
    if (state === ExperienceState.STATE_5_FREE_PLAY || state === ExperienceState.STATE_4_HELPING_FRIEND || isWindmillState(state)) {
      onCallHome?.();
    }
  };

  return (
    <div
      id="lumori-orb-target"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Lumori Orb on Shelf"
      className={`relative group cursor-pointer select-none transition-transform duration-500 rounded-full ${
        isHoveredOrTargeted ? 'scale-105' : 'hover:scale-[1.02]'
      }`}
      style={{
        width: 170,
        height: 170,
      }}
    >
      {/* Outer Atmospheric Aura */}
      <div
        className={`absolute -inset-6 rounded-full blur-xl pointer-events-none transition-all duration-700 ${
          isHoveredOrTargeted
            ? 'bg-amber-300/35 scale-110'
            : isInsideWorld
            ? 'bg-cyan-400/20'
            : 'bg-amber-400/15'
        }`}
      />

      {/* AR Interaction Ring on Hover/Pinch */}
      {(isHoveredOrTargeted || isPinching) && (
        <div className="absolute -inset-2.5 rounded-full border-2 border-dashed border-amber-300/80 animate-spin-slow pointer-events-none z-30" />
      )}

      {/* Glass Sphere Container */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border border-white/40 backdrop-blur-[2px] bg-gradient-to-b from-sky-900/40 via-slate-900/60 to-emerald-950/70">
        {/* Subtle Lumori Miniature World Background */}
        <div className="absolute inset-0">
          {/* Miniature Sky & Floating Stardust */}
          <div className="absolute inset-0 bg-radial from-cyan-900/50 via-slate-950/80 to-slate-950" />

          {/* Floating Bioluminescent Spores / Fireflies */}
          <div className="absolute top-6 left-8 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#38bdf8] animate-pulse" />
          <div
            className="absolute top-14 right-10 w-1 h-1 rounded-full bg-amber-300 shadow-[0_0_6px_#fde047] animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div
            className="absolute bottom-16 left-12 w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7] animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute top-20 left-16 w-1 h-1 rounded-full bg-teal-200 shadow-[0_0_5px_#99f6e4] animate-pulse"
            style={{ animationDelay: '1.5s' }}
          />

          {/* Miniature Lumori Island Landscape */}
          <div className="absolute bottom-2 inset-x-3 h-20 rounded-t-full bg-gradient-to-t from-emerald-950 via-teal-900/90 to-emerald-800/80 border-t border-emerald-500/40 shadow-inner">
            {/* Glowing Miniature Tree / Flora */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-14 pointer-events-none">
              {/* Trunk */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-6 bg-amber-950/80 rounded-t" />
              {/* Foliage */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-9 rounded-full bg-gradient-to-b from-cyan-400/80 to-emerald-600/90 shadow-[0_0_12px_rgba(79,227,193,0.5)]" />
              <div className="absolute top-2 left-3 w-4 h-4 rounded-full bg-amber-300/60 blur-[1px]" />
              <div className="absolute top-1 right-3 w-5 h-5 rounded-full bg-teal-300/70 blur-[1px]" />
            </div>

            {/* Miniature Crystal Waterfall inside Lumori */}
            <div className="absolute bottom-1 right-7 w-2 h-10 bg-gradient-to-b from-cyan-200/90 via-sky-300/60 to-transparent blur-[0.5px] rounded-full animate-pulse" />
          </div>

          {/* MINIATURE LUMIS INSIDE THE ORB */}
          {isInsideWorld && (
            <div className="absolute inset-0 pointer-events-none">
              {/* State 0: Subtle cozy resting silhouettes of all 4 Lumori */}
              {state === ExperienceState.STATE_0_DORMANT_ORB && (
                <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-2">
                  {/* Sprout sleeping curl */}
                  <div className="relative w-5 h-5 rounded-full bg-blue-400/80 shadow-[0_0_8px_#38bdf8] animate-pulse">
                    <div className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-400" />
                  </div>
                  {/* Bellflower resting curl */}
                  <div
                    className="relative w-5 h-5 rounded-full bg-teal-300/85 shadow-[0_0_8px_#2dd4bf] animate-pulse"
                    style={{ animationDelay: '0.5s' }}
                  >
                    <div className="absolute -top-1 left-1 w-1.5 h-1.5 rounded-full bg-cyan-200" />
                  </div>
                  {/* Sakura resting curl */}
                  <div
                    className="relative w-5 h-5 rounded-full bg-pink-400/85 shadow-[0_0_8px_#f472b6] animate-pulse"
                    style={{ animationDelay: '1s' }}
                  >
                    <div className="absolute -top-1 left-1 w-1.5 h-1.5 rounded-full bg-pink-200" />
                  </div>
                  {/* Lotus resting curl */}
                  <div
                    className="relative w-5 h-5 rounded-full bg-purple-400/85 shadow-[0_0_8px_#c084fc] animate-pulse"
                    style={{ animationDelay: '1.5s' }}
                  >
                    <div className="absolute -top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-300" />
                  </div>
                </div>
              )}

              {/* State 7: Active persistent living idling world (All 4 Lumori) */}
              {isIdling && (
                <div className="absolute bottom-6 inset-x-0 transition-all duration-700">
                  {miniActivity === 0 && (
                    <div className="flex items-center justify-center gap-2 animate-fade-in">
                      <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300 shadow-[0_0_10px_#60a5fa] flex items-center justify-center">
                        <span className="text-[7px] text-blue-950 font-bold select-none">^.^</span>
                      </div>
                      <div className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-teal-300 shadow-[0_0_10px_#2dd4bf] flex items-center justify-center">
                        <span className="text-[7px] text-teal-950 font-bold select-none">^.^</span>
                      </div>
                      <div className="relative w-5 h-5 rounded-full bg-gradient-to-tr from-pink-500 to-pink-300 shadow-[0_0_8px_#f472b6] flex items-center justify-center">
                        <span className="text-[6px] text-pink-950 font-bold">♥</span>
                      </div>
                      <div className="relative w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-purple-300 shadow-[0_0_8px_#c084fc] flex items-center justify-center">
                        <span className="text-[6px] text-purple-950 font-bold">♫</span>
                      </div>
                    </div>
                  )}

                  {miniActivity === 1 && (
                    <div className="flex items-center justify-around px-4 animate-fade-in">
                      <div className="relative w-5 h-5 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]">
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[7px]">♫</div>
                      </div>
                      <div className="relative w-6 h-6 rounded-full bg-blue-400 shadow-[0_0_10px_#38bdf8] flex items-center justify-center">
                        <span className="text-[7px] text-blue-950 font-bold">♥</span>
                      </div>
                      <div className="relative w-5 h-5 rounded-full bg-teal-300 shadow-[0_0_8px_#5eead4] flex items-center justify-center">
                        <span className="text-[7px] text-teal-900 font-bold">^.^</span>
                      </div>
                      <div className="relative w-5 h-5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                    </div>
                  )}

                  {miniActivity === 2 && (
                    <div className="flex items-center justify-center gap-2 animate-fade-in">
                      <div className="relative w-6 h-6 rounded-full bg-blue-300 shadow-[0_0_12px_#93c5fd] animate-bounce">
                        <div className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-blue-950" />
                      </div>
                      <div className="relative w-5 h-5 rounded-full bg-teal-400 shadow-[0_0_8px_#14b8a6]">
                        <div className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-teal-950" />
                      </div>
                      <div className="relative w-5 h-5 rounded-full bg-pink-300 shadow-[0_0_8px_#f9a8d4] animate-bounce" style={{ animationDelay: '0.3s' }}>
                        <div className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-pink-950" />
                      </div>
                    </div>
                  )}

                  {miniActivity === 3 && (
                    <div className="flex items-center justify-center gap-1.5 animate-fade-in">
                      <div className="relative w-5 h-4.5 rounded-full bg-blue-400/90 shadow-[0_0_6px_#3b82f6]" />
                      <div className="relative w-5 h-4.5 rounded-full bg-teal-300/90 shadow-[0_0_6px_#0d9488]" />
                      <div className="relative w-4.5 h-4 rounded-full bg-pink-300/90 shadow-[0_0_6px_#db2777]" />
                      <div className="relative w-4.5 h-4 rounded-full bg-purple-400/90 shadow-[0_0_6px_#7c3aed]" />
                      <span className="text-[8px] text-cyan-200/80 animate-pulse ml-0.5">zZ</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Entering transition shimmer */}
          {isTransitioningIn && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-300/40 animate-ping" />
            </div>
          )}
        </div>

        {/* Realistic Glass Curved Reflections & Highlights */}
        {/* Top-left sharp specular crescent */}
        <div className="absolute -top-3 -left-3 w-28 h-20 rounded-full bg-gradient-to-br from-white/60 via-white/20 to-transparent rotate-[-25deg] pointer-events-none" />
        {/* Secondary lower reflection */}
        <div className="absolute bottom-2 right-4 w-16 h-8 rounded-full bg-gradient-to-t from-white/25 to-transparent rotate-[15deg] pointer-events-none" />
        {/* Glass border rim shine */}
        <div className="absolute inset-0 rounded-full border border-white/30 pointer-events-none" />
      </div>

      {/* Physical Stand / Brass Shelf Pedestal */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-6 pointer-events-none">
        {/* Curved metal collar */}
        <div className="w-full h-3 rounded-full bg-gradient-to-r from-stone-400 via-amber-200 to-stone-500 shadow-md border-t border-amber-100/50" />
        {/* Flanged base */}
        <div className="w-32 -ml-2 h-3 rounded-b-lg bg-gradient-to-r from-stone-600 via-amber-700/60 to-stone-700 shadow-lg" />
      </div>

      {/* Floating AR Tag when Hovered or in Free Play */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="text-[11px] font-medium tracking-wide text-amber-200 bg-slate-900/85 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-amber-400/30 shadow-lg">
          {state === ExperienceState.STATE_5_FREE_PLAY ? 'Pinch/Click to Call Home' : 'Lumori Orb'}
        </span>
      </div>
    </div>
  );
};
