import React, { useState, useEffect } from 'react';
import { ExperienceState, isWindmillState, isWindmillZoomed } from '../types';
import { Orb } from './Orb';
import { Lumi } from './Lumi';
import { WindmillField } from './WindmillField';
import { soundEngine } from '../utils/audio';

interface LivingRoomProps {
  state: ExperienceState;
  isPinching: boolean;
  isInsideOrb: boolean;
  isNearWindmill: boolean;
  isWindmillRepaired: boolean;
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
  isWindmillRepaired,
  moriRescued,
  freePlayPhase,
  onOrbClick,
  onWindmillInteract,
  onMoriRescue,
}) => {
  // Emergence phase tracker for State 1 (0: emerging on shelf, 1: travelling down to table)
  const [emergencePhase, setEmergencePhase] = useState<number>(0);

  // Camera zoom check: Zooms smoothly into coffee table during States 2A-2G, smoothly zooms out in 2_ZOOM_OUT
  const isZoomed = isWindmillZoomed(state);

  useEffect(() => {
    if (state === ExperienceState.STATE_1_EMERGENCE) {
      setEmergencePhase(0);
      const timer = setTimeout(() => {
        setEmergencePhase(1);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      setEmergencePhase(0);
    }
  }, [state]);

  // Render roaming Lumis strictly outside the windmill field
  const renderRoamingLumis = () => {
    // ZERO Lumis outside in State 0 (Dormant) and State 7 (Lumori Idling)!
    // ZERO roaming Lumis during Windmill Field states (they are exclusively inside WindmillField)!
    if (
      state === ExperienceState.STATE_0_DORMANT_ORB ||
      state === ExperienceState.STATE_7_LUMORI_IDLING ||
      isWindmillState(state)
    ) {
      return null;
    }

    // State 1: Visible emergence from the Orb onto the shelf, then travelling to coffee table
    if (state === ExperienceState.STATE_1_EMERGENCE) {
      if (emergencePhase === 0) {
        // Phase 1A: Visibly emerging from the orb opening onto the floating shelf
        return (
          <>
            {/* Sprout Lumi stepping onto shelf */}
            <div
              className="absolute z-20 transition-all duration-700 ease-out"
              style={{ left: '16%', top: '22%' }}
            >
              <Lumi type="sprout" mood="curious" size={48} emote="^.^" />
            </div>
            {/* Bellflower Lumi stepping out right beside */}
            <div
              className="absolute z-20 transition-all duration-700 ease-out"
              style={{ left: '21%', top: '22%' }}
            >
              <Lumi type="bellflower" mood="curious" size={46} emote="♥" />
            </div>
            {/* Sakura Lumi peeking out */}
            <div
              className="absolute z-20 transition-all duration-700 ease-out"
              style={{ left: '12%', top: '23%' }}
            >
              <Lumi type="sakura" mood="curious" size={42} emote="!" />
            </div>
            {/* Lotus Lumi stepping down */}
            <div
              className="absolute z-20 transition-all duration-700 ease-out"
              style={{ left: '25%', top: '23%' }}
            >
              <Lumi type="lotus" mood="curious" size={44} emote="♫" />
            </div>
          </>
        );
      } else {
        // Phase 1B: Travelling down from the shelf across the room towards the coffee table
        return (
          <>
            <div
              className="absolute z-20 transition-all duration-1000 ease-in-out"
              style={{ left: '32%', top: '56%' }}
            >
              <Lumi type="sprout" mood="curious" size={48} emote="^.^" />
            </div>
            <div
              className="absolute z-20 transition-all duration-1000 ease-in-out"
              style={{ left: '26%', top: '55%' }}
            >
              <Lumi type="bellflower" mood="curious" size={46} emote="?" />
            </div>
            <div
              className="absolute z-20 transition-all duration-1000 ease-in-out"
              style={{ left: '22%', top: '53%' }}
            >
              <Lumi type="sakura" mood="curious" size={42} emote="♫" />
            </div>
            <div
              className="absolute z-20 transition-all duration-1000 ease-in-out"
              style={{ left: '36%', top: '57%' }}
            >
              <Lumi type="lotus" mood="curious" size={44} emote="♥" />
            </div>
          </>
        );
      }
    }

    // State 3: Sofa Adventure - Jump and stuck in seat-cushion crevice
    if (state === ExperienceState.STATE_3_SOFA_ADVENTURE) {
      return (
        <>
          {/* Sprout Lumi landed safely on left seat cushion looking over with surprise */}
          <div
            className="absolute z-20 transition-all duration-700 ease-out"
            style={{ left: '69%', top: '71.5%' }}
          >
            <Lumi type="sprout" mood="curious" size={54} emote="O.O" />
          </div>
          {/* Bellflower Lumi jumped from headrest and fell stuck in the seat-cushion crevice! */}
          <div
            className="absolute z-20 transition-all duration-700 ease-out cursor-pointer"
            style={{ left: '76.8%', top: '73.5%' }}
            onClick={() => {
              soundEngine.playPop();
              onMoriRescue();
            }}
            title="Help Bellflower!"
          >
            <Lumi type="bellflower" size={50} isStuck={true} emote="!" />
          </div>
          {/* Sakura & Lotus resting contentedly on the coffee table beside the spinning mill */}
          <div className="absolute z-15" style={{ left: '28%', top: '64%' }}>
            <Lumi type="sakura" size={42} mood="resting" emote="♥" />
          </div>
          <div className="absolute z-15" style={{ left: '48%', top: '65%' }}>
            <Lumi type="lotus" size={42} mood="resting" />
          </div>
        </>
      );
    }

    // State 4: Helping a Friend (rescue Bellflower Lumi from seat-cushion gap)
    if (state === ExperienceState.STATE_4_HELPING_FRIEND) {
      return (
        <>
          {/* Sprout Lumi on left seat cushion leaning over to pull Bellflower */}
          <div
            className="absolute z-20 transition-all duration-500 ease-out"
            style={{ left: moriRescued ? '71%' : '72%', top: '71.5%' }}
          >
            <Lumi
              type="sprout"
              mood={moriRescued ? 'happy' : 'helping'}
              size={54}
              isHelping={!moriRescued}
              emote={moriRescued ? '♥' : '>_<'}
            />
          </div>
          {/* Bellflower Lumi stuck in cushion crevice with kicking feet */}
          <div
            className="absolute z-20 transition-all duration-500 cursor-pointer"
            style={{ left: moriRescued ? '78%' : '76.8%', top: moriRescued ? '71%' : '73.5%' }}
            onClick={() => {
              if (!moriRescued) {
                soundEngine.playPop();
                onMoriRescue();
              }
            }}
            title="Pull Bellflower out of the cushion"
          >
            <Lumi
              type="bellflower"
              mood={moriRescued ? 'happy' : 'stuck'}
              size={50}
              isStuck={!moriRescued}
              emote={moriRescued ? '^.^' : '!'}
            />
          </div>
          {/* Sakura & Lotus on coffee table */}
          <div className="absolute z-15" style={{ left: '28%', top: '64%' }}>
            <Lumi type="sakura" size={42} mood="resting" emote="♥" />
          </div>
          <div className="absolute z-15" style={{ left: '48%', top: '65%' }}>
            <Lumi type="lotus" size={42} mood="resting" />
          </div>
        </>
      );
    }

    // State 4B: Rescued Reunion & Celebration (Autonomous progression to State 5)
    if (state === ExperienceState.STATE_4B_RESCUED_REUNION) {
      return (
        <>
          {/* Sprout celebrating on left cushion */}
          <div
            className="absolute z-20 transition-all duration-700 ease-out"
            style={{ left: '70%', top: '71.5%' }}
          >
            <Lumi type="sprout" mood="happy" size={54} emote="♥" />
          </div>
          {/* Bellflower safely emerged, sitting happily on right cushion */}
          <div
            className="absolute z-20 transition-all duration-700 ease-out"
            style={{ left: '78%', top: '71.5%' }}
          >
            <Lumi type="bellflower" mood="happy" size={50} emote="^.^" />
          </div>
          {/* Floating celebratory sparkle */}
          <div className="absolute left-[74%] top-[67%] z-25 pointer-events-none text-amber-400 text-lg animate-bounce">
            ✨
          </div>
          {/* Sakura & Lotus on coffee table */}
          <div className="absolute z-15" style={{ left: '28%', top: '64%' }}>
            <Lumi type="sakura" size={42} mood="happy" emote="♫" />
          </div>
          <div className="absolute z-15" style={{ left: '48%', top: '65%' }}>
            <Lumi type="lotus" size={42} mood="happy" emote="♥" />
          </div>
        </>
      );
    }

    // State 5: Free Play around the sofa cushions and armrest
    if (state === ExperienceState.STATE_5_FREE_PLAY) {
      const positions = [
        {
          sprout: { left: '69%', top: '71.5%' },
          bellflower: { left: '79%', top: '71.5%' },
          sproutEmote: '♥',
          bellflowerEmote: '^.^',
        },
        {
          sprout: { left: '63%', top: '65%' }, // On armrest
          bellflower: { left: '75%', top: '71.5%' },
          sproutEmote: '♫',
          bellflowerEmote: '♫',
        },
        {
          sprout: { left: '71%', top: '56%' }, // On back cushion
          bellflower: { left: '78%', top: '71.5%' },
          sproutEmote: '^.^',
          bellflowerEmote: '♥',
        },
        {
          sprout: { left: '71%', top: '71.5%' },
          bellflower: { left: '77%', top: '71.5%' },
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
          <div className="absolute z-15" style={{ left: '28%', top: '64%' }}>
            <Lumi type="sakura" size={42} mood="happy" emote="♫" />
          </div>
          <div className="absolute z-15" style={{ left: '48%', top: '65%' }}>
            <Lumi type="lotus" size={42} mood="happy" emote="♥" />
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
            style={{ left: '22%', top: '25%' }}
          >
            <Lumi type="sprout" mood="returning" size={44} emote="!" />
          </div>
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{ left: '17%', top: '24%' }}
          >
            <Lumi type="bellflower" mood="returning" size={42} emote="♫" />
          </div>
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{ left: '25%', top: '28%' }}
          >
            <Lumi type="sakura" mood="returning" size={40} emote="♥" />
          </div>
          <div
            className="absolute z-20 transition-all duration-1000 ease-in-out"
            style={{ left: '13%', top: '27%' }}
          >
            <Lumi type="lotus" mood="returning" size={40} emote="♫" />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="relative w-full h-full min-h-[640px] flex items-center justify-center overflow-hidden bg-[#FAF8F5] select-none font-sans">
      {/* ---------------- BRIGHT, WARM SCANDINAVIAN LIVING ROOM BACKGROUND ---------------- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm Ivory / Off-White Wall */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] via-[#F8F5EE] to-[#EFE8DC]" />

        {/* Soft Natural Daylight Window Sunbeams */}
        <div className="absolute -top-32 -left-20 w-[700px] h-[700px] bg-gradient-to-br from-amber-100/50 via-orange-50/25 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-amber-50/40 via-yellow-50/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Pale Natural Oak Flooring (Kept light and warm) */}
        <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-[#E2D6C0] via-[#ECE3D2] to-[#F5EEE0] border-t border-[#DFD3BD]">
          {/* Subtle Blond Wood Planks Perspective Lines */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(90deg,transparent_0%,rgba(160,130,90,0.18)_50%,transparent_100%)] [background-size:140px_100%]" />
        </div>

        {/* Soft Light Cream / Oatmeal Area Rug */}
        <div className="absolute bottom-6 left-[18%] w-[72%] h-[34%] rounded-[48px] bg-gradient-to-tr from-[#FAF6EE] via-[#FDFBF6] to-[#F5EFE4] border border-[#E8DEC9] backdrop-blur-[1px] shadow-lg" />
      </div>

      {/* ---------------- CAMERA ZOOM STAGE (Smooth zoom into coffee table in States 2A-2G, pulls back in 2_ZOOM_OUT) ---------------- */}
      <div
        className="absolute inset-0 transition-transform duration-[1400ms] ease-in-out will-change-transform pointer-events-auto"
        style={{
          transform: isZoomed ? 'scale(2.05)' : 'scale(1)',
          transformOrigin: '38% 74%',
        }}
      >
        {/* ---------------- FURNITURE 1: LIGHT OAK FLOATING SHELF WITH ORB ---------------- */}
        <div className="absolute left-[12%] top-[24%] z-10">
          <div className="relative w-72 h-4 rounded-md bg-gradient-to-r from-[#DFD2BC] via-[#EAE1CF] to-[#D5C6AC] shadow-md border-t border-white/60">
            <div className="absolute top-4 inset-x-0 h-3 rounded-b-md bg-[#C5B499]/60 shadow-inner" />

            {/* Design Books on Shelf (Pastel & Light Naturals) */}
            <div className="absolute -top-8 right-4 flex flex-col items-end gap-0.5">
              <div className="w-16 h-2.5 rounded-sm bg-[#D8E2DC] border-l-2 border-[#9DBEB9]" />
              <div className="w-18 h-3 rounded-sm bg-[#FFE5D9] border-l-2 border-[#FFCAD4]" />
              <div className="w-20 h-2.5 rounded-sm bg-[#F4ACB7] border-l-2 border-[#E5989B]" />
            </div>

            {/* Miniature Potted Plant in White Ceramic */}
            <div className="absolute -top-7 right-26 flex flex-col items-center">
              <div className="flex gap-0.5 -mb-1">
                <div className="w-2 h-4 rounded-full bg-emerald-500/90 rotate-[-15deg]" />
                <div className="w-2.5 h-4.5 rounded-full bg-teal-400/90" />
                <div className="w-2 h-4 rounded-full bg-emerald-500/90 rotate-[15deg]" />
              </div>
              <div className="w-5 h-4.5 rounded-b-md bg-[#FAF8F5] border border-stone-200 shadow-sm" />
            </div>

            {/* THE ORB (Mounted on shelf with explicit target ID) */}
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

        {/* ---------------- FURNITURE 2: MEDIUM WALNUT / SMOKED-OAK COFFEE TABLE WITH WINDMILL FIELD ---------------- */}
        <div className="absolute left-[24%] bottom-[8%] z-10">
          {/* Tabletop Surface (Darkened to rich medium walnut / smoked-oak wood) */}
          <div className="relative w-[400px] h-72 rounded-[42px] bg-gradient-to-b from-[#6D5340] via-[#5C4332] to-[#4A3425] shadow-2xl border border-[#3E2B1E] p-3">
            {/* Subtle warm amber grain highlight */}
            <div className="absolute inset-x-12 top-1.5 h-2.5 rounded-full bg-gradient-to-r from-transparent via-amber-200/15 to-transparent pointer-events-none" />

            {/* BROKEN WINDMILL FIELD (Storyboard 1-6) */}
            <div className="absolute left-6 top-3">
              <WindmillField
                state={state}
                isNearWindmill={isNearWindmill}
                isWindmillRepaired={isWindmillRepaired}
                onUserInteract={onWindmillInteract}
              />
            </div>
          </div>

          {/* Medium Walnut Table Legs */}
          <div className="absolute -bottom-6 left-12 w-3 h-7 bg-[#422D1F] rounded-b shadow-md border-r border-[#302015]" />
          <div className="absolute -bottom-6 right-12 w-3 h-7 bg-[#422D1F] rounded-b shadow-md border-r border-[#302015]" />
        </div>

        {/* ---------------- FURNITURE 3: MEDIUM WARM TAUPE / GREIGE SOFA ---------------- */}
        <div className="absolute right-[6%] bottom-[12%] z-10">
          <div className="relative w-[380px] h-[220px]">
            {/* Soft Ambient Floor Shadow */}
            <div className="absolute -bottom-4 inset-x-4 h-9 bg-stone-700/20 blur-xl rounded-full" />

            {/* Sofa Backrest (Darkened to medium warm taupe / greige fabric) */}
            <div className="absolute top-0 inset-x-3 h-28 rounded-t-3xl bg-gradient-to-b from-[#8C7D70] via-[#7B6E62] to-[#6E6156] shadow-xl border-t border-[#A8988B]/40 flex justify-around px-4 pt-3">
              {/* Back cushions */}
              <div className="w-36 h-20 rounded-2xl bg-gradient-to-b from-[#96877B] to-[#807267] border border-[#685C52]/50 shadow-inner" />
              <div className="w-36 h-20 rounded-2xl bg-gradient-to-b from-[#96877B] to-[#807267] border border-[#685C52]/50 shadow-inner" />
            </div>

            {/* Sofa Armrests (Taupe) */}
            <div className="absolute bottom-6 -left-3 w-10 h-32 rounded-3xl bg-gradient-to-b from-[#887A6E] to-[#706257] shadow-lg border border-[#5F5348]" />
            <div className="absolute bottom-6 -right-3 w-10 h-32 rounded-3xl bg-gradient-to-b from-[#887A6E] to-[#706257] shadow-lg border border-[#5F5348]" />

            {/* Seat Cushions Frame */}
            <div className="absolute bottom-4 inset-x-5 h-26 rounded-2xl bg-gradient-to-b from-[#8D7F73] to-[#74665B] shadow-2xl border border-[#5F5247] flex gap-1 p-1">
              {/* Left Seat Cushion */}
              <div className="flex-1 h-full rounded-xl bg-gradient-to-b from-[#9A8B7E] via-[#8C7D71] to-[#7A6B60] border-t border-[#AA9B8E]/50 shadow-inner" />

              {/* CUSHION CREVICE WITH DOM TARGET ID FOR ACCURATE HIT TESTING */}
              <div
                id="lumori-sofa-rescue-target"
                className="relative w-4 h-full bg-[#3D322A] rounded shadow-inner cursor-pointer"
                onClick={() => {
                  if (state === ExperienceState.STATE_4_HELPING_FRIEND && !moriRescued) {
                    soundEngine.playPop();
                    onMoriRescue();
                  }
                }}
                title="Cushion crevice - Help Bellflower!"
              >
                {state === ExperienceState.STATE_4_HELPING_FRIEND && !moriRescued && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-cyan-400/40 blur-[2px] animate-pulse pointer-events-none" />
                )}
              </div>

              {/* Right Seat Cushion */}
              <div className="flex-1 h-full rounded-xl bg-gradient-to-b from-[#9A8B7E] via-[#8C7D71] to-[#7A6B60] border-t border-[#AA9B8E]/50 shadow-inner" />
            </div>
          </div>
        </div>

        {/* Roaming Lumis in room states (Never renders during State 0 or 7!) */}
        {renderRoamingLumis()}
      </div>
    </div>
  );
};
