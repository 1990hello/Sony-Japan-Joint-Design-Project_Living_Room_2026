import { ExperienceState } from './types';

export interface StateMachineConfig {
  autoTransitions: boolean;
  onStateChange: (state: ExperienceState) => void;
  onPlayChirp: (type: 'greet' | 'curious' | 'happy' | 'alert') => void;
  onPlayWaterfall: () => void;
  onPlayPop: () => void;
  onPlayOrb: () => void;
}

export class LumoriStateMachine {
  private currentState: ExperienceState = ExperienceState.STATE_0_DORMANT_ORB;
  private config: StateMachineConfig;
  private activeTimers: number[] = [];

  constructor(config: StateMachineConfig) {
    this.config = config;
  }

  public getState(): ExperienceState {
    return this.currentState;
  }

  public setAutoTransitions(enabled: boolean) {
    this.config.autoTransitions = enabled;
  }

  public getAutoTransitions(): boolean {
    return this.config.autoTransitions;
  }

  public clearAllTimers() {
    this.activeTimers.forEach((timerId) => clearTimeout(timerId));
    this.activeTimers = [];
  }

  private addTimer(fn: () => void, delayMs: number): number {
    const id = window.setTimeout(() => {
      this.activeTimers = this.activeTimers.filter((t) => t !== id);
      fn();
    }, delayMs);
    this.activeTimers.push(id);
    return id;
  }

  public transitionTo(nextState: ExperienceState) {
    this.clearAllTimers();
    this.currentState = nextState;
    console.log(`[Lumori StateMachine] Transitioned to: ${ExperienceState[nextState] || nextState}`);
    this.config.onStateChange(nextState);
    this.onEnterState(nextState);
  }

