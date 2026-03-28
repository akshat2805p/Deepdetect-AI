import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const rootDir = process.cwd();
const clientRoot = path.join(rootDir, 'client');
const serverRoot = path.join(rootDir, 'server');

const requireFromServer = createRequire(path.join(serverRoot, 'package.json'));
const requireFromClient = createRequire(path.join(clientRoot, 'package.json'));
const { default: app } = requireFromServer('./dist/index.js');
const serverPort = Number(process.env.PORT || 5002);
const apiServer = http.createServer(app);

const viteModulePath = requireFromClient.resolve('vite');
const { createServer: createViteServer } = await import(pathToFileURL(viteModulePath).href);

const viteServer = await createViteServer({
  root: clientRoot,
  configFile: path.join(clientRoot, 'vite.config.ts'),
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
  },
});

const shutdown = async (signal) => {
  console.log(`\nShutting down (${signal})...`);

  await Promise.allSettled([
    new Promise((resolve) => apiServer.close(() => resolve())),
    viteServer.close(),
  ]);

  process.exit(0);
};

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

apiServer.listen(serverPort, () => {
  console.log(`API running on http://127.0.0.1:${serverPort}`);
});

await viteServer.listen();
viteServer.printUrls();
