export type ExecutionEventType = 
  | 'ExecutionStarted'
  | 'ExecutionPaused'
  | 'ExecutionResumed'
  | 'ExecutionCompleted'
  | 'ExecutionCancelled'
  | 'ExecutionFailed'
  | 'StageStarted'
  | 'StageCompleted'
  | 'StageFailed'
  | 'ArtifactProduced'
  | 'QualityGateFailed';

export interface ExecutionEvent {
  type: ExecutionEventType;
  timestamp: string;
  workflowId: string;
  stageId?: string;
  payload?: any;
}

export class ExecutionLogger {
  private events: ExecutionEvent[] = [];

  log(event: Omit<ExecutionEvent, 'timestamp'>) {
    const fullEvent: ExecutionEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };
    this.events.push(fullEvent);
    // In production, this would emit to a central observability sink (e.g. Datadog)
  }

  getEvents(): ExecutionEvent[] {
    return [...this.events];
  }
}
