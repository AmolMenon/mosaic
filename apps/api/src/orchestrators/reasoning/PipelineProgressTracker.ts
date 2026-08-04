export type ProgressState = 
  | "Preparing Workflow"
  | "Parsing Document"
  | "Extracting Entities"
  | "Building Evidence"
  | "Generating Hypotheses"
  | "Running IC Review"
  | "Packaging Results"
  | "Completed"
  | "Failed"
  | "Recovered";

export class PipelineProgressTracker {
  private currentState: ProgressState = "Preparing Workflow";
  private history: { state: ProgressState, timestamp: number }[] = [];

  updateState(newState: ProgressState) {
    // Prevent regression
    if (this.currentState === "Completed" || this.currentState === "Failed") {
      if (newState !== "Recovered") {
        return;
      }
    }
    
    this.currentState = newState;
    this.history.push({ state: newState, timestamp: Date.now() });
  }

  getState(): ProgressState {
    return this.currentState;
  }

  getHistory() {
    return this.history;
  }
}
