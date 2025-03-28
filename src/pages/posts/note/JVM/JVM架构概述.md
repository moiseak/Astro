---
layout: /src/layouts/MarkdownPostLayout.astro
title: JVM
description: JVM学习笔记
pubDate: 2025-03-25
---
## JVM

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327153855.png)

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327153940.png)


![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327154111.png)


## JVM内存结构

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327153306.png)
JDK 1.8 同 JDK 1.7 比，最大的差别就是：元数据区取代了永久代。元空间的本质和永久代类似，都是对 JVM 规范中方法区的实现。不过元空间与永久代之间最大的区别在于：元数据空间并不在虚拟机中，而是使用本地内存。

## 类加载器

类加载器负责将Java字节码文件加载到JVM中。

Java内置了三个类加载器：
- **`BootstrapClassLoader`(启动类加载器/根加载器)**：最顶层的加载类，由 C++实现，通常表示为 null，并且没有父级，主要用来加载 JDK 内部的核心类库（ `%JAVA_HOME%/lib`目录下的 `rt.jar`、`resources.jar`、`charsets.jar`等 jar 包和类）以及被 `-Xbootclasspath`参数指定的路径下的所有类。
- **`ExtensionClassLoader`(扩展类加载器)**：主要负责加载 `%JRE_HOME%/lib/ext` 目录下的 jar 包和类以及被 `java.ext.dirs` 系统变量所指定的路径下的所有类。在**Java9**中`PlatformClassLoader`代替了`ExtensionClassLoader` 。
- **`AppClassLoader`(应用程序类加载器)**：面向我们用户的加载器，负责加载当前应用 classpath 下的所有 jar 包和类。

```Java
public class Student {  
    private String name;  
    private int age;  
  
    public static void main(String[] args) {  
        Student s = new Student();  
        System.out.println("s.getClass().getClassLoader() = " + s.getClass().getClassLoader());  
        System.out.println("s.getClass().getClassLoader().getParent() = " + s.getClass().getClassLoader().getParent());  
        System.out.println("s.getClass().getClassLoader().getParent().getParent() = "  
                + s.getClass().getClassLoader().getParent().getParent());  
  
    }  
}
```
```

s.getClass().getClassLoader() =
jdk.internal.loader.ClassLoaders$AppClassLoader@5e481248
s.getClass().getClassLoader().getParent() = jdk.internal.loader.ClassLoaders$PlatformClassLoader@3b07d329
s.getClass().getClassLoader().getParent().getParent() = null
```
### 双亲委派机制

我们的代码到底应该由哪个类加载器加载？假如我定义一个`java.lang.String`类，那么是我定义的这个类会被加载还是Java自带的String类被加载？

Java为了避免类被重复加载和核心API被篡改，采用了双亲委派机制来加载类。

这个机制使得我们加载一个类的时候，会优先向父类加载器委托加载，父类再向自己的父类委托，直到到达根加载器，也就是我们上面写的Student类会向PlatformClassLoader委托加载，PlatformClassLoader则会向BootstrapClassLoader委托加载，而BootstrapClassLoader发现自己无法加载，就会再将委托返回到PlatformClassLoader，而PlatformClassLoader同样发现自己无法加载，于是请求就再次回到了AppClassLoader，由AppClassLoader负责加载Student类。

那么我们上面提到的String类的问题也就能够回答了，String类的加载一直向上委托，然后由BootstrapClassLoader加载了，我们自己编写的String类也就无法被AppClassLoader加载，这样也就避免了String类被用户篡改。

## 虚拟机栈

Java 虚拟机栈是线程私有的区域，它随着线程的创建而创建。它里面保存的是局部变量表（基础数据类型和对象引用地址）和计算过程中的中间结果。

每执行一个方法，便会为它生成一个栈帧，方法完成之后出栈：

![image.png|675](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250326190229.png)
而栈帧中又存储了 5 个内容：

1. 局部变量表（Local Variables）；
2. 操作（数）栈（Operand Stack）；
3. 动态链接（Dynamic Linking）；
4. 方法返回地址（Return Address）；
5. 附加信息。
### 局部变量表

**局部变量表是一个数组，里面存储的内容有：**

- **方法参数；**
- **方法内的局部变量，也就是方法内的基本数据类型和对象引用（Reference）；**
- **方法返回类型（Return Address）。**
### 操作数栈
**操作数栈主要用于保存计算过程的中间结果，同时作为计算过程中变量临时的存储空间。**

思考：为什么不把程序执行过程中的中间结果保存到局部变量表，而是保存到操作数栈中呢？

