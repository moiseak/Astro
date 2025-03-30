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
`synchronized`是关键字，`lock`是接口。
synchronized 可以给类、方法、代码块加锁；而 lock 只能给代码块加锁。

- synchronized 不需要手动获取锁和释放锁，使用简单，发生异常会自动释放锁，不会造成死锁；
    
- 而 lock 需要自己加锁和释放锁，如果使用不当没有 unLock()去释放锁就会造成死锁。
    

通过 Lock 可以知道有没有成功获取锁，而 synchronized 却无法办到。