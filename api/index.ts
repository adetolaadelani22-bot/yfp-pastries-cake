import { Express } from 'express';
import { createApp } from '../server';

let appPromise: Promise<Express> | undefined;

export default async function handler(req: Express['request'], res: Express['response']) {
  appPromise ??= createApp();
  const app = await appPromise;
  return app(req, res);
}
