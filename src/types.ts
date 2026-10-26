export enum ExperienceState {
  STATE_0_DORMANT_ORB = 0,
  STATE_1_EMERGENCE = 1,
  // State 2: Broken Windmill Field (Sub-states 2A - 2G)
  STATE_2A_DISCOVERY = 20,
  STATE_2B_OBSERVATION = 21,
  STATE_2C_INVITATION = 22,
  STATE_2D_INTERACTION = 23,
  STATE_2E_AUTONOMOUS = 24,
  STATE_2F_SUCCESS = 25,
  STATE_2G_CLOSURE = 26,
  // Remaining States
  STATE_3_SOFA_ADVENTURE = 3,
  STATE_4_HELPING_FRIEND = 4,
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
    name: "2A — Windmill Discovery",
    shortDesc: "A tiny windmill field appears on the coffee table.",
    userHint: "The Lumori gather around the broken windmill on the table.",
  },
  [ExperienceState.STATE_2B_OBSERVATION]: {
    id: ExperienceState.STATE_2B_OBSERVATION,
    name: "2B — Windmill Observation",
    shortDesc: "The Lumori inspect the stalled windmill blades.",
    userHint: "One Lumori inspects the cog while another tries to push the blade.",
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
  [ExperienceState.STATE_3_SOFA_ADVENTURE]: {
    id: ExperienceState.STATE_3_SOFA_ADVENTURE,
    name: "3 — Sofa Adventure",
    shortDesc: "Lumi leaps and slips between sofa cushions!",
    userHint: "Bellflower Lumi got playfully stuck between the cushions!",
  },
  [ExperienceState.STATE_4_HELPING_FRIEND]: {
    id: ExperienceState.STATE_4_HELPING_FRIEND,
    name: "4 — Helping a Friend",
    shortDesc: "Rescue your friend together or watch the autonomous heave.",
    userHint: "Click/pinch the trapped Lumi to pull free, or watch Sprout help.",
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

export interface HandTrackingState {
  isActive: boolean;
  isPinching: boolean;
  pinchX: number; // 0 to 1 normalized
  pinchY: number; // 0 to 1 normalized
  isInsideOrb: boolean;
  isNearWindmill: boolean;
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
    state === ExperienceState.STATE_2G_CLOSURE
  );
}
