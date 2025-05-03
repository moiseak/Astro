---
layout: /src/layouts/MarkdownPostLayout.astro
title: String 的底层存储结构
description: String 的底层存储结构
pubDate: 2025-05-03
---
## `Integer a = 1, b = 1; a == b?`

由于自动装箱（`Integer.valueOf(int)`）会缓存 [-128,127] 范围内的 `Integer` 对象，`a==b` 对于 `1` 返回 `true`。