  private onEnterState(state: ExperienceState) {
    switch (state) {
      case ExperienceState.STATE_0_DORMANT_ORB:
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.config.onPlayOrb();
            this.transitionTo(ExperienceState.STATE_1_EMERGENCE);
          }, 3500);
        }
        break;

      case ExperienceState.STATE_1_EMERGENCE:
        this.config.onPlayChirp('greet');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.config.onPlayChirp('curious');
            this.transitionTo(ExperienceState.STATE_2A_DISCOVERY);
          }, 4500);
        }
        break;

      // ---------------- STATE 2: BROKEN WINDMILL FIELD (CAMERA ZOOMS IN) ----------------
      case ExperienceState.STATE_2A_DISCOVERY:
        // Camera smoothly zooms in towards the windmill on the coffee table
        this.config.onPlayChirp('curious');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_2B_OBSERVATION);
          }, 3500);
        }
        break;

      case ExperienceState.STATE_2B_OBSERVATION:
        // Lumis inspect hub; Sakura searches crate for tool and carries it over
        this.config.onPlayChirp('curious');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_2C_INVITATION);
          }, 4500);
        }
        break;

      case ExperienceState.STATE_2C_INVITATION:
        this.config.onPlayChirp('alert');
        // User may assist (transitionTo STATE_2D_INTERACTION).
        // If user does not interact, autonomous fallback triggers after 6.5s:
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_2E_AUTONOMOUS);
          }, 6500);
        }
        break;

      case ExperienceState.STATE_2D_INTERACTION:
        // User interacted! Blades start moving, Lumori cheer
        this.config.onPlayChirp('happy');
        this.config.onPlayWaterfall();
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_2F_SUCCESS);
          }, 2500);
        }
        break;

      case ExperienceState.STATE_2E_AUTONOMOUS:
        // Lumori coordinate to free the gear independently
        this.config.onPlayChirp('curious');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.config.onPlayWaterfall();
            this.transitionTo(ExperienceState.STATE_2F_SUCCESS);
          }, 3000);
        }
        break;

      case ExperienceState.STATE_2F_SUCCESS:
        // Windmill spins smoothly, lively petals and cheers
        this.config.onPlayChirp('happy');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_2G_CLOSURE);
          }, 4000);
        }
        break;

      case ExperienceState.STATE_2G_CLOSURE:
        // Activity calms down; Lumori admire working mill
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_2_ZOOM_OUT);
          }, 3500);
        }
        break;

      case ExperienceState.STATE_2_ZOOM_OUT:
        // Camera smoothly zooms out to original full room perspective (1.4s)
        // Ensure camera transition finishes completely (2000ms) before starting sofa sequence!
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.config.onPlayChirp('curious');
            this.transitionTo(ExperienceState.STATE_3A_SPROUT_HEADREST);
          }, 2000);
        }
        break;

      // ---------------- SOFA SEQUENCE (EXPLICIT JUMP & TRAPPED STATES) ----------------
      case ExperienceState.STATE_3_SOFA_ADVENTURE:
        // Redirect to Step 3A if triggered directly
        this.transitionTo(ExperienceState.STATE_3A_SPROUT_HEADREST);
        break;

      case ExperienceState.STATE_3A_SPROUT_HEADREST:
        // Step 3: First Lumi (Sprout) reaches the sofa headrest with clear starting pose
        this.config.onPlayChirp('curious');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_3B_SPROUT_JUMP);
          }, 1600);
        }
        break;

      case ExperienceState.STATE_3B_SPROUT_JUMP:
        // Step 4: Sprout visibly jumps down from headrest onto the seat cushion & settles
        this.config.onPlayChirp('happy');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_3C_BELLFLOWER_HEADREST);
          }, 1800);
        }
        break;

      case ExperienceState.STATE_3C_BELLFLOWER_HEADREST:
        // Step 5: Second Lumi (Bellflower) hops onto the headrest with clear starting pose
        this.config.onPlayChirp('greet');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_3D_BELLFLOWER_JUMP_TRAPPED);
          }, 1600);
        }
        break;

      case ExperienceState.STATE_3D_BELLFLOWER_JUMP_TRAPPED:
        // Step 6: Bellflower jumps forward & down, slipping head-first into cushion crevice!
        this.config.onPlayChirp('alert');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_4_HELPING_FRIEND);
          }, 2000);
        }
        break;

      case ExperienceState.STATE_4_HELPING_FRIEND:
        // Step 7: Rescue - Sprout tries to pull Bellflower free; user can pinch or click
        this.config.onPlayChirp('curious');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.config.onPlayPop();
            this.transitionTo(ExperienceState.STATE_4B_RESCUED_REUNION);
          }, 6000);
        }
        break;

      case ExperienceState.STATE_4B_RESCUED_REUNION:
        // Trapped Lumi emerges onto seat cushion. Both Lumis celebrate together!
        this.config.onPlayChirp('happy');
        // Automatically advance to Free Play after celebration without requiring another input!
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_5_FREE_PLAY);
          }, 2800);
        }
        break;

      case ExperienceState.STATE_5_FREE_PLAY:
        this.config.onPlayChirp('happy');
        // Persistent until user calls them home by pinching at orb
        break;

      case ExperienceState.STATE_6_RETURN_TO_ORB:
        this.config.onPlayChirp('alert');
        this.addTimer(() => {
          this.config.onPlayOrb();
          this.transitionTo(ExperienceState.STATE_7_LUMORI_IDLING);
        }, 3800);
        break;

      case ExperienceState.STATE_7_LUMORI_IDLING:
        // Stage 1: Lumori Settle - Lumis settle quietly into their resting position inside the orb
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_8_REVEAL_ORB);
          }, 3400);
        }
        break;

      case ExperienceState.STATE_8_REVEAL_ORB:
        // Stage 2: Reveal the whole physical orb in the living room on the shelf
        this.config.onPlayOrb();
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_9_ENTER_MINIATURE_WORLD);
          }, 2800);
        }
        break;

      case ExperienceState.STATE_9_ENTER_MINIATURE_WORLD:
        // Stage 3: Spatial camera travel into the miniature world
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_10_SEASONAL_WORLD);
          }, 2600);
        }
        break;

      case ExperienceState.STATE_10_SEASONAL_WORLD:
        // Stage 4: Enable exploration in the persistent miniature seasonal world
        // Exploration is enabled indefinitely; no automatic return to living room!
        break;
    }
  }

  public start() {
    this.transitionTo(ExperienceState.STATE_0_DORMANT_ORB);
  }

  public next() {
    const sequence: ExperienceState[] = [
      ExperienceState.STATE_0_DORMANT_ORB,
      ExperienceState.STATE_1_EMERGENCE,
      ExperienceState.STATE_2A_DISCOVERY,
      ExperienceState.STATE_2B_OBSERVATION,
      ExperienceState.STATE_2C_INVITATION,
      ExperienceState.STATE_2D_INTERACTION,
      ExperienceState.STATE_2F_SUCCESS,
      ExperienceState.STATE_2G_CLOSURE,
      ExperienceState.STATE_2_ZOOM_OUT,
      ExperienceState.STATE_3A_SPROUT_HEADREST,
      ExperienceState.STATE_3B_SPROUT_JUMP,
      ExperienceState.STATE_3C_BELLFLOWER_HEADREST,
      ExperienceState.STATE_3D_BELLFLOWER_JUMP_TRAPPED,
      ExperienceState.STATE_4_HELPING_FRIEND,
      ExperienceState.STATE_4B_RESCUED_REUNION,
      ExperienceState.STATE_5_FREE_PLAY,
      ExperienceState.STATE_6_RETURN_TO_ORB,
      ExperienceState.STATE_7_LUMORI_IDLING,
      ExperienceState.STATE_8_REVEAL_ORB,
      ExperienceState.STATE_9_ENTER_MINIATURE_WORLD,
      ExperienceState.STATE_10_SEASONAL_WORLD,
    ];
    const currentIndex = sequence.indexOf(this.currentState);
    const nextIndex = (currentIndex + 1) % sequence.length;
    this.transitionTo(sequence[nextIndex]);
  }

  public reset() {
    this.transitionTo(ExperienceState.STATE_0_DORMANT_ORB);
  }
}
