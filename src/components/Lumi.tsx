import React from 'react';
import { LumiType, CreatureMood } from '../types';

interface LumiProps {
  type: LumiType;
  mood?: CreatureMood;
  size?: number; // base pixel size
  isStuck?: boolean;
  isHelping?: boolean;
  emote?: string;
  toolHolding?: 'wrench' | 'crate' | 'none';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const Lumi: React.FC<LumiProps> = ({
  type,
  mood = 'idle',
  size = 64,
  isStuck = false,
  isHelping = false,
  emote,
  toolHolding = 'none',
  onClick,
  className = '',
  style,
}) => {
  // Authoritative palettes from character sheet image_f00e7209.png
  const configs: Record<
    LumiType,
    {
      name: string;
      primary: string;
      secondary: string;
      belly: string;
      earInner: string;
      glow: string;
      highlight: string;
    }
  > = {
    sprout: {
      name: 'Sprout Lumi (Blue)',
      primary: '#318CE7',
      secondary: '#1D63B8',
      belly: '#FDE047',
      earInner: '#FEF08A',
      glow: 'rgba(49, 140, 231, 0.45)',
      highlight: '#93C5FD',
    },
    bellflower: {
      name: 'Bellflower Lumi (Mint)',
      primary: '#34D399',
      secondary: '#059669',
      belly: '#FEF08A',
      earInner: '#D1FAE5',
      glow: 'rgba(52, 211, 153, 0.45)',
      highlight: '#A7F3D0',
    },
    sakura: {
      name: 'Sakura Lumi (Pink)',
      primary: '#F472B6',
      secondary: '#DB2777',
      belly: '#FFF1F2',
      earInner: '#FCE7F3',
      glow: 'rgba(244, 114, 182, 0.45)',
      highlight: '#FBCFE8',
    },
    lotus: {
      name: 'Lotus Lumi (Purple)',
      primary: '#7C3AED',
      secondary: '#5B21B6',
      belly: '#FEF9C3',
      earInner: '#E9D5FF',
      glow: 'rgba(124, 58, 237, 0.45)',
      highlight: '#DDD6FE',
    },
  };

  const conf = configs[type] || configs.sprout;

  return (
    <div
      onClick={onClick}
      className={`relative select-none transition-transform duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 4px 12px ${conf.glow})`,
        ...style,
      }}
      title={conf.name}
    >
      {/* Emote Bubble */}
      {emote && (
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 px-2 py-0.5 rounded-full bg-white/95 text-slate-800 text-[10px] font-bold shadow-md border border-white/40 flex items-center justify-center animate-bounce whitespace-nowrap pointer-events-none"
          style={{ minWidth: 22 }}
        >
          {emote}
        </div>
      )}

      {/* SVG Creature */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full overflow-visible ${
          isStuck
            ? 'animate-wiggle-stuck'
            : mood === 'playful' || mood === 'dancing'
            ? 'animate-lumi-bounce'
            : 'animate-lumi-float'
        }`}
      >
        <defs>
          {/* Main Body Gradient */}
          <radialGradient id={`lumi-body-${type}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={conf.highlight} />
            <stop offset="50%" stopColor={conf.primary} />
            <stop offset="100%" stopColor={conf.secondary} />
          </radialGradient>

          {/* Belly Gradient */}
          <radialGradient id={`lumi-belly-${type}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor={conf.belly} />
            <stop offset="100%" stopColor={conf.belly} stopOpacity="0.85" />
          </radialGradient>

          {/* Ear Inner Gradient */}
          <linearGradient id={`lumi-ear-inner-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={conf.primary} stopOpacity="0.4" />
            <stop offset="100%" stopColor={conf.earInner} />
          </linearGradient>

          {/* Lotus Core Glow */}
          <radialGradient id="lotus-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="40%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
          </radialGradient>
        </defs>

        {isStuck ? (
          /* Stuck state: Lower body & cute kicking feet sticking upside-down */
          <g className="origin-center rotate-180 translate-y-3">
            <ellipse cx="50" cy="55" rx="26" ry="22" fill={`url(#lumi-body-${type})`} />

            {/* Little tail wiggling */}
            <path
              d="M 50 75 Q 44 88 38 94"
              stroke={conf.secondary}
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
            />

            {/* Crossbody satchel strap & leaf bag */}
            <path d="M 32 46 Q 50 56 68 64" stroke="#92400E" strokeWidth="2.5" fill="none" />
            <g transform="translate(62, 58) rotate(20)">
              <path d="M 0 0 C 4 -6 14 -4 16 2 C 18 8 10 14 2 12 Z" fill="#4D7C0F" />
              <circle cx="8" cy="4" r="2" fill="#FEF3C7" />
            </g>

            {/* Feet kicking */}
            <g className="animate-foot-kick-left origin-[36px_45px]">
              <ellipse cx="36" cy="38" rx="7.5" ry="11" fill="#B45309" />
              <ellipse cx="36" cy="36" rx="5.5" ry="9" fill="#D97706" opacity="0.8" />
              <circle cx="33" cy="28" r="2" fill="#FDE68A" />
              <circle cx="38" cy="28" r="2" fill="#FDE68A" />
            </g>
            <g className="animate-foot-kick-right origin-[64px_45px]">
              <ellipse cx="64" cy="38" rx="7.5" ry="11" fill="#B45309" />
              <ellipse cx="64" cy="36" rx="5.5" ry="9" fill="#D97706" opacity="0.8" />
              <circle cx="62" cy="28" r="2" fill="#FDE68A" />
              <circle cx="67" cy="28" r="2" fill="#FDE68A" />
            </g>

            {/* Struggle sweat drop */}
            <path
              d="M 72 65 C 72 61 77 56 77 56 C 77 56 82 61 82 65 C 82 68 77.5 70 77 70 C 76.5 70 72 68 72 65 Z"
              fill="#70D6FF"
              className="animate-bounce"
            />
          </g>
        ) : (
          /* Upright Creature */
          <g>
            {/* Ground Shadow */}
            <ellipse cx="50" cy="89" rx="19" ry="4.5" fill="rgba(0,0,0,0.18)" filter="blur(2px)" />

            {/* Little Tail */}
            <path
              d="M 28 66 Q 16 64 12 52 Q 22 56 26 62"
              fill={conf.secondary}
              className="origin-[26px_62px] animate-tail-wag"
            />

            {/* Golden-Brown Paws/Feet */}
            <ellipse cx="38" cy="83" rx="6.5" ry="4.5" fill="#B45309" />
            <ellipse cx="62" cy="83" rx="6.5" ry="4.5" fill="#B45309" />

            {/* Drooping Long Bunny/Petal Ears (Authoritative feature from reference) */}
            {/* Left Ear */}
            <g className="origin-[32px_36px] animate-ear-left">
              <path
                d="M 32 36 C 20 30 6 40 8 62 C 10 74 24 74 30 52 Z"
                fill={`url(#lumi-body-${type})`}
              />
              <path
                d="M 28 42 C 20 38 12 46 14 60 C 16 68 24 66 28 52 Z"
                fill={`url(#lumi-ear-inner-${type})`}
              />
            </g>

            {/* Right Ear */}
            <g className="origin-[68px_36px] animate-ear-right">
              <path
                d="M 68 36 C 80 30 94 40 92 62 C 90 74 76 74 70 52 Z"
                fill={`url(#lumi-body-${type})`}
              />
              <path
                d="M 72 42 C 80 38 88 46 86 60 C 84 68 76 66 72 52 Z"
                fill={`url(#lumi-ear-inner-${type})`}
              />
            </g>

            {/* HEAD ATTACHMENTS (Distinctive Authoritative Features) */}
            {/* 1. SPROUT LUMI: Arching green leafy sprout stem */}
            {type === 'sprout' && (
              <g className="origin-[50px_28px] animate-tuft-bob">
                {/* Stem */}
                <path
                  d="M 50 26 C 50 16 48 8 52 2"
                  stroke="#4D7C0F"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Big curved leaf */}
                <path
                  d="M 52 2 C 58 -6 74 -6 82 2 C 78 12 62 14 52 4 Z"
                  fill="#65A30D"
                />
                {/* Small leaf on opposite side */}
                <path
                  d="M 48 12 C 40 8 32 10 28 16 C 36 20 44 18 48 14 Z"
                  fill="#84CC16"
                />
              </g>
            )}

            {/* 2. BELLFLOWER LUMI: Curved arching stem with hanging bellflower cup */}
            {type === 'bellflower' && (
              <g className="origin-[50px_28px] animate-tuft-bob">
                {/* Arching green stem */}
                <path
                  d="M 50 26 C 50 12 56 4 68 6 C 74 7 76 12 76 16"
                  stroke="#16A34A"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Hanging bellflower blossom */}
                <g transform="translate(66, 14)">
                  <path
                    d="M 10 0 C 14 6 22 12 24 22 C 16 25 4 25 -4 22 C -2 12 6 6 10 0 Z"
                    fill="#E0F2FE"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                  />
                  {/* Blossom petal scalloped rim */}
                  <path
                    d="M -4 22 Q 2 26 8 23 Q 14 26 20 23 Q 24 24 24 22"
                    fill="#BAE6FD"
                  />
                </g>
              </g>
            )}

            {/* 3. SAKURA LUMI: Woody twig sprouting blooming pink cherry blossoms */}
            {type === 'sakura' && (
              <g className="origin-[50px_28px] animate-tuft-bob">
                {/* Woody twig */}
                <path
                  d="M 50 26 L 50 14 L 46 8 M 50 16 L 56 10"
                  stroke="#78350F"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Main cherry blossom bloom */}
                <g transform="translate(46, 6)">
                  {[0, 72, 144, 216, 288].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="0"
                      cy="-7"
                      rx="4.5"
                      ry="6.5"
                      fill="#FBCFE8"
                      stroke="#F472B6"
                      strokeWidth="0.8"
                      transform={`rotate(${deg})`}
                    />
                  ))}
                  <circle cx="0" cy="0" r="3" fill="#FDE047" />
                </g>
                {/* Small blossom bud */}
                <circle cx="58" cy="8" r="3.5" fill="#F472B6" />
              </g>
            )}

