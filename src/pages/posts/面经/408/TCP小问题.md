---
layout: /src/layouts/MarkdownPostLayout.astro
title: TCP小问题
description: TCP小问题
pubDate: 2025-05-03
---
## TCP 协议的状态

TCP 连接状态共 11 种：`LISTEN`、`SYN-SENT`、`SYN-RECEIVED`、`ESTABLISHED`、`FIN-WAIT-1`、`FIN-WAIT-2`、`CLOSE-WAIT`、`CLOSING`、`LAST-ACK`、`TIME-WAIT`、`CLOSED`。

## 握手/挥手的初始序列号是多少，如何生成的

- **初始序列号（ISN）**：三次握手时客户端/服务端分别生成随机 32 位数作为 ISN，避免安全风险。 
    
- **生成方式**：遵循 RFC 6528，以加密安全的伪随机数生成器产生。

## TCP 握手时，还交换了哪些信息

除 SYN/ACK/ACK 标志和序列号外，还交换**窗口大小**（advertised window）用于流量控制。

## TCP 头部字段与选项

- **字段**：源端口、目的端口、序列号、确认号、数据偏移、保留位、控制位（URG/ACK/PSH/RST/SYN/FIN）、窗口、校验和、紧急指针、选项、填充。 
- **常见选项**：最大报文段长度（MSS）、窗口缩放（Window Scale）、SACK 可选、时间戳（Timestamps）。