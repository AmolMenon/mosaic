import { ReasoningOrchestrator } from '../../../apps/api/src/orchestrators/reasoning/ReasoningOrchestrator';
import { UnitOfWork } from '../../../apps/api/src/infrastructure/persistence/UnitOfWork';

describe('Reasoning Pipeline Integration', () => {
  let orchestrator: ReasoningOrchestrator;
  let uow: UnitOfWork;

  beforeAll(() => {
    uow = new UnitOfWork();
    orchestrator = new ReasoningOrchestrator(uow);
  });

  it('should successfully execute the complete pipeline and persist artifacts', async () => {
    const documentId = 'test-doc-id';
    const projectId = 'test-project-id';
    
    const execution = await orchestrator.execute(projectId, documentId);
    
    expect(execution).toBeDefined();
    expect(execution.status).toBe('COMPLETED');
    
    // Verify persistence
    const artifacts = await uow.artifacts.findByExecutionId(execution.id);
    expect(artifacts.length).toBeGreaterThan(0);
    
    const evidence = artifacts.filter(a => a.type === 'EVIDENCE');
    const hypotheses = artifacts.filter(a => a.type === 'HYPOTHESIS');
    
    expect(evidence.length).toBeGreaterThan(0);
    expect(hypotheses.length).toBeGreaterThan(0);
  });

  it('should support resumption from checkpoint after failure', async () => {
    // Simulate failure at Hypothesis generation
    jest.spyOn(orchestrator as any, 'runHypothesisGeneration').mockRejectedValueOnce(new Error('Simulated Crash'));
    
    const executionId = 'failed-exec-id';
    await expect(orchestrator.execute('proj', 'doc', executionId)).rejects.toThrow('Simulated Crash');
    
    // Verify checkpoint exists
    const checkpoint = await uow.checkpoints.findById(executionId);
    expect(checkpoint.lastCompletedStage).toBe('EVIDENCE_EXTRACTION');

    // Resume execution
    jest.restoreAllMocks();
    const resumedExecution = await orchestrator.resume(executionId);
    
    expect(resumedExecution.status).toBe('COMPLETED');
  });

  it('should rollback transaction on complete unrecoverable failure', async () => {
    jest.spyOn(uow, 'commit').mockRejectedValueOnce(new Error('DB Deadlock'));
    const rollbackSpy = jest.spyOn(uow, 'rollback');

    await expect(orchestrator.execute('proj', 'doc')).rejects.toThrow('DB Deadlock');
    expect(rollbackSpy).toHaveBeenCalled();
  });
});