            {/* 4. LOTUS LUMI: Crown of blooming purple lotus with glowing center */}
            {type === 'lotus' && (
              <g className="origin-[50px_28px] animate-tuft-bob">
                <circle cx="50" cy="12" r="14" fill="url(#lotus-glow)" />
                {/* Lotus Petals */}
                <g transform="translate(50, 16)">
                  {/* Outer petals */}
                  <path d="M 0 0 C -8 -6 -18 -8 -22 2 C -18 8 -8 4 0 0 Z" fill="#A855F7" />
                  <path d="M 0 0 C 8 -6 18 -8 22 2 C 18 8 8 4 0 0 Z" fill="#A855F7" />
                  {/* Center vertical petals */}
                  <path d="M 0 0 C -10 -10 -8 -22 0 -26 C 8 -22 10 -10 0 0 Z" fill="#C084FC" />
                  <path d="M 0 0 C -6 -8 -16 -16 -12 -22 C -6 -18 -2 -8 0 0 Z" fill="#DDD6FE" />
                  <path d="M 0 0 C 6 -8 16 -16 12 -22 C 6 -18 2 -8 0 0 Z" fill="#DDD6FE" />
                  {/* Glowing core spark */}
                  <circle cx="0" cy="-6" r="3" fill="#FEF08A" />
                </g>
              </g>
            )}

