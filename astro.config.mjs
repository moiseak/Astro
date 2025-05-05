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
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/chunks/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js'
        }
      },
      // 添加 terser 配置
      terserOptions: {
        compress: {
          drop_console: true,  // 移除 console
          drop_debugger: true  // 移除 debugger
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