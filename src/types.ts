export enum ExperienceState {
  STATE_0_DORMANT_ORB = 0,
  STATE_1_EMERGENCE = 1,
  // State 2: Broken Windmill Field (Sub-states 2A - 2G & Zoom-Out)
  STATE_2A_DISCOVERY = 20,
  STATE_2B_OBSERVATION = 21,
  STATE_2C_INVITATION = 22,
  STATE_2D_INTERACTION = 23,
  STATE_2E_AUTONOMOUS = 24,
  STATE_2F_SUCCESS = 25,
  STATE_2G_CLOSURE = 26,
  STATE_2_ZOOM_OUT = 27,
  // Sofa States (Explicit 7-step sequence)
  STATE_3_SOFA_ADVENTURE = 3,
  STATE_3A_SPROUT_HEADREST = 30,
  STATE_3B_SPROUT_JUMP = 31,
  STATE_3C_BELLFLOWER_HEADREST = 32,
  STATE_3D_BELLFLOWER_JUMP_TRAPPED = 33,
  STATE_4_HELPING_FRIEND = 4,
  STATE_4B_RESCUED_REUNION = 41,
  // Remaining States
  STATE_5_FREE_PLAY = 5,
  STATE_6_RETURN_TO_ORB = 6,
  STATE_7_LUMORI_IDLING = 7,
}

export type LumiType = 'sprout' | 'bellflower' | 'sakura' | 'lotus';

export interface StateMeta {
  id: ExperienceState;
  name: string;
  shortDesc: string;
  userHint?: string;
}

export const STATE_METAS: Record<ExperienceState, StateMeta> = {
  [ExperienceState.STATE_0_DORMANT_ORB]: {
    id: ExperienceState.STATE_0_DORMANT_ORB,
    name: "0 — Dormant Orb",
    shortDesc: "The orb rests silently on the living room shelf.",
    userHint: "Observe the glowing orb on the shelf...",
  },
  [ExperienceState.STATE_1_EMERGENCE]: {
    id: ExperienceState.STATE_1_EMERGENCE,
    name: "1 — Emergence",
    shortDesc: "The Lumori emerge from the orb and explore the room.",
    userHint: "The Lumori are climbing down to the living room.",
  },
  [ExperienceState.STATE_2A_DISCOVERY]: {
    id: ExperienceState.STATE_2A_DISCOVERY,
    name: "2A — Windmill Discovery (Zoom In)",
    shortDesc: "Camera zooms in to the tiny windmill field on the coffee table.",
    userHint: "The Lumori gather around the broken windmill on the table.",
  },
  [ExperienceState.STATE_2B_OBSERVATION]: {
    id: ExperienceState.STATE_2B_OBSERVATION,
    name: "2B — Windmill Observation",
    shortDesc: "The Lumori inspect the blades and find tools in the crate.",
    userHint: "Sakura fetches tools while Sprout and Lotus inspect the hub.",
  },
  [ExperienceState.STATE_2C_INVITATION]: {
    id: ExperienceState.STATE_2C_INVITATION,
    name: "2C — Windmill Invitation",
    shortDesc: "The Lumori gesture toward you inviting assistance.",
    userHint: "Wave hand, pinch/rotate blades, or click to help create wind.",
  },
  [ExperienceState.STATE_2D_INTERACTION]: {
    id: ExperienceState.STATE_2D_INTERACTION,
    name: "2D — Windmill Interaction",
    shortDesc: "User assists: blades begin rotating with excitement.",
    userHint: "The blades start to catch the breeze and accelerate!",
  },
  [ExperienceState.STATE_2E_AUTONOMOUS]: {
    id: ExperienceState.STATE_2E_AUTONOMOUS,
    name: "2E — Windmill Autonomous Solve",
    shortDesc: "The Lumori coordinate their efforts to free the axle.",
    userHint: "The Lumori coordinate together to push and unlock the blades.",
  },
  [ExperienceState.STATE_2F_SUCCESS]: {
    id: ExperienceState.STATE_2F_SUCCESS,
    name: "2F — Windmill Success",
    shortDesc: "The windmill spins smoothly; petals drift in the lively field.",
    userHint: "The windmill is turning! The Lumori celebrate with joy.",
  },
  [ExperienceState.STATE_2G_CLOSURE]: {
    id: ExperienceState.STATE_2G_CLOSURE,
    name: "2G — Windmill Closure",
    shortDesc: "Activity settles peacefully; Lumori admire the working mill.",
    userHint: "The Lumori rest contentedly near the working windmill.",
  },
  [ExperienceState.STATE_2_ZOOM_OUT]: {
    id: ExperienceState.STATE_2_ZOOM_OUT,
    name: "2 — Windmill Zoom Out",
    shortDesc: "Camera returns smoothly to full living room framing.",
    userHint: "Returning to full living room view...",
  },
  [ExperienceState.STATE_3_SOFA_ADVENTURE]: {
    id: ExperienceState.STATE_3_SOFA_ADVENTURE,
    name: "3 — Sofa Adventure",
    shortDesc: "Sprout and Bellflower head to the sofa to explore.",
    userHint: "Watch the Lumori explore the sofa...",
  },
  [ExperienceState.STATE_3A_SPROUT_HEADREST]: {
    id: ExperienceState.STATE_3A_SPROUT_HEADREST,
    name: "3A — Sprout on Headrest",
    shortDesc: "Sprout perches on top of the sofa headrest, looking down.",
    userHint: "Sprout is preparing to jump down from the headrest.",
  },
  [ExperienceState.STATE_3B_SPROUT_JUMP]: {
    id: ExperienceState.STATE_3B_SPROUT_JUMP,
    name: "3B — Sprout Jumps to Cushion",
    shortDesc: "Sprout leaps down from the headrest onto the seat cushion.",
    userHint: "Sprout lands safely on the cushion and calls Bellflower!",
  },
  [ExperienceState.STATE_3C_BELLFLOWER_HEADREST]: {
    id: ExperienceState.STATE_3C_BELLFLOWER_HEADREST,
    name: "3C — Bellflower on Headrest",
    shortDesc: "Bellflower hops onto the headrest, gearing up to copy the jump.",
    userHint: "Bellflower reaches the headrest and prepares to jump.",
  },
  [ExperienceState.STATE_3D_BELLFLOWER_JUMP_TRAPPED]: {
    id: ExperienceState.STATE_3D_BELLFLOWER_JUMP_TRAPPED,
    name: "3D — Bellflower Jumps & Trapped",
    shortDesc: "Bellflower leaps, slips, and lands trapped in the seat gap!",
    userHint: "Oh no! Bellflower got stuck between the seat cushions!",
  },
  [ExperienceState.STATE_4_HELPING_FRIEND]: {
    id: ExperienceState.STATE_4_HELPING_FRIEND,
    name: "4 — Helping a Friend (Rescue)",
    shortDesc: "Rescue Bellflower together or watch Sprout pull him out.",
    userHint: "Click/pinch Bellflower to pull free, or watch Sprout help.",
  },
  [ExperienceState.STATE_4B_RESCUED_REUNION]: {
    id: ExperienceState.STATE_4B_RESCUED_REUNION,
    name: "4B — Reunion & Celebration",
    shortDesc: "Bellflower is freed! Both Lumis celebrate on the sofa.",
    userHint: "Rescued! Both Lumori celebrate together.",
  },
  [ExperienceState.STATE_5_FREE_PLAY]: {
    id: ExperienceState.STATE_5_FREE_PLAY,
    name: "5 — Free Play",
    shortDesc: "Autonomous joyful playtime across the sofa.",
    userHint: "Pinch at the orb to call the Lumis home.",
  },
  [ExperienceState.STATE_6_RETURN_TO_ORB]: {
    id: ExperienceState.STATE_6_RETURN_TO_ORB,
    name: "6 — Return to Orb",
    shortDesc: "Lumis hear the signal and return to the shelf.",
    userHint: "The Lumis are climbing back into their world.",
  },
  [ExperienceState.STATE_7_LUMORI_IDLING]: {
    id: ExperienceState.STATE_7_LUMORI_IDLING,
    name: "7 — Lumori Idling",
    shortDesc: "Persistent living decoration inside the orb.",
    userHint: "The Lumis are living peacefully in miniature Lumori.",
  },
};

