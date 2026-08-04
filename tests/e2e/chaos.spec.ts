import { test, expect } from '@playwright/test';

test.describe('Chaos Engineering & Resilience', () => {
  test('Orchestrator should recover from abrupt database restart', async ({ request }) => {
    // Note: In a real CI environment, this test would interact with Docker to kill the DB container mid-flight
    // For this stub, we test the application's response to simulated connection drops.
    const res = await request.post('http://localhost:3000/api/v1/chaos/simulate-db-drop');
    expect(res.status()).toBe(200);

    const execRes = await request.post('http://localhost:3000/api/v1/executions', {
      data: { projectId: 'p1', documentId: 'd1' }
    });
    // The system should have auto-reconnected via Prisma/TypeORM
    expect(execRes.status()).toBe(200);
  });

  test('Worker should route to DLQ on persistent provider failure', async ({ request }) => {
    // 1. Force the provider to throw a non-transient error 3 times
    await request.post('http://localhost:3000/api/v1/chaos/mock-provider-failure', {
      data: { provider: 'EntityExtraction', errorType: 'OOM', retries: 3 }
    });
    
    // 2. Trigger execution
    const execRes = await request.post('http://localhost:3000/api/v1/executions', {
      data: { projectId: 'p1', documentId: 'd2' }
    });
    
    const executionId = await execRes.json().then(j => j.data.id);
    
    // 3. Wait for DLQ processing
    await new Promise(r => setTimeout(r, 5000));
    
    // 4. Verify execution status is marked unrecoverable
    const statusRes = await request.get(`http://localhost:3000/api/v1/executions/${executionId}`);
    const status = await statusRes.json().then(j => j.data.status);
    
    expect(status).toBe('UNRECOVERABLE_FAILURE');
  });
});
