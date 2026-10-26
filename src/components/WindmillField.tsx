import React from 'react';
import { ExperienceState } from '../types';
import { Lumi } from './Lumi';
import { soundEngine } from '../utils/audio';

interface WindmillFieldProps {
  state: ExperienceState;
  isNearWindmill: boolean;
  onUserInteract: () => void;
  className?: string;
}

export const WindmillField: React.FC<WindmillFieldProps> = ({
  state,
  isNearWindmill,
  onUserInteract,
  className = '',
}) => {
  const isStalled =
    state === ExperienceState.STATE_2A_DISCOVERY ||
    state === ExperienceState.STATE_2B_OBSERVATION ||
    state === ExperienceState.STATE_2C_INVITATION;

  const isAccelerating =
    state === ExperienceState.STATE_2D_INTERACTION ||
    state === ExperienceState.STATE_2E_AUTONOMOUS;

  const isSpinningSmoothly =
    state === ExperienceState.STATE_2F_SUCCESS ||
    state === ExperienceState.STATE_2G_CLOSURE;

  const isInviting = state === ExperienceState.STATE_2C_INVITATION;

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
      onClick={handleWindmillClick}
      className={`relative select-none transition-all duration-700 ${
        isInviting ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: 340, height: 260 }}
      title="Broken Windmill Field (Miro Storyboard)"
    >
      {/* Ground Shadow on Tabletop */}
      <div className="absolute bottom-2 inset-x-6 h-12 rounded-[50%] bg-black/35 blur-lg pointer-events-none" />

      {/* Miniature Grassy Field Base with Flowers & Fencing */}
      <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-gradient-to-b from-[#2E5A27] via-[#24481F] to-[#173214] border border-[#528A46]/60 shadow-2xl p-2">
        {/* Grassy Texture Speckles & Sunlight Rays */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#86efac_1px,transparent_1px)] [background-size:6px_6px]" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-300/15 rounded-full blur-2xl pointer-events-none" />

        {/* Miniature Wooden Split-Rail Fence in Background */}
        <div className="absolute top-10 inset-x-8 h-8 pointer-events-none flex justify-between items-center opacity-75">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div className="w-1.5 h-7 rounded-sm bg-amber-950 border-t border-amber-700" />
              {i < 5 && (
                <div className="absolute top-2 left-1 w-12 h-1 bg-amber-900 -rotate-1 shadow-sm" />
              )}
            </div>
          ))}
        </div>

        {/* Miniature Wildflower Sprinkles (White Daisies & Lavender) */}
        <div className="absolute bottom-5 inset-x-6 flex justify-between pointer-events-none z-10">
          <span className="text-[10px] animate-pulse">🌼</span>
          <span className="text-[9px] animate-pulse" style={{ animationDelay: '0.4s' }}>🌸</span>
          <span className="text-[11px] animate-pulse" style={{ animationDelay: '1.2s' }}>🌾</span>
          <span className="text-[9px] animate-pulse" style={{ animationDelay: '0.8s' }}>🌼</span>
          <span className="text-[10px] animate-pulse" style={{ animationDelay: '1.5s' }}>🌸</span>
        </div>

        {/* Floating Petals / Pollen in Success / Closure State */}
        {(isSpinningSmoothly || isAccelerating) && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-pink-300/80 shadow-[0_0_6px_#f472b6] animate-pulse"
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
          {/* Windmill Roof Cap & Axle Hub */}
          <div className="relative w-16 h-12 flex flex-col items-center">
            {/* Cone Roof Shingles */}
            <div className="w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[24px] border-b-amber-900 drop-shadow-md" />
            <div className="w-12 h-2 bg-amber-950 rounded-b shadow" />

            {/* Axle Center Hub */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950 border-2 border-amber-400 shadow-md flex items-center justify-center z-30">
              <div className="w-2 h-2 rounded-full bg-amber-200" />
            </div>

            {/* THE FOUR WINDMILL BLADES (Animated) */}
            <div
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-48 -ml-24 -mt-24 pointer-events-none z-20 origin-center ${
                isSpinningSmoothly
                  ? 'animate-spin'
                  : isAccelerating
                  ? 'animate-spin-slow'
                  : 'rotate-12 transition-transform duration-500'
              }`}
              style={{
                animationDuration: isSpinningSmoothly ? '1.8s' : '5s',
              }}
            >
              <svg viewBox="-80 -80 160 160" className="w-full h-full overflow-visible drop-shadow-md">
                {[0, 90, 180, 270].map((deg) => (
                  <g key={deg} transform={`rotate(${deg})`}>
                    {/* Main Timber Spar */}
                    <line x1="0" y1="0" x2="0" y2="-72" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
                    {/* Canvas & Lattice Vane */}
                    <path
                      d="M 2 -20 L 16 -24 L 16 -68 L 2 -68 Z"
                      fill="#FEF3C7"
                      stroke="#92400E"
                      strokeWidth="1.2"
                      opacity="0.9"
                    />
                    {/* Lattice Cross Grid */}
                    <line x1="2" y1="-32" x2="16" y2="-34" stroke="#92400E" strokeWidth="0.8" />
                    <line x1="2" y1="-44" x2="16" y2="-46" stroke="#92400E" strokeWidth="0.8" />
                    <line x1="2" y1="-56" x2="16" y2="-58" stroke="#92400E" strokeWidth="0.8" />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Windmill Tower Body (Timber Beams & Shingles) */}
          <div className="relative w-24 h-24 bg-gradient-to-b from-[#5c3a21] via-[#452b19] to-[#2e1c10] border-x-2 border-amber-800/80 shadow-2xl flex flex-col items-center justify-between p-1.5 -mt-1 rounded-sm">
            {/* Upper Railing & Inspection Platform (Where Sprout stands) */}
            <div className="w-28 -mt-2 h-3.5 bg-amber-950 border-t border-b border-amber-600 rounded-sm shadow-md flex justify-around px-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-full bg-amber-800" />
              ))}
            </div>

            {/* Little arched window with warm light inside */}
            <div className="w-5 h-7 rounded-t-full bg-amber-300/30 border border-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.3)] flex items-center justify-center">
              <div className="w-1 h-full bg-amber-900/60" />
            </div>

            {/* Hanging Lantern (Glows warmly in success/closure) */}
            <div className="absolute top-6 -right-2 flex flex-col items-center">
              <div className="w-0.5 h-3 bg-stone-700" />
              <div
                className={`w-3 h-4 rounded-sm border border-amber-300 ${
                  isSpinningSmoothly ? 'bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-pulse' : 'bg-stone-800'
                }`}
              />
            </div>

            {/* Small Wooden Access Ladder */}
            <div className="absolute bottom-1 -left-3 w-4 h-16 flex flex-col justify-around">
              <div className="w-full h-0.5 bg-amber-700" />
              <div className="w-full h-0.5 bg-amber-700" />
              <div className="w-full h-0.5 bg-amber-700" />
              <div className="w-full h-0.5 bg-amber-700" />
            </div>
          </div>

          {/* Stone Foundation Base */}
          <div className="w-28 h-4 rounded-b-lg bg-gradient-to-r from-stone-600 via-stone-500 to-stone-700 border-t border-stone-400 shadow-lg" />
        </div>

        {/* ---------------- INVITATION AR VISUAL CUES (Storyboard Panel 3) ---------------- */}
        {isInviting && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
            {/* Rotating Arrow Ring around Hub */}
            <div className="absolute top-[32%] left-[43.5%] w-24 h-24 rounded-full border-2 border-dashed border-amber-300/90 animate-spin-slow pointer-events-none" />

            {/* Blowing & Waving Action Badge */}
            <div className="absolute top-2 right-4 px-3 py-1.5 rounded-xl bg-slate-950/90 border border-amber-400/70 shadow-2xl text-amber-200 text-xs flex items-center gap-2 animate-bounce">
              <span className="text-base">💨</span>
              <span className="font-semibold">Wave / Click to Blow Wind!</span>
            </div>
          </div>
        )}

        {/* ---------------- THE FOUR LUMORI IN THE FIELD (Storyboard 1-6) ---------------- */}

        {/* 1. SPROUT LUMI (Blue) - Up on the windmill platform observing blades */}
        <div
          className="absolute z-25 transition-all duration-700"
          style={{
            left: '32%',
            top: isSpinningSmoothly ? '24%' : '26%',
          }}
        >
          <Lumi
            type="sprout"
            size={46}
            mood={
              isSpinningSmoothly
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
                : isSpinningSmoothly
                ? '♫'
                : undefined
            }
          />
        </div>

        {/* 2. BELLFLOWER LUMI (Mint) - Pushing lower blade */}
        <div
          className="absolute z-25 transition-all duration-700"
          style={{
            left: isSpinningSmoothly ? '64%' : '58%',
            bottom: isSpinningSmoothly ? '24%' : '26%',
          }}
        >
          <Lumi
            type="bellflower"
            size={46}
            mood={
              isSpinningSmoothly
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
                : isSpinningSmoothly
                ? '♥'
                : undefined
            }
          />
        </div>

        {/* 3. SAKURA LUMI (Pink) - Beside toolbox / resting on crate */}
        <div
          className="absolute z-25 transition-all duration-700"
          style={{
            left: '12%',
            bottom: '18%',
          }}
        >
          <Lumi
            type="sakura"
            size={44}
            toolHolding={
              state === ExperienceState.STATE_2B_OBSERVATION || state === ExperienceState.STATE_2A_DISCOVERY
                ? 'crate'
                : 'none'
            }
            mood={
              isSpinningSmoothly
                ? 'happy'
                : isInviting
                ? 'inviting'
                : isAccelerating
                ? 'happy'
                : 'concerned'
            }
            emote={
              state === ExperienceState.STATE_2B_OBSERVATION
                ? '!'
                : isSpinningSmoothly
                ? '^.^'
                : undefined
            }
          />
        </div>

        {/* 4. LOTUS LUMI (Purple) - Inspecting cog at base / resting peacefully */}
        <div
          className="absolute z-25 transition-all duration-700"
          style={{
            left: isSpinningSmoothly ? '44%' : '42%',
            bottom: '10%',
          }}
        >
          <Lumi
            type="lotus"
            size={46}
            toolHolding={
              state === ExperienceState.STATE_2B_OBSERVATION ? 'wrench' : 'none'
            }
            mood={
              isSpinningSmoothly
                ? state === ExperienceState.STATE_2G_CLOSURE
                  ? 'resting'
                  : 'dancing'
                : isAccelerating
                ? 'happy'
                : 'working'
            }
            emote={
              isSpinningSmoothly
                ? '♫'
                : state === ExperienceState.STATE_2B_OBSERVATION
                ? '>_<'
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};