export type LumiLocation =
  | 'insideOrb'
  | 'emergingOnShelf'
  | 'travellingToTable'
  | 'atWindmill'
  | 'travellingToSofa'
  | 'atSofa'
  | 'returningToShelf';

export type InteractionTarget = 'none' | 'orb' | 'windmill' | 'sofa_rescue';

export interface HandTrackingState {
  isActive: boolean;
  isPinching: boolean;
  pinchX: number; // 0 to 1 normalized
  pinchY: number; // 0 to 1 normalized
  isInsideOrb: boolean;
  isNearWindmill: boolean;
  currentTarget: InteractionTarget;
  isTargetHit: boolean;
  lastActionTriggered: string;
  landmarksCount: number;
  permissionStatus: 'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported';
  source: 'webcam' | 'mouse';
  lastPinchTime: number;
}

export type CreatureMood =
  | 'idle'
  | 'curious'
  | 'happy'
  | 'stuck'
  | 'helping'
  | 'playful'
  | 'returning'
  | 'resting'
  | 'dancing'
  | 'concerned'
  | 'working'
  | 'inviting';

export interface CreatureState {
  id: LumiType;
  name: string;
  colorTheme: {
    primary: string;
    secondary: string;
    glow: string;
    accent: string;
  };
  mood: CreatureMood;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  emote?: string;
}

export function isWindmillState(state: ExperienceState): boolean {
  return (
    state === ExperienceState.STATE_2A_DISCOVERY ||
    state === ExperienceState.STATE_2B_OBSERVATION ||
    state === ExperienceState.STATE_2C_INVITATION ||
    state === ExperienceState.STATE_2D_INTERACTION ||
    state === ExperienceState.STATE_2E_AUTONOMOUS ||
    state === ExperienceState.STATE_2F_SUCCESS ||
    state === ExperienceState.STATE_2G_CLOSURE ||
    state === ExperienceState.STATE_2_ZOOM_OUT
  );
}

export function isWindmillZoomed(state: ExperienceState): boolean {
  return (
    state === ExperienceState.STATE_2A_DISCOVERY ||
    state === ExperienceState.STATE_2B_OBSERVATION ||
    state === ExperienceState.STATE_2C_INVITATION ||
    state === ExperienceState.STATE_2D_INTERACTION ||
    state === ExperienceState.STATE_2E_AUTONOMOUS ||
    state === ExperienceState.STATE_2F_SUCCESS ||
    state === ExperienceState.STATE_2G_CLOSURE
  );
}

export function isSofaSequenceState(state: ExperienceState): boolean {
  return (
    state === ExperienceState.STATE_3_SOFA_ADVENTURE ||
    state === ExperienceState.STATE_3A_SPROUT_HEADREST ||
    state === ExperienceState.STATE_3B_SPROUT_JUMP ||
    state === ExperienceState.STATE_3C_BELLFLOWER_HEADREST ||
    state === ExperienceState.STATE_3D_BELLFLOWER_JUMP_TRAPPED
  );
}
