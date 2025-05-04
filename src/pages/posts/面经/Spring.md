---
layout: /src/layouts/MarkdownPostLayout.astro
title: Spring
description: Spring相关面试题
pubDate: 2025-04-18
---
## Spring框架核心特性
- **IoC容器**：Spring通过控制反转实现了对象的创建和对象间的依赖关系管理。开发者只需要定义好Bean及其依赖关系，Spring容器负责创建和组装这些对象。
- **AOP**：AOP是一种**编程范式**，用于在**不修改原始代码的情况下向现有应用程序添加新功能**。能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。
- **事务管理**：Spring提供了一致的事务管理接口，支持声明式和编程式事务。开发者可以轻松地进行事务管理，而无需关心具体的事务API。
- **MVC框架**：Spring MVC是一个基于Servle API构建的Web框架，采用了模型-视图-控制器（MVC）架构。它支持灵活的URL到页面控制器的映射，以及多种视图技术。

## Bean生命周期


![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250426183855.png)
## 什么是反射？有哪些使用场景？

反射机制是指程序在运行状态下，对于任意一个类，都能够获取这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意属性和方法。也就是说，Java 反射允许在运行时获取类的信息并动态操作对象，即使在编译时不知道具体的类也能实现。

反射具有以下特性：

1. **运行时类信息访问**：反射机制允许程序在运行时获取类的完整结构信息，包括类名、包名、父类、实现的接口、构造函数、方法和字段等。
2. **动态对象创建**：可以使用反射API动态地创建对象实例，即使在编译时不知道具体的类名。这是通过Class类的newInstance()方法或Constructor对象的newInstance()方法实现的。
3. **动态方法调用**：可以在运行时动态地调用对象的方法，包括私有方法。这通过Method类的invoke()方法实现，允许你传入对象实例和参数值来执行方法。
4. **访问和修改字段值**：反射还允许程序在运行时访问和修改对象的字段值，即使是私有的。这是通过Field类的get()和set()方法完成的。

Java反射机制在spring框架中，很多地方都用到了反射，让我们来看看Spring的IoC和AOP是如何使用反射技术的。

> 1、Spring框架的依赖注入（DI）和控制反转（IoC）

Spring 使用反射来实现其核心特性：依赖注入。

在Spring中，开发者可以通过XML配置文件或者基于注解的方式声明组件之间的依赖关系。当应用程序启动时，Spring容器会扫描这些配置或注解，然后利用反射来实例化Bean（即Java对象），并根据配置自动装配它们的依赖。

例如，当一个Service类需要依赖另一个DAO类时，开发者可以在Service类中使用@Autowired注解，而无需自己编写创建DAO实例的代码。Spring容器会在运行时解析这个注解，通过反射找到对应的DAO类，实例化它，并将其注入到Service类中。这样不仅降低了组件之间的耦合度，也极大地增强了代码的可维护性和可测试性。

> 2、动态代理的实现

在需要对现有类的方法调用进行拦截、记录日志、权限控制或是事务管理等场景中，反射结合动态代理技术被广泛应用。

一个典型的例子是Spring AOP（面向切面编程）的实现。Spring AOP允许开发者定义切面（Aspect），这些切面可以横切关注点（如日志记录、事务管理），并将其插入到业务逻辑中，而不需要修改业务逻辑代码。

例如，为了给所有的服务层方法添加日志记录功能，可以定义一个切面，在这个切面中，Spring会使用JDK动态代理或CGLIB（如果目标类没有实现接口）来创建目标类的代理对象。这个代理对象在调用任何方法前或后，都会执行切面中定义的代码逻辑（如记录日志），而这一切都是在运行时通过反射来动态构建和执行的，无需硬编码到每个方法调用中。

这两个例子展示了反射机制如何在实际工程中促进**松耦合、高内聚**的设计，以及如何提供动态、灵活的编程能力，特别是在框架层面和解决跨切面问题时。
## SpringAOP的原理

AOP是一种**编程范式**，用于在**不修改原始代码的情况下向现有应用程序添加新功能**。能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP的实现依赖于**动态代理技术**。动态代理是在运行时动态生成代理对象，而不是在编译时。它允许开发者在运行时指定要代理的接口和行为，从而实现在不修改源码的情况下增强方法的功能。

Spring AOP支持两种动态代理：

- **基于JDK的动态代理**：使用java.lang.reflect.Proxy类和java.lang.reflect.InvocationHandler接口实现。这种方式需要代理的类实现一个或多个接口。
- **基于CGLIB的动态代理**：当被代理的类没有实现接口时，Spring会使用CGLIB库生成一个被代理类的子类作为代理。CGLIB（Code Generation Library）是一个第三方代码生成库，通过继承方式实现代理。

> JDK和CGLib动态代理对比

JDK 动态代理是实现了被代理对象所实现的接口，CGLib是继承了被代理对象。 

JDK和CGLib 都是在运行期生成字节码,JDK是直接写Class字节码，CGLib 使用 ASM 框架写Class字节码，Cglib代理实现更复杂，生成代理类的效率比JDK代理低。

JDK 调用代理方法，是通过反射机制调用,CGLib 是通过FastClass机制直接调用方法,CGLib 执行效率更高。

> 除了 AOP，还有其他方式能达到这种功能吗

注解可以实现吗？

可以。通过 Java 注解处理器（`javax.annotation.processing`），在编译期扫描自定义注解并生成或修改代码，实现类似 AOP 的功能；但需手动接入编译流程。
> 知道 @Data 注解吗，作用于哪个阶段

`@Data` 是 Lombok 提供的编译期注解处理器，编译时通过 AST 操作向类插入 getter、setter、`equals`、`hashCode`、`toString`、必需参数构造器等方法。

> 注解统计函数耗时 vs AOP 的差异

- **注解+编译期处理**：直接将计时代码插入目标方法，性能开销小，但侵入编译流程且不灵活。 
    
- **AOP（运行时代理/字节码织入）**：切面灵活，可动态开关、无需修改源代码；额外有微量代理或字节码改写开销。 

## Spring框架中都用到了哪些设计模式
- **工厂设计模式** : Spring使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象。
- **代理设计模式** : Spring AOP 功能的实现。
- **单例设计模式** : Spring 中的 Bean 默认都是单例的。
- **原型设计模式**
- **模板方法模式** : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式。
- **包装器设计模式** : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源。
- **观察者模式:** Spring 事件驱动模型就是观察者模式很经典的一个应用。
- **适配器模式** :Spring AOP 的增强或通知(Advice)使用到了适配器模式、spring MVC 中也是用到了适配器模式适配Controller。

## SpringMVC的执行流程
SpringMVC的执行流程包括以下步骤：

1. 用户发送请求到前端控制器`DispatcherServlet`。
    
2. `DispatcherServlet`调用`HandlerMapping`找到具体处理器。
    
3. `HandlerMapping`返回处理器对象及拦截器（如果有）给`DispatcherServlet`。
    
4. `DispatcherServlet`调用`HandlerAdapter`。
    
5. `HandlerAdapter`适配并调用具体处理器（Controller）。
    
6. Controller执行并返回`ModelAndView`对象。
    
7. `HandlerAdapter`将`ModelAndView`返回给`DispatcherServlet`。
    
8. `DispatcherServlet`传给`ViewResolver`进行视图解析。
    
9. `ViewResolver`返回具体视图给`DispatcherServlet`。
    
10. `DispatcherServlet`渲染视图并响应用户。

## next