---
layout: /src/layouts/MarkdownPostLayout.astro
title: SpringAOP的原理
description: SpringAOP的原理
pubDate: 2025-04-18
---
AOP是一种**编程范式**，用于在**不修改原始代码的情况下向现有应用程序添加新功能**。能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP的实现依赖于**动态代理技术**。动态代理是在运行时动态生成代理对象，而不是在编译时。它允许开发者在运行时指定要代理的接口和行为，从而实现在不修改源码的情况下增强方法的功能。

Spring AOP支持两种动态代理：

- **基于JDK的动态代理**：使用java.lang.reflect.Proxy类和java.lang.reflect.InvocationHandler接口实现。这种方式需要代理的类实现一个或多个接口。
- **基于CGLIB的动态代理**：当被代理的类没有实现接口时，Spring会使用CGLIB库生成一个被代理类的子类作为代理。CGLIB（Code Generation Library）是一个第三方代码生成库，通过继承方式实现代理。

## JDK和CGLib动态代理对比

JDK 动态代理是实现了被代理对象所实现的接口，CGLib是继承了被代理对象。 

JDK和CGLib 都是在运行期生成字节码,JDK是直接写Class字节码，CGLib 使用 ASM 框架写Class字节码，Cglib代理实现更复杂，生成代理类的效率比JDK代理低。

JDK 调用代理方法，是通过反射机制调用,CGLib 是通过FastClass机制直接调用方法,CGLib 执行效率更高。

### 除了 AOP，还有其他方式能达到这种功能吗

注解可以实现吗？

可以。通过 Java 注解处理器（`javax.annotation.processing`），在编译期扫描自定义注解并生成或修改代码，实现类似 AOP 的功能；但需手动接入编译流程。
### 知道 @Data 注解吗，作用于哪个阶段

`@Data` 是 Lombok 提供的编译期注解处理器，编译时通过 AST 操作向类插入 getter、setter、`equals`、`hashCode`、`toString`、必需参数构造器等方法。

### 注解统计函数耗时 vs AOP 的差异

- **注解+编译期处理**：直接将计时代码插入目标方法，性能开销小，但侵入编译流程且不灵活。 
    
- **AOP（运行时代理/字节码织入）**：切面灵活，可动态开关、无需修改源代码；额外有微量代理或字节码改写开销。 