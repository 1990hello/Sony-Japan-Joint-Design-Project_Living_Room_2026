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

      // ---------------- STATE 2: BROKEN WINDMILL FIELD (SUB-STATES) ----------------
      case ExperienceState.STATE_2A_DISCOVERY:
        this.config.onPlayChirp('curious');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_2B_OBSERVATION);
          }, 3500);
        }
        break;

      case ExperienceState.STATE_2B_OBSERVATION:
        this.config.onPlayChirp('curious');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_2C_INVITATION);
          }, 4000);
        }
        break;

      case ExperienceState.STATE_2C_INVITATION:
        this.config.onPlayChirp('alert');
        // User may interact (transitionTo STATE_2D_INTERACTION).
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
            this.config.onPlayChirp('curious');
            this.transitionTo(ExperienceState.STATE_3_SOFA_ADVENTURE);
          }, 4200);
        }
        break;

      // ---------------- REMAINING STATES ----------------
      case ExperienceState.STATE_3_SOFA_ADVENTURE:
        this.config.onPlayChirp('alert');
        if (this.config.autoTransitions) {
          this.addTimer(() => {
            this.transitionTo(ExperienceState.STATE_4_HELPING_FRIEND);
          }, 3200);
        }
        break;

      case ExperienceState.STATE_4_HELPING_FRIEND:
        this.config.onPlayChirp('curious');
        // Autonomous heave triggers in App.tsx or timer after 5.5s if user does nothing
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
        // Persistent living decoration state inside the orb.
        // Never auto-emerges again!
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
      ExperienceState.STATE_3_SOFA_ADVENTURE,
      ExperienceState.STATE_4_HELPING_FRIEND,
      ExperienceState.STATE_5_FREE_PLAY,
      ExperienceState.STATE_6_RETURN_TO_ORB,
      ExperienceState.STATE_7_LUMORI_IDLING,
    ];
    const currentIndex = sequence.indexOf(this.currentState);
    const nextIndex = (currentIndex + 1) % sequence.length;
    this.transitionTo(sequence[nextIndex]);
  }

  public reset() {
    this.transitionTo(ExperienceState.STATE_0_DORMANT_ORB);
  }
}