            {/* Main Rounded Pear Body */}
            <ellipse cx="50" cy="56" rx="27" ry="26" fill={`url(#lumi-body-${type})`} />

            {/* Soft Pale Belly (Authoritative feature) */}
            <ellipse cx="50" cy="62" rx="18" ry="18" fill={`url(#lumi-belly-${type})`} />

            {/* Crossbody Satchel Strap & Leaf Pouch (Authoritative accessory on all Lumori) */}
            <path
              d="M 33 48 Q 50 58 67 66"
              stroke="#78350F"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Leaf bag at hip */}
            <g transform="translate(63, 62) rotate(18)">
              <path
                d="M 0 0 C 6 -8 18 -6 18 4 C 18 12 10 18 0 14 Z"
                fill="#4D7C0F"
                stroke="#365314"
                strokeWidth="1"
              />
              {/* White berry / pod charm */}
              <circle cx="9" cy="6" r="2.5" fill="#FFFBEB" stroke="#78350F" strokeWidth="0.8" />
            </g>

            {/* Paws / Arms */}
            {isHelping || mood === 'inviting' ? (
              // Reaching / beckoning arms
              <g>
                <path
                  d="M 32 58 Q 24 50 18 44"
                  stroke={conf.secondary}
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="17" cy="43" r="4" fill={conf.highlight} />
                <path
                  d="M 68 58 Q 78 50 84 44"
                  stroke={conf.secondary}
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="85" cy="43" r="4" fill={conf.highlight} />
              </g>
            ) : toolHolding === 'wrench' ? (
              // Holding miniature wrench tool (Lotus Lumi in storyboard)
              <g>
                <ellipse cx="36" cy="64" rx="4.5" ry="3.5" fill={conf.secondary} />
                <g transform="translate(64, 60) rotate(-30)">
                  {/* Wrench */}
                  <rect x="0" y="-2" width="12" height="4" rx="1" fill="#94A3B8" />
                  <circle cx="12" cy="0" r="3.5" fill="#64748B" />
                  <circle cx="12" cy="0" r="1.5" fill="#334155" />
                  <ellipse cx="2" cy="0" rx="3.5" ry="3" fill={conf.secondary} />
                </g>
              </g>
            ) : toolHolding === 'crate' ? (
              // Holding miniature crate / toolbox (Sakura Lumi in storyboard)
              <g>
                <ellipse cx="36" cy="64" rx="4.5" ry="3.5" fill={conf.secondary} />
                <rect x="58" y="56" width="14" height="12" rx="2" fill="#78350F" stroke="#B45309" strokeWidth="1" />
                <line x1="65" y1="56" x2="65" y2="68" stroke="#B45309" strokeWidth="1" />
                <ellipse cx="62" cy="62" rx="3.5" ry="3" fill={conf.secondary} />
              </g>
            ) : (
              // Resting cute paws
              <g>
                <ellipse cx="36" cy="64" rx="4.5" ry="3.5" fill={conf.secondary} />
                <ellipse cx="64" cy="64" rx="4.5" ry="3.5" fill={conf.secondary} />
              </g>
            )}

            {/* Cheek Blushes */}
            <circle cx="34" cy="56" r="5" fill="#F43F5E" opacity="0.3" />
            <circle cx="66" cy="56" r="5" fill="#F43F5E" opacity="0.3" />

            {/* Eyes & Expressions */}
            {mood === 'happy' || mood === 'dancing' ? (
              // Joyful smiling arcs `^ ^`
              <g stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" fill="none">
                <path d="M 36 49 Q 42 42 46 49" />
                <path d="M 54 49 Q 58 42 64 49" />
              </g>
            ) : mood === 'concerned' ? (
              // Anxious tilted eyes
              <g>
                <ellipse cx="40" cy="48" rx="4.5" ry="6" fill="#1E293B" />
                <circle cx="41.5" cy="46" r="1.8" fill="#FFFFFF" />
                <ellipse cx="60" cy="48" rx="4.5" ry="6" fill="#1E293B" />
                <circle cx="61.5" cy="46" r="1.8" fill="#FFFFFF" />
                {/* Worried brows */}
                <path d="M 37 40 L 43 43" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
                <path d="M 63 40 L 57 43" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
              </g>
            ) : isHelping || mood === 'working' ? (
              // Focused determined look `>_<`
              <g stroke="#1E293B" strokeWidth="2.6" strokeLinecap="round" fill="none">
                <path d="M 37 45 L 44 49 L 37 53" />
                <path d="M 63 45 L 56 49 L 63 53" />
              </g>
            ) : (
              // Authoritative large expressive eyes with twin light gleams
              <g className="animate-lumi-blink origin-[50px_48px]">
                {/* Left eye */}
                <ellipse cx="40" cy="48" rx="5.2" ry="7" fill="#1E293B" />
                <circle cx="42" cy="46" r="2.4" fill="#FFFFFF" />
                <circle cx="38" cy="51" r="1.2" fill="#FFFFFF" />

                {/* Right eye */}
                <ellipse cx="60" cy="48" rx="5.2" ry="7" fill="#1E293B" />
                <circle cx="62" cy="46" r="2.4" fill="#FFFFFF" />
                <circle cx="58" cy="51" r="1.2" fill="#FFFFFF" />
              </g>
            )}

            {/* Mouth */}
            {mood === 'happy' || mood === 'dancing' ? (
              <path
                d="M 46 57 Q 50 63 54 57"
                stroke="#1E293B"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="#F43F5E"
              />
            ) : mood === 'concerned' ? (
              <path
                d="M 47 59 Q 50 56 53 59"
                stroke="#1E293B"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <path
                d="M 47 56 Q 50 59 53 56"
                stroke="#1E293B"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
