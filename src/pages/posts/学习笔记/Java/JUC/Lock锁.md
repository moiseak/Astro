---
layout: /src/layouts/MarkdownPostLayout.astro
title: Lock
pubDate: 2025-03-27
description: Lock锁相关
---
基本用法

```Java
import java.util.concurrent.locks.ReentrantLock;  
  
public class Student {  
  
    public static void main(String[] args) {  
  
        Ticket ticket = new Ticket();  
        new Thread(()->{  
            for (int i = 0; i < 10; i++) {  
                ticket.sale();  
            }  
        }, "A").start();  
  
        new Thread(()->{  
            for (int i = 0; i < 10; i++) {  
                ticket.sale();  
            }  
        }, "B").start();  
  
        new Thread(()->{  
            for (int i = 0; i < 10; i++) {  
                ticket.sale();  
            }  
        }, "C").start();  
  
    }  
}  
  
class Ticket {  
    ReentrantLock lock = new ReentrantLock();  
    private int ticketNumber = 10;  
    public void sale() {  
        lock.lock();  
        try {  
            if (ticketNumber > 0) {  
                ticketNumber--;  
                System.out.println(Thread.currentThread().getName() + " sale ticket " + ticketNumber);  
            }  
        } catch (Exception e) {  
            throw new RuntimeException(e);  
        } finally {  
            lock.unlock();  
        }  
    }  
}
```

##  ReentrantLock

`ReentrantLock`，意思是“可重入锁”。ReentrantLock 是唯一实现了 Lock 接口的类，并且 ReentrantLock 提供了更 多的方法。

`可重入锁`：什么是 “可重入”，可重入就是说某个线程已经获得某个锁，可以再次获取锁而不会出现死锁。

与`synchronized`的区别：

synchronized 可以给类、方法、代码块加锁；而 lock 只能给代码块加锁。

synchronized 是java内置的关键字，lock是一个java类

synchronized 无法获取锁的状态，lock 可以判断是否获得了锁

synchronized 会自动释放锁，lock不会自动释放锁，需要自己手动释放锁，如果不释放锁，会造成死锁

synchronized 线程一（获得锁，然后锁阻塞了），线程二（等待，然后还是傻傻的等待），lock锁就不一定会等待下去

synchronized 可重入锁，不可以被中断，非公平，lock 可重入锁，可判断锁，是否为公平锁，可以自行设置

synchronized 适合少量的代码同步问题，lock适合大量的代码同步问题