---
layout: /src/layouts/MarkdownPostLayout.astro
title: String 的底层存储结构
description: String 的底层存储结构
pubDate: 2025-04-23
---
## String 的底层存储结构

- **Java 8 及以前**：`private final char[] value`，每字符 2 字节 UTF‑16。
    
- **Java 9+（紧凑字符串）**：`private final byte[] value; private final byte coder`，当全为 Latin‑1 字符时以 1 字节存储，否则 UTF‑16。

Java 9 这样调整的目的是减小字符串的内存占用，这样带来了两个好处：

1. **节省内存**：对于包含大量`ASCII`字符的字符串，内存占用大幅减少，因为每个字符只占用一个字节而不是两个字节。
2. **提高性能**：由于字符串的存储结构与编码方式更加紧凑，字符串操作的性能也有所提高。


在 Java 9 中，`String` 支持的字符编码格式有两种：

`Latin-1`：`Latin-1` 编码用于存储只包含拉丁字符的字符串。它采用了一字节编码，每个字符占用一个字节（8位）。

UTF-16`：`UTF-16` 编码用于存储包含非拉丁字符的字符串，以及当字符串包含不适合 `Latin-1` 编码的字符时。

在 Java 9 中，`String` 多了一个成员变量 `coder`，它代表编码的格式，0 表示 `Latin-1` ，1 表示 `UTF-16`，我们在看 `skString1` 和 `skString2`：

  