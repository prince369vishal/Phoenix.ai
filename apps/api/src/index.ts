import Fastify from 'fastify';
import { logger } from '@phoenix-ai/shared';
import { registerHealthRoutes } from './routes/health.js';

const app = Fastify({ logger: false });

registerHealthRoutes(app);

const port = Number(process.env.PORT ?? 3001);

app
  .listen({ port, host: '0.0.0.0' })
  .then(() => logger.info(`api listening on :${port}`))
  .catch((err: unknown) => {
    logger.error('failed to start api', { err: String(err) });
    process.exit(1);
  });
