---
layout: /src/layouts/MarkdownPostLayout.astro
title: Spring框架核心特性
description: Spring框架核心特性
pubDate: 2025-04-18
---
- **IoC容器**：Spring通过控制反转实现了对象的创建和对象间的依赖关系管理。开发者只需要定义好Bean及其依赖关系，Spring容器负责创建和组装这些对象。
- **AOP**：AOP是一种**编程范式**，用于在**不修改原始代码的情况下向现有应用程序添加新功能**。能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。
- **事务管理**：Spring提供了一致的事务管理接口，支持声明式和编程式事务。开发者可以轻松地进行事务管理，而无需关心具体的事务API。
- **MVC框架**：Spring MVC是一个基于Servle API构建的Web框架，采用了模型-视图-控制器（MVC）架构。它支持灵活的URL到页面控制器的映射，以及多种视图技术。


![image.png](https://raw.githubusercontent.com/moiseak/blogimg/main/img/20250426183855.png)
