import React from 'react';
import { ExperienceState, isWindmillState } from '../types';
import { Orb } from './Orb';
import { Lumi } from './Lumi';
import { WindmillField } from './WindmillField';
import { soundEngine } from '../utils/audio';

interface LivingRoomProps {
  state: ExperienceState;
  isPinching: boolean;
  isInsideOrb: boolean;
  isNearWindmill: boolean;
  moriRescued: boolean;
  freePlayPhase: number;
  onOrbClick: () => void;
  onWindmillInteract: () => void;
  onMoriRescue: () => void;
}

export const LivingRoom: React.FC<LivingRoomProps> = ({
  state,
  isPinching,
  isInsideOrb,
  isNearWindmill,
  moriRescued,
  freePlayPhase,
  onOrbClick,
  onWindmillInteract,
  onMoriRescue,
}) => {
  // Render roaming Lumis outside the windmill field
  const renderRoamingLumis = () => {
    // Hidden in State 0, State 7, or during the Windmill Field states (where they are within WindmillField)
    if (
      state === ExperienceState.STATE_0_DORMANT_ORB ||
      state === ExperienceState.STATE_7_LUMORI_IDLING ||
      isWindmillState(state)
    ) {
      return null;
    }

    // State 1: Emergence on shelf & walking to coffee table
    if (state === ExperienceState.STATE_1_EMERGENCE) {
      return (
        <>
          <div
            className="absolute transition-all duration-1000 ease-out z-20"
            style={{ left: '33%', top: '56%' }}
          >
            <Lumi type="sprout" mood="curious" size={52} emote="^.^" />
          </div>
          <div
            className="absolute transition-all duration-1000 ease-out z-20"
            style={{ left: '26%', top: '54%' }}
          >
            <Lumi type="bellflower" mood="curious" size={50} emote="?" />
          </div>
        </>
      );
    }

    // State 3: Sofa Adventure - Jump and stuck in cushion crevice
    if (state === ExperienceState.STATE_3_SOFA_ADVENTURE) {
      return (
        <>
          {/* Sprout Lumi on cushion looking at Bellflower */}
          <div
            className="absolute z-20 transition-all duration-500"
            style={{ left: '68%', top: '56%' }}
          >
            <Lumi type="sprout" mood="curious" size={54} emote="O.O" />
          </div>
          {/* Bellflower Lumi stuck in cushion crevice! */}
          <div
            className="absolute z-20 transition-all duration-500"
            style={{ left: '76%', top: '59%' }}
          >
            <Lumi type="bellflower" size={50} isStuck={true} emote="!" />
          </div>
        </>
      );
    }

    // State 4: Helping a Friend (rescue Bellflower Lumi)
    if (state === ExperienceState.STATE_4_HELPING_FRIEND) {
      return (
        <>
          {/* Sprout Lumi pulling or celebrating */}
          <div
            className="absolute z-20 transition-all duration-500"
            style={{ left: moriRescued ? '70%' : '71%', top: '57%' }}
          >
            <Lumi
              type="sprout"
              mood={moriRescued ? 'happy' : 'curious'}
              size={54}
              isHelping={!moriRescued}
              emote={moriRescued ? '♥' : '>_<'}
            />
          </div>
          {/* Bellflower Lumi stuck or happily rescued */}
          <div
            className="absolute z-20 transition-all duration-500 cursor-pointer"
            style={{ left: moriRescued ? '78%' : '76%', top: moriRescued ? '56%' : '59%' }}
            onClick={() => {
              if (!moriRescued) {
                soundEngine.playPop();
                onMoriRescue();
              }
            }}
          >
            <Lumi
              type="bellflower"
              mood={moriRescued ? 'happy' : 'idle'}
              size={50}
              isStuck={!moriRescued}
              emote={moriRescued ? '^.^' : '!'}
            />
          </div>
        </>
      );
    }

    // State 5: Free Play around the sofa
    if (state === ExperienceState.STATE_5_FREE_PLAY) {
      const positions = [
        {
          sprout: { left: '68%', top: '54%' },
          bellflower: { left: '78%', top: '55%' },
          sproutEmote: '♥',
          bellflowerEmote: '^.^',
        },
        {
          sprout: { left: '77%', top: '48%' },
          bellflower: { left: '69%', top: '57%' },
          sproutEmote: '♫',
          bellflowerEmote: '♫',
        },
        {
          sprout: { left: '73%', top: '56%' },
          bellflower: { left: '76%', top: '56%' },
          sproutEmote: '^.^',
          bellflowerEmote: '♥',
        },
        {
          sprout: { left: '66%', top: '55%' },
          bellflower: { left: '81%', top: '53%' },
          sproutEmote: '♫',
          bellflowerEmote: '^.^',
        },
      ];
      const cur = positions[freePlayPhase % positions.length];

      return (
        <>
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{ left: cur.sprout.left, top: cur.sprout.top }}
          >
            <Lumi type="sprout" mood="playful" size={54} emote={cur.sproutEmote} />
          </div>
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{ left: cur.bellflower.left, top: cur.bellflower.top }}
          >
            <Lumi type="bellflower" mood="playful" size={50} emote={cur.bellflowerEmote} />
          </div>
        </>
      );
    }

    // State 6: Returning to Orb
    if (state === ExperienceState.STATE_6_RETURN_TO_ORB) {
      return (
        <>
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{ left: '23%', top: '34%' }}
          >
            <Lumi type="sprout" mood="returning" size={46} emote="!" />
          </div>
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{ left: '17%', top: '35%' }}
          >
            <Lumi type="bellflower" mood="returning" size={44} emote="♫" />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full h-full min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-900 select-none font-sans">
      {/* 3D-Like Contemporary Living Room Interior */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#181a20] via-[#22252e] to-[#2a2c35]" />
        <div className="absolute -top-32 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-amber-100/10 via-amber-200/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Contemporary Hardwood Flooring */}
        <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-[#1b1c20] via-[#24262b] to-[#2b2d35] border-t border-white/5">
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] [background-size:140px_100%]" />
        </div>

        {/* Minimalist Area Rug */}
        <div className="absolute bottom-6 left-[18%] w-[72%] h-[34%] rounded-[48px] bg-gradient-to-tr from-stone-800/40 via-stone-700/25 to-stone-800/30 border border-stone-600/20 backdrop-blur-[1px] shadow-2xl" />
      </div>

      {/* ---------------- FURNITURE 1: FLOATING SHELF WITH ORB ---------------- */}
      <div className="absolute left-[12%] top-[24%] z-10">
        <div className="relative w-72 h-4 rounded-md bg-gradient-to-r from-amber-900/90 via-amber-800 to-amber-950 shadow-2xl border-t border-amber-600/40">
          <div className="absolute top-4 inset-x-0 h-3 rounded-b-md bg-stone-950/80 shadow-inner" />

          {/* Design Books on Shelf */}
          <div className="absolute -top-8 right-4 flex flex-col items-end gap-0.5">
            <div className="w-16 h-2.5 rounded-sm bg-stone-700 border-l-2 border-stone-400" />
            <div className="w-18 h-3 rounded-sm bg-stone-600 border-l-2 border-amber-300" />
            <div className="w-20 h-2.5 rounded-sm bg-stone-800 border-l-2 border-teal-400" />
          </div>

          {/* Miniature Potted Plant */}
          <div className="absolute -top-7 right-26 flex flex-col items-center">
            <div className="flex gap-0.5 -mb-1">
              <div className="w-2 h-4 rounded-full bg-emerald-600/90 rotate-[-15deg]" />
              <div className="w-2.5 h-4.5 rounded-full bg-teal-500/90" />
              <div className="w-2 h-4 rounded-full bg-emerald-600/90 rotate-[15deg]" />
            </div>
            <div className="w-5 h-4.5 rounded-b-md bg-stone-400 border border-stone-300 shadow-sm" />
          </div>

          {/* THE ORB (Mounted on shelf) */}
          <div className="absolute -top-38 left-6">
            <Orb
              state={state}
              isPinching={isPinching}
              isHoveredOrTargeted={isInsideOrb}
              onClick={onOrbClick}
              onCallHome={onOrbClick}
            />
          </div>
        </div>
      </div>

      {/* ---------------- FURNITURE 2: COFFEE TABLE WITH BROKEN WINDMILL FIELD ---------------- */}
      <div className="absolute left-[24%] bottom-[8%] z-10">
        {/* Tabletop Surface */}
        <div className="relative w-[400px] h-72 rounded-[42px] bg-gradient-to-b from-stone-700/80 via-stone-800/90 to-stone-900 shadow-2xl border border-stone-600/40 p-3">
          <div className="absolute inset-x-12 top-1 h-3 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* BROKEN WINDMILL FIELD (Storyboard 1-6) */}
          <div className="absolute left-6 top-3">
            <WindmillField
              state={state}
              isNearWindmill={isNearWindmill}
              onUserInteract={onWindmillInteract}
            />
          </div>
        </div>

        {/* Minimalist Table Legs */}
        <div className="absolute -bottom-6 left-12 w-2.5 h-7 bg-stone-900 rounded-b shadow-lg" />
        <div className="absolute -bottom-6 right-12 w-2.5 h-7 bg-stone-900 rounded-b shadow-lg" />
      </div>

      {/* ---------------- FURNITURE 3: CONTEMPORARY SOFA ---------------- */}
      <div className="absolute right-[6%] bottom-[12%] z-10">
        <div className="relative w-[380px] h-[220px]">
          <div className="absolute -bottom-3 inset-x-4 h-8 bg-black/40 blur-lg rounded-full" />

          {/* Sofa Backrest */}
          <div className="absolute top-0 inset-x-3 h-28 rounded-t-3xl bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 shadow-xl border-t border-stone-600/50 flex justify-around px-4 pt-3">
            <div className="w-36 h-20 rounded-2xl bg-stone-700/70 border border-stone-600/30 shadow-inner" />
            <div className="w-36 h-20 rounded-2xl bg-stone-700/70 border border-stone-600/30 shadow-inner" />
          </div>

          {/* Sofa Armrests */}
          <div className="absolute bottom-6 -left-3 w-10 h-32 rounded-3xl bg-gradient-to-b from-stone-600 to-stone-800 shadow-xl border border-stone-500/40" />
          <div className="absolute bottom-6 -right-3 w-10 h-32 rounded-3xl bg-gradient-to-b from-stone-600 to-stone-800 shadow-xl border border-stone-500/40" />

          {/* Cushions */}
          <div className="absolute bottom-4 inset-x-5 h-26 rounded-2xl bg-gradient-to-b from-stone-700 to-stone-800 shadow-2xl border border-stone-600/50 flex gap-1 p-1">
            <div className="flex-1 h-full rounded-xl bg-gradient-to-b from-stone-600 via-stone-700 to-stone-800 border-t border-stone-500/40 shadow-inner" />

            {/* Cushion Crevice */}
            <div className="relative w-3 h-full bg-stone-950/80 rounded shadow-inner">
              {state === ExperienceState.STATE_4_HELPING_FRIEND && !moriRescued && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-400/20 blur-[2px] animate-pulse pointer-events-none" />
              )}
            </div>

            <div className="flex-1 h-full rounded-xl bg-gradient-to-b from-stone-600 via-stone-700 to-stone-800 border-t border-stone-500/40 shadow-inner" />
          </div>
        </div>
      </div>

      {/* Roaming Lumis in other room states */}
      {renderRoamingLumis()}
    </div>
  );
};
