import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/live', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

healthRouter.get('/ready', (req, res) => {
  // In a real app, verify database, repository, provider registry here
  res.status(200).json({ 
    status: 'READY',
    checks: {
      database: 'UP',
      repositories: 'UP',
      provider_registry: 'UP',
      orchestrator: 'UP'
    }
  });
});

healthRouter.get('/startup', (req, res) => {
  res.status(200).json({ status: 'COMPLETED' });
});
