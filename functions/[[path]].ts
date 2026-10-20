/**
 * Cloudflare Pages Functions adapter
 * Automatically bridges all incoming requests to worker/index.ts
 * Enables Cloudflare Pages to immediately recognize D1 database bindings
 */
import worker, { Env } from '../worker/index';

export const onRequest = async (context: { request: Request; env: Env }): Promise<Response> => {
  return worker.fetch(context.request, context.env);
};