因为局部变量表是数组，而数组的长度是在其创建时就要确定，所以局部变量表在编译器就决定内容和大小了，那么在程序执行中的这些动态中间结果，是需要新的空间来保存了，而操作数栈就可以实现此功能。

## 程序计数器

程序计数器是一块较小的内存空间，可以看作是当前线程所执行的字节码的行号指示器。字节码解释器工作时通过改变这个计数器的值来选取下一条需要执行的字节码指令，分支、循环、跳转、异常处理、线程恢复等功能都需要依赖这个计数器来完成。

另外，为了线程切换后能恢复到正确的执行位置，每条线程都需要有一个独立的程序计数器，各线程之间计数器互不影响，独立存储，我们称这类内存区域为“线程私有”的内存。

从上面的介绍中我们知道了程序计数器主要有两个作用：

- 字节码解释器通过改变程序计数器来依次读取指令，从而实现代码的流程控制，如：顺序执行、选择、循环、异常处理。
- 在多线程的情况下，程序计数器用于记录当前线程执行的位置，从而当线程被切换回来的时候能够知道该线程上次运行到哪儿了。

⚠️ 注意：程序计数器是唯一一个不会出现 `OutOfMemoryError` 的内存区域，它的生命周期随着线程的创建而创建，随着线程的结束而死亡。

## 本地方法栈
和虚拟机栈所发挥的作用非常相似，区别是：**虚拟机栈为虚拟机执行 Java 方法 （也就是字节码）服务，而本地方法栈则为虚拟机使用到的 Native 方法服务。** 在 HotSpot 虚拟机中和 Java 虚拟机栈合二为一。

## 堆
Java 虚拟机所管理的内存中最大的一块，Java 堆是所有线程共享的一块内存区域，在虚拟机启动时创建。**此内存区域的唯一目的就是存放对象实例，几乎所有的对象实例以及数组都在这里分配内存。**

Java 堆是垃圾收集器管理的主要区域，因此也被称作 **GC 堆（Garbage Collected Heap）**。从垃圾回收的角度，由于现在收集器基本都采用分代垃圾收集算法，所以 Java 堆还可以细分为：新生代和老年代；再细致一点有：Eden、Survivor、Old 等空间。进一步划分的目的是更好地回收内存，或者更快地分配内存。
![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327145039.png)


在VM选项上加入-XX:+PrintGCDetails（高版本使用-Xlog:gc*）

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327142012.png)

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327142140.png)
可以看到堆的最小容量，初始容量，最大容量。下面可以看到young,surviors,metespace。

我们规定一下最小内存试试：

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327142514.png)
![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327142546.png)


人为制造一个OOM看看：

```Java
public static void main(String[] args) {  
    StringBuilder sb = new StringBuilder();  
    while (true) {  
        sb.append("Hello");  
    }  
}
```

我们随便截几张信息：

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327143620.png)

可以看到eden survivor old metaspace这几个区域的变化

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327143741.png)

看一下最后一次GC：

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327143905.png)
![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327143933.png)
其中Phase(x)就是GC的过程。

## 方法区
方法区属于是 JVM 运行时数据区域的一块逻辑区域，是各个线程共享的内存区域。

《Java 虚拟机规范》只是规定了有方法区这么个概念和它的作用，方法区到底要如何实现那就是虚拟机自己要考虑的事情了。也就是说，在不同的虚拟机实现上，方法区的实现是不同的。

**运行时常量池**就是将编译后的类信息放入方法区中，也就是说它是方法区的一部分。

当虚拟机要使用一个类时，它需要读取并解析 Class 文件获取相关信息，再将信息存入到方法区。方法区会存储已被虚拟机加载的 **类信息、字段信息、方法信息、常量、静态变量、即时编译器编译后的代码缓存等数据**。

**方法区和永久代以及元空间是什么关系呢？** 方法区和永久代以及元空间的关系很像 Java 中接口和类的关系，类实现了接口，这里的类就可以看作是永久代和元空间，接口可以看作是方法区，也就是说永久代以及元空间是 HotSpot 虚拟机对虚拟机规范中方法区的两种实现方式。并且，永久代是 JDK 1.8 之前的方法区实现，JDK 1.8 及以后方法区的实现变成了元空间。

**元空间存储在本地内存中，由操作系统管理，与堆内存是分开的。**

## 字符串常量池

在日常开发过程中，字符串的创建是比较频繁的，而字符串的分配和其他对象的分配是类似的，需要耗费大量的时间和空间，从而影响程序的运行性能，所以作为最基础最常用的引用数据类型，Java设计者在JVM层面提供了字符串常量池。
![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327151231.png)

## 总结

![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250327154242.png)
