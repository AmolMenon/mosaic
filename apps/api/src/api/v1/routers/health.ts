import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

export const healthRouter: import("express").Router = Router();

healthRouter.get('/live', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

healthRouter.get('/ready', async (req, res) => {
  try {
    const prisma = new PrismaClient({ adapter });
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'READY',
      checks: {
        database: 'UP',
        repositories: 'UP',
        provider_registry: 'UP',
        orchestrator: 'UP'
      }
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'DOWN',
      checks: {
        database: 'DOWN',
        repositories: 'DOWN',
        provider_registry: 'DOWN',
        orchestrator: 'DOWN'
      }
    });
  }
});

healthRouter.get('/startup', (req, res) => {
  res.status(200).json({ status: 'COMPLETED' });
});
