---
layout: '/src/layouts/MarkdownPostLayout.astro'
title: "Spring #2"  
description: "AOP"  
pubDate: 2024-11-23   
type: "summary" 
---
# AOP
## 概念
AOP的就是在运行时增强我们指定的方法，动态的将代码切入到指定方法的指定位置。也就是说我们可以利用AOP在多个方法的前后增加一些重复性的操作。
比如我们要在每个方法前面打印日志，就可以利用AOP来实现。在不改动原代码的情况下，对我们的代码进行了增强。
![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20241125172212.png)
**在某个地方把我们的逻辑切断，在切断处进行一个额外的操作，然后再把逻辑续上。**
## 配置
xml和接口的使用就不说了，毕竟我们主要还是使用注解开发。
首先我们需要在主类添加`@EnableAspectJAutoProxy`注解，开启AOP注解支持：
```Java
@EnableAspectJAutoProxy 
@ComponentScan("org.example.entity") 
@Configuration 
public class MainConfiguration { }
```
注册一个Bean：
```JAva
@Component 
public class Student { 
	public void study(){ 
		System.out.println("我是学习方法！"); 
	} 
}
```
接着我们需要在定义AOP增强操作的类上添加`@Aspect`注解和`@Component`将其注册为Bean即可，就像我们之前在配置文件中也要将其注册为Bean那样：
```Java
@Aspect 
@Component 
public class StudentAOP { }
```
比如我们要在study之前执行我们的增强代码：
```JAva
@Before("execution(* org.example.entity.Student.study())") //execution写法跟之前一样 
public void before(){ System.out.println("我是之前执行的内容！"); }
```
除了Before，还有其他的位置可以使用。