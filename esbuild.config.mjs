// esbuild.config.mjs
import * as esbuild from 'esbuild';
import { config } from 'dotenv';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

// 👇 this loads .env
config();

await esbuild.build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/extension.js',
  external: ['vscode'],
  plugins: [nodeExternalsPlugin()],
  define: {
    // 👇 this inlines the API key at build time
    'process.env.OPENAI_API_KEY': JSON.stringify(process.env.OPENAI_API_KEY || ''),
  },
});
