---
layout: /src/layouts/MarkdownPostLayout.astro
title: ThreadLocal 实现原理
description: ThreadLocal 实现原理
pubDate: 2025-05-03
---
`ThreadLocal` 在 Java 中不是依赖操作系统 TLS，而是在每个 `Thread` 对象中维护一个 `ThreadLocalMap`，键为 `ThreadLocal` 实例（弱引用），值为对应线程私有变量。访问 `get()/set()` 时取当前线程的 map 操作。