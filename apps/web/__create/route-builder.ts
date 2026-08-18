import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Hono } from 'hono';
import type { Handler } from 'hono/types';
import updatedFetch from '../src/__create/fetch';

const API_BASENAME = '/api';
const api = new Hono();

if (globalThis.fetch) {
  globalThis.fetch = updatedFetch;
}

// 1. Static glob importing for Vite / Vercel bundler support
const routeGlobModules = import.meta.glob('../src/app/api/**/route.js', { eager: true });

function registerGlobRoutes() {
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

  for (const [filePath, module] of Object.entries(routeGlobModules)) {
    const routeModule = module as Record<string, any>;
    let relative = filePath.replace(/^.*\/src\/app\/api\//, '').replace(/\/route\.js$/, '');
    if (relative === 'route.js' || relative === '') relative = '';

    const segments = relative.split('/').filter(Boolean).map((seg) => {
      const match = seg.match(/^\[(\.{3})?([^\]]+)\]$/);
      if (match) {
        const [_, dots, param] = match;
        return dots === '...' ? `:${param}{.+}` : `:${param}`;
      }
      return seg;
    });

    const honoPath = '/' + segments.join('/');

    for (const method of methods) {
      if (routeModule[method]) {
        const handler: Handler = async (c) => {
          const params = c.req.param();
          return await routeModule[method](c.req.raw, { params });
        };
        const methodLower = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
        api[methodLower](honoPath, handler);
      }
    }
  }
}

// 2. Dynamic readdir registration fallback
let __dirname = '';
try {
  __dirname = join(fileURLToPath(new URL('.', import.meta.url)), '../src/app/api');
  if (!__dirname.includes('src/app/api') || __dirname.includes('build/server')) {
    __dirname = join(process.cwd(), 'src/app/api');
  }
} catch (e) {
  __dirname = join(process.cwd(), 'src/app/api');
}

async function findRouteFiles(dir: string): Promise<string[]> {
  const files = await readdir(dir).catch(() => []);
  let routes: string[] = [];

  for (const file of files) {
    try {
      const filePath = join(dir, file);
      const statResult = await stat(filePath);

      if (statResult.isDirectory()) {
        routes = routes.concat(await findRouteFiles(filePath));
      } else if (file === 'route.js') {
        routes.push(filePath);
      }
    } catch (error) {
      console.error(`Error reading file ${file}:`, error);
    }
  }

  return routes;
}

function getHonoPath(routeFile: string): { name: string; pattern: string }[] {
  const relativePath = routeFile.replace(__dirname, '').replace(/\\/g, '/');
  const parts = relativePath.split('/').filter(Boolean);
  const routeParts = parts.slice(0, -1);
  if (routeParts.length === 0) {
    return [{ name: 'root', pattern: '' }];
  }
  return routeParts.map((segment) => {
    const match = segment.match(/^\[(\.{3})?([^\]]+)\]$/);
    if (match) {
      const [_, dots, param] = match;
      return dots === '...'
        ? { name: param, pattern: `:${param}{.+}` }
        : { name: param, pattern: `:${param}` };
    }
    return { name: segment, pattern: segment };
  });
}

async function registerDynamicRoutes() {
  const routeFiles = (await findRouteFiles(__dirname)).sort((a, b) => b.length - a.length);

  for (const routeFile of routeFiles) {
    try {
      const fileUrl = pathToFileURL(routeFile).href;
      const route = await import(/* @vite-ignore */ `${fileUrl}`);
      const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

      for (const method of methods) {
        if (route[method]) {
          const parts = getHonoPath(routeFile);
          const honoPath = `/${parts.map(({ pattern }) => pattern).join('/')}`;
          const handler: Handler = async (c) => {
            const params = c.req.param();
            return await route[method](c.req.raw, { params });
          };
          const methodLowercase = method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
          api[methodLowercase](honoPath, handler);
        }
      }
    } catch (error) {
      console.error(`Error importing route file ${routeFile}:`, error);
    }
  }
}

async function initRoutes() {
  api.routes = [];
  if (Object.keys(routeGlobModules).length > 0) {
    registerGlobRoutes();
  } else {
    await registerDynamicRoutes();
  }
}

await initRoutes();

// Hot reload routes in development
if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept((newSelf) => {
    initRoutes().catch((err) => {
      console.error('Error reloading routes:', err);
    });
  });
}

export { api, API_BASENAME };

