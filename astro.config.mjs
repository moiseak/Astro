// @ts-check
import { defineConfig } from 'astro/config';


export default defineConfig({
  prefetch: {
    prefetchAll: true
  },
  site: "https://zephyrblog.netlify.app",
  markdown: {
    shikiConfig: {
      theme:"light-plus",
      langAlias: {
        Java: "java",
        JAva: "java"
      },
      wrap: true,
    },
  },
});