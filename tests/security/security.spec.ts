import { test, expect } from '@playwright/test';

test.describe('Security Headers Validation', () => {
  test('API should return strict security headers', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/v1/health/live');
    
    const headers = response.headers();
    
    expect(headers['strict-transport-security']).toContain('max-age=31536000');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['x-xss-protection']).toBe('1; mode=block');
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['content-security-policy']).toBeDefined();
    
    // Server should not reveal technology stack
    expect(headers['x-powered-by']).toBeUndefined();
  });

  test('API should reject unauthenticated requests to protected endpoints', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/v1/executions', {
      data: { projectId: 'test', documentId: 'test' }
    });
    
    expect(response.status()).toBe(401);
  });
});
