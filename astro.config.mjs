// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: "https://zephyrblog.netlify.app",
  integrations: [preact()],
  markdown: {
    shikiConfig: {
      theme:"light-plus",
      langAlias: {
        Java: "java",
        JAva: "java"
      },
      wrap: true,
    },
    
    // 启用自动换行以防止水平滚动
  },
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
          },
          // 添加代码分割优化
          // 由于 chunkSizeWarningLimit 不是 rollup 的标准选项，移至 vite.build.chunkSizeWarningLimit
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    },
    ssr: {
      noExternal: ['astro']
    },
    optimizeDeps: {
      exclude: ['@astrojs/preact/client.js']
    },
    // 添加内存优化配置
    server: {
      hmr: {
        overlay: false
      },
      watch: {
        usePolling: false
      }
    }
  },
  // 添加性能优化
  output: 'static',
  compressHTML: true
});