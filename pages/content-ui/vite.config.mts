import { resolve } from 'node:path';
import { makeEntryPointPlugin } from '@extension/hmr';
import { withPageConfig } from '@extension/vite-config';
import { IS_DEV, IS_PROD } from '@extension/env';

const rootDir = resolve(import.meta.dirname);
const srcDir = resolve(rootDir, 'src');

export default withPageConfig({
  resolve: {
    alias: {
      '@src': srcDir,
    },
  },
  esbuild: {
    drop: IS_PROD ? ['console', 'debugger'] : [],
  },
  plugins: [IS_DEV && makeEntryPointPlugin()],
  publicDir: resolve(rootDir, 'public'),
  build: {
    lib: {
      name: 'contentUI',
      fileName: 'index',
      formats: ['iife'],
      entry: resolve(srcDir, 'index.tsx'),
    },
    outDir: resolve(rootDir, '..', '..', 'dist', 'content-ui'),
  },
});
