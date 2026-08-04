import { IngestionPipeline } from "@mosaic/contracts";
import { ExecutionContext } from "./ExecutionContext";
import { ExecutionStateMachine } from "./ExecutionStateMachine";
import { StageExecutor } from "./StageExecutor";

export class WorkflowExecutor {
  private stateMachine = new ExecutionStateMachine();

  constructor(private context: ExecutionContext) {}

  async execute(pipeline: IngestionPipeline, stageProviders: Record<string, string>): Promise<void> {
    this.context.logger.log({ type: "ExecutionStarted", workflowId: pipeline.id });
    this.stateMachine.transitionTo('Running');

    const stageExecutor = new StageExecutor(this.context);

    try {
      for (const stage of pipeline.stages) {
        if (stage.status === 'success' || stage.status === 'skipped') {
          continue; // Already done
        }

        const providerName = stageProviders[stage.id];
        if (!providerName) {
          throw new Error(`No provider mapped for stage ${stage.id}`);
        }

        const success = await stageExecutor.execute(stage, providerName);

        if (!success && stage.status === 'awaiting_human') {
          this.stateMachine.transitionTo('WaitingForHuman');
          this.context.logger.log({ type: "ExecutionPaused", workflowId: pipeline.id });
          return; // Halts workflow loop
        }
      }

      this.stateMachine.transitionTo('Completed');
      this.context.logger.log({ type: "ExecutionCompleted", workflowId: pipeline.id });
    } catch (err: any) {
      this.stateMachine.transitionTo('Failed');
      this.context.logger.log({ type: "ExecutionFailed", workflowId: pipeline.id, payload: err.message });
      throw err;
    }
  }

  resume(): void {
    if (this.stateMachine.getState() !== 'WaitingForHuman' && this.stateMachine.getState() !== 'Paused') {
      throw new Error(`Cannot resume from state ${this.stateMachine.getState()}`);
    }
    
    this.stateMachine.transitionTo('Running');
    this.context.logger.log({ type: "ExecutionResumed", workflowId: this.context.workflowId });
    // In a full implementation, this would trigger the execute loop from currentStageIndex
  }

  getState(): string {
    return this.stateMachine.getState();
  }
}
