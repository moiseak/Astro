// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: "https://moiads.xyz/",
  integrations: [preact()],
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['astro'],
            'preact': ['preact']
          }
        }
      }
    },
    ssr: {
      noExternal: ['astro']
    },
    // 添加性能优化配置
    optimizeDeps: {
      exclude: ['@astrojs/preact/client.js']
    }
  }
});