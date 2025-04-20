---
layout: /src/layouts/MarkdownPostLayout.astro
title: HashMap 是线程安全的吗？那线程安全的 Map 有哪些？
description: HashMap 是线程安全的吗？那线程安全的 Map 有哪些？
pubDate: 2025-04-18
---

HashMap 是非线程安全的，因为它不是同步的，多个线程同时对 HashMap 进行操作可能会导致数据不一致的问题。

Java 提供了多种线程安全的 Map 实现，包括：

ConcurrentHashMap：它是线程安全的，采用分段锁机制，不同的段（Segment）可以被不同的线程同时访问，从而提高了并发性能。

Hashtable：它是线程安全的，但是性能相对较差，因为它在每个方法上都使用了同步锁。

Collections.synchronizedMap：它可以将非线程安全的 Map 转换为线程安全的 Map，但是性能相对较差，因为它在每个方法上都使用了同步锁。

在选择线程安全的 Map 时，需要根据实际情况进行选择。如果需要高并发性能，可以选择 ConcurrentHashMap；如果需要完全的线程安全，可以选择 Hashtable；如果需要将非线程安全的 Map 转换为线程安全的 Map，可以选择 Collections.synchronizedMap。