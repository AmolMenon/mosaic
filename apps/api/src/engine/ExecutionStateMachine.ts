export type EngineState = 
  | 'Queued'
  | 'Running'
  | 'Paused'
  | 'WaitingForHuman'
  | 'Retrying'
  | 'Failed'
  | 'Completed'
  | 'Cancelled';

export class ExecutionStateMachine {
  private state: EngineState = 'Queued';

  // Defines valid transitions FROM a given state
  private readonly transitions: Record<EngineState, EngineState[]> = {
    'Queued': ['Running', 'Cancelled'],
    'Running': ['Completed', 'Failed', 'Paused', 'WaitingForHuman', 'Cancelled'],
    'Paused': ['Running', 'Cancelled'],
    'WaitingForHuman': ['Running', 'Cancelled', 'Failed'],
    'Retrying': ['Running', 'Failed', 'Cancelled'],
    'Failed': ['Retrying', 'Cancelled'],
    'Completed': [], // Terminal
    'Cancelled': []  // Terminal
  };

  getState(): EngineState {
    return this.state;
  }

  transitionTo(newState: EngineState): void {
    const validNextStates = this.transitions[this.state];
    
    if (!validNextStates.includes(newState)) {
      throw new Error(`Illegal state transition: Cannot transition from ${this.state} to ${newState}`);
    }

    this.state = newState;
  }
}
