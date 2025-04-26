---
layout: /src/layouts/MarkdownPostLayout.astro
title: synchronized和reentrantlock区别？
description: synchronized和reentrantlock区别？
pubDate: 2025-04-20
---
### synchronized和reentrantlock区别？

synchronized 和 ReentrantLock 都是 Java 中提供的可重入锁：

- **用法不同**：synchronized 可用来修饰普通方法、静态方法和代码块，而 ReentrantLock 只能用在代码块上。
- **获取锁和释放锁方式不同**：synchronized 会自动加锁和释放锁，当进入 synchronized 修饰的代码块之后会自动加锁，当离开 synchronized 的代码段之后会自动释放锁。而 ReentrantLock 需要手动加锁和释放锁
- **锁类型不同**：synchronized 属于非公平锁，而 ReentrantLock 既可以是公平锁也可以是非公平锁。
- **响应中断不同**：ReentrantLock 可以响应中断，解决死锁的问题，而 synchronized 不能响应中断。
- **底层实现不同**：synchronized 是 JVM 层面通过监视器实现的，而 ReentrantLock 是基于 AQS 实现的。