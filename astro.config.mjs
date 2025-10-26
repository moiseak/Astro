// @ts-check
import { defineConfig } from "astro/config";


export default defineConfig({
  // site 与 base
  site: "https://zephyrus612.netlify.app",
  base: "/", // 根据站点子路径调整
  trailingSlash: "never", // "always" | "never" | "ignore"，按部署需求选


  markdown: {
    shikiConfig: {
      theme: "github-light", // 或 "github-dark", "light-plus" 等，按喜好替换
      langAlias: {
        Java: "java",
        JAva: "java",
      },
      wrap: true,

    },

  },

  // Vite 级别优化（针对开发与构建）
  vite: {
    build: {
      target: "es2020",
      minify: "esbuild",
    },
    optimizeDeps: {
      // 如果有大量 glob/import 依赖，列出会加速冷启动
      include: [],
    },
    server: {
      fs: {
        // 允许访问项目外部文件（Windows 路径可能需要）
        allow: [".."],
      },
    },
  },

  // 其它可选：开启预渲染或缓存策略按需配置
});
