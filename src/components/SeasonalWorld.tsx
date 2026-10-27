import React, { useState, useEffect, useRef } from "react";
import { SeasonalState, SEASONAL_METAS, getNextSeasonalState, getPrevSeasonalState } from "../types";
import { soundEngine } from "../utils/audio";

interface SeasonalWorldProps {
  seasonalState: SeasonalState;
  isTransitioning: boolean;
  onSwipe: (direction: "next" | "prev") => void;
}

export const SeasonalWorld: React.FC<SeasonalWorldProps> = ({
  seasonalState,
  isTransitioning,
  onSwipe,
}) => {
  const meta = SEASONAL_METAS[seasonalState];
  const isRainy = meta.weather === "rainy";
  const season = meta.season;

  // Wetness factor that dries gradually over time when transitioning from rainy to sunny
  const [wetness, setWetness] = useState<number>(isRainy ? 1 : 0);
  const [rainFade, setRainFade] = useState<boolean>(isRainy);

  // Subtle natural idle reaction timer for Lumori
  const [lumiIdleTick, setLumiIdleTick] = useState<number>(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLumiIdleTick((prev) => (prev + 1) % 6);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  // Update wetness and rain state with smooth drying transition
  useEffect(() => {
    if (isRainy) {
      setRainFade(true);
      setWetness(1);
    } else {
      // Stop rain immediately or fade over 1.2s, and gradually dry wet surfaces
      setRainFade(false);
      const timer = window.setTimeout(() => {
        setWetness(0);
      }, 3500); // Gradual drying over 3.5 seconds!
      return () => clearTimeout(timer);
    }
  }, [isRainy, seasonalState]);

  // Audio update on season change
  useEffect(() => {
    soundEngine.setSeasonalAmbience(seasonalState);
  }, [seasonalState]);

  // Dynamic seasonal color palettes for the persistent landscape
  const getAtmosphereConfig = () => {
    switch (seasonalState) {
      case SeasonalState.SPRING_SUNNY:
        return {
          skyGradient: "from-[#A5E3F7] via-[#D8F3DC] to-[#FDFBF7]",
          ambientLight: "rgba(255, 248, 220, 0.25)",
          terrainTone: "#68A357",
          terrainShade: "#457538",
          streamTone: "#48CAE4",
          rockTone: "#7A8274",
          foliagePrimary: "#48BB78",
          foliageAccent: "#F687B3", // pink cherry blossoms
          sunGlow: "opacity-80",
        };
      case SeasonalState.SPRING_RAINY:
        return {
          skyGradient: "from-[#8EAF9D] via-[#A8C5B5] to-[#D5E1D8]",
          ambientLight: "rgba(180, 205, 200, 0.2)",
          terrainTone: "#5B8D4C",
          terrainShade: "#3B6130",
          streamTone: "#5AA9BF",
          rockTone: "#5C6659",
          foliagePrimary: "#38A169",
          foliageAccent: "#E4729F",
          sunGlow: "opacity-10",
        };
      case SeasonalState.SUMMER_SUNNY:
        return {
          skyGradient: "from-[#38BDF8] via-[#7DD3FC] to-[#FEF08A]",
          ambientLight: "rgba(254, 240, 138, 0.35)",
          terrainTone: "#388E3C",
          terrainShade: "#1B5E20",
          streamTone: "#00B4D8",
          rockTone: "#6E7569",
          foliagePrimary: "#2E7D32",
          foliageAccent: "#81C784",
          sunGlow: "opacity-100",
        };
      case SeasonalState.SUMMER_RAINY:
        return {
          skyGradient: "from-[#475569] via-[#64748B] to-[#94A3B8]",
          ambientLight: "rgba(148, 163, 184, 0.25)",
          terrainTone: "#2E7D32",
          terrainShade: "#1B5E20",
          streamTone: "#3A8699",
          rockTone: "#475569",
          foliagePrimary: "#1B5E20",
          foliageAccent: "#4CAF50",
          sunGlow: "opacity-10",
        };
      case SeasonalState.AUTUMN_SUNNY:
        return {
          skyGradient: "from-[#F59E0B] via-[#FBBF24] to-[#FDE68A]",
          ambientLight: "rgba(251, 191, 36, 0.32)",
          terrainTone: "#A16207",
          terrainShade: "#78350F",
          streamTone: "#38BDF8",
          rockTone: "#78716C",
          foliagePrimary: "#D97706",
          foliageAccent: "#DC2626", // rich maple red
          sunGlow: "opacity-90",
        };
      case SeasonalState.AUTUMN_RAINY:
        return {
          skyGradient: "from-[#78716C] via-[#A8A29E] to-[#D6D3D1]",
          ambientLight: "rgba(168, 162, 158, 0.2)",
          terrainTone: "#854D0E",
          terrainShade: "#542508",
          streamTone: "#5A8B9C",
          rockTone: "#57534E",
          foliagePrimary: "#B45309",
          foliageAccent: "#991B1B",
          sunGlow: "opacity-15",
        };
      case SeasonalState.WINTER_SUNNY:
        return {
          skyGradient: "from-[#BAE6FD] via-[#E0F2FE] to-[#F8FAFC]",
          ambientLight: "rgba(224, 242, 254, 0.35)",
          terrainTone: "#E2E8F0", // snow cover
          terrainShade: "#CBD5E1",
          streamTone: "#7DD3FC",
          rockTone: "#94A3B8",
          foliagePrimary: "#064E3B", // dark hardy evergreens
          foliageAccent: "#E2E8F0", // frost/snow tips
          sunGlow: "opacity-75",
        };
      case SeasonalState.WINTER_RAINY:
        return {
          skyGradient: "from-[#475569] via-[#64748B] to-[#94A3B8]",
          ambientLight: "rgba(100, 116, 139, 0.2)",
          terrainTone: "#CBD5E1", // damp wet snow
          terrainShade: "#94A3B8",
          streamTone: "#4A6E82",
          rockTone: "#334155",
          foliagePrimary: "#022C22",
          foliageAccent: "#64748B",
          sunGlow: "opacity-5",
        };
    }
  };

  const config = getAtmosphereConfig();

  return (
    <div className="relative w-full h-full overflow-hidden select-none font-sans">
      {/* ---------------- LAYER 1: SKY & ATMOSPHERE (Smooth 2s transition) ---------------- */}
      <div
        className={"absolute inset-0 bg-gradient-to-b " + config.skyGradient + " transition-colors duration-[2200ms] ease-in-out"}
      />

      {/* Warm / Pale Sunlight Rays in Sunny States */}
      <div
        className={"absolute -top-32 -right-16 w-[700px] h-[700px] bg-gradient-to-br from-amber-200/40 via-yellow-100/20 to-transparent rounded-full blur-3xl pointer-events-none transition-opacity duration-[2200ms] " + config.sunGlow}
      />

      {/* ---------------- LAYER 2: PERSISTENT MINIATURE LANDSCAPE (Identical Geography Across States) ---------------- */}
      <svg
        className="absolute inset-0 w-full h-full preserve-3d"
        viewBox="0 0 1000 650"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle water shimmer gradient */}
          <linearGradient id="streamGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={config.streamTone} stopOpacity="0.88" />
            <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.65" />
            <stop offset="100%" stopColor={config.streamTone} stopOpacity="0.95" />
          </linearGradient>

          {/* Wet surface glossy reflection filter */}
          <linearGradient id="wetSheenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- DISTANT MINIATURE HILLS (Persistent landmark) --- */}
        <path
          d="M 0,380 Q 250,290 520,330 T 1000,280 L 1000,650 L 0,650 Z"
          fill={config.terrainShade}
          className="transition-colors duration-[2200ms]"
          opacity="0.75"
        />

        {/* --- MIDGROUND HILL & STREAM BANK --- */}
        <path
          d="M 0,420 Q 340,360 680,410 T 1000,390 L 1000,650 L 0,650 Z"
          fill={config.terrainTone}
          className="transition-colors duration-[2200ms]"
        />

        {/* --- PERSISTENT WINDING STREAM (Flows from top-right around mossy bend to bottom-left) --- */}
        {/* Stream bed / bottom contour */}
        <path
          d="M 720,370 C 660,400 580,420 500,450 C 400,485 300,510 180,560 C 110,590 50,620 0,650 L 0,590 C 80,540 180,490 290,440 C 400,395 520,365 640,335 Z"
          fill="url(#streamGrad)"
          className="transition-all duration-[2200ms]"
        />

        {/* Flow ripples along the stream */}
        <g stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" fill="none">
          <path d="M 600,380 Q 560,395 530,410" className="animate-pulse" />
          <path d="M 430,445 Q 380,465 340,480" className="animate-pulse" style={{ animationDelay: "0.8s" }} />
          <path d="M 240,510 Q 180,535 130,560" className="animate-pulse" style={{ animationDelay: "1.4s" }} />
        </g>

        {/* Rainy Ripples on stream in rainy states */}
        {isRainy && (
          <g stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.6">
            <circle cx="560" cy="400" r="8" className="animate-ping" style={{ animationDuration: "2s" }} />
            <circle cx="410" cy="460" r="12" className="animate-ping" style={{ animationDuration: "1.8s", animationDelay: "0.5s" }} />
            <circle cx="280" cy="510" r="10" className="animate-ping" style={{ animationDuration: "2.3s", animationDelay: "1.1s" }} />
            <circle cx="160" cy="560" r="14" className="animate-ping" style={{ animationDuration: "1.6s", animationDelay: "0.7s" }} />
          </g>
        )}

        {/* --- PERSISTENT NATURAL RIVER ROCKS & STEPPING STONES --- */}
        {/* Rock A (Right bank) */}
        <ellipse cx="640" cy="415" rx="34" ry="20" fill={config.rockTone} className="transition-colors duration-[2200ms]" />
        <ellipse cx="636" cy="410" rx="28" ry="14" fill="#8C9388" opacity="0.3" />

        {/* Rock B (Center stream stepping stone) */}
        <ellipse cx="460" cy="470" rx="26" ry="16" fill={config.rockTone} className="transition-colors duration-[2200ms]" />

        {/* Rock C (Left bank near Lumori shelter) */}
        <ellipse cx="280" cy="535" rx="42" ry="24" fill={config.rockTone} className="transition-colors duration-[2200ms]" />
        <ellipse cx="275" cy="530" rx="36" ry="18" fill="#8C9388" opacity="0.3" />

        {/* Gradual Wet Surface Sheen (Dries over 3.5s) */}
        <g opacity={wetness} className="transition-opacity duration-[3500ms] pointer-events-none">
          <ellipse cx="636" cy="408" rx="24" ry="9" fill="url(#wetSheenGrad)" />
          <ellipse cx="458" cy="466" rx="20" ry="8" fill="url(#wetSheenGrad)" />
          <ellipse cx="275" cy="528" rx="30" ry="11" fill="url(#wetSheenGrad)" />
        </g>

        {/* --- PERSISTENT ANCIENT SHELTER TREE (Overarching Grove on Center-Left) --- */}
        {/* Ancient Root Alcove / Sheltered Bank where Lumori live */}
        <path
          d="M 220,540 C 240,490 280,470 340,465 C 380,465 400,490 410,540 Z"
          fill="#3B261A"
          className="transition-colors duration-[2200ms]"
        />
        {/* Moss blanket over the alcove roof */}
        <path
          d="M 225,510 C 260,475 320,465 360,470 C 390,475 405,495 408,520"
          stroke={season === "winter" ? "#E2E8F0" : config.foliagePrimary}
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-[2200ms]"
        />

        {/* Tree Trunk */}
        <path
          d="M 330,470 C 320,400 290,340 280,260 C 290,260 330,320 360,470 Z"
          fill="#4A3425"
        />
        {/* Major branches spreading canopy */}
        <path d="M 290,320 Q 220,290 170,270" stroke="#4A3425" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M 300,280 Q 370,250 440,240" stroke="#4A3425" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M 285,260 Q 275,200 290,170" stroke="#4A3425" strokeWidth="8" strokeLinecap="round" fill="none" />

        {/* Seasonal Foliage Clusters */}
        {/* Deciduous Canopy (Thick in Summer/Autumn/Spring, reduced to bare frosted branches in Winter) */}
        {season !== "winter" ? (
          <g className="transition-all duration-[2200ms]">
            {/* Primary Foliage Clouds */}
            <circle cx="170" cy="260" r="54" fill={config.foliagePrimary} opacity="0.9" />
            <circle cx="280" cy="180" r="62" fill={config.foliagePrimary} opacity="0.92" />
            <circle cx="390" cy="220" r="58" fill={config.foliagePrimary} opacity="0.9" />
            <circle cx="240" cy="230" r="48" fill={config.foliagePrimary} opacity="0.88" />
            <circle cx="330" cy="240" r="45" fill={config.foliagePrimary} opacity="0.88" />

            {/* Accent Details: Blossoms (Spring) / Highlights (Summer) / Golden Crimson Leaves (Autumn) */}
            <circle cx="150" cy="245" r="18" fill={config.foliageAccent} opacity="0.85" />
            <circle cx="260" cy="160" r="22" fill={config.foliageAccent} opacity="0.85" />
            <circle cx="300" cy="190" r="16" fill={config.foliageAccent} opacity="0.8" />
            <circle cx="410" cy="210" r="20" fill={config.foliageAccent} opacity="0.85" />
            <circle cx="220" cy="225" r="15" fill={config.foliageAccent} opacity="0.75" />
          </g>
        ) : (
          /* Winter: Frost-lined bare deciduous branches with evergreen conifer */
          <g className="transition-all duration-[2200ms]">
            {/* Frost crystals on bare branches */}
            <path d="M 290,320 Q 220,290 170,270" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 300,280 Q 370,250 440,240" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 285,260 Q 275,200 290,170" stroke="#F1F5F9" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.8" />

            {/* Hardy Evergreen Pine retaining rich dark green needles & snow pads */}
            <polygon points="120,310 160,250 200,310" fill="#064E3B" />
            <polygon points="130,270 160,220 190,270" fill="#064E3B" />
            {/* Snow caps on pine */}
            <path d="M 140,255 Q 160,245 180,255" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 148,225 Q 160,218 172,225" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* Winter Snow Blanket on terrain */}
        {season === "winter" && (
          <path
            d="M 230,505 C 270,470 330,465 370,470 C 395,475 410,500 412,525"
            stroke="#FFFFFF"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
            className="transition-opacity duration-[2200ms]"
          />
        )}
      </svg>

      {/* ---------------- LAYER 3: LUMORI IN FIXED RESTING LOCATION (Under the Tree Alcove) ---------------- */}
      <div
        className="absolute z-20 pointer-events-none transition-all duration-700 ease-out"
        style={{
          left: "27%",
          top: "68%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="relative flex items-center gap-2">
          {/* SPROUT LUMI (Curled resting with tiny breathing motion) */}
          <div
            className={"relative transition-transform duration-1000 ease-in-out " + (lumiIdleTick % 2 === 0 ? "scale-105" : "scale-100")}
          >
            {/* Sprout body */}
            <div className="relative w-12 h-11 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-300 shadow-[0_0_14px_rgba(56,189,248,0.7)] flex items-center justify-center border border-white/50">
              {/* Cute sprout leaf on head */}
              <div
                className={"absolute -top-3 right-2 w-3.5 h-4.5 rounded-full bg-gradient-to-t from-emerald-500 to-green-300 border border-white/60 transition-transform duration-700 " + (isRainy ? "rotate-[20deg]" : "rotate-[-10deg]")}
              />
              {/* Resting sleepy eyes */}
              <span className="text-[10px] text-blue-950 font-bold select-none tracking-tighter">
                {season === "winter" ? ">.<" : isRainy && lumiIdleTick === 1 ? "^.~" : "^.^"}
              </span>
            </div>
            {/* Subtle weather reaction icon */}
            {season === "winter" && (
              <span className="absolute -top-4 -right-1 text-[9px] text-cyan-200 animate-pulse">zZ</span>
            )}
          </div>

          {/* BELLFLOWER LUMI (Snuggled beside Sprout) */}
          <div
            className={"relative transition-transform duration-1000 ease-in-out " + (lumiIdleTick % 2 === 1 ? "scale-105" : "scale-100")}
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative w-11 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-teal-200 shadow-[0_0_12px_rgba(45,212,191,0.65)] flex items-center justify-center border border-white/50">
              {/* Bellflower petal cap */}
              <div className="absolute -top-2 left-1.5 w-4 h-3 rounded-t-full bg-gradient-to-b from-teal-200 to-teal-400 border-t border-white/60" />
              <span className="text-[9px] text-teal-950 font-bold select-none">
                {isRainy ? "♥" : "^.^"}
              </span>
            </div>
          </div>

          {/* SAKURA LUMI (Curled resting) */}
          <div className="relative transition-transform duration-1000">
            <div className="relative w-9 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-pink-200 shadow-[0_0_10px_rgba(244,114,182,0.6)] flex items-center justify-center border border-white/40">
              <span className="text-[8px] text-pink-950 font-bold select-none">♥</span>
            </div>
          </div>

          {/* LOTUS LUMI (Resting curl) */}
          <div className="relative transition-transform duration-1000">
            <div className="relative w-9 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-purple-200 shadow-[0_0_10px_rgba(192,132,252,0.6)] flex items-center justify-center border border-white/40">
              <span className="text-[8px] text-purple-950 font-bold select-none">♫</span>
            </div>
          </div>
        </div>

        {/* Small ground shadow beneath Lumori */}
        <div className="absolute -bottom-2 inset-x-2 h-3.5 bg-black/25 blur-sm rounded-full pointer-events-none" />
      </div>

      {/* ---------------- LAYER 4: ACTIVE SEASONAL PARTICLES & WEATHER ---------------- */}
      {/* Spring: Drifting Blossom Petals */}
      {season === "spring" && !isRainy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-3 rounded-full bg-pink-300/80 shadow-[0_0_6px_#fbcfe8] animate-pulse"
              style={{
                top: (12 + (i * 7) % 75) + "%",
                left: (15 + (i * 11) % 80) + "%",
                transform: "rotate(" + (i * 25) + "deg)",
                transition: "all 3s ease-in-out",
              }}
            />
          ))}
        </div>
      )}

      {/* Summer: Fireflies / Golden Spores */}
      {season === "summer" && !isRainy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde047] animate-pulse"
              style={{
                top: (25 + (i * 9) % 65) + "%",
                left: (10 + (i * 13) % 85) + "%",
                animationDuration: (2 + (i % 3)) + "s",
              }}
            />
          ))}
        </div>
      )}

      {/* Autumn: Drifting Golden & Red Leaves */}
      {season === "autumn" && !isRainy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={"absolute rounded-sm shadow-sm " + (i % 2 === 0 ? "bg-amber-600/90 w-3 h-2" : "bg-red-600/85 w-2.5 h-2.5")}
              style={{
                top: (15 + (i * 8) % 75) + "%",
                left: (12 + (i * 10) % 80) + "%",
                transform: "rotate(" + (i * 40) + "deg)",
              }}
            />
          ))}
        </div>
      )}

      {/* Winter Sunny: Sparkling Ice Glints */}
      {season === "winter" && !isRainy && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-ping"
              style={{
                top: (35 + (i * 7) % 55) + "%",
                left: (20 + (i * 12) % 75) + "%",
                animationDuration: (2.5 + (i % 2)) + "s",
                animationDelay: (i * 0.3) + "s",
              }}
            />
          ))}
        </div>
      )}

      {/* Rainy States: Rainfall Streaks & Precipitation */}
      {rainFade && (
        <div
          className={"absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 " + (isRainy ? "opacity-100" : "opacity-0")}
        >
          {/* Slanted rainfall lines across entire miniature world */}
          <svg className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
            <line x1="120" y1="20" x2="100" y2="120" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6,8" />
            <line x1="280" y1="40" x2="260" y2="160" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="8,10" />
            <line x1="420" y1="10" x2="400" y2="140" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6,8" />
            <line x1="560" y1="50" x2="540" y2="190" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="8,10" />
            <line x1="720" y1="20" x2="700" y2="150" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="7,9" />
            <line x1="880" y1="60" x2="860" y2="200" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="8,10" />
            <line x1="200" y1="220" x2="180" y2="340" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="7,9" />
            <line x1="360" y1="260" x2="340" y2="400" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="6,8" />
            <line x1="640" y1="240" x2="620" y2="390" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="8,10" />
            <line x1="800" y1="280" x2="780" y2="440" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="7,9" />
            <line x1="150" y1="420" x2="130" y2="580" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="8,10" />
            <line x1="500" y1="400" x2="480" y2="560" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="7,9" />
            <line x1="750" y1="430" x2="730" y2="600" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="8,10" />
          </svg>
        </div>
      )}

      {/* ---------------- LAYER 5: FAINT SPHERICAL ORB BOUNDARY AT PERIPHERY ---------------- */}
      {/* Outer Curved Vignette Rim reminding user that they are inside the glass sphere */}
      <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_120px_rgba(15,23,42,0.45)] border-[8px] border-white/10" />
      {/* Specular curved arc reflection top-left */}
      <div className="absolute -top-12 -left-12 w-96 h-64 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-transparent rotate-[-20deg] pointer-events-none" />
      {/* Bottom rim refraction highlight */}
      <div className="absolute -bottom-8 inset-x-12 h-20 rounded-full bg-gradient-to-t from-white/15 to-transparent pointer-events-none" />

      {/* ---------------- LAYER 6: ELEGANT MINIMAL DESKTOP MOUSE / TOUCH SWIPE CONTROLS ---------------- */}
      {/* Discreet left/right hover arrows for mouse users (follow exact lockout and neutral rules) */}
      <div className="absolute inset-y-0 left-2 flex items-center z-30">
        <button
          onClick={() => {
            if (!isTransitioning) onSwipe("prev");
          }}
          disabled={isTransitioning}
          aria-label="Previous Season"
          title="Swipe Left / Previous Season"
          className={"w-10 h-10 rounded-full bg-slate-900/35 hover:bg-slate-900/65 backdrop-blur-md border border-white/25 text-white/80 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg " + (isTransitioning ? "opacity-30 cursor-not-allowed" : "opacity-60 hover:opacity-100 hover:scale-110 cursor-pointer")}
        >
          <span className="text-lg font-bold select-none leading-none">‹</span>
        </button>
      </div>

      <div className="absolute inset-y-0 right-2 flex items-center z-30">
        <button
          onClick={() => {
            if (!isTransitioning) onSwipe("next");
          }}
          disabled={isTransitioning}
          aria-label="Next Season"
          title="Swipe Right / Next Season"
          className={"w-10 h-10 rounded-full bg-slate-900/35 hover:bg-slate-900/65 backdrop-blur-md border border-white/25 text-white/80 hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg " + (isTransitioning ? "opacity-30 cursor-not-allowed" : "opacity-60 hover:opacity-100 hover:scale-110 cursor-pointer")}
        >
          <span className="text-lg font-bold select-none leading-none">›</span>
        </button>
      </div>

      {/* Subtle indicator dot row (minimal, non-intrusive) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-30 pointer-events-none">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <div
            key={s}
            className={"transition-all duration-500 rounded-full " + (s === seasonalState ? "w-4 h-1.5 bg-white shadow-[0_0_8px_#ffffff]" : "w-1.5 h-1.5 bg-white/40")}
          />
        ))}
      </div>
    </div>
  );
};
