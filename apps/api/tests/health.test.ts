import { describe, expect, it } from 'vitest';
import Fastify from 'fastify';
import { registerHealthRoutes } from '../src/routes/health.js';

describe('GET /health', () => {
  it('returns ok', async () => {
    const app = Fastify();
    registerHealthRoutes(app);
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: 'ok' });
  });
});
