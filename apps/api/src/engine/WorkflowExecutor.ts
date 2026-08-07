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
    
    // Lazy loaded to avoid circular deps if any
    const { ExecutionRepository } = require("../infrastructure/persistence/repositories/ExecutionRepository");
    const executionRepo = new ExecutionRepository(this.context.db);
    
    // We assume the execution row already exists, just update its status
    await this.context.uow.startTransaction();
    executionRepo.update(pipeline.id, {
      status: "RUNNING",
      progress_state: "STARTED"
    }, 1, this.context.uow);
    await this.context.uow.commit();

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
          await this.context.uow.startTransaction();
          executionRepo.update(pipeline.id, {
            status: "PAUSED",
            progress_state: `WAITING_FOR_HUMAN_${stage.id}`
          }, 2, this.context.uow);
          await this.context.uow.commit();
          return; // Halts workflow loop
        }
      }

      this.stateMachine.transitionTo('Completed');
      this.context.logger.log({ type: "ExecutionCompleted", workflowId: pipeline.id });
      await this.context.uow.startTransaction();
      executionRepo.update(pipeline.id, {
        status: "COMPLETED",
        progress_state: "DONE"
      }, 2, this.context.uow);
      await this.context.uow.commit();
    } catch (err: any) {
      this.stateMachine.transitionTo('Failed');
      this.context.logger.log({ type: "ExecutionFailed", workflowId: pipeline.id, payload: err.message });
      await this.context.uow.startTransaction();
      executionRepo.update(pipeline.id, {
        status: "FAILED",
        progress_state: "ERROR"
      }, 2, this.context.uow);
      await this.context.uow.commit();
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
