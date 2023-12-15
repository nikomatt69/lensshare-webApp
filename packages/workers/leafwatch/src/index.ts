import { Errors } from '@lensshare/data/errors';
import response from '@lensshare/lib/response';
import { createCors, error, Router, status } from 'itty-router';

import ingest from './handlers/ingest';
import buildRequest from './helpers/buildRequest';
import type { Env, WorkerRequest } from './types';

const { preflight } = createCors({
  origins: ['*'],
  methods: ['HEAD', 'GET', 'POST']
});

const router = Router();

router
  .all('*', preflight)
  .head('*', () => status(200))
  .get('/', (request: WorkerRequest) =>
    response({
      message: 'gm, to leafwatch service 👋',
      version: request.env.RELEASE ?? 'unknown'
    })
  )
  .post('/ingest', ingest)
  .all('*', () => error(404));

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const incomingRequest = buildRequest(request, env, ctx);

    return await router.handle(incomingRequest).catch(() => {
      return error(500, Errors.InternalServerError);
    });
  }
};
