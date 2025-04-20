---
layout: /src/layouts/MarkdownPostLayout.astro
title: Java中有哪些常用的锁
description: Java中有哪些常用的锁
pubDate: 2025-04-18
---
- **内置锁（synchronized）**：Java中的`synchronized`关键字是内置锁机制的基础，可以用于方法或代码块。当一个线程进入`synchronized`代码块或方法时，它会获取关联对象的锁；当线程离开该代码块或方法时，锁会被释放。如果其他线程尝试获取同一个对象的锁，它们将被阻塞，直到锁被释放。其中，syncronized加锁时有无锁、偏向锁、轻量级锁和重量级锁几个级别。偏向锁用于当一个线程进入同步块时，如果没有任何其他线程竞争，就会使用偏向锁，以减少锁的开销。轻量级锁使用线程栈上的数据结构，避免了操作系统级别的锁。重量级锁则涉及操作系统级的互斥锁。
- **ReentrantLock**：`java.util.concurrent.locks.ReentrantLock`是一个显式的锁类，提供了比`synchronized`更高级的功能，如可中断的锁等待、定时锁等待、公平锁选项等。`ReentrantLock`使用`lock()`和`unlock()`方法来获取和释放锁。其中，公平锁按照线程请求锁的顺序来分配锁，保证了锁分配的公平性，但可能增加锁的等待时间。非公平锁不保证锁分配的顺序，可以减少锁的竞争，提高性能，但可能造成某些线程的饥饿。
- **读写锁（ReadWriteLock）**：`java.util.concurrent.locks.ReadWriteLock`接口定义了一种锁，允许多个读取者同时访问共享资源，但只允许一个写入者。读写锁通常用于读取远多于写入的情况，以提高并发性。
- **乐观锁和悲观锁**：悲观锁（Pessimistic Locking）通常指在访问数据前就锁定资源，假设最坏的情况，即数据很可能被其他线程修改。`synchronized`和`ReentrantLock`都是悲观锁的例子。乐观锁（Optimistic Locking）通常不锁定资源，而是在更新数据时检查数据是否已被其他线程修改。乐观锁常使用版本号或时间戳来实现。
- **自旋锁**：自旋锁是一种锁机制，线程在等待锁时会持续循环检查锁是否可用，而不是放弃CPU并阻塞。通常可以使用CAS来实现。这在锁等待时间很短的情况下可以提高性能，但过度自旋会浪费CPU资源。