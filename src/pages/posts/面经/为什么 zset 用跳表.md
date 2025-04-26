---
layout: /src/layouts/MarkdownPostLayout.astro
title: 为什么 zset 用跳表
description: 为什么 zset 用跳表
pubDate: 2025-04-26
---
- **内存友好**：跳表基于链表，通过多级索引加速查询，**内存访问模式更符合CPU缓存局部性**（指针跳跃更少）。
- **简单灵活**：插入/删除时仅需调整局部指针，无需复杂的节点分裂与合并。
- 跳表实现简单